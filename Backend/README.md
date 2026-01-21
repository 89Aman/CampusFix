# CampusFix Backend

## Setup
1. Install Python 3.10+
2. Install dependencies:
   ```bash
   pip install fastapi uvicorn pydantic python-multipart sqlalchemy
   ```
3. Run the server:
   ```bash
   python main.py
   ```
   The server runs on `http://localhost:8000`.

## API Documentation
Once running, visit `http://localhost:8000/docs` for the interactive Swagger UI.

## Features Implemented
1. **Submission**: POST /issues (supports image, location, text)
2. **Auth**: POST /auth/anonymous
3. **AI Logic**: 
   - Mocked categorization (water -> plumbing)
   - Mocked severity (fire -> critical)
   - Mocked summary (first 10 words)
4. **Upvoting**: POST /issues/{id}/upvote
5. **Priority**: Calculated as `upvotes * 2 + severity_score`.
6. **Analytics**: GET /analytics
7. **Heatmap**: GET /heatmap

## Database
Uses SQLite (`campusfix.db`). Created automatically on first run.
Images are stored in `static/images`.
