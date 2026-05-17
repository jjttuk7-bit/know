'use client'
// 클라이언트 검색 — /api/search에서 인덱스 로드 후 fuse.js로 퍼지 검색
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { getCatColor, parseTags, formatDateShort, MVP_CATEGORIES, catToSlug } from '@/lib/config'
import type { ArticleIndex } from '@/lib/db'

type FuseResult = { item: ArticleIndex; score?: number }

const QUICK_CATEGORIES = MVP_CATEGORIES.slice(0, 6)

export default function SearchBar() {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState<ArticleIndex[]>([])
  const [open,    setOpen]    = useState(false)
  const [focused, setFocused] = useState(false)
  const [fuse,    setFuse]    = useState<any>(null)
  const ref = useRef<HTMLDivElement>(null)

  // fuse.js + 검색 인덱스 지연 로딩
  useEffect(() => {
    if (fuse) return
    Promise.all([
      import('fuse.js').then(m => m.default),
      fetch('/api/search').then(r => r.json()),
    ]).then(([Fuse, index]) => {
      setFuse(new Fuse(index, {
        keys:              [
          { name: 'headline_en',    weight: 0.6 },
          { name: 'seo_description', weight: 0.25 },
          { name: 'tags',           weight: 0.15 },
        ],
        threshold:         0.35,
        includeScore:      true,
        ignoreLocation:    true,
      }))
    })
  }, [fuse])

  // 쿼리 변경 시 검색
  useEffect(() => {
    if (!fuse || query.trim().length < 2) { setResults([]); return }
    const hits = (fuse.search(query) as FuseResult[])
      .slice(0, 8)
      .map(r => r.item)
    setResults(hits)
    setOpen(hits.length > 0)
  }, [query, fuse])

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative w-full max-w-xs">
      <div className="relative">
        <input
          type="search"
          placeholder="Search articles…"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => { setFocused(true); if (results.length > 0 || query.length < 2) setOpen(true) }}
          onBlur={() => setFocused(false)}
          className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-[#E8E6DF] dark:border-[#1E1E3A]
                     bg-white dark:bg-[#13132A] dark:text-[#EAE9E2] dark:placeholder-gray-500
                     focus:outline-none focus:border-know-red transition-colors"
        />
        <svg className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
        </svg>
      </div>

      {/* 검색 드롭다운 */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#13132A]
                        rounded-card border border-[#E8E6DF] dark:border-[#1E1E3A]
                        shadow-lg z-50 overflow-hidden">

          {/* 결과 있을 때 */}
          {results.length > 0 && (
            <>
              {results.map(article => {
                const { badgeBg, badgeText } = getCatColor(article.category)
                return (
                  <Link
                    key={article.id}
                    href={`/articles/${article.id}`}
                    onClick={() => { setOpen(false); setQuery('') }}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#1A1A2E] transition-colors"
                  >
                    <span className="flex-shrink-0 mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded"
                          style={{ background: badgeBg, color: badgeText }}>
                      {article.category}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-know-navy dark:text-[#EAE9E2] line-clamp-1">
                        {article.headline_en}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDateShort(article.published_at_ko)}
                      </p>
                    </div>
                  </Link>
                )
              })}
              <div className="px-4 py-2 border-t border-[#E8E6DF] dark:border-[#1E1E3A] bg-gray-50 dark:bg-[#0D0D1A]">
                <p className="text-xs text-gray-400">{results.length} results for &ldquo;{query}&rdquo;</p>
              </div>
            </>
          )}

          {/* 결과 없음 — 2자 이상 입력했을 때 */}
          {results.length === 0 && query.trim().length >= 2 && (
            <div className="px-4 py-5 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                No results for &ldquo;<span className="font-medium text-know-navy dark:text-[#EAE9E2]">{query}</span>&rdquo;
              </p>
              <p className="text-xs text-gray-400 mb-3">Try browsing by category:</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {QUICK_CATEGORIES.map(cat => {
                  const { bg } = getCatColor(cat)
                  return (
                    <Link key={cat} href={`/${catToSlug(cat)}`}
                          onClick={() => { setOpen(false); setQuery('') }}
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-full text-white"
                          style={{ background: bg }}>
                      {cat}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* 포커스만 됐을 때 (쿼리 없음) — 빠른 카테고리 탐색 */}
          {query.trim().length === 0 && focused && (
            <div className="px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Browse categories
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_CATEGORIES.map(cat => {
                  const { bg } = getCatColor(cat)
                  return (
                    <Link key={cat} href={`/${catToSlug(cat)}`}
                          onClick={() => { setOpen(false) }}
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-full text-white"
                          style={{ background: bg }}>
                      {cat}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
