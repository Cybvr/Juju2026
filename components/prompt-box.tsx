"use client"

import { Paperclip, AtSign, Slash, RotateCcw, Loader2, Image as ImageIcon, X } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface PromptBoxProps {
    onSubmit: (prompt: string, attachments: string[]) => void
    isLoading?: boolean
    placeholder?: string
    className?: string
    variant?: "dashboard" | "landing"
    attachments?: string[]
    onRemoveAttachment?: (index: number) => void
}

export function PromptBox({
    onSubmit,
    isLoading = false,
    placeholder = "Generate any image",
    className,
    variant = "dashboard",
    attachments = [],
    onRemoveAttachment
}: PromptBoxProps) {
    const [prompt, setPrompt] = useState("")
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleSubmit = () => {
        if (!prompt.trim() && attachments.length === 0) return
        if (isLoading) return
        onSubmit(prompt.trim(), attachments)
        setPrompt("")
        if (textareaRef.current) textareaRef.current.style.height = 'auto'
    }

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [prompt])

    return (
        <div className={cn("w-full max-w-3xl mx-auto", className)}>
            <div className={cn(
                "border border-border rounded-3xl p-2 bg-background/60 backdrop-blur-xl shadow-2xl focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden",
                variant === "landing" ? "p-3" : "p-2"
            )}>
                {/* Attachments Preview */}
                {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 pb-0 animate-fade-in">
                        {attachments.map((url, idx) => (
                            <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-border bg-muted shadow-sm">
                                <Image
                                    src={url}
                                    alt="Attachment"
                                    fill
                                    className="object-cover transition-transform group-hover:scale-110"
                                />
                                <button
                                    onClick={() => onRemoveAttachment?.(idx)}
                                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="p-3">
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        placeholder={placeholder}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleSubmit()
                            }
                        }}
                        className={cn(
                            "w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground mb-4 resize-none max-h-48 font-light",
                            variant === "landing" ? "text-xl px-2" : "text-base px-1"
                        )}
                        disabled={isLoading}
                        style={{ height: 'auto' }}
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 md:gap-3">
                            <button className="p-2.5 hover:bg-secondary rounded-xl transition-colors disabled:opacity-50 group" disabled={isLoading}>
                                <Paperclip className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </button>
                            <button className="p-2.5 hover:bg-secondary rounded-xl transition-colors disabled:opacity-50 group" disabled={isLoading}>
                                <AtSign className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </button>
                            <button className="p-2.5 hover:bg-secondary rounded-xl transition-colors disabled:opacity-50 group" disabled={isLoading}>
                                <ImageIcon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted-foreground bg-secondary/80 px-4 py-2 rounded-full border border-border/50">
                                <Slash className="w-3.5 h-3.5" />
                                <span className="uppercase tracking-wider">NanoBanana V2</span>
                            </div>
                            <button
                                onClick={handleSubmit}
                                className={cn(
                                    "p-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl transition-all disabled:opacity-50 shadow-lg hover:translate-y-[-2px] active:translate-y-[0px]",
                                    (prompt.trim() || attachments.length > 0) ? "scale-100" : "scale-95 opacity-50"
                                )}
                                disabled={isLoading || (!prompt.trim() && attachments.length === 0)}
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RotateCcw className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {variant === "landing" && (
                <div className="text-center mt-6">
                    <p className="text-muted-foreground/60 text-sm italic font-serif">
                        Click any image below to use as a style reference
                    </p>
                </div>
            )}
        </div>
    )
}

