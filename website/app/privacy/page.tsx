import type { Metadata } from 'next'
import { SITE_NAME, CONTACT_EMAIL } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${SITE_NAME} handles your data.`,
}

export default function PrivacyPage() {
  return (
    <article className="max-w-2xl mx-auto space-y-8 prose prose-sm">
      <header>
        <h1 className="text-2xl font-bold text-know-navy">Privacy Policy</h1>
        <p className="text-sm text-gray-400">Last updated: May 17, 2026</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">Overview</h2>
        <p className="text-gray-600 leading-relaxed">
          KNow is a static news website. We do not operate user accounts, collect
          form submissions, or store personal data on our servers. This policy explains
          what limited data third-party services may collect when you visit our site.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">Analytics (Google Analytics 4)</h2>
        <p className="text-gray-600 leading-relaxed">
          We use Google Analytics 4 to understand aggregate traffic patterns — which
          pages are visited, approximate geography, and device type. This data is
          anonymised and does not identify individual visitors. Google&apos;s privacy
          policy applies:{' '}
          <a href="https://policies.google.com/privacy" target="_blank"
             rel="noopener noreferrer" className="text-know-red underline">
            policies.google.com/privacy
          </a>.
        </p>
        <p className="text-gray-600 leading-relaxed">
          You can opt out of Google Analytics tracking using the{' '}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank"
             rel="noopener noreferrer" className="text-know-red underline">
            Google Analytics Opt-out Browser Add-on
          </a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">Images (Unsplash)</h2>
        <p className="text-gray-600 leading-relaxed">
          Article images are served via Unsplash. When your browser loads an image,
          Unsplash may log the request per their own privacy policy. All images include
          photographer credit as required by the Unsplash License.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">Embedded Videos (YouTube)</h2>
        <p className="text-gray-600 leading-relaxed">
          Some articles embed YouTube videos. If you play a video, YouTube (Google)
          may set cookies on your device. YouTube&apos;s privacy policy applies.
          Videos only load when the embed is displayed — we do not pre-load video data.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">Newsletter (Buttondown)</h2>
        <p className="text-gray-600 leading-relaxed">
          If you subscribe to our newsletter, your email address is stored by Buttondown.
          We use it only to send the KNow newsletter. You can unsubscribe at any time
          via the link in any email.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">Cookies</h2>
        <p className="text-gray-600 leading-relaxed">
          KNow itself sets no cookies. Google Analytics uses cookies to distinguish
          unique visitors. You can block cookies in your browser settings.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">Contact</h2>
        <p className="text-gray-600 leading-relaxed">
          Questions about this policy:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-know-red underline">
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>
    </article>
  )
}
