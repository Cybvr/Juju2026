"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Paperclip, AtSign, Slash, RotateCcw, Send } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatProps {
  albumName: string
  onGenerate?: (prompt: string) => void
}

export function Chat({ albumName, onGenerate }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
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

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Generating image for: "${userMessage.content}"`,
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 500)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-xl font-serif font-semibold">{albumName}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Start a conversation to generate images
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.role === "user"
                    ? "bg-foreground text-background"
                    : "bg-muted text-foreground"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-border p-4">
        <div className="bg-muted rounded-xl p-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Generate any image"
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
              <Button 
                onClick={handleSend}
                size="icon" 
                className="h-9 w-9 rounded-full"
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
