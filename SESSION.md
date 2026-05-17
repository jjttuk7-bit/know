# SESSION.md — KNow
<!-- 매 세션 종료 시 업데이트. Claude Code가 세션 시작 시 가장 먼저 읽는 상태 파일. -->

## 현재 상태

| 항목 | 내용 |
|---|---|
| **최종 업데이트** | 2026-05-17 |
| **현재 단계** | MVP 배포 완료 + v1.1 카테고리 활성화 완료 |
| **다음 작업** | Google Analytics 4 + Search Console + 정책 페이지 |

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
- [x] **MVP 배포 완료** — GitHub Pages 라이브
- [x] **모바일/데스크탑 반응형 개선** (커밋 3f4b8c3)
  - 히어로 비율: `aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9]`
  - featured 카드: 모바일 16:9, 데스크탑 16:7
  - 헤더 카테고리 탭 탭타겟 개선 (36px)
  - 검색 입력창 높이 개선
  - CategoryBadge sm: 10px → 11px
  - 관련 기사 그리드: 3열 → 2열 (max-w-2xl 컨테이너 대응)
- [x] **v1.1 카테고리 3개 활성화** (커밋 20ad6e8)
  - K-Travel / K-Sport / K-Entertainment `enabled: true`
  - `MVP_CATEGORIES` 9개로 확장 (헤더 네비 + SSG 자동 반영)
  - 프롬프트 3개 신규 작성: `v1_ktravel.txt` / `v1_ksport.txt` / `v1_kentertainment.txt`

---

## 진행 중인 작업

- 없음

---

## 다음 세션 할 일

### 🔴 우선순위 1 — 트래픽 측정 (배포 후 필수)
```
1. Google Analytics 4 연동
   - website/app/layout.tsx에 GA4 Script 추가
   - NEXT_PUBLIC_GA_ID 환경변수

2. Google Search Console
   - sitemap.xml 제출 확인 (/api/sitemap.xml 또는 정적 생성)
   - 소유권 확인 메타태그 layout.tsx 추가
```

### 🔴 우선순위 2 — 법적 필수 페이지
```
3. /privacy  — Privacy Policy
4. /terms    — Terms of Use
5. /dmca     — DMCA 정책 (Unsplash 이미지 사용 때문에 필수)
   → website/app/privacy/page.tsx 등 정적 페이지로 작성
```

### 🟡 우선순위 3 — 사용자 경험
```
6. 소셜 공유 버튼 — 기사 상세 페이지 (X, Copy Link)
7. 뉴스레터 구독 인라인 CTA — 기사 본문 중간 삽입
8. 검색 결과 없음 UX 개선
```

---

## 빌드 순서 (전체 로드맵)

```
세션 1~9  MVP 코드베이스 완성 ✅
세션 10   MVP 배포 완료 ✅
세션 11   반응형 UI 개선 + v1.1 카테고리 오픈 ✅  ← 현재
세션 12   Analytics + Search Console + 정책 페이지
세션 13   소셜 공유 + 뉴스레터 CTA 개선
세션 14   다크모드
```

---

## 현재 이슈 / 블로커

- 없음

---

## 환경변수 체크리스트 (GitHub Secrets 등록 필요)

| 변수명 | 필수 | 발급처 | 등록 여부 |
|---|---|---|---|
| `OPENAI_API_KEY` | ✅ 필수 | platform.openai.com | ⬜ |
| `ANTHROPIC_API_KEY` | 권장 | console.anthropic.com | ⬜ |
| `NAVER_CLIENT_ID` | ✅ 필수 | developers.naver.com | ⬜ |
| `NAVER_CLIENT_SECRET` | ✅ 필수 | developers.naver.com | ⬜ |
| `UNSPLASH_ACCESS_KEY` | ✅ 필수 | unsplash.com/developers | ⬜ |
| `YOUTUBE_API_KEY` | 권장 | console.cloud.google.com | ⬜ |
| `BUTTONDOWN_API_KEY` | P1 | buttondown.email | ⬜ |
| `DISCORD_WEBHOOK` | P1 | Discord 채널 설정 | ⬜ |
| `TWITTER_API_KEY` | P2 (v1.1) | developer.twitter.com | ⬜ |
| `NEXT_PUBLIC_GA_ID` | P1 | analytics.google.com | ⬜ |

---

## 세션 시작 주문 템플릿

```
SESSION.md 읽고, [작업 내용] 이어서 시작해줘.
참조: KWAVE_DAILY_PLAN.md [N절] / PROMPTS.md [섹션명]
```
