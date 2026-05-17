import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import { SITE_NAME, SITE_DESC } from '@/lib/config'

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
          </p>
        </footer>
      </body>
    </html>
  )
}
