"use client"

import { Paperclip, AtSign, Slash, RotateCcw } from "lucide-react"
import { useState } from "react"

interface PromptPanelProps {
  albumName?: string
  onGenerate: (prompt: string) => void
}

export function GeneratePanel({ albumName }: { albumName?: string }) {
  const [prompt, setPrompt] = useState("")

  const handleSubmit = () => {
    if (prompt.trim()) {
      console.log("Generating:", prompt)
      setPrompt("")
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8">
      <h2 className="text-2xl font-serif font-semibold mb-16">Juju</h2>
      {albumName ? (
        <h1 className="text-4xl font-serif italic mb-8">{albumName}</h1>
      ) : (
        <h1 className="text-5xl font-serif italic mb-8">Reimagine reality</h1>
      )}
      
      <div className="w-full max-w-md">
        <div className="border border-border rounded-xl p-4 bg-background">
          <input
            type="text"
            placeholder="Generate any image"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground mb-4"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <Paperclip className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <AtSign className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <Slash className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm hover:bg-secondary rounded-lg transition-colors">
                Custom
              </button>
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
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
