# 🏫 CampusFix - Smart Campus Issue Reporter

CampusFix is a modern, transparent, and efficient system designed to streamline campus facility management. It bridges the gap between students/staff and administration by providing a real-time platform for reporting and tracking infrastructure issues.

---

## 🎯 The Problem
Students and staff frequently face infrastructure issues like **broken fans, dirty washrooms, lack of drinking water, and faulty lights**. However, the current state of affairs is inefficient:
- 🐌 **Manual Complaints**: Reporting is slow, bureaucratic, or verbal.
- 📉 **Zero Transparency**: No tracking of complaint status.
- 🙈 **Ignored Issues**: "Submit and forget" leads to long-standing problems.
- 📊 **No Data**: Admin lacks data to prioritize repairs effectively.

## 💡 The Solution: CampusFix
**CampusFix** digitizes the entire process, ensuring accountability and speed.
- **Instant Reporting**: Snap a picture, add a location, and submit in seconds (guest or logged in).
- **Transparency**: Real-time status updates (Pending → In Progress → Resolved).
- **Validation**: Upvoting system to highlight critical/common issues.
- **Admin Power**: Data-driven dashboard for maintenance teams to prioritize tasks.

---

## ✨ Key Features

### 🚀 For Students & Staff
- **📸 Quick Reporting**: Fast issue submission with image compression.
- **👤 Guest Access**: Report anonymously without logging in.
- **🔐 Secure Login**: Google & GitHub OAuth integration.
- **👍 Upvotes**: "Me too" functionality to escalate popular issues.
- **📱 Responsive Design**: Works on mobile and desktop.
- **🌗 Dark Mode**: Full dark theme support for comfortable viewing.

### For Administration
- **Dashboard Overview**: View live analytics (Total, Pending, Resolved).
- **Interactive Charts**: Visualize issue status distribution.
- **Priority System**: Auto-calculated priority (Low/Medium/High) based on upvotes.
- **Issue Details**: View reporter information (Name/Email) and full issue context.
- **Status Management**: Update issue status realistically.
- **🛡️ Role-Based Access**: Secure admin features protected by email authorization.
- **📈 Analytics**: Track submission trends (coming soon).

---

## 🛠️ Technology Stack

**Frontend**
- **Framework**: Angular 17+ (Standalone Components)
- **Styling**: TailwindCSS (Responsive & Dark Mode)
- **Language**: TypeScript

**Backend**
- **Framework**: FastAPI (Python)
- **Database**: SQLite (SQLAlchemy ORM)
- **Authentication**: OAuth 2.0 (Google & GitHub)
- **Validation**: Pydantic

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- Git

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/CampusFix.git
cd CampusFix
```

### 2️⃣ Frontend Setup
```bash
cd Frontend
npm install
npm start
```
The app will be available at `http://localhost:4200`.

### 3️⃣ Backend Setup
```bash
cd Backend
# Create virtual environment (optional but recommended)
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py
```
The API will be available at `http://localhost:8000`.

---

## 🔑 Environment Configuration

Create a `.env` file in the `Backend` directory:

```env
SECRET_KEY=your_secure_secret_key
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
# Admin Access
ADMIN_EMAILS=admin@example.com,your_email@gmail.com
```

---

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Built with ❤️ for better campuses.