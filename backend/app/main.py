from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.session import Base, engine
import app.models.user
import app.models.product
import app.models.order

from app.api.auth import router as auth_router
from app.api.products import router as product_router
from app.api.orders import router as order_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ToyAlfa E-Commerce API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(product_router)
app.include_router(order_router)

@app.get("/health", tags=["Health Check"])
def health_check():
    return {"status": "ok", "database": "PostgreSQL connected"}