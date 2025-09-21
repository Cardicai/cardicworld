import { NextRequest } from "next/server"

export const runtime = "edge"

type Msg = { role: "user" | "assistant" | "system"; content: string }
type Settings = {
  mentorName?: string
  responseStyle?: "concise" | "normal" | "detailed"
  persona?: "coach" | "analyst" | "risk"
}

function pickModel() {
  // default to GPT-5 mini, switch to GPT-5 if you set NEXT_PUBLIC_MENTOR_TIER=pro
  return process.env.NEXT_PUBLIC_MENTOR_TIER === "pro" ? "gpt-5" : "gpt-5-mini"
}

function systemText(settings?: Settings) {
  const mentorName = settings?.mentorName || "AI Trading Mentor"
  const tone =
    settings?.responseStyle === "concise" ? "Be brief, 1–3 short sentences."
    : settings?.responseStyle === "detailed" ? "Be step-by-step and explicit."
    : "Be clear and to the point."
  const persona =
    settings?.persona === "risk" ? "You are a strict risk manager. Emphasize risk control, sizing, invalidation."
    : settings?.persona === "analyst" ? "You are a pro technical analyst. Use structure and clear levels when helpful."
    : "You are a friendly coach. Encourage and simplify without fluff."
  return [
    `You are ${mentorName}, an educational trading mentor.`,
    persona,
    tone,
    "Always end with: 'Education only — not financial advice.'",
  ].join(" ")
}

async function callResponsesAPI(model: string, messages: Msg[], sys: string) {
  // Responses API expects structured content objects
  const input = [
    { role: "system",  content: [{ type: "text", text: sys }] },
    ...messages.map(m => ({
      role: m.role,
      content: [{ type: "text", text: m.content }],
    })),
  ]

  const resp = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, input, temperature: 0.7 }),
  })
  const text = await resp.text()
  if (!resp.ok) throw new Error(`OpenAI Responses ${resp.status}: ${text}`)

  try {
    const data = JSON.parse(text)
    if (typeof data.output_text === "string" && data.output_text.trim()) return data.output_text
    const piece = data.output?.[0]?.content?.[0]?.text
    if (typeof piece === "string" && piece.trim()) return piece
    return text || "Empty response."
  } catch {
    return text || "Empty response."
  }
}

// Fallback to Chat Completions (helps diagnose or run alt models if needed)
async function callChatAPI(model: string, messages: Msg[], sys: string) {
  const payload = {
    model,
    messages: [
      { role: "system", content: sys },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ],
    temperature: 0.7,
  }
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
  const text = await resp.text()
  if (!resp.ok) throw new Error(`OpenAI Chat ${resp.status}: ${text}`)
  const data = JSON.parse(text)
  return data.choices?.[0]?.message?.content ?? "Empty chat response."
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY on server" }), { status: 500 })
    }

    const { messages, settings }: { messages: Msg[]; settings?: Settings } = await req.json()
    const sys = systemText(settings)
    const model = pickModel()

    // Try Responses API first (for GPT-5 / GPT-5 mini)
    try {
      const content = await callResponsesAPI(model, messages, sys)
      return new Response(JSON.stringify({ content }), {
        status: 200, headers: { "Content-Type": "application/json" },
      })
    } catch (err1: any) {
      // Fallback to chat completions with a safe small model to verify wiring
      try {
        const content = await callChatAPI("gpt-4.1-mini", messages, sys)
        return new Response(JSON.stringify({
          content: content + "\n\n_(Fallback model used for debugging: gpt-4.1-mini)_",
          warn: String(err1?.message || err1),
        }), { status: 200, headers: { "Content-Type": "application/json" } })
      } catch (err2: any) {
        return new Response(JSON.stringify({
          error: "Both Responses and Chat calls failed",
          responses_error: String(err1?.message || err1),
          chat_error: String(err2?.message || err2),
        }), { status: 500, headers: { "Content-Type": "application/json" } })
      }
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Unknown server error" }), { status: 500 })
  }
}
