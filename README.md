# 🏫 CampusFix - Smart Campus Maintenance & Safety Platform

**CampusFix** is a next-generation platform designed to streamline campus facility management and enhance student safety. It provides a real-time, transparent bridge between students, staff, and administration.

🚀 **Version 1.0.0 (Stable Release)**: Now featuring a full Flutter mobile app, PostgreSQL-backed persistence, and advanced safety tools.

---

## 🎯 The Mission
To transform modern campus living by replacing fragmented reporting systems with a **unified, transparent, and safety-first mobile ecosystem.**

### ⚠️ The Problem
- **Fragmentation**: Issues reported via emails or phone calls often get lost.
- **Opacity**: Students don't know the status of their reports.
- **Safety Gaps**: Lack of immediate, coordinated emergency tools.
- **Sluggishness**: Maintenance teams lack precise data for quick dispatch.

### ✅ The CampusFix Solution
- **Unified Portal**: One app for all maintenance and safety needs.
- **Visual Accountability**: Public status tracking and community upvotes.
- **Rapid Response**: GPS-tagged reporting and one-tap emergency SOS.
- **AI Moderation**: Automated NSFW detection ensures a clean community feed.

---

## 🌟 Key Features

### 🛠 Maintenance & Infrastructure
- **📸 Smart Reporting**: Snap photos of campus issues (broken fans, leaks, etc.) and report them instantly.
- **📍 Location Tagging**: Precise location logging for faster maintenance dispatch.
- **📈 Live Tracking**: Real-time status updates: `Pending` → `In Progress` → `Resolved`.
- **👍 Community Upvotes**: High-priority issues are automatically escalated based on community votes.

### 🛡 Safety & Emergency Tools
- **🆘 SOS Button**: Instant access to emergency campus contacts (e.g., Police, Security).
- **🚨 Virtual Siren**: Loud audible alert for immediate attention in dangerous situations.
- **📢 Community Safety Feed**: An anonymous, transparent feed to keep the campus informed about safety incidents.
- **🤖 AI Safety Check**: Automatic NSFW detection for reported media to ensure a safe community environment.
- **📍 Location Sharing**: Share your live GPS coordinates with trusted contacts via SMS or social apps.

### 👨‍💼 Administration Portal
- **📊 Analytics Dashboard (Mobile Integrated)**: View total, pending, and resolved issues at a glance directly in the app.
- **🛡️ Role-Based Access**: Secure dashboard protected by authorized admin emails.
- **🔄 Priority Management**: Data-driven task prioritization based on community feedback.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Mobile App** | Flutter (Android/iOS) |
| **Backend API** | FastAPI (Python 3.11) |
| **Database** | PostgreSQL (Supabase) |
| **Storage** | Supabase Storage (Images) |
| **AI Security** | Nude-AI (Python-based detection) |
| **Authentication** | OAuth 2.0 (Google & GitHub) |

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/89Aman/CampusFix.git
cd CampusFix
```

### 2️⃣ Backend Setup
```bash
cd Backend
python -m venv venv
# Activate venv: .\venv\Scripts\activate (Windows) or source venv/bin/activate (Linux/Mac)
pip install -r requirements.txt
```
**Environment Config**: Create a `.env` file in the `Backend/` folder:
```env
DATABASE_URL=postgresql://user:pass@host:port/postgres
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SECRET_KEY=your_secure_secret
ADMIN_EMAILS=admin@campus.edu,you@gmail.com
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

### 3️⃣ Mobile Setup (Flutter)
```bash
cd flutter_app
flutter pub get
flutter build apk --release # To generate the installable APK
flutter run # To run in debug mode on a connected device
```

---

## 🧪 Quality & Verification
The platform includes a dedicated testing suite to ensure database integrity and API reliability:
```bash
cd Backend
python test_verification.py # Runs end-to-end flow verification
python verify_db.py         # Validates Supabase connection
```

---

## 🤝 Contributing
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/NewFeature`).
3. Commit Changes (`git commit -m 'Add NewFeature'`).
4. Push to Branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---
Built with ❤️ by the CampusFix Team to make campuses safer and better maintained.