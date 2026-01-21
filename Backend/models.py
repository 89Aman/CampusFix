from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, Text
from sqlalchemy.sql import func
from database import Base
import enum
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class IssueStatus(str, enum.Enum):
    NEW = "New"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"

class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text, nullable=False)
    location = Column(String, nullable=False) # Simplified for now, can be "lat,long" or address
    image_url = Column(String, nullable=True)
    
    # AI Enriched Fields
    category = Column(String, default="General")
    severity = Column(String, default="Low") # Low, Medium, High, Critical
    summary = Column(String, nullable=True)
    
    # Metrics
    upvotes = Column(Integer, default=0)
    priority_score = Column(Float, default=0.0)
    
    # Status & Admin
    status = Column(String, default=IssueStatus.NEW)
    resolution_image_url = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# Pydantic Models for API
class IssueBase(BaseModel):
    description: str
    location: str

class IssueCreate(IssueBase):
    pass # Image will be handled via UploadFile

class IssueOut(IssueBase):
    id: int
    image_url: Optional[str] = None
    category: str
    severity: str
    summary: Optional[str] = None
    upvotes: int
    priority_score: float
    status: str
    resolution_image_url: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True # For Pydantic v1, user likely has v2 installed but this is safe, or from_attributes=True for v2

class IssueUpdateStatus(BaseModel):
    status: IssueStatus
    resolution_image_url: Optional[str] = None
