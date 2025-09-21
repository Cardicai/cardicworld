"use client"
import Link from "next/link"

export default function ChartFullPage() {
  return (
    <div className="fixed inset-0 z-0">
      {/* Fullscreen TradingView (iframe approach = most reliable) */}
      <iframe
        title="TradingView"
        src="https://s.tradingview.com/widgetembed/?symbol=OANDA%3AXAUUSD&interval=15&theme=dark&style=1&timezone=Etc%2FUTC&allow_symbol_change=1&withdateranges=1&hide_top_toolbar=0&hide_legend=0&save_image=0&studies=%5B%5D&locale=en"
        className="absolute inset-0 w-full h-full border-0"
        referrerPolicy="no-referrer"
        loading="lazy"
        allow="clipboard-read; clipboard-write; fullscreen; display-capture"
      />

      {/* Overlay controls */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between gap-2 p-3">
        <Link
          href="/"
          className="rounded-full border border-cardic-primary/50 bg-cardic-primary/10 px-3 py-2 text-sm"
        >
          ← Return to AI Home
        </Link>
      </div>
    </div>
  )
}
