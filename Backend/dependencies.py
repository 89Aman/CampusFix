import os
from dotenv import load_dotenv
from supabase import create_client, Client
from starlette.requests import Request

# Load environment variables
load_dotenv()

# --- Supabase Setup ---
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

supabase = None
if not supabase_url or not supabase_key:
    print("WARNING: Supabase credentials not found. Image uploads will fail.")
else:
    try:
        supabase: Client = create_client(supabase_url, supabase_key)
        print("SUCCESS: Supabase client initialized!")
    except Exception as e:
        print(f"ERROR: Failed to initialize Supabase client: {e}")

# --- Auth Helpers ---

def get_current_user(request: Request):
    return request.session.get('user')

def is_admin(user: dict) -> bool:
    if not user or 'email' not in user:
        return False
    admin_emails = os.getenv("ADMIN_EMAILS", "").split(",")
    # Normalize and check
    admin_emails = [email.strip().lower() for email in admin_emails if email.strip()]
    user_email = user.get('email', '').lower()
    return user_email in admin_emails
