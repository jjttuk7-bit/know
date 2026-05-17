// 기사 본문 중간 삽입용 뉴스레터 구독 CTA
// inline=true → 본문 사이 카드 / inline=false → 풀 배너 (기본값)
interface Props { inline?: boolean }

export default function NewsletterCTA({ inline = false }: Props) {
  if (inline) {
    return (
      <aside className="my-2 rounded-card border border-know-red/20 bg-know-red/5
                        dark:bg-know-red/10 dark:border-know-red/30 px-5 py-4
                        flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-know-red mb-0.5">
            KNow Newsletter
          </p>
          <p className="text-sm text-know-navy dark:text-[#EAE9E2] leading-snug">
            Get K-culture delivered every morning — free.
          </p>
        </div>
        <a
          href="https://buttondown.email/knowkorea"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 bg-know-red hover:bg-know-red-dark text-white
                     text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          Subscribe Free →
        </a>
      </aside>
    )
  }

  return (
    <section className="rounded-card bg-know-navy dark:bg-[#07070F] text-white p-8 text-center">
      <p className="text-sm text-white/60 uppercase tracking-widest mb-2">Newsletter</p>
      <h2 className="text-xl font-semibold mb-1">Get Korea delivered every morning.</h2>
      <p className="text-white/60 text-sm mb-6">K-beauty, drama, music, and food — daily.</p>
      <a
        href="https://buttondown.email/knowkorea"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-know-red hover:bg-know-red-dark text-white font-medium
                   px-6 py-2.5 rounded-lg text-sm transition-colors"
      >
        Subscribe Free →
      </a>
    </section>
  )
}
