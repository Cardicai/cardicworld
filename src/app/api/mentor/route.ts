import { NextRequest } from "next/server"

export const runtime = "edge"

type Msg = { role: "user" | "assistant" | "system"; content: string }

function systemPrompt() {
  return "You are an AI Trading Mentor. Be clear, structured, friendly. End every answer with: Education only — not financial advice."
}

async function callResponses(model: string, messages: Msg[]) {
  const input = [
    { role: "system", content: [{ type: "text", text: systemPrompt() }] },
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

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), { status: 500 })
    }
    const { messages }: { messages: Msg[] } = await req.json()

    const content = await callResponses("gpt-5-mini", messages)

    return new Response(JSON.stringify({ content, model: "gpt-5-mini" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Unknown server error" }), { status: 500 })
  }
}
