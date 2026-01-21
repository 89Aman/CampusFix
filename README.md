# CampusFix

A campus maintenance issue reporting and tracking system built with Angular and FastAPI.

## Features

- 🔐 OAuth authentication (Google & GitHub)
- 📝 Issue reporting with image upload
- 👍 Upvoting system
- 📊 Admin dashboard with analytics
- 🌓 Dark mode support
- 📱 Responsive design

## Tech Stack

**Frontend:**
- Angular 21
- TailwindCSS
- TypeScript

**Backend:**
- FastAPI
- SQLAlchemy
- SQLite
- OAuth 2.0

## Setup

### Frontend
```bash
cd Frontend
npm install
npm start
```

### Backend
```bash
cd Backend
pip install -r requirements.txt
python main.py
```

## Environment Variables

Create a `.env` file in the Backend directory with:
- SECRET_KEY
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GITHUB_CLIENT_ID
- GITHUB_CLIENT_SECRET
