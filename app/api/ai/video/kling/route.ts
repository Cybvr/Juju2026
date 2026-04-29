import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const apiKey = process.env.KLING_API_KEY
  const baseUrl = "https://api.klingapi.com"

  if (!apiKey) {
    return NextResponse.json({ error: "Missing KLING_API_KEY" }, { status: 500 })
  }

  const {
    prompt,
    imageUrl,
    duration = 5,
    aspectRatio = "16:9",
    mode = "standard",
    negativePrompt,
  } = await request.json()

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
  }

  const endpoint = imageUrl ? "/v1/videos/image2video" : "/v1/videos/text2video"
  const body: Record<string, unknown> = {
    model: "kling-v2.6-std",
    prompt,
    duration,
    aspect_ratio: aspectRatio,
    mode,
  }

  if (imageUrl) body.image_url = imageUrl
  if (negativePrompt) body.negative_prompt = negativePrompt

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()

  if (!response.ok) {
    return NextResponse.json(
      { error: data?.message || data?.error || "Kling video generation failed", details: data },
      { status: response.status }
    )
  }

  return NextResponse.json({ provider: "kling", ...data })
}
