from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.models.product import Product, Category
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, CategoryCreate, CategoryResponse
from app.api.deps import get_current_admin

router = APIRouter(prefix="/api/products", tags=["Products"])

# --- PUBLIC ROUTES ---

@router.get("/", response_model=List[ProductResponse])
def get_products(category_id: Optional[int] = None, limit: int = 20, db: Session = Depends(get_db)):
    query = db.query(Product)
    if category_id:
        query = query.filter(Product.category_id == category_id)
    return query.limit(limit).all()

@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.get("/{slug}", response_model=ProductResponse)
def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.slug == slug).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# --- ADMIN ONLY ROUTES ---

@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_in: CategoryCreate, 
    db: Session = Depends(get_db), 
    admin=Depends(get_current_admin)
):
    db_category = db.query(Category).filter(Category.slug == category_in.slug).first()
    if db_category:
        raise HTTPException(status_code=400, detail="Category slug already exists")
    
    new_category = Category(**category_in.model_dump())
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate, 
    db: Session = Depends(get_db), 
    admin=Depends(get_current_admin)
):
    db_product = db.query(Product).filter(Product.slug == product_in.slug).first()
    if db_product:
        raise HTTPException(status_code=400, detail="Product slug already exists")

    new_product = Product(**product_in.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
        
    db.commit()
    db.refresh(product)
    return product