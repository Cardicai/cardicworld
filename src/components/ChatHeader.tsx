"use client"

import Link from "next/link"
import { CandlestickChart, Clock3, Settings } from "lucide-react"

export default function ChatHeader({
  onOpenHistory,
  onOpenSettings,
}: {
  onOpenHistory: () => void
  onOpenSettings: () => void
}) {

  return (
    <header className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-full border border-cardic-primary/60">
          <div className="size-8 rounded-full bg-cardic-primary/20" />
        </div>
        <h1 className="text-lg font-semibold tracking-tight">AI Trading Mentor</h1>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/chart"
          className="inline-flex items-center gap-2 rounded-full border border-cardic-primary/50 bg-cardic-primary/10 px-3 py-2 text-sm"
          title="Open Fullscreen Chart"
        >
          <CandlestickChart className="size-4" /> Chart
        </Link>
        <button
          onClick={onOpenHistory}
          className="inline-flex items-center gap-2 rounded-full border border-cardic-primary/50 bg-cardic-primary/10 px-3 py-2 text-sm"
        >
          <Clock3 className="size-4" /> History
        </button>
        <button
          onClick={onOpenSettings}
          className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/5"
          title="Settings"
        >
          <Settings className="size-4" />
        </button>
      </div>
    </header>
  )
}
