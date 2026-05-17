// RSS 2.0 피드 — 최신 기사 20건
import { getRecentArticles } from '@/lib/db'
import { SITE_NAME, SITE_DESC, SITE_URL } from '@/lib/config'

export const dynamic = 'force-static'

export function GET() {
  const articles = getRecentArticles(20)
  const now      = new Date().toUTCString()

  const items = articles.map(a => {
    const url  = `${SITE_URL}/articles/${a.id}`
    const date = new Date(a.published_at_ko).toUTCString()
    const desc = (a.seo_description ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const title = a.headline_en.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return `
    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${desc}</description>
      <pubDate>${date}</pubDate>
      <category>${a.category}</category>
      ${a.image_url ? `<enclosure url="${a.image_url}" type="image/jpeg" length="0"/>` : ''}
    </item>`
  }).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESC}</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/api/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
