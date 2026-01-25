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
from supabase import create_client, Client
import secrets
import time

# Load environment variables
load_dotenv()

# Initialize Supabase Client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

print(f"DEBUG: SUPABASE_URL = {supabase_url}")
print(f"DEBUG: SUPABASE_KEY exists = {bool(supabase_key)}")
print(f"DEBUG: SUPABASE_KEY length = {len(supabase_key) if supabase_key else 0}")
print(f"DEBUG: SUPABASE_KEY starts with 'eyJ' = {supabase_key.startswith('eyJ') if supabase_key else False}")

supabase = None
if not supabase_url or not supabase_key:
    print("WARNING: Supabase credentials not found in environment variables. Image uploads will fail.")
else:
    try:
        supabase: Client = create_client(supabase_url, supabase_key)
        print("SUCCESS: Supabase client initialized!")
    except Exception as e:
        print(f"ERROR: Failed to initialize Supabase client: {e}")

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
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "http://localhost:56662",
        "http://localhost:5000",
        "http://localhost:5001",
        "http://localhost:5005",
        "http://127.0.0.1:5005",
        "http://localhost:*",
        "https://campusfix-backend-1cc0.onrender.com"
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
    api_base_url='https://api.github.com/',
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
    reporter_name: Optional[str]
    reporter_email: Optional[str]
    priority: str = "medium"

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


# Temporary token store for mobile OAuth (in production, use Redis or database)
mobile_auth_tokens = {}
# Store platform info keyed by state/nonce
platform_store = {}

# Auth endpoints
@app.get("/auth/login/google")
async def login_google(request: Request, platform: str = "web"):
    redirect_uri = str(request.url_for('auth_google'))
    # Force HTTPS in production (Render or Cloud Run)
    if redirect_uri.startswith("http://") and ("onrender.com" in redirect_uri or "run.app" in redirect_uri):
        redirect_uri = redirect_uri.replace("http://", "https://")
    
    # Generate a unique state and store platform info
    state = secrets.token_urlsafe(16)
    platform_store[state] = {'platform': platform, 'created_at': time.time()}
    
    # Pass state to OAuth
    return await oauth.google.authorize_redirect(request, redirect_uri, state=state)


@app.get("/auth/callback/google")
async def auth_google(request: Request):
    # Get state from the callback
    state = request.query_params.get('state', '')
    platform_info = platform_store.pop(state, {})
    platform = platform_info.get('platform', 'web')
    
    print(f"DEBUG: Google callback - state={state}, platform={platform}")
    
    token = await oauth.google.authorize_access_token(request)
    user = token.get('userinfo')
    
    print(f"DEBUG: Google user={user}")
    
    if user:
        request.session['user'] = dict(user)
    
    # For mobile, redirect to deep link with temporary token
    if platform == 'mobile' and user:
        temp_token = secrets.token_urlsafe(32)
        mobile_auth_tokens[temp_token] = {
            'user': dict(user),
            'created_at': time.time()
        }
        print(f"DEBUG: Redirecting to campusfix://auth/callback?token={temp_token}")
        return RedirectResponse(url=f'campusfix://auth/callback?token={temp_token}')
    
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5005")
    return RedirectResponse(url=f'{frontend_url}/#/issues')


@app.get("/auth/login/github")
async def login_github(request: Request, platform: str = "web"):
    redirect_uri = str(request.url_for('auth_github'))
    # Force HTTPS in production (Render or Cloud Run)
    if redirect_uri.startswith("http://") and ("onrender.com" in redirect_uri or "run.app" in redirect_uri):
        redirect_uri = redirect_uri.replace("http://", "https://")
    
    # Generate a unique state and store platform info
    state = secrets.token_urlsafe(16)
    platform_store[state] = {'platform': platform, 'created_at': time.time()}
    
    # Pass state to OAuth
    return await oauth.github.authorize_redirect(request, redirect_uri, state=state)


@app.get("/auth/callback/github")
async def auth_github(request: Request):
    # Get state from the callback
    state = request.query_params.get('state', '')
    platform_info = platform_store.pop(state, {})
    platform = platform_info.get('platform', 'web')
    
    print(f"DEBUG: GitHub callback - state={state}, platform={platform}")
    
    token = await oauth.github.authorize_access_token(request)
    resp = await oauth.github.get('user', token=token)
    user = resp.json()
    
    print(f"DEBUG: GitHub user={user}")
    
    user_data = None
    if user:
        user_data = {
            'sub': str(user['id']),
            'name': user['name'] or user['login'],
            'email': user.get('email'),
            'picture': user['avatar_url']
        }
        request.session['user'] = user_data
    
    # For mobile, redirect to deep link with temporary token
    if platform == 'mobile' and user_data:
        temp_token = secrets.token_urlsafe(32)
        mobile_auth_tokens[temp_token] = {
            'user': user_data,
            'created_at': time.time()
        }
        print(f"DEBUG: Redirecting to campusfix://auth/callback?token={temp_token}")
        return RedirectResponse(url=f'campusfix://auth/callback?token={temp_token}')
    
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5005")
    return RedirectResponse(url=f'{frontend_url}/#/issues')


@app.post("/auth/exchange-token")
async def exchange_token(request: Request):
    """Exchange a temporary mobile auth token for user info and session"""
    body = await request.json()
    temp_token = body.get('token')
    
    if not temp_token or temp_token not in mobile_auth_tokens:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    token_data = mobile_auth_tokens.pop(temp_token)
    
    # Check if token is expired (5 minutes)
    if time.time() - token_data['created_at'] > 300:
        raise HTTPException(status_code=401, detail="Token expired")
    
    # Set session
    request.session['user'] = token_data['user']
    
    return token_data['user']


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
    try:
        user = get_current_user(request)
        if not user:
            raise HTTPException(status_code=401, detail="Authentication required")
        user_id = user.get('sub')
        
        print(f"DEBUG: Creating issue for user: {user}")
        
        # robust name extraction
        reporter_name = user.get('name')
        if not reporter_name:
            reporter_name = user.get('given_name', '') + ' ' + user.get('family_name', '')
            reporter_name = reporter_name.strip()
        if not reporter_name:
             reporter_name = user.get('email', '').split('@')[0]

        image_url = None
        if image:
            file_extension = os.path.splitext(image.filename)[1]
            filename = f"{int(datetime.now().timestamp())}_{user_id[:5]}{file_extension}"
            
            # Read file content
            content = await image.read()
            
            # Upload to Supabase Storage
            if not supabase:
                 print("ERROR: Supabase client is not initialized. Skipping upload.")
                 raise HTTPException(status_code=500, detail="Image storage service not configured.")

            try:
                bucket_name = "issue-images"
                res = supabase.storage.from_(bucket_name).upload(
                    path=filename,
                    file=content,
                    file_options={"content-type": image.content_type}
                )
                
                # Get Public URL
                public_url_response = supabase.storage.from_(bucket_name).get_public_url(filename)
                image_url = public_url_response
                print(f"DEBUG: Image uploaded to Supabase: {image_url}")
                
            except Exception as upload_error:
                print(f"ERROR uploading to Supabase: {upload_error}")
                # Fallback or error handling? For now, log it.
                # If upload fails, image_url remains None

        issue = Issue(
            description=description,
            location=location,
            image_url=image_url,
            user_id=user_id,
            reporter_name=reporter_name,
            reporter_email=user.get('email')
        )
        db.add(issue)
        db.commit()
        db.refresh(issue)
        return issue
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"ERROR in create_issue: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/issues", response_model=list[IssueResponse])
async def get_issues(request: Request, db: Session = Depends(get_db)):
    if not get_current_user(request):
        raise HTTPException(status_code=401, detail="Authentication required")
    issues = db.query(Issue).order_by(Issue.created_at.desc()).all()
    return issues


@app.post("/issues/{issue_id}/upvote")
async def upvote_issue(request: Request, issue_id: int, db: Session = Depends(get_db)):
    if not get_current_user(request):
        raise HTTPException(status_code=401, detail="Authentication required")
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
async def get_analytics(request: Request, db: Session = Depends(get_db)):
    if not get_current_user(request):
        raise HTTPException(status_code=401, detail="Authentication required")
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
