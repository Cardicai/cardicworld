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
import TradingViewPanel from "@/components/TradingViewPanel"

export default function Page() {
  const { topics, createTopic, deleteTopic, addMessage, getMessages, seedIfEmpty, clearAll } = useTopics()
  const { settings } = useSettings()
  const [openHistory, setOpenHistory] = useState(false)
  const [openSettings, setOpenSettings] = useState(false)
  const [openNotes, setOpenNotes] = useState(false)
  const [currentTopicId, setCurrentTopicId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => { seedIfEmpty() }, [seedIfEmpty])

  useEffect(() => {
    const firstTopic = topics[0]
    if (!currentTopicId && firstTopic) {
      setCurrentTopicId(firstTopic.id)
      setMessages(getMessages(firstTopic.id))
    } else if (currentTopicId && !topics.some(topic => topic.id === currentTopicId)) {
      const fallback = topics[0]
      if (fallback) {
        setCurrentTopicId(fallback.id)
        setMessages(getMessages(fallback.id))
      } else {
        setCurrentTopicId(null)
        setMessages([])
      }
    }
  }, [topics, currentTopicId, getMessages])

  useEffect(() => {
    if (currentTopicId) {
      setMessages(getMessages(currentTopicId))
    }
  }, [currentTopicId, getMessages])

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
    setMessages(prev => [...prev, userMessage])
    setTimeout(() => {
      const mentorMessage: Message = {
        id: crypto.randomUUID(),
        role: "mentor",
        type: "text",
        content: `Technical analysis involves analyzing past price and volume ...\n\n— Cardic Mentor\n**Risk note** — Education only.`,
        createdAt: Date.now(),
      }
      setMessages(prev => [...prev, mentorMessage])
      addMessage(currentTopicId, mentorMessage)
    }, 500)
  }

  const fontSizePx = useMemo(
    () => (settings.fontSize === "sm" ? 14 : settings.fontSize === "lg" ? 17 : 15),
    [settings.fontSize],
  )

  return (
    <main className="min-h-[85dvh]">
      <ChatHeader onOpenHistory={() => setOpenHistory(true)} onOpenSettings={() => setOpenSettings(true)} />

      <div className="mt-4 grid grid-cols-1 gap-4 items-start md:grid-cols-[11rem_1fr_32rem]">
        <SidebarLeft
          onOpenNotes={() => setOpenNotes(true)}
          onHome={() => { /* placeholder as requested */ }}
          onJoin={() => { /* placeholder as requested */ }}
        />

        <div className="flex flex-col gap-4 md:min-h-[70vh]">
          <section
            className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-white/10 bg-[#040b16]/60 p-4"
            style={{ fontSize: `${fontSizePx}px` }}
          >
            {messages.map(message => (
              <MessageBubble key={message.id} role={message.role} content={message.content} />
            ))}
          </section>
          <ComposerBar onSend={handleSend} />
        </div>

        <div className="h-[420px] rounded-2xl border border-white/10 bg-black/20 p-2 md:h-[70vh]">
          <TradingViewPanel symbol="OANDA:XAUUSD" interval="15" />
        </div>
      </div>

      <HistorySheet
        open={openHistory}
        onClose={() => setOpenHistory(false)}
        topics={topics}
        onSelectTopic={topic => {
          setCurrentTopicId(topic.id)
          setMessages(getMessages(topic.id))
          setOpenHistory(false)
        }}
        onDeleteTopic={id => {
          deleteTopic(id)
          if (currentTopicId === id) {
            setCurrentTopicId(null)
            setMessages([])
          }
        }}
        onCreateTopic={title => {
          const newTopic = createTopic(title)
          setCurrentTopicId(newTopic.id)
          setMessages([])
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
      />

      <NotesSheet open={openNotes} onClose={() => setOpenNotes(false)} />

      <footer className="mt-6 mb-4 text-center">
        <div className="text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-cardic-primary to-cardic-gold bg-clip-text text-transparent drop-shadow neon-soft">
          CARDIC NEXUS
        </div>
        <div className="mt-1 text-sm md:text-base text-white/80">
          we dont chase we build from vision to result — welcome to cardic nexus
        </div>
      </footer>
    </main>
  )
}
