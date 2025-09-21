// /api/mentor/diagnose  -> quick check for GPT-5 mini availability
import { NextRequest } from "next/server"
export const runtime = "edge"

export async function GET(_req: NextRequest) {
  const hasKey = !!process.env.OPENAI_API_KEY
  if (!hasKey) {
    return new Response(JSON.stringify({ ok:false, reason:"Missing OPENAI_API_KEY" }), {
      status: 200, headers: { "Content-Type": "application/json" }
    })
  }

  try {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        // If your key belongs to a specific org, optionally set:
        // "OpenAI-Organization": process.env.OPENAI_ORG_ID || ""
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: [{ role: "user", content: [{ type: "text", text: "ping" }] }],
        temperature: 0
      })
    })

    const body = await r.text()
    if (!r.ok) {
      return new Response(JSON.stringify({ ok:false, status:r.status, error:body }), {
        status: 200, headers: { "Content-Type": "application/json" }
      })
    }

    // success
    return new Response(JSON.stringify({ ok:true, status:r.status, sample: body.slice(0,120) + "..." }), {
      status: 200, headers: { "Content-Type": "application/json" }
    })
  } catch (e:any) {
    return new Response(JSON.stringify({ ok:false, reason: e?.message || "unknown" }), {
      status: 200, headers: { "Content-Type": "application/json" }
    })
  }
}
