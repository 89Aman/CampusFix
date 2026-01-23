# CampusFix Project Context

> **Purpose**: This file serves as a reference for building the Android app that connects to the same backend.
> **Last Updated**: 2026-01-22

---

## 📋 Project Overview

**CampusFix** is a campus issue reporting and management system that allows:
- **Students** to report issues (broken lights, plumbing problems, etc.) with photos and location
- **Admins** to view, prioritize, and resolve issues
- **AI-powered** automatic categorization, severity detection, and summarization

---

## 🎯 Feature List

1. Student issue submission with photo, location, text
2. Anonymous student authentication
3. AI-cleaned complaint text
4. AI-based issue category assignment
5. AI-based severity level assignment
6. AI-generated one-line admin summary
7. Issue upvoting by students
8. Automatic priority score calculation
9. Admin issue list sorted by priority
10. Issue status lifecycle (New, In Progress, Resolved)
11. Resolution proof image upload
12. Campus issue heatmap visualization
13. Analytics: issues by category, resolution time, trends
14. Public visibility of issue status without identities

---

## 🗄️ Database Schema

### Issue Table
| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer | Primary key, auto-increment |
| `description` | Text | Full issue description |
| `location` | String | Location of the issue |
| `image_url` | String (nullable) | Path to uploaded image |
| `status` | String | `pending`, `in_progress`, `resolved` |
| `upvotes` | Integer | Number of upvotes (default: 0) |
| `created_at` | DateTime | Timestamp (UTC) |
| `user_id` | String (nullable) | Anonymous user ID |
| `reporter_name` | String (nullable) | Reporter name (optional) |
| `reporter_email` | String (nullable) | Reporter email (optional) |

### AI-Generated Fields (from main.py, not stored in DB yet)
- `category`: Auto-detected (Plumbing, Electrical, IT, Cleanliness, Mess/Food, General)
- `severity`: Auto-detected (Low, Medium, High, Critical)
- `summary`: First 10 words + "..."
- `priority_score`: Calculated as `(upvotes * 2) + (severity_weight * 10)`

---

## 🔌 Backend API Endpoints

**Base URL**: `http://localhost:8000` (development)

### Authentication

| Method | Endpoint | Description | Request | Response |
|--------|----------|-------------|---------|----------|
| `POST` | `/auth/anonymous` | Generate anonymous session | None | `{ "token": "uuid" }` |

### Issues

| Method | Endpoint | Description | Request | Response |
|--------|----------|-------------|---------|----------|
| `POST` | `/issues` | Create new issue | `FormData: description, location, image (optional)` | `IssueOut` object |
| `GET` | `/issues` | List all issues | `Query: skip, limit, sort_by (priority/newest)` | `List<IssueOut>` |
| `POST` | `/issues/{id}/upvote` | Upvote an issue | Path: `id` | `{ message, upvotes, new_priority }` |
| `PUT` | `/issues/{id}/status` | Update issue status | `{ status, resolution_image_url? }` | `{ message, status }` |

### Analytics

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/analytics` | Get issue statistics | `{ total_issues, resolved_issues, by_category }` |
| `GET` | `/heatmap` | Get location data for heatmap | `List<{ id, location, severity }>` |

---

## 📱 API Data Structures (for Android)

### IssueOut (Response Model)
```json
{
  "id": 1,
  "description": "Water leaking from pipe in bathroom",
  "location": "Building A, Floor 2",
  "image_url": "/static/images/uuid.jpg",
  "status": "pending",
  "upvotes": 5,
  "created_at": "2026-01-22T10:30:00",
  "category": "Plumbing",
  "severity": "Medium",
  "summary": "Water leaking from pipe in bathroom building a floor...",
  "priority_score": 30.0
}
```

### Issue Status Values
- `pending` - New issue, not yet addressed
- `in_progress` - Being worked on
- `resolved` - Fixed and closed

### Category Values (Auto-detected)
- `General` (default)
- `Plumbing` (water, leak, pipe)
- `Electrical` (light, electric, wire)
- `IT` (wifi, internet)
- `Cleanliness` (clean, trash, dust)
- `Mess/Food` (food, mess)

### Severity Values (Auto-detected)
- `Low` (default) - weight: 1
- `Medium` (broken, not working) - weight: 2
- `High` (urgent) - weight: 3
- `Critical` (fire, danger, spark) - weight: 5

---

## 📁 Project File Structure

```
CampusFix/
├── Backend/
│   ├── main.py              # FastAPI application with all endpoints
│   ├── models.py            # SQLAlchemy database models
│   ├── database.py          # Database configuration
│   ├── requirements.txt     # Python dependencies
│   ├── campusfix.db         # SQLite database file
│   ├── .env                 # Environment variables
│   └── static/
│       └── images/          # Uploaded images storage
│
├── Frontend/                # Angular 18 web application
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/
│   │   │   │   ├── login/              # Anonymous login page
│   │   │   │   ├── student-submit/     # Issue submission form
│   │   │   │   ├── student-list/       # View all issues
│   │   │   │   └── admin-dashboard/    # Admin management
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts     # Authentication service
│   │   │   │   └── issue.service.ts    # Issue API service
│   │   │   ├── components/layout/      # Shared layout component
│   │   │   ├── guards/                 # Route guards
│   │   │   └── interceptors/           # HTTP interceptors
│   │   └── ...
│   └── ...
│
├── feature_list.txt          # Complete feature requirements
├── DEPLOYMENT.md             # Deployment instructions
└── .gemini/
    └── PROJECT_CONTEXT.md    # THIS FILE - Project reference
```

---

## 🚀 Running the Backend

```bash
cd Backend
pip install -r requirements.txt
python main.py
# Server runs on http://localhost:8000
# API docs: http://localhost:8000/docs
```

---

## 🤖 Android App Development Notes

### Key Implementation Points

1. **Anonymous Auth**: On first launch, call `/auth/anonymous` and store the token locally (SharedPreferences)

2. **Image Upload**: Use `multipart/form-data` with Retrofit or similar
   - Field: `description` (text)
   - Field: `location` (text)
   - Field: `image` (file, optional)

3. **Image Display**: Prepend base URL to `image_url` paths
   - Example: `http://localhost:8000/static/images/uuid.jpg`

4. **Priority Sorting**: Backend handles sorting, use `sort_by=priority` or `sort_by=newest`

5. **Real-time Updates**: Consider polling `/issues` endpoint periodically

6. **Status Colors** (suggest):
   - `pending` → Yellow/Orange
   - `in_progress` → Blue
   - `resolved` → Green

7. **Severity Colors** (suggest):
   - `Low` → Green
   - `Medium` → Yellow
   - `High` → Orange
   - `Critical` → Red

### Recommended Android Libraries
- **Retrofit2** - API calls
- **Gson/Moshi** - JSON parsing
- **Glide/Coil** - Image loading
- **Room** - Local caching (optional)
- **Hilt** - Dependency injection

---

## 🔗 Related Files to Reference

When building Android app, check these files for implementation details:
- `Backend/main.py` - Complete API logic
- `Frontend/src/app/services/issue.service.ts` - API call examples
- `Frontend/src/app/services/auth.service.ts` - Auth flow example

---

*This document is maintained for cross-platform development reference.*
