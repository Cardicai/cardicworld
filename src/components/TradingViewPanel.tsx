"use client"
import { useEffect, useRef } from "react"

declare global {
  interface Window {
    TradingView?: {
      widget: (config: Record<string, unknown>) => void
    }
  }
}

const SCRIPT_ID = "tradingview-widget-script"
const SCRIPT_SRC = "https://s3.tradingview.com/tv.js"

type TradingViewPanelProps = {
  symbol: string
  interval: string
}

export default function TradingViewPanel({ symbol, interval }: TradingViewPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (!container.id) {
      container.id = `tradingview_${Math.random().toString(36).slice(2)}`
    }

    const initWidget = () => {
      if (!window.TradingView) return
      container.innerHTML = ""
      window.TradingView.widget({
        autosize: true,
        symbol,
        interval,
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        allow_symbol_change: true,
        container_id: container.id,
        withdateranges: true,
        hide_side_toolbar: false,
        studies: ["MACD@tv-basicstudies"],
      })
    }

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    let loadHandler: (() => void) | undefined

    if (script && window.TradingView) {
      initWidget()
    } else {
      loadHandler = () => initWidget()

      if (!script) {
        script = document.createElement("script")
        script.id = SCRIPT_ID
        script.src = SCRIPT_SRC
        script.type = "text/javascript"
        script.async = true
        script.addEventListener("load", loadHandler)
        document.head.appendChild(script)
      } else {
        script.addEventListener("load", loadHandler)
      }
    }

    return () => {
      if (loadHandler && script) {
        script.removeEventListener("load", loadHandler)
      }
      container.innerHTML = ""
    }
  }, [symbol, interval])

  return <div ref={containerRef} className="size-full" />
}
