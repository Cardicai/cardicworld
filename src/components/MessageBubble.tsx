import { cn } from "@/lib/utils"

export function MessageBubble({ role, content }: { role: 'user'|'mentor', content: string }) {
  const isUser = role === 'user'
  return (
    <div className={cn("flex w-full gap-3", isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (<div className="size-9 shrink-0 rounded-full bg-cardic.primary/20 ring-1 ring-cardic.primary/40" />)}
      <div className={cn(
        'max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-glow',
        isUser ? 'bg-white text-black border border-cardic.gold/40' : 'bg-cardic.primary/10 text-white border border-cardic.primary/30'
      )}>
        <p className="leading-relaxed">{content}</p>
      </div>
      {isUser && (<div className="size-9 shrink-0 rounded-full bg-cardic.gold/20 ring-1 ring-cardic.gold/40" />)}
    </div>
  )
}
