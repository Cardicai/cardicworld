"use client"

import { useCallback, useEffect, useSyncExternalStore } from "react"

type ChartPrefs = {
  symbol: string
  interval: string
}

const KEY = "cn_chart_prefs_v1"
const DEFAULTS: ChartPrefs = { symbol: "OANDA:XAUUSD", interval: "15" }

let currentPrefs: ChartPrefs = DEFAULTS
const listeners = new Set<() => void>()

function readFromStorage(): ChartPrefs {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

function persist(prefs: ChartPrefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs))
  } catch {
    // ignore write errors (e.g., private mode)
  }
}

function notify() {
  listeners.forEach(listener => listener())
}

function updatePrefs(partial: Partial<ChartPrefs>) {
  currentPrefs = { ...currentPrefs, ...partial }
  persist(currentPrefs)
  notify()
}

export function useChartPrefs() {
  const subscribe = useCallback((listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }, [])

  const getSnapshot = useCallback(() => currentPrefs, [])

  const prefs = useSyncExternalStore(subscribe, getSnapshot, () => currentPrefs)

  useEffect(() => {
    const sync = () => {
      currentPrefs = readFromStorage()
      notify()
    }
    sync()
    window.addEventListener("storage", sync)
    return () => window.removeEventListener("storage", sync)
  }, [])

  const setSymbol = useCallback((symbol: string) => updatePrefs({ symbol }), [])
  const setInterval = useCallback((interval: string) => updatePrefs({ interval }), [])

  return { prefs, setSymbol, setInterval } as const
}
