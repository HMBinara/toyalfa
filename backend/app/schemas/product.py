from pydantic import BaseModel
from typing import Optional, List

# --- Category Schemas ---
class CategoryBase(BaseModel):
    name: str
    slug: str

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        from_attributes = True


# --- Product Schemas ---
class ProductBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    stock: int
    image_url: Optional[str] = None
    is_featured: bool = False
    category_id: int

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None
    is_featured: Optional[bool] = None

class ProductResponse(ProductBase):
    id: str

    class Config:
        from_attributes = True