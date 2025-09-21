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
  const pillButton =
    "inline-flex items-center gap-2 rounded-full border border-cardic-primary/50 " +
    "bg-cardic-primary/10 px-3 py-2 text-sm"

  return (
    <header className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-full border border-cardic-primary/60 bg-cardic-primary/10 shadow">
          {/* Smiling bot logo (inline SVG, neon-blue) */}
          <svg
            viewBox="0 0 24 24"
            className="size-7 text-cardic-primary"
            aria-hidden="true"
          >
            {/* antenna */}
            <circle cx="12" cy="3" r="1" fill="currentColor" />
            <path d="M12 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* head */}
            <rect
              x="5"
              y="6.5"
              width="14"
              height="11"
              rx="3.5"
              ry="3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* eyes */}
            <circle cx="9.5" cy="12" r="1.2" fill="currentColor" />
            <circle cx="14.5" cy="12" r="1.2" fill="currentColor" />
            {/* smile */}
            <path
              d="M9 14.5c.8.8 1.8 1.2 3 1.2s2.2-.4 3-1.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* side-ears */}
            <rect x="3.5" y="10" width="1.5" height="4" rx="0.75" fill="currentColor" />
            <rect x="19" y="10" width="1.5" height="4" rx="0.75" fill="currentColor" />
          </svg>
        </div>

        <h1 className="text-lg font-semibold tracking-tight">
          AI Trading Mentor
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/chart" className={pillButton} title="Open Fullscreen Chart">
          <CandlestickChart className="size-4" /> Chart
        </Link>
        <button onClick={onOpenHistory} className={pillButton} title="History">
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
