'use client'
import { useState } from 'react'
import { SITE_URL } from '@/lib/config'

interface Props {
  articleId: number
  headline: string
}

export default function ShareButtons({ articleId, headline }: Props) {
  const [copied, setCopied] = useState(false)
  const url = `${SITE_URL}/articles/${articleId}`

  function shareX() {
    const text = encodeURIComponent(`${headline} — via @KNowKorea`)
    const href = encodeURIComponent(url)
    window.open(`https://x.com/intent/tweet?text=${text}&url=${href}`, '_blank', 'width=600,height=400')
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select a temporary input
      const inp = document.createElement('input')
      inp.value = url
      document.body.appendChild(inp)
      inp.select()
      document.execCommand('copy')
      document.body.removeChild(inp)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 mr-1">Share</span>

      {/* X (Twitter) */}
      <button
        onClick={shareX}
        aria-label="Share on X"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E6DF]
                   text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Post
      </button>

      {/* Copy Link */}
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E6DF]
                   text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
      >
        {copied ? (
          <>
            <svg className="w-3.5 h-3.5 text-green-500" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-500">Copied!</span>
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Copy link
          </>
        )}
      </button>
    </div>
  )
}
