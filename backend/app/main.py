from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.models.user import User
from app.models.produce import Produce
from app.models.order import Order
from app.core.security import get_password_hash

# Routers
from app.api.auth import router as auth_router
from app.api.produce import router as produce_router
from app.api.orders import router as orders_router
from app.api.logistics import router as logistics_router
from app.api.farmers import router as farmers_router
from app.api.buyers import router as buyers_router
from app.api.admin import router as admin_router
from app.api.notifications import router as notifications_router

# Initialize DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FarmSetu API",
    description="AI-Powered Direct Digital Marketplace for Farmers, FPOs & Buyers — Digital bridge between farm & buyer.",
    version="1.0.0"
)

# CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth_router, prefix="/api")
app.include_router(produce_router, prefix="/api")
app.include_router(orders_router, prefix="/api")
app.include_router(logistics_router, prefix="/api")
app.include_router(farmers_router, prefix="/api")
app.include_router(buyers_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(notifications_router, prefix="/api")

@app.on_event("startup")
def seed_initial_data():
    db = SessionLocal()
    try:
        # Check if users already seeded
        if db.query(User).count() == 0:
            demo_farmer = User(
                id="farmer-1",
                name="Ramesh Patel",
                phone="+91 98250 12345",
                email="ramesh.farmer@farmsetu.in",
                hashed_password=get_password_hash("password123"),
                role="farmer",
                location="Rajkot, Gujarat",
                verified=True,
                rating=4.9,
                avatar="https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80"
            )
            demo_buyer = User(
                id="buyer-1",
                name="GreenLeaf Grand Restaurant",
                phone="+91 97120 78901",
                email="procurement@greenleaf.com",
                hashed_password=get_password_hash("password123"),
                role="buyer",
                location="150ft Ring Road, Rajkot",
                verified=True,
                rating=4.7,
                avatar="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80"
            )
            db.add_all([demo_farmer, demo_buyer])
            db.commit()

        if db.query(Produce).count() == 0:
            p1 = Produce(
                id="prod-101",
                farmer_id="farmer-1",
                farmer_name="Ramesh Patel",
                crop="Tomato",
                variety="Hybrid Vaishali",
                category="Vegetable",
                quantity_kg=500,
                quality_grade="Grade A",
                price_per_kg=31.0,
                suggested_price_min=30.0,
                suggested_price_max=33.0,
                available_date="Tomorrow",
                location="Rajkot, Gujarat",
                organic=True,
                freshness_priority="High",
                image_url="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80"
            )
            db.add(p1)
            db.commit()
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "project": "FarmSetu",
        "tagline": "AI-Powered Direct Digital Marketplace for Farmers, FPOs & Buyers",
        "subtitle": "Digital bridge between farm & buyer",
        "problem_statement_id": "26033 (DoCA)",
        "status": "healthy",
        "docs_url": "/docs"
    }
