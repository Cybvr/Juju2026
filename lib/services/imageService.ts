import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export const imageService = {
    async generateImage(userId: string, projectId: string, prompt: string) {
        const response = await fetch("/api/ai/image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        })

        const generated = await response.json()

        if (!response.ok) {
            throw new Error(generated?.error || "Image generation failed")
        }

        const docRef = await addDoc(collection(db, "images"), {
            userId,
            projectId,
            prompt,
            url: generated.url,
            provider: generated.provider,
            model: generated.model,
            title: prompt.substring(0, 20) + "...",
            createdAt: serverTimestamp()
        })

        return docRef.id
    }
}
