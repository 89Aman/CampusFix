# Deployment Guide for CampusFix

## ⚠️ Important Prerequisites regarding Data
This application currently uses **SQLite** (file-based DB) and **Local File Storage** for images.
- **On Cloud Platforms**: The file system is ephemeral. **Data and Images will be wiped** whenever you redeploy or the server restarts.
- **For Production**: You must switch to **PostgreSQL** (Database) and **Cloudinary/S3** (Image Storage).

---

## Option 1: The "All-in-One" Easiest Path (Render.com)
Render is great because it supports both Python and Angular easily.

### Step 1: Deploy Backend (FastAPI)
1. Push your code to GitHub.
2. Sign up for [Render](https://render.com/).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Configure the service:
   - **Name**: `campusfix-backend`
   - **Root Directory**: `Backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variables:
   - `SECRET_KEY`: (Generate a random string)
   - `GOOGLE_CLIENT_ID`: (Your Google OAuth ID)
   - `GOOGLE_CLIENT_SECRET`: (Your Google OAuth Secret)
   - *Note: You need to update your Google Cloud Console to allow the new Render URL in "Authorized Redirect URIs".*

### Step 2: Configure Frontend for Production
1. Open `Frontend/src/environments/environment.ts` (create it if missing) or use `environment.prod.ts`.
2. Update the `apiUrl` to your **new Backend URL** (e.g., `https://campusfix-backend.onrender.com`).
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://campusfix-backend.onrender.com' // Your Render Backend URL
   };
   ```
3. Update `Frontend/src/app/services/issue.service.ts` and `auth.service.ts` to use `environment.apiUrl` instead of hardcoded `localhost`.

### Step 3: Deploy Frontend (Angular)
1. On Render, Click **New +** -> **Static Site**.
2. Connect your GitHub repository.
3. Configure the site:
   - **Name**: `campusfix-frontend`
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist/frontend/browser` (Check your angular.json `outputPath` to be sure)
4. Add Environment Variables (if needed).
5. Deploy!

---

## Option 2: The "Performance" Path (Vercel + Render)
- **Frontend**: Deploy to **Vercel** (Optimized for JS frameworks).
  - Install Vercel CLI or use Dashboard.
  - Import project -> Select `Frontend` folder.
  - Framework Preset: Angular.
- **Backend**: Deploy to **Render** (as above).

## 🔧 Production Checklist (To Fix Data Loss)
To make this app real-world ready, you need to execute these code changes:
1. **Database**: 
   - Install `psycopg2-binary`.
   - Update `models.py` to use `os.getenv('DATABASE_URL')`.
   - Provision a Postgres DB on Render/Neon.
2. **Images**:
   - Register for Cloudinary (Free).
   - Install `cloudinary` python package.
   - Update `main.py` upload logic to send files to Cloudinary and save the returned URL.
