from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

import os
from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./campusfix.db")

connect_args = {}
if "sqlite" in SQLALCHEMY_DATABASE_URL:
    connect_args["check_same_thread"] = False

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    status = Column(String, default="pending")  # pending, in_progress, resolved
    upvotes = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(String, nullable=True)
    reporter_name = Column(String, nullable=True)
    reporter_email = Column(String, nullable=True)
    priority = Column(String, default="medium") # high, medium, low


class SafetyReport(Base):
    __tablename__ = "safety_reports"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    media_url = Column(String, nullable=True)
    is_nsfw = Column(Integer, default=0) # 0=False, 1=True (using Integer for SQLite boolean compatibility if needed, though SQLAlchemy handles Boolean)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="received") # received, investigating, resolved
    is_critical = Column(Integer, default=1) # Default to True (1) as safety issues are critical


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
