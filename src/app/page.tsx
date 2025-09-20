"use client"
import { useEffect, useState } from "react"
import ChatHeader from "@/components/ChatHeader"
import ComposerBar from "@/components/ComposerBar"
import HistorySheet from "@/components/HistorySheet"
import SettingsSheet from "@/components/SettingsSheet"
import { MessageBubble } from "@/components/MessageBubble"
import { useSettings } from "@/hooks/useSettings"
import { useTopics } from "@/hooks/useTopics"
import type { Message } from "@/types/chat"

export default function Page() {
  const { topics, createTopic, deleteTopic, renameTopic, addMessage, getMessages, seedIfEmpty, clearAll } = useTopics()
  const { settings } = useSettings()
  const [openHistory, setOpenHistory] = useState(false)
  const [openSettings, setOpenSettings] = useState(false)
  const [currentTopicId, setCurrentTopicId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    seedIfEmpty()
  }, [seedIfEmpty])

  useEffect(() => {
    const t = topics[0]
    if (t && !currentTopicId) {
      setCurrentTopicId(t.id)
      setMessages(getMessages(t.id))
    }
  }, [topics, currentTopicId, getMessages])

  useEffect(() => {
    if (currentTopicId) setMessages(getMessages(currentTopicId))
  }, [currentTopicId, getMessages])

  function handleSend(text: string) {
    if (!currentTopicId) return

    if (settings.autoTitle) {
      const current = topics.find((t) => t.id === currentTopicId)
      if (current && (/^Getting started$/i.test(current.title) || current.title.length < 3)) {
        const candidate = text.slice(0, 40).replace(/\s+/g, " ").trim()
        if (candidate) renameTopic(current.id, candidate)
      }
    }
    const m: Message = {
      id: crypto.randomUUID(),
      role: "user",
      type: "text",
      content: text,
      createdAt: Date.now(),
    }
    addMessage(currentTopicId, m)
    setMessages((p) => [...p, m])
    // placeholder mentor reply
    setTimeout(() => {
      const r: Message = {
        id: crypto.randomUUID(),
        role: "mentor",
        type: "text",
        content:
          `Technical analysis involves analyzing past price and volume ...\n\n` +
          `— ${settings.mentorName}\n` +
          `**Risk note** — Education only.`,
        createdAt: Date.now(),
      }
      setMessages((p) => [...p, r])
      addMessage(currentTopicId, r)
    }, 500)
  }

  return (
    <main className="flex min-h-[85dvh] flex-col gap-4">
      <ChatHeader
        onOpenHistory={() => setOpenHistory(true)}
        onOpenSettings={() => setOpenSettings(true)}
        mentorName={settings.mentorName}
      />

      <section className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-white/10 bg-black/20 p-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} content={m.content} />
        ))}
      </section>

      <ComposerBar onSend={handleSend} />

      <HistorySheet
        open={openHistory}
        onClose={() => setOpenHistory(false)}
        topics={topics}
        onSelectTopic={(t) => {
          setCurrentTopicId(t.id)
          setOpenHistory(false)
          setMessages(getMessages(t.id))
        }}
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
          setOpenHistory(false)
        }}
      />
      <SettingsSheet
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        onClearAll={() => {
          clearAll()
          setCurrentTopicId(null)
          setMessages([])
          setOpenSettings(false)
        }}
        currentTopic={currentTopicId ? topics.find((t) => t.id === currentTopicId) ?? null : null}
        onRenameTopic={(id, title) => {
          renameTopic(id, title)
        }}
      />
    </main>
  )
}
