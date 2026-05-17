// 기사 상세 페이지 — 서버 컴포넌트 (SSG)
// 참조: KWAVE_DAILY_PLAN.md 5.3절
import type { Metadata } from 'next'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ArticleCard from '@/components/ArticleCard'
import CategoryBadge from '@/components/CategoryBadge'
import ShareButtons from '@/components/ShareButtons'
import { getArticleById, getAllArticleIds, getRelatedArticles, getTagLinkedArticles, type TagLink } from '@/lib/db'
import { getCatColor, formatDate, readTime, parseTags, SITE_NAME } from '@/lib/config'

function LinkedParagraph({ text, links }: { text: string; links: TagLink[] }) {
  if (!links.length) return <p>{text}</p>
  const sorted = [...links].sort((a, b) => b.term.length - a.term.length)
  const used   = new Set<string>()
  let parts: (string | React.ReactElement)[] = [text]
  for (const { term, id } of sorted) {
    if (used.has(term.toLowerCase())) continue
    const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i')
    const next: typeof parts = []
    let linked = false
    for (const part of parts) {
      if (typeof part !== 'string' || linked) { next.push(part); continue }
      const idx = part.search(re)
      if (idx === -1) { next.push(part); continue }
      const m = part.match(re)![0]
      next.push(part.slice(0, idx))
      next.push(
        <Link key={`${id}-${term}`} href={`/articles/${id}`}
              className="underline decoration-dotted underline-offset-2 hover:text-know-red transition-colors">
          {m}
        </Link>
      )
      next.push(part.slice(idx + m.length))
      linked = true
      used.add(term.toLowerCase())
    }
    parts = next
  }
  return <p>{parts}</p>
}

interface Props { params: { id: string } }

export async function generateStaticParams() {
  return getAllArticleIds().map(id => ({ id: String(id) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleById(Number(params.id))
  if (!article) return { title: 'Article not found' }
  return {
    title:       article.seo_title ?? article.headline_en,
    description: article.seo_description ?? undefined,
    openGraph: {
      title:       article.headline_en,
      description: article.seo_description ?? undefined,
      images:      article.image_url ? [{ url: article.image_url }] : [],
      type:        'article',
      siteName:    SITE_NAME,
    },
    twitter: {
      card:        'summary_large_image',
      title:       article.headline_en,
      description: article.seo_description ?? undefined,
      images:      article.image_url ? [article.image_url] : [],
    },
  }
}

export default function ArticlePage({ params }: Props) {
  const article = getArticleById(Number(params.id))
  if (!article) notFound()

  const related    = getRelatedArticles(article.category, article.id)
  const tagLinks   = getTagLinkedArticles(article.tags, article.id)
  const tags       = parseTags(article.tags)
  const { bg }     = getCatColor(article.category)
  const bodyPara   = (article.body_en ?? '').split(/\n\n+/).filter(Boolean)

  return (
    <article className="max-w-2xl mx-auto space-y-8">

      {/* ── 메타 행 ────────────────────────────────────────── */}
      <header className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryBadge category={article.category} linked size="md" />
          {article.content_type && article.content_type !== 'breaking' && (
            <span className="text-[10px] font-semibold uppercase tracking-wider
                             px-2 py-0.5 rounded bg-gray-100 text-gray-500">
              {article.content_type}
            </span>
          )}
          {article.reader_level === 'fan' && (
            <span className="text-[10px] font-semibold uppercase tracking-wider
                             px-2 py-0.5 rounded bg-amber-50 text-amber-600">
              Fan Level
            </span>
          )}
          <span className="text-xs text-gray-400">{formatDate(article.published_at_ko)}</span>
          <span className="text-xs text-gray-400">· {readTime(article.body_en)} min read</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-know-navy dark:text-[#EAE9E2] leading-snug">
          {article.headline_en}
        </h1>

        {article.subheadline_en && (
          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">{article.subheadline_en}</p>
        )}
      </header>

      {/* ── 히어로 이미지 ────────────────────────────────────── */}
      <div
        className="relative w-full aspect-[16/9] rounded-card overflow-hidden"
        style={{ background: bg }}
      >
        {article.image_url && article.image_source !== 'og_generated' ? (
          <>
            <Image
              src={article.image_url}
              alt={article.headline_en}
              fill
              priority
              className="object-cover"
              sizes="(max-width:768px) 100vw, 672px"
            />
            {/* Unsplash 출처 표기 — 정책 필수 (CLAUDE.md 규칙 #3) */}
            {article.image_source === 'unsplash' && article.image_credit && (
              <p className="absolute bottom-2 right-3 text-white/60 text-[10px]">
                Photo by{' '}
                <a
                  href={article.image_credit_url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white"
                >
                  {article.image_credit}
                </a>{' '}
                on Unsplash
              </p>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/20 text-8xl font-bold select-none">
              {article.category.replace('K-', '')}
            </span>
          </div>
        )}
      </div>

      {/* ── YouTube embed ───────────────────────────────────── */}
      {article.video_id && article.video_source === 'youtube_official' && (
        <div className="space-y-2">
          <div className="relative w-full aspect-[16/9] rounded-card overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${article.video_id}?rel=0&modestbranding=1`}
              title={article.headline_en}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="text-xs text-gray-400 text-right">
            Video via{' '}
            <a
              href={`https://www.youtube.com/watch?v=${article.video_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-know-red"
            >
              YouTube
            </a>
          </p>
        </div>
      )}

      {/* ── 본문 (Q-09 인라인 링크 포함) ──────────────────────── */}
      <div className="article-body">
        {bodyPara.map((para, i) => (
          <LinkedParagraph key={i} text={para} links={tagLinks} />
        ))}
      </div>

      {/* ── Global Reaction ─────────────────────────────────── */}
      {article.global_reaction && (
        <div className="flex gap-3 rounded-card bg-know-navy/5 border border-know-navy/10 px-4 py-3">
          <span className="text-lg leading-none">🌍</span>
          <p className="text-sm text-know-navy/80 leading-relaxed">{article.global_reaction}</p>
        </div>
      )}

      {/* ── Cultural Note ────────────────────────────────────── */}
      {article.cultural_note && (
        <aside className="border-l-4 pl-4 py-2" style={{ borderColor: bg }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1"
             style={{ color: bg }}>
            Cultural Note
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">{article.cultural_note}</p>
        </aside>
      )}

      {/* ── 태그 ─────────────────────────────────────────────── */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* ── 공유 버튼 ─────────────────────────────────────────── */}
      <div className="pt-4 border-t border-[#E8E6DF]">
        <ShareButtons articleId={article.id} headline={article.headline_en} />
      </div>

      {/* ── 출처 표기 — 필수 (CLAUDE.md 규칙 #9) ──────────────── */}
      <div className="pt-4 border-t border-[#E8E6DF]">
        <p className="text-xs text-gray-400">
          Source:{' '}
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-know-red break-all"
          >
            {article.source_url}
          </a>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Originally reported via {article.source_name === 'naver' ? 'Naver News' : 'Daum News'}.
          This article was independently rewritten based on facts only.
        </p>
      </div>

      {/* ── 관련 기사 ─────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="pt-8 border-t border-[#E8E6DF]">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            More from {article.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map(a => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

    </article>
  )
}
