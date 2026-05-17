"""
scripts/backfill_evergreen_images.py
이미지 없는 Evergreen 기사에 Unsplash 이미지 일괄 적용

사용법:
  python scripts/backfill_evergreen_images.py
  python scripts/backfill_evergreen_images.py --force   # 이미 있는 것도 교체
"""

from __future__ import annotations

import argparse
import os
import sqlite3
from pathlib import Path

import httpx
import yaml

ROOT    = Path(__file__).parent.parent
DB_PATH = ROOT / "website" / "data" / "know.db"

# .env 파일 자동 로드 (있으면)
env_path = ROOT / ".env"
if env_path.exists():
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, _, v = line.partition("=")
            os.environ.setdefault(k.strip(), v.strip())


def load_config() -> dict:
    with (ROOT / "config.yaml").open(encoding="utf-8") as f:
        return yaml.safe_load(f)


def fetch_unsplash(keywords: list[str], api_key: str) -> dict | None:
    for kw in keywords:
        try:
            r = httpx.get(
                "https://api.unsplash.com/photos/random",
                params={"query": kw, "orientation": "landscape", "content_filter": "high"},
                headers={"Authorization": f"Client-ID {api_key}"},
                timeout=8,
            )
            r.raise_for_status()
            d = r.json()
            return {
                "url":        d["urls"]["regular"],
                "credit":     d["user"]["name"],
                "credit_url": d["user"]["links"]["html"],
                "license":    f"Unsplash License — {d.get('links', {}).get('html', '')}",
            }
        except Exception as exc:
            print(f"  키워드 '{kw}' 실패: {exc}")
            continue
    return None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="이미 이미지 있는 기사도 교체")
    args = parser.parse_args()

    api_key = os.getenv("UNSPLASH_ACCESS_KEY", "")
    if not api_key:
        print("UNSPLASH_ACCESS_KEY 없음.")
        print("방법 1: set UNSPLASH_ACCESS_KEY=키 && python scripts/backfill_evergreen_images.py")
        print("방법 2: .env 파일에 UNSPLASH_ACCESS_KEY=키 추가 후 재실행")
        return

    cfg      = load_config()
    defaults = cfg.get("image_keywords", {})

    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row

    query = """
        SELECT id, category, tags FROM articles
        WHERE source_name = 'evergreen'
    """
    if not args.force:
        query += " AND (image_url IS NULL OR image_source = 'og_generated')"

    rows = conn.execute(query).fetchall()
    print(f"처리 대상: {len(rows)}개 기사\n")

    ok = fail = 0
    for row in rows:
        print(f"[id={row['id']}] {row['category']}")
        kws = defaults.get(row["category"], [])[:5]
        img = fetch_unsplash(kws, api_key)
        if img:
            conn.execute("""
                UPDATE articles SET
                    image_url=?, image_source='unsplash',
                    image_credit=?, image_credit_url=?, image_license=?
                WHERE id=?
            """, (img["url"], img["credit"], img["credit_url"], img["license"], row["id"]))
            conn.commit()
            print(f"  이미지 적용: {img['url'][:70]}...")
            ok += 1
        else:
            print(f"  실패 — og_generated 유지")
            fail += 1

    conn.execute("PRAGMA wal_checkpoint(FULL)")
    conn.close()
    print(f"\n완료: 성공 {ok} / 실패 {fail}")


if __name__ == "__main__":
    main()
