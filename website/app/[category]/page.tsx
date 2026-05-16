// 카테고리 페이지 — 서버 컴포넌트 (SSG)
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticleCard from '@/components/ArticleCard'
import { getArticlesByCategory, getPublishedCategories } from '@/lib/db'
import { slugToCat, getCatColor, catToSlug, MVP_CATEGORIES, SITE_NAME } from '@/lib/config'

interface Props { params: { category: string } }

// 빌드 시 모든 카테고리 정적 생성
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

export default function CategoryPage({ params }: Props) {
  const cat      = slugToCat(params.category)
  const articles = getArticlesByCategory(cat, 24)
  const { bg }   = getCatColor(cat)

  if (!cat) notFound()

  return (
    <div className="space-y-8">

      {/* 카테고리 헤더 */}
      <div className="rounded-card px-8 py-6 text-white" style={{ background: bg }}>
        <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Category</p>
        <h1 className="text-3xl font-bold">{cat}</h1>
        <p className="text-white/70 text-sm mt-1">
          {articles.length} {articles.length === 1 ? 'story' : 'stories'}
        </p>
      </div>

      {/* 기사 그리드 */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((a, i) => (
            <ArticleCard key={a.id} article={a} featured={i === 0} />
          ))}
        </div>
      ) : (
        <div className="rounded-card border border-[#E8E6DF] py-16 text-center">
          <p className="text-gray-400 text-sm">No articles yet. Check back tomorrow.</p>
        </div>
      )}

    </div>
  )
}
