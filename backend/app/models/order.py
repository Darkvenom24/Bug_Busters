from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey
from datetime import datetime
from app.core.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(String(50), primary_key=True, index=True)
    buyer_id = Column(String(50), ForeignKey("users.id"), index=True)
    buyer_name = Column(String(100), nullable=False)
    farmer_id = Column(String(50), ForeignKey("users.id"), index=True)
    farmer_name = Column(String(100), nullable=False)
    produce_id = Column(String(50), ForeignKey("produce.id"), index=True)
    crop = Column(String(100), nullable=False)
    quantity_kg = Column(Float, nullable=False)
    price_per_kg = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(String(50), default="Order Placed")
    status_step = Column(Integer, default=1)
    eta = Column(String(100), nullable=True)
    pickup_location = Column(String(200), nullable=False)
    delivery_location = Column(String(200), nullable=False)
    transit_progress = Column(Integer, default=10)
    vehicle_id = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
