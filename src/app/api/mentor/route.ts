import { NextRequest } from "next/server"

export const runtime = "edge"

type Msg = { role: "user" | "assistant" | "system"; content: string }
type Settings = {
  mentorName?: string
  responseStyle?: "concise" | "normal" | "detailed"
  persona?: "coach" | "analyst" | "risk"
}

// choose model via tier; default gpt-5-mini
function pickModel() {
  return process.env.NEXT_PUBLIC_MENTOR_TIER === "pro" ? "gpt-5" : "gpt-5-mini"
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), { status: 500 })
    }

    const { messages, settings }: { messages: Msg[]; settings?: Settings } = await req.json()

    const mentorName = settings?.mentorName || "AI Trading Mentor"
    const tone =
      settings?.responseStyle === "concise" ? "Be brief, 1–3 short sentences."
      : settings?.responseStyle === "detailed" ? "Be step-by-step and explicit."
      : "Be clear and to the point."
    const persona =
      settings?.persona === "risk" ? "You are a strict risk manager. Emphasize risk control, sizing, invalidation."
      : settings?.persona === "analyst" ? "You are a pro technical analyst. Use structure and clear levels when helpful."
      : "You are a friendly coach. Encourage and simplify without fluff."

    const system = [
      `You are ${mentorName}, an educational trading mentor.`,
      persona,
      tone,
      "Always end with: 'Education only — not financial advice.'",
    ].join(" ")

    const model = pickModel()

    // GPT-5 models use the Responses API
    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          { role: "system", content: system },
          ...messages.map(m => ({ role: m.role, content: m.content })),
        ],
        temperature: 0.7,
      }),
    })

    const text = await resp.text()
    if (!resp.ok) {
      return new Response(JSON.stringify({ error: `OpenAI error ${resp.status}: ${text}` }), { status: 500 })
    }

    // Parse Responses API payload
    let out = "Sorry, I couldn’t generate a response."
    try {
      const data = JSON.parse(text)
      // Prefer convenience field if present
      if (typeof data.output_text === "string" && data.output_text.trim()) {
        out = data.output_text
      } else if (Array.isArray(data.output) && data.output[0]?.content?.[0]?.text) {
        out = data.output[0].content[0].text
      }
    } catch { out = text }

    return new Response(JSON.stringify({ content: out }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Unknown server error" }), { status: 500 })
  }
}
