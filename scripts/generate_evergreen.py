"""
scripts/generate_evergreen.py — KNow Evergreen 콘텐츠 생성기

사용법:
  python scripts/generate_evergreen.py               # 미생성 주제 전부
  python scripts/generate_evergreen.py --topic kpop-beginners-guide-2026
  python scripts/generate_evergreen.py --list        # 주제 목록만 출력
  python scripts/generate_evergreen.py --force       # 이미 있어도 재생성
  python scripts/generate_evergreen.py --dry-run     # LLM 호출 없이 프롬프트만 출력

규칙 (CLAUDE.md):
  - LLM 호출: GPT-4o → Claude fallback
  - JSON 파싱: safe_parse_json() 경유
  - 시크릿: os.getenv()
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

import yaml

# ── 경로 설정 ─────────────────────────────────────────────────────
ROOT    = Path(__file__).parent.parent
DB_PATH = ROOT / "website" / "data" / "know.db"
PROMPTS = ROOT / "agent" / "prompts"

sys.path.insert(0, str(ROOT))


# ── 설정 로드 ─────────────────────────────────────────────────────

def load_config() -> dict:
    with (ROOT / "config.yaml").open(encoding="utf-8") as f:
        return yaml.safe_load(f)


def load_prompt(name: str) -> str:
    return (PROMPTS / f"{name}.txt").read_text(encoding="utf-8")


# ── JSON 파싱 (safe) ──────────────────────────────────────────────

_RE_FENCE = re.compile(r"```(?:json)?\s*(\{.*?\})\s*```", re.DOTALL)
_RE_BARE  = re.compile(r"\{.*\}", re.DOTALL)

def safe_parse_json(text: str) -> dict | None:
    cleaned = text.strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass
    m = _RE_FENCE.search(cleaned)
    if m:
        try:
            return json.loads(m.group(1))
        except json.JSONDecodeError:
            pass
    m = _RE_BARE.search(cleaned)
    if m:
        try:
            return json.loads(m.group(0))
        except json.JSONDecodeError:
            pass
    return None


# ── LLM 호출 ─────────────────────────────────────────────────────

def call_llm(system: str, user: str, cfg: dict) -> str | None:
    import openai, anthropic

    # 1차: GPT-4o
    try:
        client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        r = client.chat.completions.create(
            model=cfg["llm"]["primary"],
            messages=[
                {"role": "system", "content": system},
                {"role": "user",   "content": user},
            ],
            temperature=0.7,
            response_format={"type": "json_object"},
        )
        return r.choices[0].message.content
    except Exception as exc:
        print(f"  GPT-4o 실패: {exc} — Claude로 재시도")

    # 2차: Claude
    try:
        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        r = client.messages.create(
            model=cfg["llm"]["fallback"],
            max_tokens=2500,
            system=system,
            messages=[{"role": "user", "content": user}],
        )
        return r.content[0].text
    except Exception as exc:
        print(f"  Claude 실패: {exc}")

    return None


# ── DB 조작 ───────────────────────────────────────────────────────

def slug_to_source_url(slug: str) -> str:
    return f"evergreen:{slug}"


def already_exists(slug: str) -> bool:
    if not DB_PATH.exists():
        return False
    conn = sqlite3.connect(str(DB_PATH))
    row = conn.execute(
        "SELECT id FROM articles WHERE source_url = ?",
        (slug_to_source_url(slug),)
    ).fetchone()
    conn.close()
    return row is not None


def save_to_db(slug: str, category: str, data: dict, image_keywords: list[str]) -> int:
    now = datetime.now(tz=timezone.utc).isoformat()
    tags = json.dumps(data.get("tags", []), ensure_ascii=False)
    body = data.get("body_en", "")

    keywords = [k for k in data.get("unsplash_keywords", []) if isinstance(k, str)][:5]
    if not keywords:
        keywords = image_keywords[:5]

    conn = sqlite3.connect(str(DB_PATH))
    conn.execute("PRAGMA journal_mode=WAL")
    cur = conn.execute("""
        INSERT INTO articles (
            source_url, source_name, title_ko,
            headline_en, subheadline_en, body_en,
            seo_title, seo_description,
            category, tags, tone, cultural_note,
            global_reaction, content_type, reader_level,
            image_source,
            published_at_ko, fetched_at, processed_at,
            published, prompt_version, view_count
        ) VALUES (
            ?,?,?,  ?,?,?,  ?,?,  ?,?,?,?,  ?,?,?,  ?,  ?,?,?,  1,?,0
        )
    """, (
        slug_to_source_url(slug),
        "evergreen",
        data.get("headline_en", slug),           # title_ko = EN headline
        data.get("headline_en", "")[:90],
        (data.get("subheadline_en", "") or "")[:60],
        body,
        (data.get("seo_title", "") or "")[:60],
        (data.get("seo_description", "") or "")[:155],
        category,
        tags,
        data.get("tone", "informative"),
        data.get("cultural_note") or None,
        data.get("global_reaction") or None,
        "evergreen",
        data.get("reader_level", "general"),
        "og_generated",                           # Unsplash 별도 처리 시 업데이트
        now, now, now,
        "v1.0",
    ))
    new_id = cur.lastrowid
    conn.commit()
    conn.close()
    print(f"  DB 저장: id={new_id}")
    return new_id


# ── Unsplash 이미지 업데이트 ──────────────────────────────────────

def fetch_unsplash_image(keywords: list[str]) -> dict | None:
    import httpx
    key = os.getenv("UNSPLASH_ACCESS_KEY", "")
    if not key:
        return None
    for kw in keywords:
        try:
            r = httpx.get(
                "https://api.unsplash.com/photos/random",
                params={"query": kw, "orientation": "landscape", "content_filter": "high"},
                headers={"Authorization": f"Client-ID {key}"},
                timeout=8,
            )
            r.raise_for_status()
            d = r.json()
            return {
                "url":        d["urls"]["regular"],
                "credit":     d["user"]["name"],
                "credit_url": d["user"]["links"]["html"],
                "license":    f"Unsplash License — {d.get('links',{}).get('html','')}",
            }
        except Exception:
            continue
    return None


def update_image(article_id: int, img: dict) -> None:
    conn = sqlite3.connect(str(DB_PATH))
    conn.execute("""
        UPDATE articles SET
            image_url=?, image_source='unsplash',
            image_credit=?, image_credit_url=?, image_license=?
        WHERE id=?
    """, (img["url"], img["credit"], img["credit_url"], img["license"], article_id))
    conn.commit()
    conn.close()
    print(f"  이미지 업데이트: {img['url'][:60]}...")


# ── 핵심 생성 로직 ────────────────────────────────────────────────

def generate_topic(topic: dict, category: str, cfg: dict, dry_run: bool) -> bool:
    slug  = topic["slug"]
    title = topic["title"]
    query = topic["target_query"]
    scope = topic.get("scope", "")

    print(f"\n[{category}] {title}")
    print(f"  target: '{query}'")

    system = load_prompt("v1_evergreen")

    user = json.dumps({
        "category":           category,
        "topic_title":        title,
        "target_search_query": query,
        "year":               datetime.now().year,
        "scope":              scope.strip(),
    }, ensure_ascii=False, indent=2)

    if dry_run:
        print("  [dry-run] 프롬프트 출력:")
        print("  SYSTEM:", system[:200], "...")
        print("  USER:",   user[:300])
        return True

    print("  LLM 호출 중...")
    raw = call_llm(system, user, cfg)
    if raw is None:
        print("  LLM 실패 — 스킵")
        return False

    data = safe_parse_json(raw)
    if data is None:
        print("  JSON 파싱 실패 — 스킵")
        print("  raw:", raw[:300])
        return False

    print(f"  헤드라인: {data.get('headline_en','')[:70]}")

    keywords = cfg.get("image_keywords", {}).get(category, [])
    article_id = save_to_db(slug, category, data, keywords)

    # Unsplash 이미지 fetch
    unsplash_kws = [k for k in data.get("unsplash_keywords", []) if isinstance(k, str)]
    if not unsplash_kws:
        unsplash_kws = keywords
    img = fetch_unsplash_image(unsplash_kws[:5])
    if img:
        update_image(article_id, img)
    else:
        print("  이미지 없음 (og_generated 유지)")

    return True


# ── CLI ───────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="KNow Evergreen 콘텐츠 생성기")
    parser.add_argument("--topic",   help="특정 slug만 생성")
    parser.add_argument("--list",    action="store_true", help="주제 목록 출력")
    parser.add_argument("--force",   action="store_true", help="이미 있어도 재생성")
    parser.add_argument("--dry-run", action="store_true", help="LLM 호출 없이 프롬프트만 출력")
    args = parser.parse_args()

    cfg    = load_config()
    topics = cfg.get("evergreen_topics", {})

    # 목록 출력
    if args.list:
        for cat, items in topics.items():
            for t in items:
                exists = "✓" if already_exists(t["slug"]) else "·"
                print(f"  [{exists}] [{cat}] {t['slug']}")
                print(f"        {t['title']}")
        return

    # 특정 slug 또는 전체
    targets: list[tuple[dict, str]] = []
    for cat, items in topics.items():
        for t in items:
            if args.topic and t["slug"] != args.topic:
                continue
            if not args.force and already_exists(t["slug"]):
                print(f"  스킵 (이미 있음): {t['slug']}")
                continue
            targets.append((t, cat))

    if not targets:
        print("생성할 주제 없음 (--force 로 재생성 가능)")
        return

    print(f"\n생성 시작: {len(targets)}개 주제")
    ok = fail = 0
    for topic, cat in targets:
        if generate_topic(topic, cat, cfg, args.dry_run):
            ok += 1
        else:
            fail += 1

    print(f"\n완료: 성공 {ok} / 실패 {fail}")

    # WAL 체크포인트
    if ok > 0 and not args.dry_run and DB_PATH.exists():
        conn = sqlite3.connect(str(DB_PATH))
        conn.execute("PRAGMA wal_checkpoint(FULL)")
        conn.close()
        print("DB WAL 체크포인트 완료")


if __name__ == "__main__":
    main()
