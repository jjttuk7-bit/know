"""
agent/youtube_collector.py — YouTube 공식 채널 최신 영상 수집
YouTube Data API v3 playlistItems.list → CollectedArticle

규칙 (CLAUDE.md):
  - YOUTUBE_API_KEY 없으면 조용히 건너뜀 (선택적 기능)
  - video_id 확보 → image_fetcher.fetch_video() 불필요
  - 원문 전문 저장 금지: description 앞 500자만 summary_ko로 보존
참조: config.yaml youtube_channels 섹션
"""

from __future__ import annotations

import asyncio
import logging
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

import httpx
import yaml

from agent.collector import CollectedArticle

logger = logging.getLogger(__name__)

_YT_API = "https://www.googleapis.com/youtube/v3"


def _load_config() -> dict:
    path = Path(__file__).parent.parent / "config.yaml"
    with path.open(encoding="utf-8") as f:
        return yaml.safe_load(f)


class YouTubeCollector:
    def __init__(self, config: dict | None = None) -> None:
        self._cfg       = config or _load_config()
        self._api_key   = os.getenv("YOUTUBE_API_KEY", "")
        self._channels  = self._cfg.get("youtube_channels", {})
        self._window    = timedelta(hours=self._cfg["pipeline"]["fetch_window_hours"])
        self._semaphore = asyncio.Semaphore(self._cfg["pipeline"]["concurrency"])
        self._enabled   = {c["key"] for c in self._cfg["categories"] if c["enabled"]}

    # ── 공개 진입점 ───────────────────────────────────────────

    async def collect_all(self) -> list[CollectedArticle]:
        if not self._api_key:
            logger.warning("YOUTUBE_API_KEY 없음 — YouTube 채널 수집 건너뜀")
            return []

        async with httpx.AsyncClient(timeout=10, follow_redirects=True) as client:
            tasks = []
            for category, channels in self._channels.items():
                if category not in self._enabled:
                    continue
                for ch in channels:
                    tasks.append(self._collect_channel(client, ch, category))

            batches = await asyncio.gather(*tasks, return_exceptions=True)

        results: list[CollectedArticle] = []
        for batch in batches:
            if isinstance(batch, BaseException):
                logger.warning("YouTube 수집 예외: %s", batch)
                continue
            results.extend(
                a for a in batch if self._is_fresh(a.published_at_ko)
            )

        logger.info("YouTube 채널 수집 완료: %d건", len(results))
        return results

    # ── 채널 1개 수집 ─────────────────────────────────────────

    async def _collect_channel(
        self, client: httpx.AsyncClient, ch: dict, category: str
    ) -> list[CollectedArticle]:
        channel_id = ch.get("id") or await self._resolve_handle(
            client, ch.get("handle", "")
        )
        if not channel_id:
            logger.warning("채널 ID 확인 실패: %s", ch.get("handle", "unknown"))
            return []

        # uploads 재생목록 ID = "UC..." → "UU..."
        uploads_id = "UU" + channel_id[2:]

        async with self._semaphore:
            try:
                r = await client.get(
                    f"{_YT_API}/playlistItems",
                    params={
                        "part":       "snippet",
                        "playlistId": uploads_id,
                        "maxResults": 5,
                        "key":        self._api_key,
                    },
                )
                r.raise_for_status()
            except httpx.HTTPError as exc:
                logger.warning(
                    "playlistItems 실패 [%s]: %s", ch.get("name", channel_id), exc
                )
                return []

        results = []
        for item in r.json().get("items", []):
            snip     = item.get("snippet", {})
            video_id = snip.get("resourceId", {}).get("videoId")
            if not video_id:
                continue

            title = snip.get("title", "").strip()
            if title in ("Private video", "Deleted video", ""):
                continue

            desc    = snip.get("description", "")[:500]  # 원문 전문 저장 금지
            pub_str = snip.get("publishedAt", "")
            try:
                pub_dt = datetime.fromisoformat(pub_str.replace("Z", "+00:00"))
            except Exception:
                pub_dt = datetime.now(tz=timezone.utc)

            results.append(
                CollectedArticle(
                    source_url=f"https://www.youtube.com/watch?v={video_id}",
                    source_name=ch.get("name", "youtube_official"),
                    title_ko=title,
                    summary_ko=desc,
                    published_at_ko=pub_dt,
                    category=category,
                    video_id=video_id,
                )
            )

        return results

    # ── @handle → channel_id 해석 ────────────────────────────

    async def _resolve_handle(
        self, client: httpx.AsyncClient, handle: str
    ) -> str | None:
        if not handle:
            return None
        clean = handle.lstrip("@")
        async with self._semaphore:
            try:
                r = await client.get(
                    f"{_YT_API}/channels",
                    params={"part": "id", "forHandle": clean, "key": self._api_key},
                )
                r.raise_for_status()
                items = r.json().get("items", [])
                if items:
                    return items[0]["id"]
            except httpx.HTTPError as exc:
                logger.warning("handle 해석 실패 [@%s]: %s", clean, exc)
        return None

    def _is_fresh(self, dt: datetime) -> bool:
        now    = datetime.now(tz=timezone.utc)
        dt_utc = dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
        return (now - dt_utc) <= self._window
