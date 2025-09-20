'use client'

import { Gamepad2, Home, NotebookPen, Users } from "lucide-react"

export default function SidebarLeft({
  onOpenNotes,
  onHome,
  onJoin,
  onPlayGame,
}: {
  onOpenNotes: () => void
  onHome: () => void
  onJoin: () => void
  onPlayGame: () => void
}) {
  const base =
    "w-full font-semibold tracking-wide rounded-xl px-4 py-3 border-2 text-left " +
    "border-cardic-primary/80 hover:bg-cardic-primary/10 transition flex items-center gap-2"

  return (
    <aside className="hidden md:block sticky top-4 self-start w-48">
      <div className="flex flex-col gap-3">
        <button className={base} onClick={onHome}>
          <Home className="size-4" /> Home
        </button>
        <button className={base} onClick={onOpenNotes}>
          <NotebookPen className="size-4" /> Notes
        </button>
        <button className={base} onClick={onJoin}>
          <Users className="size-4" /> Join Club
        </button>
        <button className={base} onClick={onPlayGame}>
          <Gamepad2 className="size-4" /> Play Game
        </button>
      </div>
    </aside>
  )
}
