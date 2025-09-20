'use client'
import { useEffect } from 'react'

export default function ThemeMount() {
  useEffect(() => {
    const KEY = 'cn_settings_v1'
    function apply() {
      try {
        const raw = localStorage.getItem(KEY)
        const theme = raw ? JSON.parse(raw).theme : 'galaxy'
        const root = document.documentElement
        if (theme === 'plain') root.classList.add('plain-bg')
        else root.classList.remove('plain-bg')
      } catch {}
    }
    apply()
    window.addEventListener('storage', apply)
    return () => window.removeEventListener('storage', apply)
  }, [])
  return null
}
