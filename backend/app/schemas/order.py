from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int

class OrderItemResponse(BaseModel):
    id: int
    product_id: str
    quantity: int
    price: float

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_address: str
    phone_number: str

class OrderResponse(BaseModel):
    id: str
    user_id: int
    total_amount: float
    status: str
    shipping_address: str
    phone_number: str
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True