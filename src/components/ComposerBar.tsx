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
    <div className="sticky bottom-2">
      {/* Dark rounded bar like your mock */}
      <div className="flex items-center gap-2 rounded-2xl border border-cardic-primary/30 bg-[#061225] px-3 py-2">
        <button
          className="grid size-10 place-items-center rounded-full text-cardic-primary/80 hover:bg-white/5"
          title="Attach"
        >
          <Paperclip className="size-5" />
        </button>

        <button
          className="grid size-10 place-items-center rounded-full text-cardic-primary/80 hover:bg-white/5"
          title="Voice"
        >
          <Mic className="size-5" />
        </button>

        {/* White pill input */}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? send() : null)}
          placeholder="Type a message..."
          className="flex-1 rounded-full bg-white px-5 py-3 text-[15px] text-black placeholder:text-black/50 outline-none"
        />

        <button
          onClick={send}
          className="grid size-10 place-items-center rounded-full bg-cardic-primary/20 ring-1 ring-cardic-primary/60 transition hover:scale-105"
          title="Send"
        >
          <Send className="size-5 text-cardic-primary" />
        </button>
      </div>
    </div>
  )
}
