import { NextResponse } from "next/server";
import { generateOpenAIImage } from "@/lib/server/openaiImage";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const generated = await generateOpenAIImage(prompt);
    return NextResponse.json(generated);
  } catch (error: any) {
    console.error("OpenAI Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
