"use client"
import { Paperclip, Mic, Send } from "lucide-react"
import { useState } from "react"

export default function ComposerBar({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState("")

  function send() {
    const t = value.trim()
    if (!t) return
    onSend(t)
    setValue("")
  }

  return (
    <div className="sticky bottom-4 z-10">
      <div className="flex items-center gap-3 rounded-2xl border border-cardic-primary/30 bg-[#061225]/95 px-4 py-3 shadow-lg md:px-6 md:py-4">
        <button
          className="grid size-11 place-items-center rounded-full text-cardic-primary/80 hover:bg-white/5 md:size-12"
          title="Attach"
        >
          <Paperclip className="size-5 md:size-6" />
        </button>

        <button
          className="grid size-11 place-items-center rounded-full text-cardic-primary/80 hover:bg-white/5 md:size-12"
          title="Voice"
        >
          <Mic className="size-5 md:size-6" />
        </button>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? send() : null)}
          placeholder="Type a message..."
          className="flex-1 h-12 md:h-14 rounded-full bg-white px-5 md:px-6 text-[15px] md:text-base text-black placeholder:text-black/50 outline-none"
        />

        <button
          onClick={send}
          className="grid size-12 md:size-14 place-items-center rounded-full bg-cardic-primary/20 ring-1 ring-cardic-primary/60 hover:scale-105 transition"
          title="Send"
        >
          <Send className="size-6 md:size-7 text-cardic-primary" />
        </button>
      </div>
    </div>
  )
}
