from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int

class OrderItemResponse(BaseModel):
    id: str
    product_id: str
    quantity: int
    unit_price: float

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_address: str
    phone_number: str
    payment_method: Optional[str] = "Cash on Delivery"

class OrderResponse(BaseModel):
    id: str
    order_number: str
    user_id: str
    total_amount: float
    status: str
    shipping_address: str
    phone_number: str
    payment_method: str
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True