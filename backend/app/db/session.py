import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# Environment variable එකෙන් ගනින්, නැත්නම් Docker .env credentials වලට fallback කරන්න
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://toyalfa:toyalfa_pass@postgres:5432/toyalfa_db"
)

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()