import { NextRequest } from "next/server"

export const runtime = "edge"

type Msg = { role: "user" | "assistant" | "system"; content: string }

function sys() {
  return "You are an AI Trading Mentor. Be clear, structured, and friendly. End with: Education only — not financial advice."
}

async function callResponses(model: string, messages: Msg[]) {
  const input = [
    { role: "system", content: [{ type: "text", text: sys() }] },
    ...messages.map((m) => ({ role: m.role, content: [{ type: "text", text: m.content }] })),
  ]
  const r = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, input, temperature: 0.7 }),
  })
  const text = await r.text()
  if (!r.ok) throw new Error(`Responses ${r.status}: ${text}`)
  try {
    const data = JSON.parse(text)
    return data.output_text || data.output?.[0]?.content?.[0]?.text || "Empty response."
  } catch {
    return text || "Empty response."
  }
}

async function callChat(model: string, messages: Msg[]) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: sys() }, ...messages],
      temperature: 0.7,
    }),
  })
  const text = await r.text()
  if (!r.ok) throw new Error(`Chat ${r.status}: ${text}`)
  const data = JSON.parse(text)
  return data.choices?.[0]?.message?.content || "Empty chat response."
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
    const { messages }: { messages: Msg[] } = await req.json()

    try {
      const content = await callResponses("gpt-5-mini", messages)
      return new Response(JSON.stringify({ content, model: "gpt-5-mini" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    } catch (err1: any) {
      try {
        const fallback = await callChat("gpt-4.1-mini", messages)
        return new Response(
          JSON.stringify({
            content: `${fallback}\n\n_(Using fallback: gpt-4.1-mini)_`,
            error: String(err1?.message || err1),
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        )
      } catch (err2: any) {
        return new Response(
          JSON.stringify({
            error: "Both calls failed",
            responses_error: String(err1?.message || err1),
            chat_error: String(err2?.message || err2),
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        )
      }
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Unknown server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
