import { Paperclip, AtSign, Slash, RotateCcw, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { chatService } from "@/lib/services/geminiService"
import { albumService } from "@/lib/services/albumService"
import { imageService } from "@/lib/services/imageService"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { toast } from "sonner"

export function GeneratePanel({ albumName }: { albumName?: string }) {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!prompt.trim() || !auth.currentUser || isLoading) return

    const userPrompt = prompt.trim()
    setPrompt("")
    setIsLoading(true)

    try {
      // 1. Get initial response from Gemini
      const { text: responseText, generatePrompt } = await chatService.sendMessage([
        { role: "user", parts: [{ text: userPrompt }] }
      ])

      // 2. Create a new album
      const albumId = await albumService.createAlbum(auth.currentUser.uid, userPrompt.substring(0, 30))

      // 3. Save initial message pair to the NEW album
      await Promise.all([
        addDoc(collection(db, "messages"), {
          albumId,
          userId: auth.currentUser.uid,
          role: "user",
          content: userPrompt,
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
        imageService.generateImage(auth.currentUser.uid, albumId, generatePrompt)
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
      <h2 className="text-2xl font-serif font-semibold mb-16">Juju</h2>
      {albumName ? (
        <h1 className="text-4xl font-serif italic mb-8">{albumName}</h1>
      ) : (
        <h1 className="text-5xl font-serif italic mb-8">Reimagine reality</h1>
      )}

      <div className="w-full max-w-md">
        <div className="border border-border rounded-xl p-4 bg-background shadow-sm focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          <textarea
            rows={1}
            placeholder="Generate any image"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = `${e.target.scrollHeight}px`
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground mb-4 resize-none max-h-48"
            disabled={isLoading}
            style={{ height: 'auto' }}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50" disabled={isLoading}>
                <Paperclip className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50" disabled={isLoading}>
                <AtSign className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50" disabled={isLoading}>
                <Slash className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Custom</span>
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-4 text-muted-foreground">
          or <button className="font-semibold text-foreground hover:underline">upload and edit</button>
        </p>
      </div>
    </div>
  )
}
