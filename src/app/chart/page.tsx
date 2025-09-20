"use client"
import Link from "next/link"
import TradingViewPanel from "@/components/TradingViewPanel"
import { useChartPrefs } from "@/hooks/useChartPrefs"

export default function ChartFullPage() {
  const { prefs, setSymbol, setInterval } = useChartPrefs()

  return (
    <main className="min-h-[100dvh] px-4 py-4 md:px-6">
      {/* Top bar */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <Link
          href="/"
          className="rounded-full border border-cardic-primary/50 bg-cardic-primary/10 px-3 py-2 text-sm"
        >
          ← Return to AI Home
        </Link>

        {/* Quick controls */}
        <div className="flex items-center gap-2">
          <select
            value={prefs.symbol}
            onChange={(e)=>setSymbol(e.target.value)}
            className="rounded-md bg-white/10 px-2 py-1 outline-none text-sm"
            title="Symbol"
          >
            <option value="OANDA:XAUUSD">XAUUSD (Gold)</option>
            <option value="BINANCE:BTCUSDT">BTCUSDT</option>
            <option value="OANDA:EURUSD">EURUSD</option>
            <option value="NASDAQ:QQQ">QQQ</option>
          </select>
          <select
            value={prefs.interval}
            onChange={(e)=>setInterval(e.target.value)}
            className="rounded-md bg-white/10 px-2 py-1 outline-none text-sm"
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

      {/* Full-screen chart */}
      <TradingViewPanel symbol={prefs.symbol} interval={prefs.interval} heightClass="h-[calc(100dvh-7.5rem)]" />

      {/* Footer brand (optional) */}
      <div className="mt-4 text-center">
        <div className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-cardic-primary to-cardic-gold bg-clip-text text-transparent">
          CARDIC NEXUS
        </div>
        <div className="text-white/80 text-sm">
          we dont chase we build from vision to result — welcome to cardic nexus
        </div>
      </div>
    </main>
  )
}
