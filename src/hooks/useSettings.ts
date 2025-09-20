'use client'
import { useCallback, useEffect, useSyncExternalStore } from 'react'

export type Settings = {
  theme: 'galaxy' | 'plain'
  fontSize: 'sm' | 'md' | 'lg'
  responseStyle: 'concise' | 'normal' | 'detailed'
}

const KEY = 'cn_settings_v1'
const DEFAULTS: Settings = { theme: 'galaxy', fontSize: 'md', responseStyle: 'normal' }

let currentSettings: Settings = DEFAULTS
const listeners = new Set<() => void>()

function readFromStorage(): Settings {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

function applyThemeClass(theme: Settings['theme']) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'plain') root.classList.add('plain-bg')
  else root.classList.remove('plain-bg')
}

function persist(settings: Settings) {
  try { localStorage.setItem(KEY, JSON.stringify(settings)) } catch {}
}

function notify() {
  listeners.forEach(listener => listener())
}

function updateSettings(partial: Partial<Settings>) {
  currentSettings = { ...currentSettings, ...partial }
  applyThemeClass(currentSettings.theme)
  persist(currentSettings)
  notify()
}

export function useSettings() {
  const subscribe = useCallback((listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }, [])

  const getSnapshot = useCallback(() => currentSettings, [])

  const settings = useSyncExternalStore(subscribe, getSnapshot, () => currentSettings)

  useEffect(() => {
    const sync = () => {
      currentSettings = readFromStorage()
      applyThemeClass(currentSettings.theme)
      notify()
    }
    sync()
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const setTheme = useCallback((theme: Settings['theme']) => updateSettings({ theme }), [])
  const setFontSize = useCallback((fontSize: Settings['fontSize']) => updateSettings({ fontSize }), [])
  const setResponseStyle = useCallback((responseStyle: Settings['responseStyle']) => updateSettings({ responseStyle }), [])

  return { settings, setTheme, setFontSize, setResponseStyle } as const
}
