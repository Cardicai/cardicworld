'use client'
import { useEffect, useState } from 'react'
import { MessageBubble } from '@/components/MessageBubble'
import HistorySheet from '@/components/HistorySheet'
import { useTopics } from '@/hooks/useTopics'
import type { Message } from '@/types/chat'

export default function Page(){
  const { topics, createTopic, deleteTopic, addMessage, getMessages, seedIfEmpty } = useTopics()
  const [openHistory,setOpenHistory]=useState(false)
  const [currentTopicId,setCurrentTopicId]=useState<string|null>(null)
  const [messages,setMessages]=useState<Message[]>([])
  const [input,setInput]=useState('')

  useEffect(()=>{ seedIfEmpty() },[seedIfEmpty])
  useEffect(()=>{ const t=topics[0]; if(t && !currentTopicId){ setCurrentTopicId(t.id); setMessages(getMessages(t.id)) }},[topics,currentTopicId,getMessages])
  useEffect(()=>{ if(currentTopicId) setMessages(getMessages(currentTopicId)) },[currentTopicId,getMessages])

  function send(){
    if(!input.trim() || !currentTopicId) return
    const m:Message={ id:`m_${Math.random().toString(36).slice(2,9)}`, role:'user', type:'text', content:input.trim(), createdAt:Date.now() }
    addMessage(currentTopicId,m); setInput(''); setMessages(p=>[...p,m])
    setTimeout(()=>{
      const r:Message={ id:`m_${Math.random().toString(36).slice(2,9)}`, role:'mentor', type:'text', content:`Nice question: "${m.content}". (Placeholder reply)`, createdAt:Date.now() }
      addMessage(currentTopicId,r); setMessages(p=>[...p,r])
    },700)
  }

  return (
    <main className="flex min-h-[85dvh] flex-col gap-4">
      <header className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-cardic-primary/20 ring-1 ring-cardic-primary/40"><div className="w-8 h-8 rounded-full bg-white/10"/></div>
          <div><h1 className="text-lg font-semibold tracking-tight">CN‑GPT Mentor</h1><p className="text-xs text-white/60">Education only</p></div>
        </div>
        <button onClick={()=>setOpenHistory(true)} className="rounded-md bg-white/5 px-3 py-2 text-sm">History</button>
      </header>

      <section className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-white/10 bg-[#040b16]/60 p-4">
        {messages.length===0 && <div className="text-white/60">No messages yet. Try typing below.</div>}
        {messages.map(m=>(
          <div key={m.id} className={m.role==='user'?'flex justify-end':'flex justify-start'}>
            <div className="max-w-[70%]"><MessageBubble role={m.role} content={m.content}/></div>
          </div>
        ))}
      </section>

      <div className="sticky bottom-2">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white p-2">
          <button className="px-3">📎</button>
          <button className="px-3">🎤</button>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'?send():null}
            placeholder="Ask the mentor..." className="flex-1 rounded-xl bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-black/50"/>
          <button onClick={send} className="grid size-10 place-items-center rounded-xl bg-cardic-primary/30 ring-1 ring-cardic-primary/40 active:scale-95 px-4 py-2 text-white">➤</button>
        </div>
      </div>

      <HistorySheet open={openHistory} onClose={()=>setOpenHistory(false)} topics={topics}
        onSelectTopic={(t)=>{ setCurrentTopicId(t.id); setOpenHistory(false); setMessages(getMessages(t.id)) }}
        onDeleteTopic={(id)=>{ deleteTopic(id); if(currentTopicId===id) setCurrentTopicId(null) }}
        onCreateTopic={(title)=>{ const nt=createTopic(title); setCurrentTopicId(nt.id); setOpenHistory(false) }}
      />
    </main>
  )
}
