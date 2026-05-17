"""
agent/image_fetcher.py — KNow 이미지 페처
Unsplash API(기사 본문) + YouTube 공식 썸네일(K-Pop·K-Drama)

규칙 (CLAUDE.md):
  - Unsplash 출처 표기 필수: "Photo by [이름] on Unsplash" (Unsplash 정책)
  - 인물 사진·아이돌 사진 절대 사용 금지
  - AI 생성 이미지 사용 금지
  - 시크릿: os.getenv() 경유
참조: KWAVE_DAILY_PLAN.md 4.4절
"""

from __future__ import annotations

import asyncio
import logging
import os
from dataclasses import dataclass, field
from pathlib import Path

import httpx
import yaml

from agent.processor import ProcessedArticle

logger = logging.getLogger(__name__)

# YouTube 썸네일을 시도하는 카테고리
_YOUTUBE_CATEGORIES = {"K-Pop", "K-Drama"}

# YouTube 영상 embed를 검색하는 카테고리
_YOUTUBE_VIDEO_CATEGORIES = {"K-Pop", "K-Drama", "K-Entertainment", "K-Travel", "K-Sport"}


# ─────────────────────────────────────────────────────────────
# 내부 컨텍스트 — 관련도 점수 산출에 사용
# ─────────────────────────────────────────────────────────────
@dataclass
class _ArticleContext:
    headline: str
    tags:     list[str] = field(default_factory=list)
    category: str       = ""


# ─────────────────────────────────────────────────────────────
# 결과 타입
# ─────────────────────────────────────────────────────────────
@dataclass
class ImageResult:
    url:        str
    source:     str         # "unsplash" | "youtube_thumbnail"
    credit:     str | None  # Unsplash 작가명 (출처 표기 필수)
    credit_url: str | None  # Unsplash 작가 프로필 URL
    license:    str | None  # 감사 추적용


# ─────────────────────────────────────────────────────────────
# ImageFetcher
# ─────────────────────────────────────────────────────────────
class ImageFetcher:
    def __init__(self, config: dict | None = None) -> None:
        self._cfg       = config or _load_config()
        self._semaphore = asyncio.Semaphore(self._cfg["pipeline"]["concurrency"])
        self._access_key = os.getenv("UNSPLASH_ACCESS_KEY", "")
        self._default_keywords: dict[str, list[str]] = self._cfg["image_keywords"]

    # ── 공개 API ──────────────────────────────────────────────

    async def fetch_for_article(
        self,
        article: ProcessedArticle,
        youtube_id: str | None = None,
    ) -> ImageResult | None:
        """
        이미지 우선순위:
          1. YouTube 공식 썸네일 (K-Pop·K-Drama + youtube_id 있을 때)
          2. Unsplash — LLM 생성 키워드 (관련도 점수 최고점 선택)
          3. Unsplash — config 기본 키워드 (fallback)
          4. None (publisher가 og_generated로 처리)
        """
        async with httpx.AsyncClient(timeout=12, follow_redirects=True) as client:
            # 1. YouTube 썸네일
            if youtube_id and article.category in _YOUTUBE_CATEGORIES:
                result = await self._fetch_youtube(client, youtube_id)
                if result:
                    return result

            # 2. Unsplash — 모든 LLM 키워드로 후보 수집 → 관련도 최고점 선택
            ctx = _ArticleContext(
                headline=article.headline_en,
                tags=article.tags or [],
                category=article.category,
            )
            result = await self._fetch_best_unsplash(
                client,
                keywords=article.unsplash_keywords,
                ctx=ctx,
            )
            if result:
                return result

            # 3. config 기본 키워드로 재시도
            fallback_kws = [
                kw for kw in self._default_keywords.get(article.category, [])
                if kw not in article.unsplash_keywords
            ]
            result = await self._fetch_best_unsplash(client, keywords=fallback_kws, ctx=ctx)
            if result:
                return result

        logger.warning("이미지 페치 실패 [%s]", article.category)
        return None

    # ── Unsplash 검색 + 관련도 점수 선택 ────────────────────────

    async def _fetch_best_unsplash(
        self,
        client: httpx.AsyncClient,
        keywords: list[str],
        ctx: "_ArticleContext",
        candidates_per_kw: int = 3,
    ) -> ImageResult | None:
        """
        각 키워드로 상위 N개 후보 수집 → 기사 관련도 점수 → 최고점 반환.
        /search/photos (관련도 정렬) 사용 — /photos/random 대비 정확도 대폭 향상.
        """
        all_candidates: list[dict] = []
        headers = {"Authorization": f"Client-ID {self._access_key}"}

        for kw in keywords:
            if not kw:
                continue
            async with self._semaphore:
                try:
                    r = await client.get(
                        "https://api.unsplash.com/search/photos",
                        params={
                            "query":          kw,
                            "orientation":    "landscape",
                            "content_filter": "high",
                            "per_page":       candidates_per_kw,
                        },
                        headers=headers,
                    )
                    r.raise_for_status()
                    results = r.json().get("results", [])
                    all_candidates.extend(results)
                    logger.debug("Unsplash [%s]: %d 후보", kw[:40], len(results))
                except httpx.HTTPStatusError as exc:
                    logger.warning("Unsplash HTTP 오류 [%s]: %s", kw[:30], exc.response.status_code)
                except httpx.HTTPError as exc:
                    logger.warning("Unsplash 연결 오류 [%s]: %s", kw[:30], exc)

        if not all_candidates:
            return None

        # 관련도 점수 계산 후 최고점 선택
        scored = [
            (self._score_candidate(d, ctx), d)
            for d in all_candidates
        ]
        scored.sort(key=lambda x: x[0], reverse=True)
        best_score, best = scored[0]
        logger.debug(
            "Unsplash 최고점 선택 (%.1f점): %s",
            best_score,
            best.get("alt_description", "")[:50],
        )

        try:
            return ImageResult(
                url=best["urls"]["regular"],
                source="unsplash",
                credit=best["user"]["name"],
                credit_url=best["user"]["links"]["html"],
                license=f"Unsplash License — {best.get('links', {}).get('html', '')}",
            )
        except (KeyError, TypeError) as exc:
            logger.warning("Unsplash 파싱 실패: %s", exc)
            return None

    def _score_candidate(self, candidate: dict, ctx: "_ArticleContext") -> float:
        """
        이미지 alt_description / description / photo tags와
        기사 헤드라인·태그·카테고리 단어 겹침 점수 산출.
        """
        # 이미지 설명 텍스트 통합
        img_text = " ".join(filter(None, [
            candidate.get("alt_description") or "",
            candidate.get("description") or "",
            " ".join(t.get("title", "") for t in candidate.get("tags", [])),
        ])).lower()

        if not img_text:
            return 0.0

        score = 0.0

        # 헤드라인 단어 (길이 3자 이상, 불용어 제외)
        _STOP = {"the", "and", "for", "with", "from", "this", "that", "are", "was",
                 "has", "have", "been", "not", "its", "their", "how", "why", "what"}
        headline_words = [
            w for w in ctx.headline.lower().split()
            if len(w) > 3 and w not in _STOP
        ]
        for word in headline_words:
            if word in img_text:
                score += 1.5

        # 기사 태그
        for tag in ctx.tags:
            if tag.lower() in img_text:
                score += 1.0

        # 카테고리 키워드 힌트
        cat_hint = ctx.category.lower().replace("k-", "korean ")
        for part in cat_hint.split():
            if len(part) > 3 and part in img_text:
                score += 0.5

        return score

    # ── YouTube 공식 썸네일 ───────────────────────────────────

    async def _fetch_youtube(
        self,
        client: httpx.AsyncClient,
        youtube_id: str,
    ) -> ImageResult | None:
        """
        YouTube maxresdefault 썸네일 존재 여부 확인 후 반환.
        공식 채널 확인은 수집 단계에서 보장되어야 함.
        """
        url = f"https://img.youtube.com/vi/{youtube_id}/maxresdefault.jpg"
        async with self._semaphore:
            try:
                r = await client.head(url)
                # YouTube는 썸네일 없을 때 120×90 기본 이미지 반환(200) — 크기로 판별
                if r.status_code == 200:
                    content_length = int(r.headers.get("content-length", 0))
                    if content_length > 5000:   # 기본 이미지는 ~1.4 KB
                        return ImageResult(
                            url=url,
                            source="youtube_thumbnail",
                            credit=None,
                            credit_url=None,
                            license="YouTube thumbnail — official channel",
                        )
            except httpx.HTTPError as exc:
                logger.debug("YouTube 썸네일 확인 실패 [%s]: %s", youtube_id, exc)
        return None


    # ── YouTube 영상 검색 ─────────────────────────────────────

    async def fetch_video(self, article: ProcessedArticle) -> str | None:
        """
        YouTube Data API → video_id 반환.
        K-Pop·K-Drama·K-Entertainment·K-Travel·K-Sport 카테고리만 검색.
        YOUTUBE_API_KEY 없으면 None 반환 (선택적 기능).
        """
        if article.category not in _YOUTUBE_VIDEO_CATEGORIES:
            return None
        api_key = os.getenv("YOUTUBE_API_KEY", "")
        if not api_key:
            return None

        query = f"{article.headline_en[:60]} Korea"
        params = {
            "part":              "snippet",
            "q":                 query,
            "type":              "video",
            "maxResults":        3,
            "order":             "relevance",
            "videoEmbeddable":   "true",
            "relevanceLanguage": "en",
            "key":               api_key,
        }

        async with httpx.AsyncClient(timeout=8) as client:
            async with self._semaphore:
                try:
                    r = await client.get(
                        "https://www.googleapis.com/youtube/v3/search",
                        params=params,
                    )
                    r.raise_for_status()
                except httpx.HTTPError as exc:
                    logger.warning("YouTube 영상 검색 실패 [%s]: %s", query[:40], exc)
                    return None

        for item in r.json().get("items", []):
            vid = item.get("id", {}).get("videoId")
            if vid:
                return vid
        return None


# ─────────────────────────────────────────────────────────────
# 유틸
# ─────────────────────────────────────────────────────────────
def _load_config() -> dict:
    path = Path(__file__).parent.parent / "config.yaml"
    with path.open(encoding="utf-8") as f:
        return yaml.safe_load(f)
