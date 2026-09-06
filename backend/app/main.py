from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="ToyAlfa API",
    description="Backend API for ToyAlfa AI-powered E-commerce Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "service": "ToyAlfa Backend"}

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to ToyAlfa API"}