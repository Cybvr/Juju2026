import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Paperclip, AtSign, Slash, RotateCcw, ChevronDown, Loader2 } from "lucide-react"
import { chatService } from "@/lib/services/geminiService"
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { toast } from "sonner"
import { imageService } from "@/lib/services/imageService"

interface Attachment {
  id: string
  url: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  attachments?: Attachment[]
  date?: string
}

interface ChatProps {
  albumId: string
  onGenerate?: (prompt: string) => void
}

export function Chat({ albumId, onGenerate }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMessagesLoading, setIsMessagesLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!albumId) return

    setIsMessagesLoading(true)
    const q = query(
      collection(db, "messages"),
      where("albumId", "==", albumId),
      orderBy("createdAt", "asc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[]
      setMessages(msgs)
      setIsMessagesLoading(false)
    }, (error) => {
      console.error("Messages switch error:", error)
      setIsMessagesLoading(false)
    })

    return () => unsubscribe()
  }, [albumId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !auth.currentUser || isLoading) return

    const userPrompt = input.trim()
    setInput("")
    setIsLoading(true)

    try {
      // 1. Save user message to Firestore
      await addDoc(collection(db, "messages"), {
        albumId,
        userId: auth.currentUser.uid,
        role: "user",
        content: userPrompt,
        createdAt: serverTimestamp()
      })

      // 2. Format history for Gemini
      const history = messages.map(m => ({
        role: m.role === "user" ? "user" as const : "model" as const,
        parts: [{ text: m.content }]
      }))

      history.push({ role: "user", parts: [{ text: userPrompt }] })

      // 3. Get response from Gemini
      const { text: responseText, generatePrompt } = await chatService.sendMessage(history)

      // 4. Save assistant message to Firestore
      await addDoc(collection(db, "messages"), {
        albumId,
        userId: auth.currentUser.uid,
        role: "assistant",
        content: responseText,
        createdAt: serverTimestamp()
      })

      // 5. If Gemini suggested a generation, trigger it
      if (generatePrompt) {
        toast.promise(
          imageService.generateImage(auth.currentUser.uid, albumId, generatePrompt),
          {
            loading: 'Juju is generating your image...',
            success: 'Image generated and added to album!',
            error: 'Failed to generate image',
          }
        )
      }

      onGenerate?.(userPrompt)
    } catch (error) {
      console.error("Chat error:", error)
      toast.error("Failed to send message")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-serif font-semibold">Juju</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {isMessagesLoading ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30">
            <Loader2 className="h-6 w-6 animate-spin mb-2" />
            <p className="text-sm">Loading chat...</p>
          </div>
        ) : messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-50">
            <p className="text-lg font-serif italic">Start a conversation with Juju</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={message.id} className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {message.attachments && message.attachments.length > 0 && (
              <div className="flex justify-center mb-4">
                {message.attachments.map((attachment) => (
                  <div key={attachment.id} className="relative w-40 h-48 rounded-lg overflow-hidden">
                    <Image
                      src={attachment.url || "/placeholder.svg"}
                      alt="Attachment"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {message.role === "user" ? (
              <div className="flex justify-center">
                <div className="bg-muted rounded-2xl px-5 py-4 max-w-md">
                  <p className="text-foreground font-medium leading-relaxed">{message.content}</p>
                </div>
              </div>
            ) : (
              <div className="max-w-md">
                <p className="text-foreground leading-relaxed">
                  {message.content}
                </p>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Juju is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-6 pb-6">
        <div className="bg-muted rounded-2xl p-4">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = `${e.target.scrollHeight}px`
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask Juju"
            className="w-full bg-transparent text-lg outline-none placeholder:text-muted-foreground mb-3 resize-none max-h-48"
            disabled={isLoading}
            style={{ height: 'auto' }}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <AtSign className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Slash className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Custom</span>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
