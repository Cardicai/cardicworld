import { NextRequest } from "next/server"

export const runtime = "edge"

type Settings = {
  mentorName: string
  responseStyle: "concise" | "normal" | "detailed"
  persona?: "coach" | "analyst" | "risk"
}

function modelFromEnv() {
  // toggle via Vercel env: NEXT_PUBLIC_MENTOR_TIER = "pro" -> gpt-5
  return process.env.NEXT_PUBLIC_MENTOR_TIER === "pro" ? "gpt-5" : "gpt-5-mini"
}

export async function POST(req: NextRequest) {
  try {
    const { messages, settings }: {
      messages: { role: "user" | "assistant" | "system"; content: string }[]
      settings: Settings
    } = await req.json()

    const mentorName = settings?.mentorName || "AI Trading Mentor"
    const tone =
      settings?.responseStyle === "concise" ? "Be brief, 1–3 short sentences."
      : settings?.responseStyle === "detailed" ? "Be step-by-step and explicit."
      : "Be clear and to the point."

    const persona =
      settings?.persona === "risk" ? "You are a strict risk manager. Emphasize risk control, sizing, invalidation."
      : settings?.persona === "analyst" ? "You are a pro technical analyst. Be structured; include levels if useful."
      : "You are a friendly trading coach. Encourage and simplify without fluff."

    const system = [
      `You are ${mentorName}, an educational trading mentor.`,
      persona,
      tone,
      "Always end with: 'Education only — not financial advice.'",
    ].join(" ")

    const body = {
      model: modelFromEnv(), // gpt-5-mini by default, gpt-5 if TIER=pro
      messages: [{ role: "system", content: system }, ...messages],
      temperature: 0.7,
    }

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    if (!resp.ok) {
      const errText = await resp.text()
      return new Response(JSON.stringify({ error: errText }), { status: 500 })
    }

    const data = await resp.json()
    const content = data.choices?.[0]?.message?.content ?? "Sorry, I couldn’t generate a response."
    return new Response(JSON.stringify({ content }), { status: 200, headers: { "Content-Type": "application/json" } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Unknown error" }), { status: 500 })
  }
}
