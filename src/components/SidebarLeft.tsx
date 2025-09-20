'use client'
export default function SidebarLeft({
  onOpenNotes, onHome, onJoin,
}: { onOpenNotes: () => void; onHome: () => void; onJoin: () => void }) {
  const base =
    "w-full font-semibold tracking-wide rounded-xl px-4 py-3 border-2 text-left " +
    "border-cardic-primary/80 hover:bg-cardic-primary/10 transition"

  return (
    <aside className="hidden md:block sticky top-4 self-start w-44">
      <div className="flex flex-col gap-3">
        <button className={base} onClick={onHome}>Home</button>
        <button className={base} onClick={onOpenNotes}>Notes</button>
        <button className={base} onClick={onJoin}>Join Club</button>
        <button
          className={base}
          onClick={() => {
            console.log("Play Game clicked")
          }}
        >
          Play Game
        </button>
      </div>
    </aside>
  )
}
