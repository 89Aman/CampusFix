from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import models
import database
import shutil
import os
import uuid
import random
from datetime import datetime
from starlette.middleware.sessions import SessionMiddleware
from starlette.requests import Request
from starlette.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv
import pathlib

# Load env vars from .env file in the same directory
env_path = pathlib.Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

# Database init
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="CampusFix Backend")

# Helper for loading env vars safely
def get_env(key):
    return os.getenv(key, "MISSING_ENV_VAR")

# Session Middleware (Required for OAuth)
app.add_middleware(SessionMiddleware, secret_key=get_env("SECRET_KEY") or "super-secret-key")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"], # Client URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth Setup
oauth = OAuth()

# 1. Google
oauth.register(
    name='google',
    client_id=get_env("GOOGLE_CLIENT_ID"),
    client_secret=get_env("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

# 2. GitHub
oauth.register(
    name='github',
    client_id=get_env("GITHUB_CLIENT_ID"),
    client_secret=get_env("GITHUB_CLIENT_SECRET"),
    access_token_url='https://github.com/login/oauth/access_token',
    access_token_params=None,
    authorize_url='https://github.com/login/oauth/authorize',
    authorize_params=None,
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'},
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

# --- AUTH ENDPOINTS ---

@app.get("/auth/login/{provider}")
async def login(provider: str, request: Request):
    redirect_uri = request.url_for('auth_callback', provider=provider)
    return await oauth.create_client(provider).authorize_redirect(request, redirect_uri)

@app.get("/auth/callback/{provider}")
async def auth_callback(provider: str, request: Request):
    token = await oauth.create_client(provider).authorize_access_token(request)
    
    user_info = None
    if provider == 'google':
        user_info = token.get('userinfo')
        # Google returns 'sub', 'name', 'email', 'picture'
    elif provider == 'github':
        resp = await oauth.create_client(provider).get('user', token=token)
        user_info = resp.json()
        # Github returns 'id', 'name', 'login', 'avatar_url'
        user_info['picture'] = user_info.get('avatar_url')
        user_info['sub'] = str(user_info.get('id'))

    # Store user in session
    if user_info:
        request.session['user'] = dict(user_info)
    
    return RedirectResponse(url='http://localhost:4200')

@app.get("/auth/logout")
async def logout(request: Request):
    request.session.pop('user', None)
    return {"message": "Logged out"}

@app.get("/auth/me")
async def get_current_user(request: Request):
    user = request.session.get('user')
    if user:
        return user
    return None # Return null if not logged in

# Dependency to protect routes
def require_login(request: Request):
    user = request.session.get('user')
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    return user

@app.post("/issues", response_model=models.IssueOut)
def create_issue(
    description: str = Form(...),
    location: str = Form(...),
    image: Optional[UploadFile] = File(None),
    user: dict = Depends(require_login),
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
    user: dict = Depends(require_login),
    db: Session = Depends(get_db)
):
    query = db.query(models.Issue)
    
    if sort_by == "priority":
        query = query.order_by(models.Issue.priority_score.desc())
    else:
        query = query.order_by(models.Issue.created_at.desc())
        
    return query.offset(skip).limit(limit).all()

@app.post("/issues/{issue_id}/upvote")
def upvote_issue(issue_id: int, user: dict = Depends(require_login), db: Session = Depends(get_db)):
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
    user: dict = Depends(require_login),
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
def get_analytics(user: dict = Depends(require_login), db: Session = Depends(get_db)):
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
def get_heatmap_data(user: dict = Depends(require_login), db: Session = Depends(get_db)):
    # Returns simplified location data
    issues = db.query(models.Issue).all()
    # Assuming location is a string, for a real heatmap we'd need to parse it or have lat/long fields.
    # For this mock, we return the raw string and let frontend handle geocoding or mocking.
    return [{"id": i.id, "location": i.location, "severity": i.severity} for i in issues]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=8000)
