import { cn } from "@/lib/utils"

export function MessageBubble({ role, content }: { role: "user" | "mentor"; content: string }) {
  const isUser = role === "user"

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-5 py-4 text-[15px] leading-relaxed",
          isUser
            ? "bg-white text-black shadow"
            : "bg-[#0B1B36] text-white border border-cardic-primary/80 shadow-glow"
        )}
        style={isUser ? { borderRadius: "18px" } : { borderRadius: "18px" }}
      >
        {content}
      </div>
    </div>
  )
}
