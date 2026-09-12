from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
import httpx
import os
import secrets
from datetime import datetime

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

def generate_order_number() -> str:
    timestamp = datetime.utcnow().strftime("%Y%m%d")
    random_hex = secrets.token_hex(3).upper()
    return f"ORD-{timestamp}-{random_hex}"

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

        # Stock sync
        product.stock -= item.quantity
        item_total = float(product.price) * item.quantity
        total_amount += item_total

        db_items.append(OrderItem(
            product_id=product.id,
            quantity=item.quantity,
            unit_price=product.price
        ))

    order_num = generate_order_number()

    new_order = Order(
        order_number=order_num,
        user_id=str(current_user.id),
        total_amount=total_amount,
        shipping_address=order_in.shipping_address,
        phone_number=order_in.phone_number,
        payment_method=order_in.payment_method,
        status="Processing",
        items=db_items
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # User model field is name
    user_name = getattr(current_user, "name", getattr(current_user, "full_name", "Customer"))

    webhook_payload = {
        "order_id": new_order.id,
        "order_number": new_order.order_number,
        "customer_email": current_user.email,
        "customer_name": user_name,
        "total_amount": float(new_order.total_amount),
        "shipping_address": new_order.shipping_address,
        "phone_number": new_order.phone_number,
        "items_count": len(db_items)
    }

    background_tasks.add_task(send_n8n_notification, webhook_payload)
    return new_order

@router.get("/my-orders", response_model=List[OrderResponse])
def get_user_orders(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Order).filter(Order.user_id == str(current_user.id)).all()