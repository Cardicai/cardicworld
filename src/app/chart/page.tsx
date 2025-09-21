"use client"
import Link from "next/link"
import TradingViewFull from "@/components/TradingViewFull"
import { useChartPrefs } from "@/hooks/useChartPrefs"

export default function ChartFullPage() {
  const { prefs, setSymbol, setInterval } = useChartPrefs()

  return (
    <div className="fixed inset-0 z-0">
      <TradingViewFull symbol={prefs.symbol} interval={prefs.interval} />

      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between gap-2 p-3">
        <Link
          href="/"
          className="rounded-full border border-cardic-primary/50 bg-cardic-primary/10 px-3 py-2 text-sm"
        >
          ← Return to AI Home
        </Link>

        <div className="flex items-center gap-2">
          <select
            value={prefs.symbol}
            onChange={(event) => setSymbol(event.target.value)}
            className="rounded-md border border-white/20 bg-black/60 px-2 py-1 text-sm text-white outline-none"
            title="Symbol"
          >
            <option value="OANDA:XAUUSD">XAUUSD (Gold)</option>
            <option value="BINANCE:BTCUSDT">BTCUSDT</option>
            <option value="OANDA:EURUSD">EURUSD</option>
            <option value="NASDAQ:QQQ">QQQ</option>
          </select>

          <select
            value={prefs.interval}
            onChange={(event) => setInterval(event.target.value)}
            className="rounded-md border border-white/20 bg-black/60 px-2 py-1 text-sm text-white outline-none"
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

      <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-10 text-center">
        <div className="bg-gradient-to-r from-cardic-primary to-cardic-gold bg-clip-text text-2xl font-extrabold tracking-wide text-transparent md:text-3xl">
          CARDIC NEXUS
        </div>
        <div className="mt-1 text-xs text-white/90 md:text-sm">
          we dont chase we build from vision to result — welcome to cardic nexus
        </div>
      </div>
    </div>
  )
}
