
from sqlalchemy.orm import Session
from models import Issue, SafetyReport, engine, SessionLocal, Base
import random
from datetime import datetime, timedelta

def seed_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        print("Seeding data...")

        # --- Seed Issues ---
        issues_data = [
            {
                "description": "Broken projector in Lecture Hall 3",
                "location": "Lecture Hall 3",
                "status": "pending",
                "category": "general",
                "priority": "medium",
                "reporter_name": "Student A",
                "upvotes": 5
            },
            {
                "description": "Water cooler leaking near gym",
                "location": "Sports Complex",
                "status": "in_progress",
                "category": "general",
                "priority": "high",
                "reporter_name": "Staff B",
                "upvotes": 12
            },
            {
                "description": "Loose tile on main walkway",
                "location": "Main Walkway",
                "status": "resolved",
                "category": "safety_hazard",
                "priority": "low",
                "reporter_name": "Student C",
                "upvotes": 2
            }
        ]

        for data in issues_data:
            issue = Issue(
                description=data["description"],
                location=data["location"],
                status=data["status"],
                category=data["category"],
                priority=data["priority"],
                reporter_name=data["reporter_name"],
                upvotes=data["upvotes"],
                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 5))
            )
            db.add(issue)

        # --- Seed Safety Reports ---
        safety_data = [
            {
                "description": "Suspicious person loitering near back gate late at night.",
                "location": "Back Gate",
                "status": "investigating",
                "is_critical": 1,
                "is_nsfw": 0
            },
            {
                "description": "Dark alleyway lights not working.",
                "location": "Pathway to Hostel D",
                "status": "received",
                "is_critical": 0,
                "is_nsfw": 0
            },
            {
                "description": "Stray dogs acting aggressive.",
                "location": "Near Cafeteria",
                "status": "resolved",
                "is_critical": 1,
                "is_nsfw": 0
            }
        ]

        for data in safety_data:
            report = SafetyReport(
                description=data["description"],
                location=data["location"],
                status=data["status"],
                is_critical=data["is_critical"],
                is_nsfw=data["is_nsfw"],
                created_at=datetime.utcnow() - timedelta(hours=random.randint(1, 48))
            )
            db.add(report)

        db.commit()
        print("Data seeded successfully!")

    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()