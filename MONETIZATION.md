# MONETIZATION.md — KNow 수익화 로드맵

> 작성: 2026-05-17  
> 방향: 사이트 안정화 완료 후 광고 진행. 독자에게 비용 청구 없음.  
> 기반: Google AdSense + 제휴 마케팅 + 스폰서십 단계별 확장

---

## 전제 조건 — 안정화 체크리스트

광고 및 수익화 진행 전 아래 항목 완료 후 시작.

| 항목 | 상태 |
|---|---|
| 매일 자동 파이프라인 정상 운영 확인 | ⬜ |
| GitHub Actions 첫 실행 성공 | ⬜ |
| Vercel 배포 안정화 | ⬜ |
| Search Console 소유권 확인 + sitemap 제출 | ⬜ |
| Google Analytics 트래픽 데이터 확인 (최소 2주) | ⬜ |
| 기사 수 50개 이상 (현재 145개 ✅) | ✅ |
| 정책 페이지 완비 (Privacy / Terms / DMCA) | ✅ |
| 모바일·데스크탑 UI 안정 | ✅ |

---

## Phase 1 — 기반 구축 (안정화 완료 후 즉시)

### 1-1. Google AdSense

**신청 방법:**
```
1. adsense.google.com 접속
2. 사이트 URL 등록 (know-red.vercel.app 또는 실제 도메인)
3. 광고 코드 발급 → layout.tsx에 삽입 (코드 구현 가능)
4. 심사 기간: 2~4주
```

**광고 배치 전략 (심사 통과 후):**
```
위치 1: 기사 본문 2단락 뒤 (현재 뉴스레터 CTA 자리)
위치 2: 기사 하단 (출처 표기 위)
위치 3: 카테고리 페이지 그리드 — 3번째 카드 자리 (인피드 광고)
```

**예상 수익 (CPM $3~8 기준):**

| 월 방문자 | 예상 수익 |
|---|---|
| 10,000명 | $30~80 |
| 50,000명 | $150~400 |
| 100,000명 | $400~1,200 |

---

### 1-2. 제휴 마케팅 — K-뷰티 (AdSense와 동시 시작 가능)

**추천 제휴처:**

| 제휴처 | 카테고리 | 커미션 | 신청처 |
|---|---|---|---|
| YesStyle | K-뷰티·K-패션 | 5~10% | yesstyle.com/affiliate |
| Stylevana | K-뷰티 전문 | 8% | stylevana.com/affiliate |
| Olive Young Global | K-뷰티 공식 | 별도 협의 | 직접 문의 |
| iHerb | 한국 뷰티·건강 | 5% | iherb.com/affiliate |
| KoreanClass101 | 한국어 학습 | 가입당 $10~30 | affiliate.koreanclass101.com |

**적용 방법:**
```
- K-Beauty 기사 하단 "Where to Buy" 섹션에 제휴 링크 삽입
- Evergreen "Korean Skincare Routine Guide" 제품 추천 링크
- 링크 클릭 후 구매 시 자동 커미션 발생 (독자 추가 비용 없음)
```

---

## Phase 2 — 트래픽 성장 (3~6개월)

### 2-1. 제휴 마케팅 확장

| 카테고리 | 제휴처 | 커미션 |
|---|---|---|
| K-Drama 스트리밍 | Viki Pass (비키) | 가입당 $5~15 |
| K-Pop 굿즈 | Weverse Shop | 판매액 5~8% |
| K-Pop 굿즈 | Ktown4u, Moonrok | 판매액 5~10% |
| K-Travel | Klook, Viator 한국 투어 | 예약당 3~6% |
| K-Food | Korean Food Market | 판매액 5% |

### 2-2. 스폰서 뉴스레터

```
조건: 뉴스레터 구독자 1,000명 이상
단가: K-뷰티 브랜드 스폰서십 1회 → $100~500
      K-팝 앨범 리뷰 스폰서 → $50~200
      한국관광공사(KTO) 협찬 가능성
```

---

## Phase 3 — 구조적 수익 (6개월 이후, 충분한 트래픽 확보 시)

### 3-1. KNow+ 프리미엄 멤버십 ($5~9/월)

```
무료 독자   → 광고 있음, 기본 기사 전체 접근
KNow+ 회원 → 광고 없음
             주간 심층 K-culture 트렌드 분석
             독점 Evergreen 가이드 (월 2편)
             월간 K-culture 트렌드 리포트 PDF

구현: Substack 또는 Memberful 연동
예상: 구독자 200명 × $7 = $1,400/월
```

### 3-2. 브랜드 직접 협업

```
Sponsored Article   → 브랜드 제품 리뷰 기사
                      $200~1,000/건
Category Sponsorship → "K-Beauty 섹션 스폰서"
                      월 $300~1,500
Newsletter Sponsorship → 주간 뉴스레터 배너
                        $50~500/회
```

---

## 수익 시뮬레이션

| 월 방문자 | AdSense | 제휴 마케팅 | 스폰서 | 월 합계 |
|---|---|---|---|---|
| 10,000 | $50 | $30 | — | **$80** |
| 50,000 | $300 | $200 | $100 | **$600** |
| 100,000 | $800 | $500 | $300 | **$1,600** |
| 300,000 | $2,500 | $1,500 | $1,000 | **$5,000** |

---

## 트래픽 확보 전략 (수익의 전제 조건)

### 즉시 가능 (비용 $0)

```
Pinterest      K-뷰티·K-패션 기사 핀 공유 (SEO 연동, 장기 유입)
Reddit         r/korea, r/kdrama, r/kpop, r/AsianBeauty에 기사 공유
X (Twitter)    @KNowKorea 계정 운영 + 일일 기사 공유
Instagram      기사 카드 이미지화 + 링크 인 바이오
```

### 중기 (1~3개월)

```
Google Discover  히어로 이미지 품질 유지 → 자동 추천 진입
Search Console   Evergreen 기사 색인 + 검색 노출 모니터링
백링크 확보      K-culture 블로그·포럼에서 KNow 기사 인용 유도
```

### 장기 (3~6개월)

```
YouTube 숏폼    기사 기반 Shorts 콘텐츠 제작
TikTok          K-culture 트렌드 클립 + KNow 링크
인플루언서 교류  K-culture 유튜버/틱토커와 콘텐츠 협업
```

---

## 실행 순서 (안정화 완료 후)

```
Step 1  Google AdSense 신청 → 심사 대기 (2~4주)
Step 2  YesStyle / Stylevana 제휴 신청 (즉시 가능)
Step 3  Pinterest + Reddit 계정 개설 + 기사 공유 시작
Step 4  AdSense 승인 → 광고 코드 삽입 (Claude Code가 구현)
Step 5  트래픽 데이터 분석 → 고수익 카테고리 집중 강화
Step 6  Phase 2 제휴 확장 + 스폰서십 협상
```

---

## 참고 — 현재 KNow 자산 현황

| 자산 | 현황 |
|---|---|
| 총 기사 수 | 145개 (뉴스 137 + Evergreen 8) |
| 카테고리 | 9개 (K-Pop / K-Drama / K-Beauty / K-Food / K-Fashion / K-Lifestyle / K-Travel / K-Sport / K-Entertainment) |
| 일일 자동 발행 | 뉴스 + YouTube 공식채널 14개 수집 |
| 뉴스레터 | Buttondown 연동 완료 |
| 정책 페이지 | Privacy / Terms / DMCA 완비 |
| SEO | sitemap 생성 완료, Search Console 연동 완료 |
| Analytics | GA4 (G-Q2Y7RWPBWF) 연동 완료 |
