import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
  const { prompt } = await req.json()
  const reply = `**Concept** — ...\n**Example** — ...\n**Steps** — 1) 2) 3)\n**Common mistakes** — ...\n**Action** — ...\n**Risk note** — Education only.`
  return NextResponse.json({ reply, echo: prompt })
}
