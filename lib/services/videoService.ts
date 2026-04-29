export interface VideoGenerationInput {
    prompt: string
    imageUrl?: string
    imageUrls?: string[]
    duration?: number
    aspectRatio?: "16:9" | "9:16" | "1:1" | string
    mode?: "standard" | "professional" | string
    resolution?: "480p" | "720p" | "1080p" | string
    negativePrompt?: string
}

async function postJson(path: string, body: unknown) {
    const response = await fetch(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.error || "Video generation failed")
    }

    return data
}

async function getJson(path: string) {
    const response = await fetch(path)
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.error || "Video status check failed")
    }

    return data
}

export const videoService = {
    generateWithKling(input: VideoGenerationInput) {
        return postJson("/api/ai/video/kling", input)
    },

    getKlingStatus(taskId: string) {
        return getJson(`/api/ai/video/kling/${encodeURIComponent(taskId)}`)
    },

    generateWithSeedance(input: VideoGenerationInput) {
        return postJson("/api/ai/video/seedance", input)
    },

    getSeedanceStatus(taskId: string) {
        return getJson(`/api/ai/video/seedance/${encodeURIComponent(taskId)}`)
    },
}
