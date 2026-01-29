# CampusFix Project Context

> **Purpose**: Comprehensive documentation for understanding and rebuilding the CampusFix project.
> **Last Updated**: 2026-01-29

---

## 📋 Project Overview

**CampusFix** is a community-driven full-stack platform designed to streamline campus facility management and enhance student safety. The application enables transparent communication between students/staff and administration for reporting, tracking, and resolving campus infrastructure issues in real-time.

### Core Purpose
- **Reporting**: Students and staff can report campus issues (e.g., broken facilities, leaks, safety hazards) with photos and location details.
- **Administration**: Authorized staff can manage, prioritize, and resolve issues via a dedicated dashboard.
- **Transparency**: Real-time status tracking (`Pending`, `In Progress`, `Resolved`) keeping the community informed.
- **Community Safety**: Integrated tools like an SOS button, virtual siren, and GPS location sharing to protect students.
- **Validation**: A community upvoting system to highlight and escalate high-priority reports.

---

## 🏗️ System Architecture

┌─────────────────────────────────────────────────────────────────────────────┐
│                              CampusFix System                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐                   ┌─────────────────────┐          │
│  │   Flutter App       │                   │                     │          │
│  │     (Mobile)        │◄─────────────────►│   FastAPI Backend   │          │
│  │                     │                   │                     │          │
│  │  • Issue Reporting  │                   │  • RESTful API      │          │
│  │  • Status Feed      │                   │  • OAuth 2.0 / Auth │          │
│  │  • Admin Dashboard  │                   │  • PostgreSQL       │          │
│  │  • SOS & Siren      │                   │  • Supabase Storage │          │
│  │  • GPS Sharing      │                   │  • NSFW Check (AI)  │          │
│  └─────────────────────┘                   └─────────────────────┘          │
│                                                       │                     │
│                                      ┌────────────────▼────────────┐        │
│                                      │   Cloud Deployment          │        │
│                                      │   (GCP Cloud Run / Docker)  │        │
│                                      └─────────────────────────────┘        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

### Tech Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Mobile App** | Flutter (Dart) | Modern cross-platform mobile application (Material 3) |
| **Backend API** | FastAPI (Python) | High-performance asynchronous REST API |
| **Database** | PostgreSQL (Supabase) | Production-grade persistent relational database |
| **Image Storage** | Supabase Storage | Cloud storage for incident documentation |
| **Authentication** | OAuth 2.0 & Session Tokens | Secure login for students and administrators |
| **Safety Logic** | Geolocator, SMS, Siren | GPS tracking and emergency alert systems |
| **Deployment** | Docker & Cloud Run | Containerized scalable cloud infrastructure |

---

## 📱 Feature Specifications (Tab-by-Tab)

### 1. Issues Tab (Community Feed)
The central hub where students browse and interact with reported problems.
- **Interactive List**: High-quality feed with image previews and location tags.
- **Upvoting**: Community-driven prioritization system.
- **Resolution Tracking**: Visible status chips (`Reported`, `In Progress`, `Resolved`).
- **Admin Access**: Seamless transition to management tools for authorized users.

### 2. Safety Tools Tab (Emergency Hub)
A high-priority interface for immediate student protection.
- **SOS Button**: Quick-dial trigger for Campus Security (1091).
- **Virtual Siren**: Toggleable high-decibel audible alert.
- **Live Location Sharing**: One-tap share of current GPS coordinates via SMS/Share options.
- **Trusted Contacts**: Secure vault for managing personal emergency contact list.
- **Quick Dial Tools**: Fast access to Police (100) and other essential services.

### 3. Report Tab (Safety Incidents)
Streamlined module for reporting security or safety hazards directly to monitoring teams.

### 4. Community Tab
A space for campus-wide announcements and discussion regarding maintenance and safety initiatives.

---

## 🔌 Backend API Reference

**Host**: `https://backend-492502501801.europe-west1.run.app`

### Key Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/issues` | Fetch all community reports | Yes |
| `POST` | `/issues` | Submit a new report with image | Yes |
| `POST` | `/issues/{id}/upvote` | Support a reported issue | Yes |
| `PATCH` | `/issues/{id}/status` | Update issue lifecycle (Admin) | Yes + Admin |
| `POST` | `/auth/exchange-token` | Estabish session for mobile clients | No |
| `GET` | `/analytics` | Dashboard stats (totals, resolved) | Yes + Admin |

---

## � Administrative Access
- **Authorization**: Controlled via the `ADMIN_EMAILS` environment variable.
- **Role-Based Views**: Only authorized emails can access the Management Dashboard and update issue statuses.

---

## � Deployment & Scaling
- **Containerization**: Entire backend is Dockerized for consistency across environments.
- **Cloud Hosting**: Deployed on **Google Cloud Run** for serverless scaling and high availability.
- **Asset Management**: Images are stored in **Supabase S3-compatible buckets** to ensure persistent access.

---

*This document serves as the master specification for the CampusFix project development team.*
