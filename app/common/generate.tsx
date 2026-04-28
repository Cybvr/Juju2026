import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { chatService } from "@/lib/services/geminiService"
import { albumService } from "@/lib/services/albumService"
import { imageService } from "@/lib/services/imageService"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { toast } from "sonner"
import { PromptBox } from "@/components/prompt-box"
import Image from "next/image"
import { Sparkles, Wand2 } from "lucide-react"

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
          projectId,
          userId: auth.currentUser.uid,
          role: "assistant",
          content: responseText,
          createdAt: serverTimestamp()
        })
      ])

      // 4. Trigger generation if needed
      if (generatePrompt) {
        imageService.generateImage(
          auth.currentUser.uid,
          projectId,
          generatePrompt
        )
        toast.info("Creating your first generation in a new project...")
      }

      // 5. Redirect to the new project
      router.push(`/dashboard/projects/${projectId}`)
    } catch (error) {
      console.error("Generation panel error:", error)
      toast.error("Failed to start generation")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 relative overflow-hidden bg-background">
      {/* Subtle Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-3xl w-full text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border text-foreground text-[10px] font-black uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Image src="/images/juju.png" alt="Juju Logo" width={16} height={16} className="w-4 h-4 object-contain" />
          <span>Full Length Text-To-Video</span>
        </div>

        {projectName ? (
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tighter leading-tight">
            {projectName}
          </h1>
        ) : (
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tighter leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Create Epic <span className="text-primary underline decoration-primary/30 underline-offset-4">CARTOON</span> Videos
          </h1>
        )}
        <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          Paste your script or describe your idea below
        </p>
      </div>

      <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
        <PromptBox
          onSubmit={handleGenerate}
          isLoading={isLoading}
          variant="dashboard"
          placeholder="e.g. A man driving an open car during summer vacation..."
          attachments={attachments}
          onRemoveAttachment={(idx) => {
            const newAttachments = [...attachments]
            newAttachments.splice(idx, 1)
            setAttachments(newAttachments)
          }}
        />
      </div>

      <div className="mt-8 flex items-center gap-6 text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest animate-in fade-in duration-1000 delay-500">
        <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-default">
          <Sparkles className="w-3 h-3" />
          AI Storyboarding
        </span>
        <span className="w-1 h-1 rounded-full bg-border" />
        <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-default">
          <Wand2 className="w-3 h-3" />
          Auto-Animation
        </span>
        <span className="w-1 h-1 rounded-full bg-border" />
        <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-default">
          <Image src="/images/juju.png" alt="Voice" width={12} height={12} className="w-3 h-3 grayscale" />
          AI Voiceover
        </span>
      </div>
    </div>
  )
}


