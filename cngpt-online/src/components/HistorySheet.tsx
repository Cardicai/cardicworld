'use client'
import { useMemo, useState } from 'react'
import type { Topic } from '@/types/chat'

export default function HistorySheet({ open,onClose,topics,onSelectTopic,onDeleteTopic,onCreateTopic }:{ open:boolean; onClose:()=>void; topics:Topic[]; onSelectTopic:(t:Topic)=>void; onDeleteTopic:(id:string)=>void; onCreateTopic:(title:string)=>void; }){
  const [q,setQ]=useState(''), [newTitle,setNewTitle]=useState('')
  const filtered=useMemo(()=>!q?topics:topics.filter(t=>t.title.toLowerCase().includes(q.toLowerCase())),[q,topics])
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-full max-w-sm bg-black/70 backdrop-blur p-4 border-r border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Past Topics</h3>
          <button onClick={onClose} className="text-white/70">Close</button>
        </div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search topics..." className="w-full rounded-md bg-white/5 px-3 py-2 text-white placeholder:text-white/50 outline-none mb-3"/>
        <div className="space-y-2 max-h-[45vh] overflow-auto mb-3">
          {filtered.length===0 && <div className="text-white/60 text-sm">No topics found.</div>}
          {filtered.map(t=>(
            <div key={t.id} className="flex items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10">
              <button onClick={()=>onSelectTopic(t)} className="text-left w-full">
                <div className="text-sm font-medium text-white truncate">{t.title}</div>
                <div className="text-xs text-white/50">{new Date(t.lastAt).toLocaleString()}</div>
              </button>
              <button onClick={()=>onDeleteTopic(t.id)} className="ml-3 text-sm text-red-400">Delete</button>
            </div>
          ))}
        </div>
        <input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="New topic title" className="w-full rounded-md bg-white/5 px-3 py-2 text-white placeholder:text-white/50 outline-none mb-2"/>
        <div className="flex gap-2">
          <button onClick={()=>{ if(newTitle.trim()){ onCreateTopic(newTitle.trim()); setNewTitle('') }}} className="flex-1 rounded-md px-3 py-2 font-medium" style={{background:'#16B5FF',color:'#00131f'}}>Create</button>
          <button onClick={onClose} className="rounded-md bg-white/5 px-3 py-2 text-white">Cancel</button>
        </div>
      </div>
      <div className="flex-1" onClick={onClose}/>
    </div>
  )
}
