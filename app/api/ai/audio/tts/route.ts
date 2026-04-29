import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Missing ELEVENLABS_API_KEY" }, { status: 500 })
  }

  const {
    text,
    voiceId = process.env.ELEVENLABS_VOICE_ID,
    modelId = "eleven_flash_v2_5",
  } = await request.json()

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Missing text" }, { status: 400 })
  }

  if (!voiceId) {
    return NextResponse.json({ error: "Missing ELEVENLABS_VOICE_ID" }, { status: 500 })
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    return NextResponse.json(
      { error: "ElevenLabs text-to-speech failed", details: errorText },
      { status: response.status }
    )
  }

  const audio = await response.arrayBuffer()

  return new Response(audio, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "audio/mpeg",
      "Cache-Control": "no-store",
    },
  })
}
