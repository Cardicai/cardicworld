"use client"
import { useEffect, useMemo, useState } from "react"
import { MessageBubble } from "@/components/MessageBubble"
import HistorySheet from "@/components/HistorySheet"
import SettingsSheet from "@/components/SettingsSheet"
import NotesSheet from "@/components/NotesSheet"
import SidebarLeft from "@/components/SidebarLeft"
import { useTopics } from "@/hooks/useTopics"
import { useSettings } from "@/hooks/useSettings"
import type { Message } from "@/types/chat"
import ChatHeader from "@/components/ChatHeader"
import ComposerBar from "@/components/ComposerBar"
import ChartSheet from "@/components/ChartSheet"
import { CandlestickChart } from "lucide-react"

export default function Page() {
  const { topics, createTopic, deleteTopic, addMessage, getMessages, seedIfEmpty, clearAll } = useTopics()
  const { settings } = useSettings()
  const [openHistory, setOpenHistory] = useState(false)
  const [openSettings, setOpenSettings] = useState(false)
  const [openNotes, setOpenNotes] = useState(false)
  const [openChart, setOpenChart] = useState(false)
  const [currentTopicId, setCurrentTopicId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => { seedIfEmpty() }, [seedIfEmpty])
  useEffect(() => { const t = topics[0]; if (t && !currentTopicId) { setCurrentTopicId(t.id); setMessages(getMessages(t.id)) } }, [topics, currentTopicId, getMessages])
  useEffect(() => { if (currentTopicId) setMessages(getMessages(currentTopicId)) }, [currentTopicId, getMessages])

  function handleSend(text: string) {
    if (!currentTopicId) return
    const m: Message = { id: crypto.randomUUID(), role: "user", type: "text", content: text, createdAt: Date.now() }
    addMessage(currentTopicId, m); setMessages(p => [...p, m])
    setTimeout(() => {
      const r: Message = { id: crypto.randomUUID(), role: "mentor", type: "text",
        content: `Technical analysis involves analyzing past price and volume ...\n\n**Risk note** — Education only.`,
        createdAt: Date.now() }
      setMessages(p => [...p, r]); addMessage(currentTopicId, r)
    }, 500)
  }

  const fontSizePx = useMemo(() => settings.fontSize === 'sm' ? 14 : settings.fontSize === 'lg' ? 17 : 15, [settings.fontSize])

  return (
    <main className="min-h-[85dvh]">
      <ChatHeader
        onOpenHistory={() => setOpenHistory(true)}
        onOpenSettings={() => setOpenSettings(true)}
        onOpenChart={() => setOpenChart(true)}
      />

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[11rem_1fr]">
        <SidebarLeft
          onOpenNotes={() => setOpenNotes(true)}
          onHome={() => { /* placeholder as requested */ }}
          onJoin={() => { /* placeholder as requested */ }}
        />

        <div className="flex flex-col gap-4">
          <section
            className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-white/10 bg-[#040b16]/60 p-4"
            style={{ fontSize: `${fontSizePx}px` }}
          >
            {messages.map(m => <MessageBubble key={m.id} role={m.role} content={m.content} />)}
          </section>
          <ComposerBar onSend={handleSend} />
        </div>
      </div>

      <HistorySheet
        open={openHistory}
        onClose={() => setOpenHistory(false)}
        topics={topics}
        onSelectTopic={(t) => { setCurrentTopicId(t.id); setOpenHistory(false); setMessages(getMessages(t.id)) }}
        onDeleteTopic={(id) => {
          deleteTopic(id)
          if (currentTopicId === id) {
            setCurrentTopicId(null)
            setMessages([])
          }
        }}
        onCreateTopic={(title) => {
          const nt = createTopic(title)
          setCurrentTopicId(nt.id)
          setMessages(getMessages(nt.id))
          setOpenHistory(false)
        }}
      />

      <SettingsSheet
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        onClearAll={() => { clearAll(); setCurrentTopicId(null); setMessages([]); setOpenSettings(false); }}
      />

      <NotesSheet open={openNotes} onClose={() => setOpenNotes(false)} />
      <ChartSheet open={openChart} onClose={() => setOpenChart(false)} symbol="OANDA:XAUUSD" interval="15" />

      <button
        onClick={() => setOpenChart(true)}
        className="fixed bottom-24 right-4 grid size-12 place-items-center rounded-full bg-cardic-primary/20 ring-1 ring-cardic-primary/60 shadow-lg md:hidden"
        title="Open Chart"
        type="button"
      >
        <CandlestickChart className="size-6 text-cardic-primary" />
      </button>
    </main>
  )
}
