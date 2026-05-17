// 기사 카드 — 메인 / 카테고리 페이지 공용
import Image from 'next/image'
import Link from 'next/link'
import CategoryBadge from './CategoryBadge'
import { getCatColor, formatDateShort, readTime } from '@/lib/config'
import type { ArticleRow } from '@/lib/db'

interface Props {
  article:  ArticleRow
  featured?: boolean
  priority?: boolean   // LCP 대상 카드에 true 전달
}

export default function ArticleCard({ article, featured = false, priority = false }: Props) {
  const { bg } = getCatColor(article.category)
  const href   = `/articles/${article.id}`

  return (
    <Link
      href={href}
      className={`group block rounded-card overflow-hidden border border-[#E8E6DF] dark:border-[#1E1E3A] hover:shadow-md transition-shadow
        ${featured ? 'md:col-span-2' : ''}`}
    >
      {/* 이미지 영역 */}
      <div className={`relative overflow-hidden ${featured ? 'aspect-[16/9] md:aspect-[16/7]' : 'aspect-[16/9]'}`}
           style={{ background: bg }}>
        {article.image_url && article.image_source !== 'og_generated' ? (
          <Image
            src={article.image_url}
            alt={article.headline_en}
            fill
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes={
              featured
                ? '(max-width:640px) 100vw, (max-width:1024px) 50vw, 740px'
                : '(max-width:640px) 100vw, (max-width:1024px) 50vw, 370px'
            }
          />
        ) : (
          /* 이미지 없을 때 카테고리 컬러 플레이스홀더 */
          <div className="absolute inset-0 flex items-end p-5">
            <span className="text-white/25 text-6xl font-bold select-none leading-none">
              {article.category.replace('K-', '')}
            </span>
          </div>
        )}

        {/* 영상 있는 기사 ▶ 배지 */}
        {'video_id' in article && article.video_id && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1
                          bg-black/60 text-white text-[10px] font-semibold
                          px-2 py-1 rounded-full backdrop-blur-sm">
            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 10 10">
              <polygon points="2,1 9,5 2,9" />
            </svg>
            VIDEO
          </div>
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="p-4 bg-know-white dark:bg-[#13132A]">
        <div className="flex items-center gap-2 mb-2">
          <CategoryBadge category={article.category} linked={false} size="sm" />
          <span className="text-xs text-gray-400">
            {formatDateShort(article.published_at_ko)}
          </span>
          <span className="text-xs text-gray-400">
            · {readTime(article.body_en ?? article.seo_description)} min
          </span>
        </div>

        <h2 className={`font-semibold text-know-navy dark:text-[#EAE9E2] leading-snug group-hover:text-know-red transition-colors
          ${featured ? 'text-xl md:text-2xl' : 'text-base'}`}>
          {article.headline_en}
        </h2>

        {article.seo_description && (
          <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">
            {article.seo_description}
          </p>
        )}
      </div>
    </Link>
  )
}
