import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import { SITE_NAME, SITE_DESC, SITE_URL } from '@/lib/config'

const GA_ID = 'G-Q2Y7RWPBWF'

const geist = Inter({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title:       { default: SITE_NAME, template: `%s — ${SITE_NAME}` },
  description: SITE_DESC,
  openGraph: {
    siteName: SITE_NAME,
    type:     'website',
    locale:   'en_US',
  },
  twitter: { card: 'summary_large_image' },
  verification: { google: 'sBPk0JemMnPNQg1-iQuDLX6ikDp52y5-OAwCtLyIFaI' },
  alternates: { types: { 'application/rss+xml': `${SITE_URL}/api/feed.xml` } },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen bg-know-white dark:bg-[#0D0D1A] transition-colors">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
        {/* GA4 */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">{`
          window.dataLayer=window.dataLayer||[];
          function gtag(){dataLayer.push(arguments);}
          gtag('js',new Date());
          gtag('config','${GA_ID}');
        `}</Script>

        <footer className="mt-16 bg-know-navy dark:bg-[#07070F] text-white/60 text-xs text-center py-6 px-4">
          <p>© {new Date().getFullYear()} KNow — K-culture news for global fans.</p>
          <p className="mt-1.5 flex items-center justify-center gap-3 flex-wrap">
            <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer"
               className="hover:text-white transition-colors">Images via Unsplash</a>
            <span className="opacity-30">·</span>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <span className="opacity-30">·</span>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <span className="opacity-30">·</span>
            <a href="/dmca" className="hover:text-white transition-colors">DMCA</a>
            <span className="opacity-30">·</span>
            <a href="/api/feed.xml" className="hover:text-white transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20 4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
              </svg>
              RSS
            </a>
          </p>
        </footer>
      </body>
    </html>
  )
}
