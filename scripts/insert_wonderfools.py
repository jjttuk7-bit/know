"""
scripts/insert_wonderfools.py
The WONDERfools K-Entertainment 기사 수동 DB 삽입
YouTube 공식 트레일러 소스: https://www.youtube.com/watch?v=KFv4ywb86F0
"""
import json
import sqlite3
from datetime import datetime
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "website" / "data" / "know.db"

VIDEO_ID   = "KFv4ywb86F0"
SOURCE_URL = f"https://www.youtube.com/watch?v={VIDEO_ID}"

HEADLINE    = "The WONDERfools Review: Netflix's Anti-Superhero Show Is the Best Argument Yet for Flawed Heroes"
SUBHEADLINE = "Park Eun-bin leads a chaotic, charming 1999-set comedy that earns every laugh"

BODY = """It's 1999. The millennium is three weeks away. A middle-aged woman in a Busan market accidentally levitates an entire fish stall. She has no idea how. She has no idea how to stop it either. The WONDERfools opens on this image — embarrassed, airborne mackerel and all — and never really lets go of the joke that superhero stories have been telling wrong for decades: the problem isn't the villain. It's that nobody asked for these powers in the first place.

Netflix dropped all eight episodes on May 15, and the question isn't whether to watch. It's whether you can stop.

Set at the tail end of Korea's IMF crisis, when Y2K panic was genuine and mobile phones were a luxury, the series follows a group of ordinary citizens — a market vendor, a school janitor, a disgraced civil servant — who suddenly develop abilities they cannot control and barely understand. Director Yoo In-sik fills the frame with period-accurate detail: boxy televisions, pay phones, the specific shade of anxiety that defined late-1990s Seoul. Park Eun-bin leads as the market vendor; Cha Eun-woo plays the one character who seems to know slightly more than he lets on.

Korean superhero television has tried seriousness (Moving, 2023) and tried spectacle (Vigilante). The WONDERfools tries something harder: sincerity dressed as farce. The powers are useless in the ways that matter — you cannot fly on purpose, you cannot lift the right things, you definitely cannot keep the fish from levitating during Sunday service. The comedy is physical and precise, and the 1990s setting does real work beyond nostalgia. The era's specific helplessness — no internet to explain what's happening, no community of heroes to find — makes the isolation feel earned, not manufactured.

Korean audiences are arguing about the ending. International viewers are arguing about whether this is better than Moving. Both conversations are correct to be happening. The show has enough ambition to sustain the debate.

Watch it. All eight episodes, ideally in one sitting, with someone who will appreciate the fish scene as much as you do."""

CULTURAL_NOTE = (
    "Y2K (Year 2000) anxiety was a global fear that computers would malfunction "
    "at midnight on January 1, 2000. In Korea, still recovering from the 1997 IMF "
    "financial crisis, the tension carried extra weight — economic fragility meeting "
    "technological uncertainty at the same moment."
)

TAGS = json.dumps(
    ["The WONDERfools", "Netflix", "Park Eun-bin", "Cha Eun-woo",
     "Korean superhero", "K-Entertainment", "OTT"],
    ensure_ascii=False,
)

SEO_TITLE = "The WONDERfools Review: Netflix's Best Korean Superhero Show Yet"
SEO_DESC  = (
    "Netflix's The WONDERfools drops all 8 episodes. Park Eun-bin stars in this "
    "Y2K-era anti-superhero comedy that's the smartest K-entertainment on streaming right now."
)

# YouTube 최고화질 썸네일
IMAGE_URL = f"https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg"


def insert():
    conn = sqlite3.connect(DB_PATH)
    cur  = conn.cursor()

    # 중복 확인
    exists = cur.execute(
        "SELECT id FROM articles WHERE source_url = ?", (SOURCE_URL,)
    ).fetchone()
    if exists:
        print(f"Already exists: id={exists[0]}")
        conn.close()
        return

    now = datetime.utcnow().isoformat()

    cur.execute("""
        INSERT INTO articles (
            source_url, source_name, title_ko,
            headline_en, subheadline_en, body_en,
            seo_title, seo_description,
            category, tags, tone, cultural_note,
            image_url, image_source,
            video_id, video_source,
            published_at_ko, fetched_at, processed_at,
            published, prompt_version, view_count
        ) VALUES (
            ?, ?, ?,
            ?, ?, ?,
            ?, ?,
            ?, ?, ?, ?,
            ?, ?,
            ?, ?,
            ?, ?, ?,
            1, ?, 0
        )
    """, (
        SOURCE_URL, "youtube", "더 원더풀스 (The WONDERfools) 공식 트레일러 — Netflix",
        HEADLINE, SUBHEADLINE, BODY,
        SEO_TITLE, SEO_DESC,
        "K-Entertainment", TAGS, "informative", CULTURAL_NOTE,
        IMAGE_URL, "youtube_thumbnail",
        VIDEO_ID, "youtube_official",
        "2026-05-15T00:00:00", now, now,
        "v1.0",
    ))

    new_id = cur.lastrowid
    conn.commit()
    conn.close()
    print(f"Inserted: id={new_id} / {HEADLINE[:60]}...")


if __name__ == "__main__":
    insert()
