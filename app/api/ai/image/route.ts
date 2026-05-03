import { NextResponse } from "next/server"
import { generateOpenAIImage } from "@/lib/server/openaiImage"

export async function POST(request: Request) {
  const {
    prompt,
  } = await request.json()

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
  }

  try {
    const generated = await generateOpenAIImage(prompt)
    return NextResponse.json(generated)
  } catch (error: any) {
    console.error("OpenAI image generation failed:", error)
    return NextResponse.json(
      { error: error.message || "OpenAI image generation failed" },
      { status: 500 }
    )
  }
}
