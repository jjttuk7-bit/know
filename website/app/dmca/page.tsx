import type { Metadata } from 'next'
import { SITE_NAME, DMCA_EMAIL } from '@/lib/config'

export const metadata: Metadata = {
  title: 'DMCA Policy',
  description: `${SITE_NAME} copyright and DMCA takedown policy.`,
}

export default function DmcaPage() {
  return (
    <article className="max-w-2xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-know-navy">DMCA & Copyright Policy</h1>
        <p className="text-sm text-gray-400">Last updated: May 17, 2026</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">Our Commitment</h2>
        <p className="text-gray-600 leading-relaxed">
          KNow respects intellectual property rights and complies with the Digital
          Millennium Copyright Act (DMCA). We respond promptly to valid takedown notices.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">Images</h2>
        <p className="text-gray-600 leading-relaxed">
          All article images are sourced from Unsplash under the{' '}
          <a href="https://unsplash.com/license" target="_blank"
             rel="noopener noreferrer" className="text-know-red underline">
            Unsplash License
          </a>
          , which permits commercial use with attribution. Each image credits the
          photographer by name per Unsplash&apos;s requirements.
        </p>
        <p className="text-gray-600 leading-relaxed">
          OG (social preview) images are auto-generated using text and brand colours only — no
          photographs are used in these images.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">Videos</h2>
        <p className="text-gray-600 leading-relaxed">
          Embedded YouTube videos are loaded via the standard YouTube embed API and
          link back to the original video. We do not host, download, or redistribute
          video content.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">Article Text</h2>
        <p className="text-gray-600 leading-relaxed">
          All article text is independently written by KNow. We extract factual
          information only (names, dates, numbers, events) from public Korean news
          sources and rewrite it in our own voice. No original source text is reproduced.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">Filing a DMCA Takedown</h2>
        <p className="text-gray-600 leading-relaxed">
          If you believe content on KNow infringes your copyright, please send a written
          notice to{' '}
          <a href={`mailto:${DMCA_EMAIL}`} className="text-know-red underline">
            {DMCA_EMAIL}
          </a>{' '}
          including:
        </p>
        <ol className="list-decimal pl-5 space-y-1 text-gray-600 text-sm leading-relaxed">
          <li>Your contact information (name, address, email, phone)</li>
          <li>Identification of the copyrighted work you claim is infringed</li>
          <li>The URL of the allegedly infringing content on KNow</li>
          <li>A statement that you have a good-faith belief the use is not authorised</li>
          <li>A statement under penalty of perjury that the information is accurate
              and that you are the copyright owner or authorised to act on their behalf</li>
          <li>Your physical or electronic signature</li>
        </ol>
        <p className="text-gray-600 leading-relaxed">
          We will review the notice and respond within 5 business days.
          Valid notices result in prompt removal or correction.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-know-navy">Counter-Notice</h2>
        <p className="text-gray-600 leading-relaxed">
          If you believe content was wrongly removed, you may submit a counter-notice
          to the same email address with the required DMCA counter-notice elements.
        </p>
      </section>
    </article>
  )
}
