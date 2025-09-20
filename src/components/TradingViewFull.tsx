"use client"
import { useMemo } from "react"

type Props = {
  symbol?: string
  interval?: string
  theme?: "dark" | "light"
}

export default function TradingViewFull({
  symbol = "OANDA:XAUUSD",
  interval = "15",
  theme = "dark",
}: Props) {
  const src = useMemo(() => {
    const params = new URLSearchParams({
      symbol,
      interval,
      theme,
      style: "1",
      timezone: "Etc/UTC",
      allow_symbol_change: "1",
      withdateranges: "1",
      hide_top_toolbar: "0",
      hide_legend: "0",
      save_image: "0",
      studies: "[]",
      locale: "en",
    })
    return `https://s.tradingview.com/widgetembed/?${params.toString()}`
  }, [symbol, interval, theme])

  return (
    <iframe
      title="TradingView"
      src={src}
      className="absolute inset-0 h-full w-full border-0"
      referrerPolicy="no-referrer"
      loading="lazy"
      allow="clipboard-read; clipboard-write; fullscreen; display-capture"
    />
  )
}
