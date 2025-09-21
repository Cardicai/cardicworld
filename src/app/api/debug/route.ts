import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(_req: NextRequest) {
  const hasKey = !!process.env.OPENAI_API_KEY
  const tier = process.env.NEXT_PUBLIC_MENTOR_TIER || "mini (default)"
  return new Response(
    JSON.stringify({ ok: true, hasOpenAIKey: hasKey, tier }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  )
}
