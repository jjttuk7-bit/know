/** @type {import('next').NextConfig} */

const isStatic = process.env.STATIC_EXPORT === 'true'

const nextConfig = {
  ...(isStatic && { output: 'export' }),
  trailingSlash: true,

  // better-sqlite3 = 네이티브 바이너리 → Next.js 번들러에서 제외 필수
  serverExternalPackages: ['better-sqlite3'],

  images: {
    // 정적 내보내기(GitHub Pages)에서만 최적화 비활성화
    // Vercel 배포에서는 자동 최적화 활성화
    ...(isStatic ? { unoptimized: true } : {
      formats:        ['image/avif', 'image/webp'],
      minimumCacheTTL: 86400,
      remotePatterns: [
        { protocol: 'https', hostname: 'images.unsplash.com' },
        { protocol: 'https', hostname: '*.unsplash.com' },
        { protocol: 'https', hostname: 'img.youtube.com' },
        { protocol: 'https', hostname: 'i.ytimg.com' },
      ],
    }),
  },
}

module.exports = nextConfig
