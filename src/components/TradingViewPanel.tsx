"use client"
import { useEffect, useRef } from "react"

type Props = {
  symbol?: string
  interval?: string
}

export default function TradingViewPanel({ symbol = "OANDA:XAUUSD", interval = "15" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.innerHTML = ""

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval,
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      hide_top_toolbar: false,
      hide_legend: false,
      withdateranges: true,
      save_image: false,
      studies: [],
    })

    const host = document.createElement("div")
    host.className = "tradingview-widget-container h-full w-full"
    const widget = document.createElement("div")
    widget.className = "tradingview-widget-container__widget h-full w-full"
    host.appendChild(widget)
    container.appendChild(host)
    container.appendChild(script)

    return () => {
      container.innerHTML = ""
    }
  }, [symbol, interval])

  return (
    <div
      ref={containerRef}
      className="h-[420px] md:h-full rounded-2xl border border-white/10 bg-[#040b16]/60 overflow-hidden"
    />
  )
}
