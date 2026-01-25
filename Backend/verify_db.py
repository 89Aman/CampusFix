import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
import sys

# Load env vars
load_dotenv()

database_url = os.getenv("DATABASE_URL")
print(f"DEBUG: DATABASE_URL from env: {database_url}")

if not database_url:
    print("ERROR: DATABASE_URL is not set in environment.")
    sys.exit(1)

if "sqlite" in database_url:
    print("WARNING: Still using SQLite URL. Check your .env file.")

if "[YOUR-PASSWORD]" in database_url:
    print("ERROR: Placeholder [YOUR-PASSWORD] found in connection string. You must replace it with your actual password.")
    sys.exit(1)

try:
    print("Attempting to connect to database...")
    engine = create_engine(database_url)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("\nSUCCESS: Connected to database!")
        
        # Check tables
        print("\nChecking for tables...")
        result = connection.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public'"))
        tables = [row[0] for row in result]
        print(f"Tables found: {tables}")
        
        if 'issues' in tables:
            # Check issue count
            result = connection.execute(text("SELECT count(*) FROM issues"))
            count = result.scalar()
            print(f"Number of issues in 'issues' table: {count}")
            
            if count >= 0:
                print("Fetching top 5 issues...")
                result = connection.execute(text("SELECT id, description, created_at FROM issues LIMIT 5"))
                for row in result:
                    print(row)
                
                # Try inserting a test issue
                print("\nAttempting to INSERT a test issue...")
                try:
                    insert_query = text("INSERT INTO issues (description, location, status) VALUES (:desc, :loc, :status)")
                    connection.execute(insert_query, {"desc": "Test Issue from Script", "loc": "Debug Land", "status": "pending"})
                    connection.commit()
                    print("SUCCESS: Inserted test issue!")
                except Exception as e:
                    print(f"INSERT FAILED: {e}")


except Exception as e:
    print(f"\nCONNECTION FAILED: {e}")
    print("Please check your password and connection string details in .env")
