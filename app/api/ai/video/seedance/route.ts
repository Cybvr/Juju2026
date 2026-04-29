import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const apiKey = process.env.SEEDANCE_API_KEY
  const baseUrl = "https://seedanceapi.org"

  if (!apiKey) {
    return NextResponse.json({ error: "Missing SEEDANCE_API_KEY" }, { status: 500 })
  }

  const {
    prompt,
    imageUrls,
    duration = 5,
    aspectRatio = "16:9",
    resolution = "720p",
  } = await request.json()

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
  }

  const response = await fetch(`${baseUrl}/v2/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "seedance-2.0-fast",
      prompt,
      image_urls: imageUrls,
      duration,
      aspect_ratio: aspectRatio,
      resolution,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    return NextResponse.json(
      { error: data?.message || data?.error || "Seedance video generation failed", details: data },
      { status: response.status }
    )
  }

  return NextResponse.json({ provider: "seedance", ...data })
}
