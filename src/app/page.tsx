"use client"
import { useEffect, useState } from "react"
import ChatHeader from "@/components/ChatHeader"
import ComposerBar from "@/components/ComposerBar"
import HistorySheet from "@/components/HistorySheet"
import { MessageBubble } from "@/components/MessageBubble"
import { useTopics } from "@/hooks/useTopics"
import type { Message } from "@/types/chat"

export default function Page() {
  const { topics, createTopic, deleteTopic, addMessage, getMessages, seedIfEmpty } = useTopics()
  const [openHistory, setOpenHistory] = useState(false)
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
          `Technical analysis involves analyzing past price and volume to spot patterns and make decisions.\n\n` +
          `**Steps** — 1) Identify trend 2) Mark key levels 3) Define invalidation.\n` +
          `**Risk note** — Education only.`,
        createdAt: Date.now(),
      }
      addMessage(currentTopicId, r)
      setMessages((p) => [...p, r])
    }, 600)
  }

  return (
    <main className="flex min-h-[85dvh] flex-col gap-4">
      <ChatHeader onOpenHistory={() => setOpenHistory(true)} />

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
          if (currentTopicId === id) setCurrentTopicId(null)
        }}
        onCreateTopic={(title) => {
          const nt = createTopic(title)
          setCurrentTopicId(nt.id)
          setOpenHistory(false)
        }}
      />
    </main>
  )
}
