"use client"
import { useEffect, useRef } from "react"

export default function TradingViewPanel({
  symbol = "OANDA:XAUUSD",
  interval = "15",
  heightClass = "h-[80vh]", // let page control height
}: { symbol?: string; interval?: string; heightClass?: string }) {
  const container = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const target = container.current
    if (!target) return

    // Clear previous render
    target.innerHTML = ""

    // Create HTML exactly like TradingView's official snippet
    const wrap = document.createElement("div")
    wrap.className = "tradingview-widget-container w-full " + heightClass

    const widget = document.createElement("div")
    const id = `tv_${Date.now()}_${Math.random().toString(36).slice(2)}`
    widget.id = id
    widget.className = "w-full h-full"

    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      container_id: id,              // <<< important
      symbol,
      interval,
      theme: "dark",
      timezone: "Etc/UTC",
      withdateranges: true,
      allow_symbol_change: true,
      hide_legend: false,
      hide_top_toolbar: false,
      studies: [],
      save_image: false,
      locale: "en",
    })

    wrap.appendChild(widget)
    wrap.appendChild(script)
    target.appendChild(wrap)

    return () => { target.innerHTML = "" }
  }, [symbol, interval, heightClass])

  return (
    <div ref={container} className={"rounded-2xl border border-white/10 bg-[#040b16] overflow-hidden " + heightClass}/>
  )
}
