from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class InspectionStatus(str, enum.Enum):
    pending = "pending"
    passed = "passed"
    failed = "failed"
    needs_review = "needs_review"

class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    operator_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Who ran it
    image_url = Column(String, nullable=False)
    status = Column(Enum(InspectionStatus), default=InspectionStatus.pending, nullable=False)
    notes = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime)

    product = relationship("Product")
    operator = relationship("User")
    defects = relationship("Defect", back_populates="inspection", cascade="all, delete-orphan")
