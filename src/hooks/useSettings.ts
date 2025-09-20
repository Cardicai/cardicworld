'use client'
import { useEffect, useState } from 'react'

export type Settings = {
  theme: 'galaxy' | 'plain'
  fontSize: 'sm' | 'md' | 'lg'
  responseStyle: 'concise' | 'normal' | 'detailed'
  displayName: string         // NEW: user public name
  mentorName: string          // NEW
  autoTitle: boolean          // NEW: auto-name sessions from first user message
}

const KEY = 'cn_settings_v1'
const DEFAULTS: Settings = {
  theme: 'galaxy',
  fontSize: 'md',
  responseStyle: 'normal',
  displayName: 'You',
  mentorName: 'AI Trading Mentor',
  autoTitle: true,
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) })
    } catch {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(settings)) } catch {}
  }, [settings])

  return {
    settings,
    setTheme: (theme: Settings['theme']) => setSettings(s => ({ ...s, theme })),
    setFontSize: (fontSize: Settings['fontSize']) => setSettings(s => ({ ...s, fontSize })),
    setResponseStyle: (responseStyle: Settings['responseStyle']) => setSettings(s => ({ ...s, responseStyle })),
    setDisplayName: (displayName: string) => setSettings(s => ({ ...s, displayName })),
    setMentorName: (mentorName: string) => setSettings(s => ({ ...s, mentorName })),
    setAutoTitle: (autoTitle: boolean) => setSettings(s => ({ ...s, autoTitle })),
  } as const
}
