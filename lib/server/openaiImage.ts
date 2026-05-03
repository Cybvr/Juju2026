const OPENAI_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1.5"

export async function generateOpenAIImage(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured")
  }

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_IMAGE_MODEL,
      prompt,
      n: 1,
      size: "1536x1024",
      quality: "medium",
    }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.error?.message || "OpenAI image generation failed")
  }

  const generated = data?.data?.[0]
  const base64 = generated?.b64_json

  if (base64) {
    return {
      url: `data:image/png;base64,${base64}`,
      provider: "openai",
      model: OPENAI_IMAGE_MODEL,
    }
  }

  if (generated?.url) {
    return {
      url: generated.url,
      provider: "openai",
      model: OPENAI_IMAGE_MODEL,
    }
  }

  throw new Error("OpenAI did not return an image")
}
