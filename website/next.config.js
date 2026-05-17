/** @type {import('next').NextConfig} */

// STATIC_EXPORT=true  → GitHub Pages 정적 빌드 (app/api 라우트 제외)
// (없음)              → Vercel 서버 빌드 (OG 이미지 라우트 포함)
const isStatic = process.env.STATIC_EXPORT === 'true'

const nextConfig = {
  ...(isStatic && { output: 'export' }),
  trailingSlash: true,
  images: {
    // Unsplash URL이 길고 query param이 많아 Next.js 프록시 실패 → 직접 서빙
    unoptimized: true,
  },
}

module.exports = nextConfig
