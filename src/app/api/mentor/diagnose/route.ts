import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(_req: NextRequest) {
  const hasKey = !!process.env.OPENAI_API_KEY
  if (!hasKey) {
    return new Response(
      JSON.stringify({ ok: false, reason: "Missing OPENAI_API_KEY" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }

  try {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        // If your key belongs to a specific org, uncomment and set it:
        // "OpenAI-Organization": process.env.OPENAI_ORG_ID || ""
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: [{ role: "user", content: [{ type: "text", text: "ping" }] }],
        temperature: 0,
      }),
    })

    const text = await r.text()
    if (!r.ok) {
      return new Response(
        JSON.stringify({ ok: false, status: r.status, error: text }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({ ok: true, status: r.status, body: text.slice(0, 120) + "..." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (e: any) {
    return new Response(
      JSON.stringify({ ok: false, reason: e?.message || "unknown" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  }
}
