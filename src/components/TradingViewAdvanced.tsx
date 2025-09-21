'use client'

import { useId, useMemo } from 'react'

type TradingViewAdvancedProps = {
  symbol: string
  interval: string
}

const BASE_URL = 'https://s.tradingview.com/widgetembed/'

export default function TradingViewAdvanced({ symbol, interval }: TradingViewAdvancedProps) {
  const rawId = useId()
  const frameId = useMemo(() => `tradingview_${rawId.replace(/[^a-zA-Z0-9_]/g, '')}`, [rawId])

  const src = useMemo(() => {
    const params = new URLSearchParams({
      frameElementId: frameId,
      symbol,
      interval,
      hidesidetoolbar: '0',
      symboledit: '1',
      saveimage: '1',
      toolbarbg: '1f2430',
      studies: '[]',
      theme: 'dark',
      style: '1',
      timezone: 'Etc/UTC',
      withdateranges: '1',
      hideideas: '1',
      enable_publishing: '0',
      allow_symbol_change: '1',
      details: '1',
      calendar: '1',
      news: '0',
      locale: 'en',
      isTransparent: 'false',
    })

    return `${BASE_URL}?${params.toString()}`
  }, [frameId, symbol, interval])

  return (
    <div className="h-full w-full">
      <iframe
        key={src}
        id={frameId}
        src={src}
        className="h-full w-full"
        frameBorder="0"
        allow="fullscreen"
        allowFullScreen
        allowTransparency
        title="TradingView advanced chart"
      />
    </div>
  )
}
