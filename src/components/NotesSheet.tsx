'use client'
import { useState, useEffect } from 'react'
import { useNotes } from '@/hooks/useNotes'

export default function NotesSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { topics, activeId, activeTopic, activeContent, setActive, createTopic, renameTopic, deleteTopic, saveContent } = useNotes()
  const [draft, setDraft] = useState(activeContent)
  const [titleEdit, setTitleEdit] = useState(activeTopic?.title ?? '')

  useEffect(()=>{ setDraft(activeContent); setTitleEdit(activeTopic?.title ?? '') },[activeId, activeContent, activeTopic?.title])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Left: topics list */}
      <div className="w-full max-w-xs bg-black/70 backdrop-blur p-4 border-r border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white text-lg font-semibold">Notes</h3>
          <button onClick={onClose} className="text-white/70">Close</button>
        </div>

        <button
          onClick={() => createTopic('New note')}
          className="w-full mb-3 rounded-md bg-cardic-primary/20 ring-1 ring-cardic-primary/60 px-3 py-2 text-sm">
          + New note
        </button>

        <div className="space-y-2 max-h-[55vh] overflow-auto">
          {topics.map(t=>(
            <div key={t.id}
              className={`rounded-md p-3 cursor-pointer ${t.id===activeId ? 'bg-white/10' : 'bg-white/5 hover:bg-white/10'}`}
              onClick={()=>setActive(t.id)}
            >
              <div className="text-sm font-medium text-white truncate">{t.title}</div>
              <div className="text-[11px] text-white/50">{new Date(t.updatedAt).toLocaleString()}</div>
            </div>
          ))}
          {topics.length===0 && <div className="text-white/60 text-sm">No notes yet.</div>}
        </div>
      </div>

      {/* Right: editor */}
      <div className="flex-1 bg-black/40 backdrop-blur p-4">
        <div className="max-w-3xl mx-auto space-y-3">
          {/* Title row */}
          <div className="flex items-center gap-2">
            <input
              value={titleEdit}
              onChange={e=>setTitleEdit(e.target.value)}
              placeholder="Note title"
              disabled={!activeTopic}
              className="flex-1 rounded-md bg-white/90 px-3 py-2 text-black placeholder:text-black/50 outline-none disabled:opacity-50"
            />
            <button
              onClick={()=> activeTopic && renameTopic(activeTopic.id, titleEdit.trim() || 'Untitled note')}
              disabled={!activeTopic}
              className="rounded-md bg-cardic-primary/20 ring-1 ring-cardic-primary/60 px-3 py-2 text-sm disabled:opacity-50">
              Save title
            </button>
            <button
              onClick={()=> activeTopic && deleteTopic(activeTopic.id)}
              disabled={!activeTopic}
              className="rounded-md bg-red-500/10 text-red-200 px-3 py-2 text-sm disabled:opacity-50">
              Delete
            </button>
          </div>

          {/* Editor */}
          <textarea
            value={draft}
            onChange={e=>setDraft(e.target.value)}
            placeholder="Start writing…"
            className="w-full h-[55vh] rounded-xl bg-white text-black p-4 leading-relaxed shadow border border-black/10 outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={()=> activeTopic && saveContent(activeTopic.id, draft)}
              disabled={!activeTopic}
              className="rounded-md bg-cardic-primary/20 ring-1 ring-cardic-primary/60 px-4 py-2 text-sm disabled:opacity-50">
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1" onClick={onClose}/>
    </div>
  )
}
