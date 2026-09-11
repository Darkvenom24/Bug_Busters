from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey
from datetime import datetime
from app.core.database import Base

class Rating(Base):
    __tablename__ = "ratings"

    id = Column(String(50), primary_key=True, index=True)
    order_id = Column(String(50), ForeignKey("orders.id"), index=True)
    from_user_id = Column(String(50), ForeignKey("users.id"))
    to_user_id = Column(String(50), ForeignKey("users.id"))
    stars = Column(Integer, nullable=False)
    comment = Column(String(500), nullable=True)
    category = Column(String(50), default="quality") # quality, delivery, reliability
    created_at = Column(DateTime, default=datetime.utcnow)
