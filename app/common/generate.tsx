import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { chatService } from "@/lib/services/geminiService"
import { albumService } from "@/lib/services/albumService"
import { imageService } from "@/lib/services/imageService"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { toast } from "sonner"
import { PromptBox } from "@/components/prompt-box"

export function GeneratePanel({ albumName }: { albumName?: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [attachments, setAttachments] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    // Check for pending prompt and attachments from landing page
    const pendingPrompt = sessionStorage.getItem('pending_prompt')
    const pendingAttachmentsRaw = sessionStorage.getItem('pending_attachments')

    if (pendingPrompt && auth.currentUser && !isLoading) {
      sessionStorage.removeItem('pending_prompt')
      sessionStorage.removeItem('pending_attachments')

      let pendingAttachments: string[] = []
      if (pendingAttachmentsRaw) {
        try {
          pendingAttachments = JSON.parse(pendingAttachmentsRaw)
          setAttachments(pendingAttachments)
        } catch (e) {
          console.error("Failed to parse pending attachments")
        }
      }

      handleGenerate(pendingPrompt, pendingAttachments)
    }
  }, [auth.currentUser])

  const handleGenerate = async (prompt: string, currentAttachments: string[] = attachments) => {
    if (!auth.currentUser || isLoading) return

    setIsLoading(true)

    try {
      // 1. Get initial response from Gemini
      // If we have attachments, we'd ideally pass them to Gemini as well
      const { text: responseText, generatePrompt } = await chatService.sendMessage([
        { role: "user", parts: [{ text: prompt }] }
      ])

      // 2. Create a new album
      const albumId = await albumService.createAlbum(auth.currentUser.uid, prompt.substring(0, 30))

      // 3. Save initial message pair to the NEW album
      await Promise.all([
        addDoc(collection(db, "messages"), {
          albumId,
          userId: auth.currentUser.uid,
          role: "user",
          content: prompt,
          attachments: currentAttachments,
          createdAt: serverTimestamp()
        }),
        addDoc(collection(db, "messages"), {
          albumId,
          userId: auth.currentUser.uid,
          role: "assistant",
          content: responseText,
          createdAt: serverTimestamp()
        })
      ])

      // 4. Trigger generation if needed
      if (generatePrompt) {
        // Pass the first attachment as a reference image if available
        imageService.generateImage(
          auth.currentUser.uid,
          albumId,
          generatePrompt
        )
        toast.info("Creating your first generation in a new album...")
      }

      // 5. Redirect to the new album
      router.push(`/dashboard/albums/${albumId}`)
    } catch (error) {
      console.error("Generation panel error:", error)
      toast.error("Failed to start generation")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 bg-background">
      <div className="mb-16 text-center">
        <h2 className="text-2xl font-serif font-semibold mb-4 opacity-50">Juju</h2>
        {albumName ? (
          <h1 className="text-4xl font-serif italic mb-2">{albumName}</h1>
        ) : (
          <h1 className="text-5xl font-serif italic mb-2">Reimagine reality</h1>
        )}
      </div>

      <PromptBox
        onSubmit={handleGenerate}
        isLoading={isLoading}
        variant="dashboard"
        attachments={attachments}
        onRemoveAttachment={(idx) => {
          const newAttachments = [...attachments]
          newAttachments.splice(idx, 1)
          setAttachments(newAttachments)
        }}
      />

      <p className="text-center mt-8 text-muted-foreground/60 transition-opacity hover:opacity-100 italic">
        or <button className="font-semibold text-foreground/80 hover:underline">upload and edit</button>
      </p>
    </div>
  )
}


