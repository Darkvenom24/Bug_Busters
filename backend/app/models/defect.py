from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Defect(Base):
    __tablename__ = "defects"

    id = Column(Integer, primary_key=True, index=True)
    inspection_id = Column(Integer, ForeignKey("inspections.id"), nullable=False)
    type = Column(String, nullable=False) # e.g. "scratch", "dent", "missing_part"
    confidence = Column(Float, nullable=False)
    bounding_box = Column(JSON, nullable=False) # [x, y, width, height]
    severity = Column(String, nullable=False) # "low", "medium", "high"
    
    inspection = relationship("Inspection", back_populates="defects")
