from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from typing import Optional
import os
from datetime import datetime
from authlib.integrations.starlette_client import OAuth
from starlette.middleware.sessions import SessionMiddleware
from starlette.requests import Request
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from models import Base, Issue, engine, get_db
from pydantic import BaseModel

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Session middleware for OAuth
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY", "your-secret-key-here"))

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "http://localhost:56662",  # Alternative dev server port
        "http://localhost:*"  # Allow any localhost port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploaded images
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# OAuth setup
oauth = OAuth()
oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

oauth.register(
    name='github',
    client_id=os.getenv("GITHUB_CLIENT_ID"),
    client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
    authorize_url='https://github.com/login/oauth/authorize',
    authorize_params=None,
    access_token_url='https://github.com/login/oauth/access_token',
    access_token_params=None,
    client_kwargs={'scope': 'user:email'},
)


# Pydantic models
class IssueCreate(BaseModel):
    description: str
    location: str


class IssueResponse(BaseModel):
    id: int
    description: str
    location: str
    image_url: Optional[str]
    status: str
    upvotes: int
    created_at: datetime
    user_id: Optional[str]

    model_config = {"from_attributes": True}


class StatusUpdate(BaseModel):
    status: str


# Helper to get current user
def get_current_user(request: Request):
    return request.session.get('user')


# Helper to check if user is admin
def is_admin(user: dict) -> bool:
    if not user or 'email' not in user:
        return False
    admin_emails = os.getenv("ADMIN_EMAILS", "").split(",")
    admin_emails = [email.strip().lower() for email in admin_emails if email.strip()]
    user_email = user.get('email', '').lower()
    return user_email in admin_emails


# Auth endpoints
@app.get("/auth/login/google")
async def login_google(request: Request):
    redirect_uri = request.url_for('auth_google')
    return await oauth.google.authorize_redirect(request, redirect_uri)


@app.get("/auth/callback/google")
async def auth_google(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user = token.get('userinfo')
    if user:
        request.session['user'] = dict(user)
    return RedirectResponse(url='http://localhost:4200/student/submit')


@app.get("/auth/login/github")
async def login_github(request: Request):
    redirect_uri = request.url_for('auth_github')
    return await oauth.github.authorize_redirect(request, redirect_uri)


@app.get("/auth/callback/github")
async def auth_github(request: Request):
    token = await oauth.github.authorize_access_token(request)
    resp = await oauth.github.get('user', token=token)
    user = resp.json()
    if user:
        request.session['user'] = {
            'sub': str(user['id']),
            'name': user['name'] or user['login'],
            'email': user.get('email'),
            'picture': user['avatar_url']
        }
    return RedirectResponse(url='http://localhost:4200/student/submit')


@app.get("/auth/me")
async def get_me(request: Request):
    user = get_current_user(request)
    return user


@app.get("/auth/is_admin")
async def check_is_admin(request: Request):
    user = get_current_user(request)
    return {"is_admin": is_admin(user)}


@app.get("/auth/logout")
async def logout(request: Request):
    request.session.pop('user', None)
    return {"message": "Logged out"}


# Issue endpoints
@app.post("/issues", response_model=IssueResponse)
async def create_issue(
        request: Request,
        description: str = Form(...),
        location: str = Form(...),
        image: Optional[UploadFile] = File(None),
        db: Session = Depends(get_db)
):
    user = get_current_user(request)
    user_id = user.get('sub') if user else None

    image_url = None
    if image:
        file_extension = os.path.splitext(image.filename)[1]
        filename = f"{datetime.now().timestamp()}{file_extension}"
        file_path = f"static/uploads/{filename}"

        with open(file_path, "wb") as f:
            content = await image.read()
            f.write(content)
        image_url = f"/static/uploads/{filename}"

    issue = Issue(
        description=description,
        location=location,
        image_url=image_url,
        user_id=user_id
    )
    db.add(issue)
    db.commit()
    db.refresh(issue)
    return issue


@app.get("/issues", response_model=list[IssueResponse])
def get_issues(db: Session = Depends(get_db)):
    issues = db.query(Issue).order_by(Issue.created_at.desc()).all()
    return issues


@app.post("/issues/{issue_id}/upvote")
def upvote_issue(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    issue.upvotes += 1
    db.commit()
    return {"message": "Upvoted", "upvotes": issue.upvotes}


@app.patch("/issues/{issue_id}/status")
def update_status(issue_id: int, status_update: StatusUpdate, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    issue.status = status_update.status
    db.commit()
    return {"message": "Status updated"}


@app.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    total = db.query(Issue).count()
    pending = db.query(Issue).filter(Issue.status == "pending").count()
    in_progress = db.query(Issue).filter(Issue.status == "in_progress").count()
    resolved = db.query(Issue).filter(Issue.status == "resolved").count()

    return {
        "total_issues": total,
        "pending": pending,
        "in_progress": in_progress,
        "resolved": resolved
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app",  port=8000, reload=True)
