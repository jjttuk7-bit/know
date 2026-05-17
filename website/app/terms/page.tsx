import type { Metadata } from 'next'
import { SITE_NAME, CONTACT_EMAIL } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: `Terms governing use of ${SITE_NAME}.`,
}

export default function TermsPage() {
  return (
    <article className="max-w-2xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-know-navy">Terms of Use</h1>
        <p className="text-sm text-gray-400">Last updated: May 17, 2026</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">About KNow</h2>
        <p className="text-gray-600 leading-relaxed">
          KNow is an independent English-language media outlet covering K-culture news
          for global audiences. Articles are written by our editorial team using
          information from publicly available Korean news sources.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">Original Content</h2>
        <p className="text-gray-600 leading-relaxed">
          All article text published on KNow is original writing. We extract factual
          information (names, dates, numbers, events) from source news articles and
          independently rewrite it in our own journalistic voice. We do not translate
          or reproduce source text verbatim.
        </p>
        <p className="text-gray-600 leading-relaxed">
          KNow articles are protected by copyright. You may share links to our content
          freely. Reproducing full article text without written permission is not permitted.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">Source Attribution</h2>
        <p className="text-gray-600 leading-relaxed">
          Every article links to the original Korean news source at the bottom of the
          page. We credit Unsplash photographers for all images. YouTube embeds link
          to the original video.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">Accuracy</h2>
        <p className="text-gray-600 leading-relaxed">
          We strive for accuracy but cannot guarantee that all information is current
          or complete. K-pop rosters, chart positions, and schedules change frequently.
          If you find an error, please contact us and we will correct it promptly.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">No Affiliation</h2>
        <p className="text-gray-600 leading-relaxed">
          KNow is not affiliated with, endorsed by, or connected to any K-pop label,
          streaming platform, broadcaster, or brand mentioned in our coverage.
          All trademarks belong to their respective owners.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">External Links</h2>
        <p className="text-gray-600 leading-relaxed">
          Links to external websites are provided for reference. We are not responsible
          for the content or privacy practices of third-party sites.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">Changes</h2>
        <p className="text-gray-600 leading-relaxed">
          We may update these terms at any time. Continued use of the site after
          changes constitutes acceptance of the revised terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">Contact</h2>
        <p className="text-gray-600 leading-relaxed">
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-know-red underline">
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>
    </article>
  )
}
