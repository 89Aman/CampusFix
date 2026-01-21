from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
import models
import database
import shutil
import os
import uuid
import random
from datetime import datetime

# Database init
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="CampusFix Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for images
os.makedirs("static/images", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Mock AI / Logic Helpers
def calculate_priority(upvotes: int, severity: str) -> float:
    severity_map = {"Low": 1, "Medium": 2, "High": 3, "Critical": 5}
    score = (upvotes * 2) + (severity_map.get(severity, 1) * 10)
    return float(score)

def mock_ai_analysis(text: str):
    text_lower = text.lower()
    
    # Category
    category = "General"
    if "water" in text_lower or "leak" in text_lower or "pipe" in text_lower:
        category = "Plumbing"
    elif "light" in text_lower or "electric" in text_lower or "wire" in text_lower:
        category = "Electrical"
    elif "wifi" in text_lower or "internet" in text_lower:
        category = "IT"
    elif "clean" in text_lower or "trash" in text_lower or "dust" in text_lower:
        category = "Cleanliness"
    elif "food" in text_lower or "mess" in text_lower:
        category = "Mess/Food"
        
    # Severity
    severity = "Low"
    if "fire" in text_lower or "danger" in text_lower or "spark" in text_lower:
        severity = "Critical"
    elif "broken" in text_lower or "not working" in text_lower:
        severity = "Medium"
    if "urgent" in text_lower:
        severity = "High"

    # Summary (First 10 words)
    summary = " ".join(text.split()[:10]) + "..."
    
    return category, severity, summary

# API Endpoints

@app.post("/auth/anonymous")
def anonymous_login():
    """Generates an anonymous session ID"""
    return {"token": str(uuid.uuid4())}

@app.post("/issues", response_model=models.IssueOut)
def create_issue(
    description: str = Form(...),
    location: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    # Handle Image Upload
    image_url = None
    if image:
        file_extension = image.filename.split(".")[-1]
        file_name = f"{uuid.uuid4()}.{file_extension}"
        file_path = f"static/images/{file_name}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = f"/static/images/{file_name}" # Relative URL

    # AI Processing
    category, severity, summary = mock_ai_analysis(description)
    
    # Create DB Entry
    new_issue = models.Issue(
        description=description,
        location=location,
        image_url=image_url,
        category=category,
        severity=severity,
        summary=summary,
        priority_score=calculate_priority(0, severity)
    )
    
    db.add(new_issue)
    db.commit()
    db.refresh(new_issue)
    return new_issue

@app.get("/issues", response_model=List[models.IssueOut])
def list_issues(
    skip: int = 0, 
    limit: int = 100, 
    sort_by: str = "priority", # priority, newest
    db: Session = Depends(get_db)
):
    query = db.query(models.Issue)
    
    if sort_by == "priority":
        query = query.order_by(models.Issue.priority_score.desc())
    else:
        query = query.order_by(models.Issue.created_at.desc())
        
    return query.offset(skip).limit(limit).all()

@app.post("/issues/{issue_id}/upvote")
def upvote_issue(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    issue.upvotes += 1
    # Recalculate priority
    issue.priority_score = calculate_priority(issue.upvotes, issue.severity)
    
    db.commit()
    return {"message": "Upvoted successfully", "upvotes": issue.upvotes, "new_priority": issue.priority_score}

@app.put("/issues/{issue_id}/status")
def update_status(
    issue_id: int, 
    status_update: models.IssueUpdateStatus,
    db: Session = Depends(get_db)
):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    issue.status = status_update.status
    if status_update.resolution_image_url:
        issue.resolution_image_url = status_update.resolution_image_url
        
    db.commit()
    return {"message": "Status updated", "status": issue.status}

@app.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    total_issues = db.query(models.Issue).count()
    resolved_issues = db.query(models.Issue).filter(models.Issue.status == models.IssueStatus.RESOLVED).count()
    
    # Issues by category
    categories = db.query(models.Issue.category, func.count(models.Issue.id)).group_by(models.Issue.category).all()
    
    return {
        "total_issues": total_issues,
        "resolved_issues": resolved_issues,
        "by_category": {cat: count for cat, count in categories}
    }

@app.get("/heatmap")
def get_heatmap_data(db: Session = Depends(get_db)):
    # Returns simplified location data
    issues = db.query(models.Issue).all()
    # Assuming location is a string, for a real heatmap we'd need to parse it or have lat/long fields.
    # For this mock, we return the raw string and let frontend handle geocoding or mocking.
    return [{"id": i.id, "location": i.location, "severity": i.severity} for i in issues]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
