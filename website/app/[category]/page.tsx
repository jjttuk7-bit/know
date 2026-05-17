// 카테고리 페이지 — 서버 컴포넌트, 페이지네이션 포함
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ArticleCard from '@/components/ArticleCard'
import { getArticlesByCategory, getPublishedCategories } from '@/lib/db'
import { slugToCat, getCatColor, catToSlug, MVP_CATEGORIES, SITE_NAME } from '@/lib/config'

interface Props {
  params:       { category: string }
  searchParams: { page?: string }
}

export async function generateStaticParams() {
  const published = getPublishedCategories()
  const all       = Array.from(new Set([...MVP_CATEGORIES, ...published]))
  return all.map(cat => ({ category: catToSlug(cat) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = slugToCat(params.category)
  return {
    title:       cat,
    description: `Latest ${cat} news and stories — ${SITE_NAME}`,
  }
}

export default function CategoryPage({ params, searchParams }: Props) {
  const cat   = slugToCat(params.category)
  const page  = Math.max(1, Number(searchParams.page) || 1)
  const { bg } = getCatColor(cat)

  if (!cat) notFound()

  const { articles, total, totalPages } = getArticlesByCategory(cat, page)

  return (
    <div className="space-y-8">

      {/* 카테고리 헤더 */}
      <div className="rounded-card px-8 py-6 text-white" style={{ background: bg }}>
        <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Category</p>
        <h1 className="text-3xl font-bold">{cat}</h1>
        <p className="text-white/70 text-sm mt-1">
          {total} {total === 1 ? 'story' : 'stories'}
          {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
        </p>
      </div>

      {/* 기사 그리드 */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((a, i) => (
            <ArticleCard key={a.id} article={a} featured={i === 0 && page === 1} />
          ))}
        </div>
      ) : (
        <div className="rounded-card border border-[#E8E6DF] py-16 text-center">
          <p className="text-gray-400 text-sm">No articles yet. Check back tomorrow.</p>
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination
          category={params.category}
          current={page}
          total={totalPages}
          accent={bg}
        />
      )}

    </div>
  )
}

// ── 페이지네이션 컴포넌트 ────────────────────────────────────

function Pagination({
  category, current, total, accent,
}: {
  category: string; current: number; total: number; accent: string
}) {
  const pages = buildPageList(current, total)

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      {/* 이전 */}
      {current > 1 ? (
        <Link
          href={`/${category}?page=${current - 1}`}
          className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors"
        >
          ← Prev
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm text-gray-300">← Prev</span>
      )}

      {/* 페이지 번호 */}
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-2 text-sm text-gray-400">…</span>
        ) : (
          <Link
            key={p}
            href={`/${category}?page=${p}`}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors"
            style={p === current
              ? { background: accent, color: '#fff' }
              : { color: '#555' }
            }
          >
            {p}
          </Link>
        )
      )}

      {/* 다음 */}
      {current < total ? (
        <Link
          href={`/${category}?page=${current + 1}`}
          className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors"
        >
          Next →
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm text-gray-300">Next →</span>
      )}
    </nav>
  )
}

// 1 2 3 … 8 9 10 형태의 페이지 목록 생성
function buildPageList(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  if (current > 3)        pages.push('…')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++)
    pages.push(p)
  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
}
