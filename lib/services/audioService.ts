export interface TextToSpeechInput {
    text: string
    voiceId?: string
    modelId?: string
}

export const audioService = {
    async textToSpeech(input: TextToSpeechInput) {
        const response = await fetch("/api/ai/audio/tts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        })

        if (!response.ok) {
            const error = await response.json().catch(() => null)
            throw new Error(error?.error || "Text-to-speech failed")
        }

        return response.blob()
    },
}
