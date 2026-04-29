import { NextResponse } from "next/server"

interface RouteContext {
  params: Promise<{ taskId: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const apiKey = process.env.KLING_API_KEY
  const baseUrl = "https://api.klingapi.com"
  const { taskId } = await context.params

  if (!apiKey) {
    return NextResponse.json({ error: "Missing KLING_API_KEY" }, { status: 500 })
  }

  const response = await fetch(`${baseUrl}/v1/videos/${encodeURIComponent(taskId)}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    return NextResponse.json(
      { error: data?.message || data?.error || "Kling status check failed", details: data },
      { status: response.status }
    )
  }

  return NextResponse.json({ provider: "kling", ...data })
}
