"""
scripts/migrate_add_video.py
기존 know.db에 video_id, video_source 컬럼 추가 (v1.1 마이그레이션)

실행: python scripts/migrate_add_video.py
"""
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "website" / "data" / "know.db"


def migrate():
    if not DB_PATH.exists():
        print(f"DB not found: {DB_PATH} -- skip (schema.sql will create on first run)")
        return

    conn = sqlite3.connect(DB_PATH)
    cur  = conn.cursor()

    existing = {row[1] for row in cur.execute("PRAGMA table_info(articles)")}

    added = []
    for col, definition in [
        ("video_id",     "TEXT"),
        ("video_source", "TEXT"),
    ]:
        if col not in existing:
            cur.execute(f"ALTER TABLE articles ADD COLUMN {col} {definition}")
            added.append(col)

    conn.commit()
    conn.close()

    if added:
        print(f"OK added columns: {', '.join(added)}")
    else:
        print("Schema already up to date.")


if __name__ == "__main__":
    migrate()
