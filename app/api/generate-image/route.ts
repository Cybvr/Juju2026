import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
    }

    // Using Gemini Imagen 3 via REST API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: prompt,
            },
          ],
          parameters: {
            sampleCount: 1,
            // aspectRatio: "1:1", // Optional: "1:1", "4:3", "3:4", "16:9", "9:16"
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to generate image with Gemini" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Gemini returns base64 in predictions[0].bytesBase64
    const base64Image = data.predictions?.[0]?.bytesBase64;
    
    if (!base64Image) {
      return NextResponse.json({ error: "No image was generated" }, { status: 500 });
    }

    const dataUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({ url: dataUrl });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
