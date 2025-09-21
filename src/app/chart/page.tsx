'use client'

import Link from 'next/link'

import TradingViewAdvanced from '@/components/TradingViewAdvanced'
import { useChartPrefs } from '@/hooks/useChartPrefs'

export default function ChartFullPage() {
  const { prefs, setSymbol, setInterval } = useChartPrefs()

  return (
    <div className="fixed inset-0 z-0">
      {/* Fullscreen advanced chart */}
      <div className="absolute inset-0">
        <TradingViewAdvanced symbol={prefs.symbol} interval={prefs.interval} />
      </div>

      {/* Left controls (symbol / interval) — top-left, non-blocking */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-10">
        <div className="pointer-events-auto ml-3 mt-3 flex items-center gap-2">
          <select
            value={prefs.symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="rounded-md bg-black/60 text-white px-2 py-1 outline-none text-sm border border-white/20"
            title="Symbol"
          >
            <option value="OANDA:XAUUSD">XAUUSD (Gold)</option>
            <option value="BINANCE:BTCUSDT">BTCUSDT</option>
            <option value="OANDA:EURUSD">EURUSD</option>
            <option value="NASDAQ:QQQ">QQQ</option>
          </select>

          <select
            value={prefs.interval}
            onChange={(e) => setInterval(e.target.value)}
            className="rounded-md bg-black/60 text-white px-2 py-1 outline-none text-sm border border-white/20"
            title="Interval"
          >
            <option value="1">1m</option>
            <option value="5">5m</option>
            <option value="15">15m</option>
            <option value="60">1h</option>
            <option value="240">4h</option>
            <option value="D">1D</option>
          </select>
        </div>
      </div>

      {/* Return button — FLOATING TOP-RIGHT, subtle until hover */}
      <div className="fixed top-3 right-3 z-20">
        <Link
          href="/"
          className="rounded-full border border-cardic-primary/50 bg-cardic-primary/10 px-3 py-2 text-sm opacity-60 hover:opacity-100 transition pointer-events-auto backdrop-blur"
          title="Back to AI Mentor"
        >
          ← Return to AI Home
        </Link>
      </div>

      {/* Brand footer (non-blocking) */}
      <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-10 text-center">
        <div className="text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-cardic-primary to-cardic-gold bg-clip-text text-transparent">
          CARDIC NEXUS
        </div>
        <div className="mt-1 text-xs md:text-sm text-white/90">
          we dont chase we build from vision to result — welcome to cardic nexus
        </div>
      </div>
    </div>
  )
}
