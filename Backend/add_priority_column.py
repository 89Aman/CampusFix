import sqlite3

def upgrade_db():
    conn = sqlite3.connect('campusfix.db')
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE issues ADD COLUMN priority TEXT DEFAULT 'medium'")
        conn.commit()
        print("Successfully added 'priority' column.")
    except sqlite3.OperationalError as e:
        print(f"Error (column might already exist): {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    upgrade_db()
