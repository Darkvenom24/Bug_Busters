from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.core.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    sku = Column(String, unique=True, index=True, nullable=False)
    description = Column(String)
    default_threshold = Column(Float, default=0.8) # Confidence threshold
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
