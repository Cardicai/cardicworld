"use client"
import { Clock3, Settings, CandlestickChart } from "lucide-react"

type ChatHeaderProps = {
  onOpenHistory: () => void
  onOpenSettings: () => void
  onOpenChart: () => void
}

export default function ChatHeader({ onOpenHistory, onOpenSettings, onOpenChart }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-full border border-cardic-primary/60">
          <div className="size-8 rounded-full bg-cardic-primary/20" />
        </div>
        <h1 className="text-lg font-semibold tracking-tight">AI Trading Mentor</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenChart}
          className="inline-flex items-center gap-2 rounded-full border border-cardic-primary/50 bg-cardic-primary/10 px-3 py-2 text-sm"
          title="Chart"
          type="button"
        >
          <CandlestickChart className="size-4" /> Chart
        </button>
        <button onClick={onOpenHistory} className="inline-flex items-center gap-2 rounded-full border border-cardic-primary/50 bg-cardic-primary/10 px-3 py-2 text-sm">
          <Clock3 className="size-4" /> History
        </button>
        <button onClick={onOpenSettings} className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/5" title="Settings" type="button">
          <Settings className="size-4" />
        </button>
      </div>
    </header>
  )
}
