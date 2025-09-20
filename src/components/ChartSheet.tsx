"use client"
import { X } from "lucide-react"
import TradingViewPanel from "@/components/TradingViewPanel"

type ChartSheetProps = {
  open: boolean
  onClose: () => void
  symbol?: string
  interval?: string
}

export default function ChartSheet({
  open,
  onClose,
  symbol = "OANDA:XAUUSD",
  interval = "15",
}: ChartSheetProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 md:top-1/2 md:-translate-y-1/2 w-[96%] md:w-[840px]">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#040b16]/95 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 p-3">
            <div className="text-sm text-white/70">Chart</div>
            <button
              onClick={onClose}
              className="grid size-9 place-items-center rounded-md bg-white/5"
              type="button"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="h-[70vh] p-2 md:h-[64vh]">
            <TradingViewPanel symbol={symbol} interval={interval} />
          </div>
        </div>
      </div>
    </div>
  )
}
