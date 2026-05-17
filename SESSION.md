# SESSION.md — KNow
<!-- 매 세션 종료 시 업데이트. Claude Code가 세션 시작 시 가장 먼저 읽는 상태 파일. -->

## 현재 상태

| 항목 | 내용 |
|---|---|
| **최종 업데이트** | 2026-05-17 |
| **현재 단계** | 세션 20 완료 — Core Web Vitals 성능 최적화 |
| **다음 작업** | Q-11 Evergreen 파이프라인 · Search Console sitemap 제출 |

---

## 완료된 작업

- [x] `config.yaml` 작성 — 카테고리 9개 / 컬러 / 필터 키워드 / 이미지 키워드 SSOT 완성
- [x] `requirements.txt` 작성 — Python 3.11 의존성 확정
- [x] `database/schema.sql` 작성 — articles / daily_digest 테이블 + 인덱스
- [x] `database/models.py` 작성 — SQLAlchemy 2.0 ORM + JsonType + make_engine / init_db
- [x] `agent/collector.py` 작성 — Naver API + Daum RSS 수집, 중복 제거, 카테고리 분류
- [x] `agent/fact_extractor.py` 작성 — regex 기반 팩트 추출 (LLM 없음)
- [x] `agent/processor.py` 작성 — process_with_fallback / safe_parse_json / 프롬프트 로딩
- [x] `agent/prompts/v1_*.txt` 작성 — base + MVP 6개 카테고리 변형 프롬프트
- [x] `agent/image_fetcher.py` 작성 — Unsplash API + YouTube 썸네일, 우선순위 폴백
- [x] `agent/publisher.py` 작성 — DB 저장 + daily_digest 큐레이션 + git push
- [x] `agent/notifier.py` 작성 — Buttondown 이메일 + Discord Webhook
- [x] `agent/main.py` 작성 — 파이프라인 오케스트레이터 (6단계)
- [x] `website/` Next.js 14 작성 — 설정 + lib + 컴포넌트 4개 + 페이지 3개 + OG 라우트
- [x] `.github/workflows/daily-kwave.yml` — 2-job 워크플로우 (pipeline + deploy)
- [x] `agent/__init__.py` / `database/__init__.py` / `.gitignore` / `.env.example`
- [x] **MVP 배포 완료** — Vercel (`https://know-red.vercel.app/`) 라이브
- [x] **모바일/데스크탑 반응형 개선** (커밋 3f4b8c3)
- [x] **v1.1 카테고리 3개 활성화** (커밋 20ad6e8)
  - K-Travel / K-Sport / K-Entertainment `enabled: true`
  - `MVP_CATEGORIES` 9개로 확장, 프롬프트 3개 신규 작성
- [x] **공공RSS + YouTube embed** (커밋 298f808)
  - Yonhap 영문 RSS 3개 (culture / sports / news) — 실접속 확인 완료
  - `fetch_video()` — YouTube Data API, 5개 카테고리
  - DB video_id / video_source 컬럼, ArticleCard ▶ VIDEO 배지
- [x] **RSS URL 검증 및 교체** (커밋 16e0e49)
  - 원래 5개 정부 URL 전부 404/연결불가 확인
  - Yonhap 영문 RSS 3개로 교체 (실접속 확인)
- [x] **GA4 연동** (커밋 18a247c) — `G-Q2Y7RWPBWF`, `next/script afterInteractive`
- [x] **Search Console 소유권 코드 추가** (커밋 2e72d2d)
  - `verification: { google: 'sBPk0JemMnPNQg1-iQuDLX6ikDp52y5-OAwCtLyIFaI' }`
  - 배포 후 Search Console에서 "Google 애널리틱스" 방법으로 확인 클릭 필요
- [x] **sitemap + 정책 페이지 + 소셜 공유** (커밋 ca78ca4)
  - `website/app/sitemap.ts`: 동적 sitemap (홈 + 카테고리 + 전체 기사)
  - `lib/config.ts`: SITE_URL / CONTACT_EMAIL / DMCA_EMAIL 상수
  - `/privacy` `/terms` `/dmca` 정책 페이지 3개 (법적 필수)
  - `ShareButtons.tsx`: X(Post) + Copy Link (복사 성공 피드백)
  - `layout.tsx` footer: Privacy · Terms · DMCA 링크
- [x] **성능 최적화 — Core Web Vitals** (커밋 a7e7c6d)
  - `ArticleCard`: `priority` prop 추가 — 모든 그리드 상단 2~3카드 즉시 로드
  - `sizes` 정밀화: `33vw/66vw` → 픽셀 고정값 (`370px/740px/1152px/672px`)
  - `next.config.js`: Vercel에서 AVIF→WebP 자동 변환, 24h TTL, Unsplash·YouTube 도메인
  - 검색 API: `Cache-Control: max-age=3600, stale-while-revalidate=86400`
- [x] **뉴스레터 CTA + 검색 UX + RSS 피드** (커밋 bc7fe29)
  - `NewsletterCTA.tsx`: inline(기사 2단락 뒤) / 풀 배너(홈) 2가지 모드, 다크모드 지원
  - `SearchBar.tsx`: 결과 없음 UX + 포커스 시 카테고리 퀵링크
  - `/api/feed.xml`: RSS 2.0 피드 (최신 20기사, 1시간 캐시)
  - `layout.tsx`: `<head>` RSS auto-discovery + footer RSS 아이콘 링크
- [x] **Q-09 인라인 링크 + 다크모드** (커밋 80060bf)
  - `db.ts`: `getTagLinkedArticles()` — 태그 LIKE 매칭으로 관련 기사 조회
  - `articles/[id]`: `LinkedParagraph` — 본문 첫 등장 태그에 dotted underline 링크
  - `tailwind.config.js`: `darkMode: 'media'`
  - `globals.css`: 다크모드 CSS 변수 오버라이드
  - body / Header / footer / ArticleCard / SearchBar dark: 클래스 적용
- [x] **Q-08 시계열 맥락 + Q-10 유형별 프롬프트** (커밋 fd79b8a)
  - `processor.py`: `_fetch_recent_headlines()` — 최근 7일 같은 카테고리 헤드라인 DB 조회
  - `_build_user_message()`: `recent_coverage_in_this_category` 컨텍스트 주입
  - `v1_base.txt`: CONTENT TYPE STRUCTURE GUIDE (breaking/evergreen/analysis/profile)
  - `v1_kpop/kdrama/kentertainment.txt`: TYPICAL CONTENT TYPES 힌트 추가
  - unsplash_keywords 상한 3→5개
- [x] **기사 품질 개선 Q-02~Q-07** (커밋 c2c6090)
  - `QUALITY_IMPROVEMENTS.md`: 전체 품질 로드맵 문서화
  - `v1_base.txt`: Self-Review 체크리스트 + content_type/reader_level/global_reaction 필드
  - `v1_base.txt`: unsplash_keywords 5개로 확장
  - `image_fetcher.py`: 키워드 순차 시도 (Q-06)
  - `publisher.py`: 당일 동일 엔티티 중복 방지 (Q-07)
  - DB + 웹사이트: 새 3개 컬럼 + 배지/callout UI
- [x] **아이돌 소속 할루시네이션 픽스** (커밋 f6afc56)
  - 발단: 소스 "블랙핑크의 장원영" → LLM이 그대로 재작성 (장원영은 아이브 소속)
  - `v1_base.txt`: FACT VERIFICATION 규칙 추가 — 소속 오류 시 모델 지식으로 교정
  - `v1_kpop.txt`: 주요 그룹 멤버 목록 명시 (IVE / aespa / NewJeans / BLACKPINK / BTS / TWICE)
- [x] **K-Entertainment 수동 기사 작성 + DB 저장** (커밋 d99d852)
  - The WONDERfools (Netflix 2026-05-15) — YouTube 트레일러 소스 (video_id: KFv4ywb86F0)
  - `scripts/insert_wonderfools.py` 작성, articles id=137 저장
- [x] **YouTube 공식 채널 자동 수집** (커밋 2de89b1)
  - `config.yaml`: `youtube_channels` 섹션 — 6카테고리 14채널
    - K-Pop: HYBE / JYP / SMTOWN / YG
    - K-Drama: tvN / JTBC / KBS / MBC
    - K-Entertainment: JTBC / tvN / Netflix Korea
    - K-Travel: KTO(Imagine Your Korea) / VISITKOREA
    - K-Sport: KFA TV
    - K-Beauty: Olive Young
  - `agent/youtube_collector.py`: 신규 — playlistItems.list, handle 자동 해석
  - `agent/collector.py`: `CollectedArticle`에 `video_id` 필드 추가
  - `agent/main.py`: 뉴스 + YouTube 채널 병렬 수집, yt_video_map으로 API 재검색 방지

---

## 진행 중인 작업

- 없음

---

## 다음 세션 할 일

### 🟡 다음 세션 후보
```
1. Q-11 Evergreen 파이프라인
   — scripts/generate_evergreen.py: 주제 목록 → LLM → DB 저장
   — "K-Pop 입문 가이드", "Netflix 한국 드라마 추천", "올리브영 완전 정복" 류

2. Q-12 독자 레벨별 톤 완전 분리
   — general vs fan 프롬프트 분기

3. Search Console sitemap.xml 제출 (유저 직접 진행)
   → Search Console → Sitemaps → sitemap.xml 입력 후 제출
```

---

## 빌드 순서 (전체 로드맵)

```
세션 1~9  MVP 코드베이스 완성 ✅
세션 10   MVP 배포 완료 ✅
세션 11   반응형 UI 개선 + v1.1 카테고리 오픈 ✅
세션 12   공공RSS + YouTube embed + RSS URL 검증 ✅
세션 13   GA4 + Search Console + 아이돌 할루시네이션 픽스 ✅
세션 14   YouTube 공식 채널 자동 수집 (14채널) ✅
세션 15   기사 품질 개선 Q-02~Q-07 ✅
세션 16   sitemap + 정책 페이지 + 소셜 공유 버튼 ✅
세션 17   Q-08 시계열 맥락 + Q-10 유형별 프롬프트 구조 ✅
세션 18   Q-09 내부 링크 + 다크모드 ✅
세션 19   뉴스레터 CTA + 검색 UX + RSS 피드 ✅
세션 20   Core Web Vitals 성능 최적화 ✅  ← 현재
세션 21   Q-11 Evergreen 파이프라인
```

---

## 현재 이슈 / 블로커

- Search Console 소유권 확인 대기 중 → 배포 완료 후 "Google 애널리틱스" 방법 클릭
- Search Console sitemap.xml 미제출 → 소유권 확인 후 직접 제출 필요
- YouTube 채널 핸들 일부 미검증 → 첫 파이프라인 실행 로그로 확인 필요

---

## 환경변수 체크리스트 (GitHub Secrets 등록 필요)

| 변수명 | 필수 | 발급처 | 등록 여부 |
|---|---|---|---|
| `OPENAI_API_KEY` | ✅ 필수 | platform.openai.com | ⬜ |
| `ANTHROPIC_API_KEY` | 권장 | console.anthropic.com | ⬜ |
| `NAVER_CLIENT_ID` | ✅ 필수 | developers.naver.com | ⬜ |
| `NAVER_CLIENT_SECRET` | ✅ 필수 | developers.naver.com | ⬜ |
| `UNSPLASH_ACCESS_KEY` | ✅ 필수 | unsplash.com/developers | ⬜ |
| `YOUTUBE_API_KEY` | 권장 | console.cloud.google.com | ✅ |
| `BUTTONDOWN_API_KEY` | P1 | buttondown.email | ⬜ |
| `DISCORD_WEBHOOK` | P1 | Discord 채널 설정 | ⬜ |
| `TWITTER_API_KEY` | P2 (v1.1) | developer.twitter.com | ⬜ |

---

## 배포 정보

| 항목 | 내용 |
|---|---|
| **플랫폼** | Vercel |
| **URL** | https://know-red.vercel.app/ |
| **GA4** | G-Q2Y7RWPBWF |
| **Search Console** | sBPk0JemMnPNQg1-iQuDLX6ikDp52y5-OAwCtLyIFaI |

---

## 세션 시작 주문 템플릿

```
SESSION.md 읽고, [작업 내용] 이어서 시작해줘.
참조: KWAVE_DAILY_PLAN.md [N절] / PROMPTS.md [섹션명]
```
