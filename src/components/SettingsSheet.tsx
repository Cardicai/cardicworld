'use client'
import { useSettings } from '@/hooks/useSettings'
import type { Topic } from '@/types/chat'
import { useEffect, useState } from 'react'

export default function SettingsSheet({
  open, onClose, onClearAll, currentTopic, onRenameTopic,
}: {
  open: boolean
  onClose: () => void
  onClearAll: () => void
  currentTopic: Topic | null
  onRenameTopic: (id: string, title: string) => void
}) {
  const { settings, setTheme, setFontSize, setResponseStyle, setDisplayName, setMentorName, setAutoTitle } = useSettings()
  const [titleDraft, setTitleDraft] = useState(currentTopic?.title ?? '')

  useEffect(() => {
    setTitleDraft(currentTopic?.title ?? '')
  }, [currentTopic?.id, currentTopic?.title])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-full max-w-sm bg-black/70 backdrop-blur p-4 border-r border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white text-lg font-semibold">Settings</h3>
          <button onClick={onClose} className="text-white/70">Close</button>
        </div>

        {/* Profile */}
        <section className="mb-4">
          <h4 className="text-sm mb-2 text-white/70">Profile</h4>
          <label className="block text-xs text-white/60 mb-1">Your name</label>
          <input
            value={settings.displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display name"
            className="w-full rounded-md bg-white/5 px-3 py-2 text-white placeholder:text-white/40 outline-none mb-2"
          />
          <label className="block text-xs text-white/60 mb-1">Mentor name</label>
          <input
            value={settings.mentorName}
            onChange={(e) => setMentorName(e.target.value)}
            placeholder="Mentor name"
            className="w-full rounded-md bg-white/5 px-3 py-2 text-white placeholder:text-white/40 outline-none"
          />
        </section>

        {/* Session */}
        <section className="mb-5">
          <h4 className="text-sm mb-2 text-white/70">Session</h4>

          <div className="mb-2">
            <label className="block text-xs text-white/60 mb-1">Current session title</label>
            <div className="flex gap-2">
              <input
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                placeholder={currentTopic ? currentTopic.title : 'No session open'}
                disabled={!currentTopic}
                className="flex-1 rounded-md bg-white/5 px-3 py-2 text-white placeholder:text-white/40 outline-none disabled:opacity-50"
              />
              <button
                disabled={!currentTopic || titleDraft.trim().length === 0}
                onClick={() => currentTopic && onRenameTopic(currentTopic.id, titleDraft.trim())}
                className="rounded-md bg-cardic-primary/20 ring-1 ring-cardic-primary/60 px-3 py-2 text-sm disabled:opacity-50">
                Save
              </button>
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.autoTitle}
              onChange={(e) => setAutoTitle(e.target.checked)}
            />
            <span className="text-white/80">Auto-title new sessions from first message</span>
          </label>
        </section>

        {/* Theme */}
        <section className="mb-4">
          <h4 className="text-sm mb-2 text-white/70">Theme</h4>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme('galaxy')}
              className={`flex-1 rounded-md px-3 py-2 text-sm ${settings.theme==='galaxy' ? 'bg-cardic-primary/20 ring-1 ring-cardic-primary/60' : 'bg-white/5'}`}>
              Galaxy (default)
            </button>
            <button
              onClick={() => setTheme('plain')}
              className={`flex-1 rounded-md px-3 py-2 text-sm ${settings.theme==='plain' ? 'bg-cardic-primary/20 ring-1 ring-cardic-primary/60' : 'bg-white/5'}`}>
              Plain dark
            </button>
          </div>
        </section>

        {/* Font size */}
        <section className="mb-4">
          <h4 className="text-sm mb-2 text-white/70">Font Size</h4>
          <div className="flex gap-2">
            <button onClick={() => setFontSize('sm')} className={`flex-1 rounded-md px-3 py-2 text-sm ${settings.fontSize==='sm'?'bg-white/10':'bg-white/5'}`}>Small</button>
            <button onClick={() => setFontSize('md')} className={`flex-1 rounded-md px-3 py-2 text-sm ${settings.fontSize==='md'?'bg-white/10':'bg-white/5'}`}>Medium</button>
            <button onClick={() => setFontSize('lg')} className={`flex-1 rounded-md px-3 py-2 text-sm ${settings.fontSize==='lg'?'bg-white/10':'bg-white/5'}`}>Large</button>
          </div>
        </section>

        {/* Response style */}
        <section className="mb-5">
          <h4 className="text-sm mb-2 text-white/70">Mentor Response Style</h4>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => setResponseStyle('concise')} className={`rounded-md px-3 py-2 text-sm ${settings.responseStyle==='concise'?'bg-white/10':'bg-white/5'}`}>Concise</button>
            <button onClick={() => setResponseStyle('normal')}  className={`rounded-md px-3 py-2 text-sm ${settings.responseStyle==='normal' ?'bg-white/10':'bg-white/5'}`}>Normal</button>
            <button onClick={() => setResponseStyle('detailed')}className={`rounded-md px-3 py-2 text-sm ${settings.responseStyle==='detailed'?'bg-white/10':'bg-white/5'}`}>Detailed</button>
          </div>
        </section>

        {/* Danger zone */}
        <section className="mb-4">
          <h4 className="text-sm mb-2 text-red-300/80">Danger</h4>
          <button
            onClick={() => { if (confirm('Clear all topics and messages?')) onClearAll() }}
            className="w-full rounded-md bg-red-500/10 text-red-200 px-3 py-2 text-sm hover:bg-red-500/20">
            Clear all history
          </button>
        </section>

        <div className="mt-4 text-xs text-white/50">
          CN-World Beta v0.1 • Education only. Not financial advice.
        </div>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  )
}
