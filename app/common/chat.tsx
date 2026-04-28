import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Paperclip, AtSign, Slash, RotateCcw, ChevronDown, Loader2, Send, Sparkles, Wand2, Play } from "lucide-react"
import { chatService } from "@/lib/services/geminiService"
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { toast } from "sonner"
import { imageService } from "@/lib/services/imageService"
import { cn } from "@/lib/utils"

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
  projectId: string
  onGenerate?: (prompt: string) => void
}

export function Chat({ projectId, onGenerate }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMessagesLoading, setIsMessagesLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

    if (!auth.currentUser) return

    setIsMessagesLoading(true)
    const q = query(
      collection(db, "messages"),
      where("projectId", "==", projectId),
      where("userId", "==", auth.currentUser.uid),
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
  }, [projectId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !auth.currentUser || isLoading) return

    const userPrompt = input.trim()
    setInput("")
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setIsLoading(true)

    try {
      await addDoc(collection(db, "messages"), {
        projectId,
        userId: auth.currentUser.uid,
        role: "user",
        content: userPrompt,
        createdAt: serverTimestamp()
      })

      const history = messages.map(m => ({
        role: m.role === "user" ? "user" as const : "model" as const,
        parts: [{ text: m.content }]
      }))

      history.push({ role: "user", parts: [{ text: userPrompt }] })

      const { text: responseText, generatePrompt } = await chatService.sendMessage(history)

      await addDoc(collection(db, "messages"), {
        projectId,
        userId: auth.currentUser.uid,
        role: "assistant",
        content: responseText,
        createdAt: serverTimestamp()
      })

      if (generatePrompt) {
        toast.promise(
          imageService.generateImage(auth.currentUser.uid, projectId, generatePrompt),
          {
            loading: 'Juju is generating your scene...',
            success: 'Scene generated and added to project!',
            error: 'Failed to generate scene',
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
    <div className="flex flex-col h-full bg-card/20 backdrop-blur-xl relative border-r border-border/50">
      {/* Chat Header */}
      <div className="px-6 py-6 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Wand2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground">AI Director</h2>
            <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">Connected & Ready</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-secondary transition-all">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 custom-scrollbar">
        {isMessagesLoading ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30">
            <Loader2 className="h-6 w-6 animate-spin mb-4 text-primary" />
            <p className="text-xs font-bold uppercase tracking-widest">Compiling Scenes...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-xs mx-auto">
            <div className="w-16 h-16 rounded-[2rem] bg-muted/50 flex items-center justify-center mb-6">
              <Play className="w-8 h-8 text-muted-foreground/30 fill-current" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Video Scripting Session</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">Describe your scenes or paste a script. Juju will handle storyboarding, characters, and animation.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={message.id} 
              className={cn(
                "flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500",
                message.role === "user" ? "items-end" : "items-start"
              )}
            >
              <div className={cn(
                "max-w-[85%] rounded-3xl p-5 shadow-sm",
                message.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-tr-none" 
                  : "bg-card border border-border/50 text-foreground rounded-tl-none"
              )}>
                <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mt-2 px-1">
                {message.role === "user" ? "Screenwriter" : "Juju Director"}
              </span>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex flex-col items-start animate-in fade-in duration-300">
            <div className="bg-card border border-border/50 rounded-3xl rounded-tl-none p-5 shadow-sm flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Synthesizing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-border/50 bg-background/50 backdrop-blur-md">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
          <div className="relative bg-card border border-border rounded-[2rem] p-3 shadow-xl transition-all duration-300 group-focus-within:border-primary/50">
            <textarea
              ref={textareaRef}
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
              placeholder="Message Juju..."
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/50 px-4 py-2 resize-none max-h-48 custom-scrollbar"
              disabled={isLoading}
            />
            <div className="flex items-center justify-between px-2 pt-2 border-t border-border/30 mt-2">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-secondary transition-all">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-secondary transition-all">
                  <AtSign className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-secondary transition-all">
                  <Slash className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-[9px] font-black text-muted-foreground/60 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50 uppercase tracking-widest">
                  NanoBanana V2
                </div>
                <Button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className={cn(
                    "h-10 w-10 rounded-2xl shadow-lg transition-all duration-300",
                    input.trim() ? "bg-primary scale-100" : "bg-muted text-muted-foreground scale-95 opacity-50"
                  )}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
