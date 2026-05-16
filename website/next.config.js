/** @type {import('next').NextConfig} */

// STATIC_EXPORT=true  → GitHub Pages 정적 빌드 (app/api 라우트 제외)
// (없음)              → Vercel 서버 빌드 (OG 이미지 라우트 포함)
const isStatic = process.env.STATIC_EXPORT === 'true'

const nextConfig = {
  ...(isStatic && { output: 'export' }),
  trailingSlash: true,
  images: {
    unoptimized: isStatic,   // GitHub Pages는 Next.js 이미지 최적화 미지원
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
}

module.exports = nextConfig
