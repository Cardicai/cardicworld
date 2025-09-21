"use client"
import { useEffect, useRef } from "react"

export default function TradingViewAdvanced({
  symbol = "OANDA:XAUUSD",
  interval = "15",
}: { symbol?: string; interval?: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    host.innerHTML = ""

    const container = document.createElement("div")
    container.className = "tradingview-widget-container w-full h-full"

    const widget = document.createElement("div")
    widget.className = "tradingview-widget-container__widget w-full h-full"
    container.appendChild(widget)

    const script = document.createElement("script")
    script.type = "text/javascript"
    script.async = true
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval,
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      withdateranges: true,
      range: "12M",
      allow_symbol_change: true,
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      studies: [],
      save_image: false,
      support_host: "https://www.tradingview.com",
    })

    container.appendChild(script)
    host.appendChild(container)

    return () => {
      host.innerHTML = ""
    }
  }, [symbol, interval])

  return <div ref={hostRef} className="w-full h-full" />
}
