import requests
import time
import os
import threading
import uvicorn
from main import app
from fastapi.testclient import TestClient

# Use TestClient to run the app in-process without needing a separate server process
client = TestClient(app)

from dependencies import get_current_user

# Mock auth for Issue testing
async def mock_get_current_user():
    return {"sub": "test_user_123", "email": "test@example.com", "name": "Test User"}

def test_full_suite():
    print("\n=== STARTING FULL BACKEND VERIFICATION ===")
    
    # --- 1. Test Safety Reporting (Anonymous) ---
    print("\n[Safety Report Flow]")
    print("1. Submitting a new safety report...")
    safety_data = {
        "description": "Test Safety Issue: Suspicious wiring",
        "location": "Library Basement"
    }
    
    response = client.post("/safety/reports", data=safety_data)
    
    if response.status_code == 200:
        data = response.json()
        print(f"   ✓ SUCCESS: Report submitted. ID={data.get('id')}")
        safety_id = data.get('id')
    else:
        print(f"   X FAILURE: {response.status_code} - {response.text}")
        return

    print("2. Checking Community Feed...")
    response = client.get("/safety/community")
    
    if response.status_code == 200:
        feed = response.json()
        found = any(item.get('id') == safety_id for item in feed)
        if found:
            print(f"   ✓ SUCCESS: Found report {safety_id} in feed.")
        else:
            print(f"   X FAILURE: Report {safety_id} NOT found in feed.")
    else:
        print(f"   X FAILURE: Could not fetch feed.")

    # --- 2. Test Standard Issues (Authenticated) ---
    print("\n[Maintenance Issue Flow]")
    # Override dependency to simulate logged-in user
    app.dependency_overrides[get_current_user] = mock_get_current_user
    
    print("3. Submitting a maintenance issue...")
    issue_data = {
        "description": "Broken chair in Room 101",
        "location": "Room 101",
        "category": "general"  # Form field usually
    }
    # Issue endpoint uses Form data
    response = client.post("/issues", data=issue_data)
    
    if response.status_code == 200:
        data = response.json()
        print(f"   ✓ SUCCESS: Issue submitted. ID={data.get('id')}")
        issue_id = data.get('id')
    else:
        print(f"   X FAILURE: {response.status_code} - {response.text}")
        issue_id = None

    print("4. Checking Issue List...")
    response = client.get("/issues")
    
    if response.status_code == 200:
        issues = response.json()
        found = any(item.get('id') == issue_id for item in issues) if issue_id else False
        if found:
            print(f"   ✓ SUCCESS: Found issue {issue_id} in list.")
        elif issue_id:
             print(f"   X FAILURE: Issue {issue_id} NOT found in list.")
    else:
        print(f"   X FAILURE: Could not fetch issues.")

    # Clean up
    app.dependency_overrides = {}
    print("\n=== VERIFICATION COMPLETE ===")

if __name__ == "__main__":
    try:
        test_full_suite()
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Test crashed: {e}")
