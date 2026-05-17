'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'
import SearchBar from './SearchBar'
import { MVP_CATEGORIES, catToSlug, getCatColor } from '@/lib/config'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-know-white/95 dark:bg-[#0D0D1A]/95 backdrop-blur border-b border-[#E8E6DF] dark:border-[#1E1E3A]">
      <div className="max-w-6xl mx-auto px-4">
        {/* 상단 줄: 로고 + 검색 */}
        <div className="flex items-center justify-between h-14 gap-4">
          <Logo size="sm" />
          <SearchBar />
        </div>

        {/* 카테고리 네비 */}
        <nav className="flex gap-1 overflow-x-auto pb-2 -mb-px scrollbar-none">
          {MVP_CATEGORIES.map(cat => {
            const slug    = catToSlug(cat)
            const active  = pathname === `/${slug}` || pathname === `/${slug}/`
            const { bg }  = getCatColor(cat)
            return (
              <Link
                key={cat}
                href={`/${slug}`}
                className="flex-shrink-0 text-xs font-medium px-3 py-2 min-h-[36px] flex items-center rounded-t transition-colors text-gray-500 dark:text-gray-400"
                style={active ? { background: bg, color: '#fff' } : {}}
              >
                {cat}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
