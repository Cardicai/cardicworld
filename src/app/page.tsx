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

export default function Page() {
  const { topics, createTopic, deleteTopic, addMessage, getMessages, seedIfEmpty, clearAll } = useTopics()
  const { settings } = useSettings()
  const [openHistory, setOpenHistory] = useState(false)
  const [openSettings, setOpenSettings] = useState(false)
  const [openNotes, setOpenNotes] = useState(false)
  const [currentTopicId, setCurrentTopicId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => { seedIfEmpty() }, [seedIfEmpty])
  useEffect(() => { const t = topics[0]; if (t && !currentTopicId) { setCurrentTopicId(t.id); setMessages(getMessages(t.id)) } }, [topics, currentTopicId, getMessages])
  useEffect(() => { if (currentTopicId) setMessages(getMessages(currentTopicId)) }, [currentTopicId, getMessages])

  function handleSend(text: string) {
    if (!currentTopicId) return
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      type: "text",
      content: text,
      createdAt: Date.now(),
    }
    addMessage(currentTopicId, userMessage)
    setMessages((prev) => [...prev, userMessage])

    const history = [...messages, userMessage].map((msg) => ({
      role: msg.role === "mentor" ? "assistant" : "user",
      content: msg.content,
    }))

    void (async () => {
      try {
        const res = await fetch("/api/mentor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        })
        const json = await res.json()
        const replyText = json?.content
          ? json.content
          : `Mentor error: ${json?.error || json?.responses_error || json?.chat_error || "unknown"}`
        const reply: Message = {
          id: crypto.randomUUID(),
          role: "mentor",
          type: "text",
          content: replyText,
          createdAt: Date.now(),
        }
        setMessages((prev) => [...prev, reply])
        addMessage(currentTopicId, reply)
      } catch (error: any) {
        const fallback: Message = {
          id: crypto.randomUUID(),
          role: "mentor",
          type: "text",
          content: `Mentor error: ${error?.message || String(error) || "unknown"}`,
          createdAt: Date.now(),
        }
        setMessages((prev) => [...prev, fallback])
        addMessage(currentTopicId, fallback)
      }
    })()
  }

  const fontSizePx = useMemo(() => settings.fontSize === 'sm' ? 14 : settings.fontSize === 'lg' ? 17 : 15, [settings.fontSize])

  return (
    <main className="min-h-[85dvh]">
      <ChatHeader onOpenHistory={() => setOpenHistory(true)} onOpenSettings={() => setOpenSettings(true)} />

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[11rem_1fr]">
        <SidebarLeft
          onOpenNotes={() => setOpenNotes(true)}
          onHome={() => { /* TODO */ }}
          onJoin={() => { /* TODO */ }}
          onPlayGame={() => { /* TODO: open game panel later */ }}
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
    </main>
  )
}
