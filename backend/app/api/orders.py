from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
import httpx
import os

from app.db.session import get_db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/api/orders", tags=["Orders"])

N8N_WEBHOOK_URL = os.getenv("N8N_WEBHOOK_URL", "http://localhost:5678/webhook/order-created")

async def send_n8n_notification(order_data: dict):
    try:
        async with httpx.AsyncClient() as client:
            await client.post(N8N_WEBHOOK_URL, json=order_data, timeout=5.0)
    except Exception as e:
        print(f"Failed to send webhook to n8n: {e}")

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_in: OrderCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Order items cannot be empty")

    total_amount = 0.0
    db_items = []

    for item in order_in.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")

        product.stock -= item.quantity
        item_price = product.price * item.quantity
        total_amount += item_price

        db_items.append(OrderItem(
            product_id=product.id,
            quantity=item.quantity,
            price=product.price
        ))

    new_order = Order(
        user_id=current_user.id,
        total_amount=total_amount,
        shipping_address=order_in.shipping_address,
        phone_number=order_in.phone_number,
        status="pending",
        items=db_items
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    webhook_payload = {
        "order_id": new_order.id,
        "customer_email": current_user.email,
        "customer_name": current_user.full_name,
        "total_amount": new_order.total_amount,
        "shipping_address": new_order.shipping_address,
        "phone_number": new_order.phone_number,
        "items_count": len(db_items)
    }

    background_tasks.add_task(send_n8n_notification, webhook_payload)
    return new_order

@router.get("/my-orders", response_model=List[OrderResponse])
def get_user_orders(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Order).filter(Order.user_id == current_user.id).all()