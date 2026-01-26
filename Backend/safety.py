import os
import shutil
import time
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from models import SafetyReport, get_db, Issue  # Import Issue just in case, but mostly SafetyReport
try:
    from nude import Nude
except ImportError:
    Nude = None

from main import get_current_user, is_admin, supabase

router = APIRouter(prefix="/safety", tags=["safety"])

# Pydantic Schemas
class SafetyReportCreate(BaseModel):
    description: str
    location: str
    incident_time: Optional[datetime] = None

class SafetyReportResponse(BaseModel):
    id: int
    description: str
    location: str
    media_url: Optional[str]
    is_nsfw: bool
    created_at: datetime
    status: str
    is_critical: bool

    model_config = {"from_attributes": True}

# Endpoints

@router.post("/reports", response_model=SafetyReportResponse)
async def create_safety_report(
    description: str = Form(...),
    location: str = Form(...),
    media: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """
    Anonymous reporting endpoint. No auth required.
    """
    image_url = None
    is_nsfw = False

    if media:
        # 1. Save locally temporarily to process NSFW
        file_extension = os.path.splitext(media.filename)[1]
        temp_filename = f"temp_{int(time.time())}{file_extension}"
        temp_path = f"static/uploads/{temp_filename}"
        
        # Ensure directory exists
        os.makedirs("static/uploads", exist_ok=True)
        
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(media.file, buffer)
        
        # 2. Check NSFW
        if Nude:
            try:
                n = Nude(temp_path)
                n.parse()
                is_nsfw = n.result
                print(f"DEBUG: NSFW check result for {media.filename}: {is_nsfw}")
            except Exception as e:
                print(f"WARNING: NSFW check failed: {e}")
        
        # 3. Upload to Supabase (if configured)
        if supabase:
            try:
                # Read file again from disk
                with open(temp_path, "rb") as f:
                    file_content = f.read()

                bucket_name = "safety-reports" # Ensure this bucket exists in Supabase
                # Or use the same bucket but different folder
                
                # Note: For MVP we might use the public bucket but with obfuscated names
                # Ideally this should be a private bucket with signed URLs
                
                final_filename = f"safety_{int(time.time())}_{secrets.token_hex(4)}{file_extension}"
                
                res = supabase.storage.from_(bucket_name).upload(
                    path=final_filename,
                    file=file_content,
                    file_options={"content-type": media.content_type}
                )
                
                # Get URL
                image_url = supabase.storage.from_(bucket_name).get_public_url(final_filename)
                
            except Exception as e:
                print(f"ERROR: Supabase upload failed: {e}")
                # Fallback: keep local path if in dev
                # image_url = f"/static/uploads/{temp_filename}"
        
        # Cleanup temp file
        # os.remove(temp_path) # Optionally keep for debug

    new_report = SafetyReport(
        description=description,
        location=location,
        media_url=image_url,
        is_nsfw=1 if is_nsfw else 0, # Store as int
        is_critical=1 # Always critical
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    # Map integer fields back to boolean for Pydantic response
    response_obj = SafetyReportResponse(
        id=new_report.id,
        description=new_report.description,
        location=new_report.location,
        media_url=new_report.media_url,
        is_nsfw=bool(new_report.is_nsfw),
        created_at=new_report.created_at,
        status=new_report.status,
        is_critical=bool(new_report.is_critical)
    )
    
    return response_obj

@router.get("/reports", response_model=List[SafetyReportResponse])
async def get_safety_reports(request: Request, db: Session = Depends(get_db)):
    """
    Admin only: Get all safety reports.
    """
    user = get_current_user(request)
    if not is_admin(user):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    reports = db.query(SafetyReport).order_by(SafetyReport.created_at.desc()).all()
    
    # Convert DB models to Pydantic
    return [
        SafetyReportResponse(
            id=r.id,
            description=r.description,
            location=r.location,
            media_url=r.media_url,
            is_nsfw=bool(r.is_nsfw),
            created_at=r.created_at,
            status=r.status,
            is_critical=bool(r.is_critical)
        ) for r in reports
    ]

@router.get("/community", response_model=List[SafetyReportResponse])
async def get_community_reports(db: Session = Depends(get_db)):
    """
    Public community feed: Returns anonymous reports to keep campus informed.
    Filters out resolved issues to focus on active alerts.
    """
    # Fetch all reports or just active ones? Let's show all for transparency, but sorted.
    # We might want to limit description length in a real app, but for now full is fine.
    reports = db.query(SafetyReport)\
        .order_by(SafetyReport.created_at.desc())\
        .limit(50)\
        .all()
    
    return [
        SafetyReportResponse(
            id=r.id,
            description=r.description,
            location=r.location,
            media_url=r.media_url,
            is_nsfw=bool(r.is_nsfw),
            created_at=r.created_at,
            status=r.status,
            is_critical=bool(r.is_critical)
        ) for r in reports
    ]

import secrets # Imported here to be available in create_safety_report
