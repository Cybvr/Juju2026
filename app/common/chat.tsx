"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Paperclip, AtSign, Slash, RotateCcw, ChevronDown } from "lucide-react"

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
  onGenerate?: (prompt: string) => void
}

export function Chat({ onGenerate }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      content: "how can we recreate something conceptually, aesthetically similar to this with a blonde very short hair boxer.",
      date: "February 3, 2026",
      attachments: [{ id: "1", url: "/images/boxer-1.jpg" }]
    },
    {
      id: "2", 
      role: "assistant",
      content: "I love this concept—the striking contrast between a living person and classical sculptural forms creates such a powerful visual tension. Let me create some variations with a blonde short-haired boxer..."
    }
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    onGenerate?.(input)
    setInput("")
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 py-4">
        <h2 className="text-2xl font-serif font-semibold">Juju</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {messages.map((message, index) => (
          <div key={message.id} className="mb-6">
            {message.date && (
              <p className="text-muted-foreground text-sm mb-4 text-center">{message.date}</p>
            )}
            
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
                  {index === messages.length - 1 && message.role === "assistant" && (
                    <button className="inline-flex items-center ml-1 text-muted-foreground hover:text-foreground">
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  )}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-6 pb-6">
        <div className="bg-muted rounded-2xl p-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask Juju"
            className="w-full bg-transparent text-lg outline-none placeholder:text-muted-foreground mb-3"
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
