# CampusFix Project Context

> **Purpose**: Comprehensive documentation for understanding and rebuilding the CampusFix project.
> **Last Updated**: 2026-01-25

---

## 📋 Project Overview

**CampusFix** is a full-stack campus issue reporting and management system designed to streamline facility management on college campuses. The application enables transparent communication between students/staff and administration for reporting and tracking infrastructure issues.

### Core Purpose
- Enable **students/staff** to report campus issues (broken lights, plumbing problems, cleanliness, etc.) with photos and location details
- Provide **administrators** with a dashboard to view, prioritize, and resolve issues
- Create **transparency** through real-time status updates and public issue tracking
- Support **community validation** through an upvoting system to highlight critical issues

---

## 🏗️ System Architecture

┌─────────────────────────────────────────────────────────────────────────────┐
│                              CampusFix System                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐                   ┌─────────────────────┐          │
│  │   Flutter App       │                   │                     │          │
│  │   (Mobile/Web)      │◄─────────────────►│   FastAPI Backend   │          │
│  │                     │                   │                     │          │
│  │  • Issue Submission │                   │  • REST API         │          │
│  │  • Issue List       │                   │  • OAuth 2.0        │          │
│  │  • Admin Dashboard  │                   │  • PostgreSQL       │          │
│  │  • Safety Tools     │                   │  • AI NSFW Detection│          │
│  │  • SOS & Siren      │                   │  • Supabase Storage │          │
│  └─────────────────────┘                   └─────────────────────┘          │
│                                                       │                     │
│                                      ┌────────────────▼────────────┐        │
│                                      │   Cloud Deployment          │        │
│                                      │   (Render / Cloud Run)      │        │
│                                      └─────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘


### Tech Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Mobile App** | Flutter (Dart) | Cross-platform mobile app (Android/iOS/Web) |
| **Backend API** | FastAPI (Python) | RESTful API with OAuth 2.0 authentication |
| **Database** | PostgreSQL (Supabase) | Scalable production database |
| **Safety Tools** | Geolocator, SMS | Location sharing and emergency alerts |
| **AI Processing** | Nude (Python) | Automated NSFW detection for safety |
| **Image Storage** | Supabase Storage | Cloud storage for uploaded images |
| **Authentication** | Google & GitHub OAuth | Social login via Authlib |
| **Deployment** | Render / GCP Cloud Run | Docker-based cloud hosting |

---

## 📁 Project Directory Structure

```
CampusFix/
├── .gemini/
│   └── PROJECT_CONTEXT.md      # This documentation file
│
├── Backend/                     # Python FastAPI Backend
│   ├── main.py                  # Main application with all API endpoints
│   ├── safety.py                # Safety-specific logic (SOS, NSFW detection)
│   ├── models.py                # SQLAlchemy ORM models (Issue & SafetyReport)
│   ├── database.py              # Database configuration
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile               # Docker build configuration
│   ├── render.yaml              # Render.com deployment config
│   └── .env                     # Environment variables (local only)
│
├── flutter_app/                 # Flutter Mobile/Web Application
│   ├── lib/
│   │   ├── main.dart                   # App entry point with routing
│   │   ├── models/
│   │   │   └── issue.dart              # Issue data model
│   │   ├── providers/
│   │   │   └── issues_provider.dart    # State management (ChangeNotifier)
│   │   ├── screens/
│   │   │   ├── login_screen.dart       # OAuth login screen
│   │   │   ├── issue_list_screen.dart  # Issue list (students)
│   │   │   ├── submit_issue_screen.dart # Issue submission form
│   │   │   ├── admin_dashboard_screen.dart   # Admin panel
│   │   │   └── admin_issue_detail_screen.dart # Issue detail view
│   │   └── services/
│   │       ├── api_service.dart        # HTTP client with cookie handling
│   │       ├── client_factory.dart     # Platform-specific HTTP factory
│   │       ├── client_web.dart         # Web HTTP client (withCredentials)
│   │       └── client_io.dart          # Mobile HTTP client
│   ├── android/                        # Android-specific configs
│   │   └── app/src/main/
│   │       └── AndroidManifest.xml     # Deep linking configuration
│   ├── pubspec.yaml                    # Flutter dependencies
│   └── assets/                         # App icons and images
│
├── docker-compose.yml           # Local Docker orchestration
├── DEPLOYMENT.md                # Deployment instructions
└── README.md                    # Project overview
```

---

## 🗄️ Database Schema

### Issue Table (SQLAlchemy Model)

| Column | Type | Nullable | Default | Description|
|--------|------|----------|---------|------------|
| `id` | Integer | No | Auto-increment | Primary key |
| `description` | Text | No | - | Full issue description |
| `location` | String | No | - | Location of the issue   |
| `image_url` | String | Yes | NULL | URL/path to uploaded image |
| `status` | String | No | `"pending"` | Issue status: `pending`, `in_progress`, `resolved` |
| `upvotes` | Integer | No | `0` | Number of upvotes  |
| `created_at` | DateTime | No | `datetime.utcnow` | Creation timestamp(UTC)|
| `user_id` | String | Yes | NULL | OAuth user ID |
| `reporter_name` | String | Yes | NULL | Reporter's display name |
| `reporter_email` | String | Yes | NULL | Reporter's email |
| `priority` | String | No | `"medium"` | Priority level: `low`, `medium`, `high` |

### Database Configuration

```python
# models.py
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./campusfix.db")
```

- **Development**: SQLite (`campusfix.db`)
- **Production**: PostgreSQL (via `DATABASE_URL` environment variable)

---

## 🔌 Backend API Reference

**Production URL**: `https://backend-492502501801.europe-west1.run.app`  
**Development URL**: `http://localhost:8000`  
**API Documentation**: `/docs` (Swagger UI)

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/auth/login/google` | Initiate Google OAuth login | No |
| `GET` | `/auth/google` | Google OAuth callback | No |
| `GET` | `/auth/login/github` | Initiate GitHub OAuth login | No |
| `GET` | `/auth/github` | GitHub OAuth callback | No |
| `GET` | `/auth/me` | Get current user session | No |
| `GET` | `/auth/is_admin` | Check if user is admin | Yes |
| `GET` | `/auth/logout` | Clear user session | Yes |
| `POST` | `/auth/exchange-token` | Exchange mobile OAuth token | No |

### Issue Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/issues` | Create new issue | Yes |
| `GET` | `/issues` | List all issues | Yes |
| `POST` | `/issues/{id}/upvote` | Upvote an issue | Yes |
| `PATCH` | `/issues/{id}/status` | Update issue status (admin) | Yes + Admin |

### Safety & Emergency Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/safety/reports` | Submit anonymous safety report (AI NSFW check) | No |
| `GET` | `/safety/reports` | Get all reports (Admin view) | Yes + Admin |
| `GET` | `/safety/community` | Public community safety feed | No |

### Analytics Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/analytics` | Get issue statistics | Yes |

---

## 📦 API Data Structures

### IssueResponse (GET /issues, POST /issues)

```json
{
  "id": 1,
  "description": "Water leaking from pipe in bathroom",
  "location": "Building A, Floor 2",
  "image_url": "https://supabase-url/storage/v1/object/public/bucket/image.jpg",
  "status": "pending",
  "upvotes": 5,
  "created_at": "2026-01-25T10:30:00",
  "user_id": "google-oauth2|123456789",
  "reporter_name": "John Doe",
  "reporter_email": "john@example.com",
  "priority": "medium"
}
```

### Status Values

| Status | Description | UI Color Suggestion |
|--------|-------------|---------------------|
| `pending` | New issue, not yet addressed | Orange/Yellow |
| `in_progress` | Being worked on | Blue |
| `resolved` | Fixed and closed | Green |

### Priority Values

| Priority | Description |
|----------|-------------|
| `low` | Minor issue, can wait |
| `medium` | Standard issue |
| `high` | Urgent, needs attention |

### Creating an Issue (POST /issues)

```http
POST /issues
Content-Type: multipart/form-data

Fields:
- description: string (required)
- location: string (required)  
- image: file (optional, image upload)
```

---

## 🔐 Authentication System

### OAuth 2.0 Flow

1. **Web Flow**: 
   - User clicks "Login with Google/GitHub"
   - Redirect to OAuth provider
   - Callback to `/auth/google` or `/auth/github`
   - Session cookie set, redirect to app

2. **Mobile Flow (Deep Linking)**:
   - App opens OAuth URL with `?platform=mobile`
   - User authenticates in browser
   - Backend generates temporary token, redirects to `campusfix://auth?token=...`
   - App intercepts deep link
   - App calls `/auth/exchange-token` with token
   - Session established

### Admin Authorization

- Controlled via `ADMIN_EMAILS` environment variable
- Comma-separated list of authorized admin emails
- Checked via `is_admin()` function in backend

```python
# main.py
ADMIN_EMAILS = os.getenv("ADMIN_EMAILS", "").split(",")

def is_admin(user: dict):
    if not user:
        return False
    user_email = user.get("email", "")
    return user_email in ADMIN_EMAILS
```

---

## 📱 Flutter App Details

### Dependencies (pubspec.yaml)

| Package | Purpose |
|---------|---------|
| `http` | HTTP client for API calls |
| `provider` | State management |
| `go_router` | Navigation/routing |
| `google_fonts` | Custom typography |
| `file_picker` | Image selection |
| `flutter_secure_storage` | Secure session storage |
| `url_launcher` | Open OAuth URLs in browser |
| `intl` | Date formatting |

### Deep Link Configuration

**Android** (`AndroidManifest.xml`):
```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW"/>
    <category android:name="android.intent.category.DEFAULT"/>
    <category android:name="android.intent.category.BROWSABLE"/>
    <data android:scheme="campusfix" android:host="auth"/>
</intent-filter>
```

### API Base URL

```dart
// api_service.dart
String get baseUrl {
  return 'https://backend-492502501801.europe-west1.run.app';
}
```

### State Management

Using `ChangeNotifier` pattern with Provider:

```dart
// issues_provider.dart
class IssuesProvider with ChangeNotifier {
  List<Issue> _issues = [];
  bool _isAdmin = false;
  bool _isLoading = false;
  
  // Methods: fetchIssues(), upvoteIssue(), submitIssue(), updateIssueStatus()
}
```

---

---

## ☁️ Deployment Configuration

### Backend Deployment (Render / Cloud Run)

**Dockerfile** (Python 3.11-slim):
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]
```

### Environment Variables (Backend)

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes (prod) |
| `SUPABASE_URL` | Supabase project URL | Yes (prod) |
| `SUPABASE_KEY` | Supabase anon/service key | Yes (prod) |
| `SECRET_KEY` | Session encryption key | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | Yes |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | Yes |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret | Yes |
| `ADMIN_EMAILS` | Comma-separated admin emails | Yes |

### Docker Compose (Local Development)

```yaml
services:
  backend:
    build: ./Backend
    ports:
      - "8080:8080"

```

---

## 🚀 Getting Started (Development)

### 1. Backend Setup

```bash
cd Backend

# Create virtual environment
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with OAuth credentials
# (see Environment Variables section)

# Run server
python main.py
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

### 2. Flutter App Setup

```bash
cd flutter_app

# Get dependencies
flutter pub get

# Run on web
flutter run -d chrome

# Run on Android (connected device/emulator)
flutter run

# Build release APK
flutter build apk --release
```

### 3. Verification
```bash
cd Backend
python test_verification.py # Runs end-to-end verification
```

---

## 🔧 Key Implementation Details

### Image Upload Flow

1. **Flutter**: Uses `file_picker` to select image, reads bytes, sends via multipart form
2. **Backend**: Receives image, uploads to Supabase Storage if configured
3. **Response**: Returns Supabase public URL or local path

### Session Management

- Backend uses `starlette.middleware.sessions.SessionMiddleware`
- Session stored server-side, accessed via cookie
- Flutter manually manages cookies via `flutter_secure_storage`
- Web uses browser's native cookie handling (with `withCredentials: true`)

### CORS Configuration

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restricted in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📋 Feature Checklist

| Feature | Backend | Flutter |
|---------|---------|---------|
| Google OAuth Login | ✅ | ✅ |
| GitHub OAuth Login | ✅ | ✅ |
| Issue Submission | ✅ | ✅ |
| Image Upload | ✅ | ✅ |
| Issue Listing | ✅ | ✅ |
| Upvoting | ✅ | ✅ |
| Status Updates | ✅ | ✅ |
| Admin Dashboard | ✅ | ✅ |
| SOS & Siren Tools | ✅ | ✅ |
| AI NSFW Recognition | ✅ | ✅ |
| Community Safety Feed| ✅ | ✅ |
| Analytics | ✅ | ✅ |
| Mobile Deep Linking | ✅ | ✅ |
| Dark Mode | - | ✅ |

---

## 🐛 Known Issues & Technical Debt

1. **Session Storage**: SQLite + local image storage is ephemeral on cloud platforms
2. **Angular API URL**: Hardcoded to `localhost:8000`, needs environment config
3. **Error Handling**: Minimal error feedback to users in some flows
4. **Test Coverage**: No automated tests currently implemented
5. **AI Features**: Category/severity auto-detection mentioned in specs but not implemented

---

## 📚 Related Files to Reference

When rebuilding or extending:

| Purpose | File(s) |
|---------|---------|
| API Logic | `Backend/main.py` |
| Safety & AI Logic | `Backend/safety.py` |
| Database Models | `Backend/models.py` |
| Flutter State | `flutter_app/lib/providers/issues_provider.dart` |
| Flutter API Client | `flutter_app/lib/services/api_service.dart` |
| Flutter Screens | `flutter_app/lib/screens/*.dart` |
| Deployment | `Backend/Dockerfile`, `render.yaml` |

---

*This document serves as the master reference for the CampusFix project. Keep it updated as the codebase evolves.*
