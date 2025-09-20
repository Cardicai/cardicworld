'use client'
import { useEffect, useState } from 'react'
type Prefs = { symbol: string; interval: string }
const KEY = 'cn_chart_prefs_v1'
const DEFAULTS: Prefs = { symbol: 'OANDA:XAUUSD', interval: '15' }
export function useChartPrefs() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS)
  useEffect(() => { try { const raw = localStorage.getItem(KEY); if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) }) } catch {} }, [])
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(prefs)) } catch {} }, [prefs])
  return {
    prefs,
    setSymbol: (symbol: string) => setPrefs(p => ({ ...p, symbol })),
    setInterval: (interval: string) => setPrefs(p => ({ ...p, interval })),
  } as const
}
