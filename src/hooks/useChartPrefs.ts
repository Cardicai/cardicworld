'use client'

import { useCallback, useEffect, useSyncExternalStore } from 'react'

type ChartPrefs = {
  symbol: string
  interval: string
}

const STORAGE_KEY = 'cardic_chart_prefs_v1'
const DEFAULT_PREFS: ChartPrefs = { symbol: 'OANDA:XAUUSD', interval: '60' }

let currentPrefs: ChartPrefs = DEFAULT_PREFS
const listeners = new Set<() => void>()

function readFromStorage(): ChartPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PREFS
    const parsed = JSON.parse(raw) as Partial<ChartPrefs>
    return { ...DEFAULT_PREFS, ...parsed }
  } catch {
    return DEFAULT_PREFS
  }
}

function persist(prefs: ChartPrefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {}
}

function notify() {
  listeners.forEach(listener => listener())
}

function update(partial: Partial<ChartPrefs>) {
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
  const getServerSnapshot = useCallback(() => DEFAULT_PREFS, [])

  useEffect(() => {
    const sync = () => {
      currentPrefs = readFromStorage()
      notify()
    }
    sync()

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) sync()
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const prefs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setSymbol = useCallback((symbol: string) => update({ symbol }), [])
  const setInterval = useCallback((interval: string) => update({ interval }), [])

  return { prefs, setSymbol, setInterval } as const
}
