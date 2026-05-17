"""
scripts/migrate_add_quality.py
기존 know.db에 품질 메타 컬럼 추가 (Q-03~Q-05)
  global_reaction, content_type, reader_level

실행: python scripts/migrate_add_quality.py
"""
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "website" / "data" / "know.db"


def migrate():
    if not DB_PATH.exists():
        print(f"DB not found: {DB_PATH} -- skip")
        return

    conn = sqlite3.connect(DB_PATH)
    cur  = conn.cursor()
    existing = {row[1] for row in cur.execute("PRAGMA table_info(articles)")}

    added = []
    for col, definition in [
        ("global_reaction", "TEXT"),
        ("content_type",    "TEXT DEFAULT 'breaking'"),
        ("reader_level",    "TEXT DEFAULT 'general'"),
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
