import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 })
  }

  const {
    prompt,
  } = await request.json()

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
  }

  const model = "gemini-2.5-flash-image"
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    return NextResponse.json(
      { error: data?.error?.message || "Gemini image generation failed", details: data },
      { status: response.status }
    )
  }

  const imagePart = data?.candidates?.[0]?.content?.parts?.find((part: any) => part?.inlineData || part?.inline_data)
  const inlineData = imagePart?.inlineData || imagePart?.inline_data
  const mimeType = inlineData?.mimeType || inlineData?.mime_type || "image/png"
  const base64 = inlineData?.data
  const url = base64 ? `data:${mimeType};base64,${base64}` : null

  if (!url) {
    return NextResponse.json({ error: "Gemini did not return an image", details: data }, { status: 502 })
  }

  return NextResponse.json({ url, provider: "gemini", model })
}
