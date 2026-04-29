"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Clock,
  Send,
  Film,
  Music,
  Type,
  SplitSquareHorizontal,
  History,
  Upload,
  PanelLeftClose,
  Palette
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { auth, storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

interface AlbumImage {
  id: string
  url: string
  type?: "image" | "video"
  title?: string
  hasAudio?: boolean
  hasCaption?: boolean
  style?: string
}

const sceneStyles = [
  "Pixar-style 3D",
  "Anime",
  "Claymation",
  "Comic book",
  "Watercolor",
  "Cinematic realistic",
]

interface LeftPanelProps {
  scenes: AlbumImage[]
  activeTab: string
  contentVisible?: boolean
  onTabChange: (tab: string) => void
  onGenerateScene: (style: string) => void
  onAddScene: (media: { url: string; type: "image" | "video"; title?: string }) => void
  onAddAudio: (track: string) => void
  onAddCaption: (text: string) => void
  onClose?: () => void
}

export function LeftPanel({
  activeTab,
  contentVisible = true,
  onTabChange,
  onGenerateScene,
  onAddScene,
  onAddAudio,
  onAddCaption,
  onClose,
}: LeftPanelProps) {
  const sceneInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const captionInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedSceneStyle, setSelectedSceneStyle] = useState(sceneStyles[0])

  const uploadFile = async (file: File, type: 'scene' | 'audio' | 'caption') => {
    if (!file) return

    const user = auth.currentUser
    if (!user) {
      toast.error("You must be logged in to upload media.")
      return
    }

    setIsUploading(true)
    const toastId = toast.loading(`Uploading ${type}...`)
    try {
      const fileRef = ref(storage, `users/${user.uid}/${Date.now()}_${file.name}`)
      await uploadBytes(fileRef, file)
      const url = await getDownloadURL(fileRef)

      toast.success(`Upload complete`, { id: toastId })

      if (type === 'scene') {
        onAddScene({
          url,
          type: file.type.startsWith("video/") ? "video" : "image",
          title: file.name,
        })
      }
      else if (type === 'audio') onAddAudio(file.name)
      else if (type === 'caption') onAddCaption(file.name)
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(`Upload failed`, { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'scene' | 'audio' | 'caption') => {
    const file = event.target.files?.[0]
    if (file) {
      await uploadFile(file, type)
    }
    event.target.value = ''
  }

  const handleSceneDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const file = event.dataTransfer.files?.[0]
    if (!file || isUploading) return

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Upload an image or video file.")
      return
    }

    await uploadFile(file, 'scene')
  }

  return (
    <div className={cn(
      "flex h-full overflow-hidden rounded-2xl bg-card shadow-sm transition-[width] duration-300",
      contentVisible ? "w-[300px]" : "w-[64px]"
    )}>
      {/* Custom Vertical Navigation Sidebar */}
      <div className="w-[64px] shrink-0 bg-muted/5 flex flex-col py-4 items-center gap-2">
        <TooltipProvider delayDuration={250}>
          {[
            { id: 'scenes', icon: Film, label: 'Scenes' },
            { id: 'audio', icon: Music, label: 'Audio' },
            { id: 'captions', icon: Type, label: 'Text' },
            { id: 'transitions', icon: SplitSquareHorizontal, label: 'Effects' }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <Tooltip key={tab.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                      "group relative flex h-16 w-14 flex-col items-center justify-center rounded-xl transition-all duration-300",
                      isActive
                        ? "bg-card text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5 mb-1.5 transition-transform duration-300",
                      isActive ? "scale-110" : "group-hover:scale-110"
                    )} />
                    <span className={cn("text-[11px] font-medium tracking-tight leading-none", !isActive && "text-muted-foreground")}>
                      {tab.label}
                    </span>

                    {isActive && (
                      <div className="absolute -left-[1px] h-4 w-1 rounded-r-full bg-primary" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{tab.label}</TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
        <div className="flex-1" />
        {onClose && (
          <TooltipProvider delayDuration={250}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onClose}
                  className="flex h-16 w-16 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all mt-auto"
                >
                  <PanelLeftClose className={cn("h-4 w-4 transition-transform", !contentVisible && "rotate-180")} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{contentVisible ? "Hide panel" : "Show panel"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Main Content Area */}
      {contentVisible && (
        <div className="flex flex-1 flex-col min-w-0 bg-background/30">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2.5">
            {activeTab === 'scenes' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <Palette className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[11px] font-medium tracking-wide text-muted-foreground">Style</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {sceneStyles.map((style) => {
                        const isSelected = selectedSceneStyle === style
                        return (
                          <button
                            key={style}
                            type="button"
                            onClick={() => setSelectedSceneStyle(style)}
                            className={cn(
                              "min-h-10 rounded-xl border px-3 py-2 text-left text-[11px] font-medium leading-tight transition-all",
                              isSelected
                                ? "border-primary bg-primary/10 text-foreground"
                                : "border-border/60 bg-muted/20 text-muted-foreground hover:border-primary/30 hover:bg-muted/40 hover:text-foreground"
                            )}
                          >
                            {style}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="relative group">
                    <Textarea
                      className="min-h-[140px] bg-muted/40 border-border resize-none pr-12 text-sm leading-relaxed rounded-2xl focus-visible:ring-primary/20"
                      placeholder="Describe the scene..."
                      defaultValue="Cinematic wide shot of two stylish characters in a vintage car driving through a palm-tree lined street in Miami. Pixar-style 3D animation, golden hour lighting, depth of field."
                    />
                    <Button
                      size="icon"
                      onClick={() => onGenerateScene(selectedSceneStyle)}
                      className="absolute bottom-3 right-3 h-8 w-8 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-border/50">

                  <div className="grid grid-cols-2 gap-3 empty:hidden px-1">
                    <p className="col-span-2 text-[11px] text-muted-foreground/50 italic text-center py-6 bg-muted/20 rounded-2xl border border-dashed border-border/50">
                      No generated scenes
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-[11px] font-medium tracking-wide text-muted-foreground">Uploads</span>
                    </div>
                    <button
                      className="text-[11px] font-medium text-primary hover:underline transition-all"
                      onClick={() => sceneInputRef.current?.click()}
                    >
                      Upload Media
                    </button>
                  </div>

                  <div
                    className="border-2 border-dashed border-border/40 rounded-2xl p-8 flex flex-col items-center justify-center bg-muted/5 group hover:bg-muted/10 hover:border-primary/30 transition-all cursor-pointer"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={handleSceneDrop}
                    onClick={() => sceneInputRef.current?.click()}
                  >
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">Click to browse or drag and drop</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 empty:hidden">
                    {/* Scenes list would go here */}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="relative group">
                    <Textarea
                      className="min-h-[140px] bg-muted/40 border-border resize-none pr-12 text-sm rounded-2xl focus-visible:ring-primary/20"
                      placeholder="Prompt music style..."
                      defaultValue="Cinematic orchestral score with rising tension, featuring deep bass and ethereal synth pads. 80bpm, mood: epic and mysterious."
                    />
                    <Button size="icon" className="absolute bottom-3 right-3 h-8 w-8 rounded-xl shadow-lg">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-border/50">

                  <p className="text-[11px] text-muted-foreground/50 italic text-center py-6 bg-muted/20 rounded-2xl border border-dashed border-border/50">
                    No generated tracks
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <History className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-[11px] font-medium tracking-wide text-muted-foreground">Library</span>
                    </div>
                    <button
                      className="text-[11px] font-medium text-primary hover:underline transition-all"
                      onClick={() => audioInputRef.current?.click()}
                    >
                      Add Audio
                    </button>
                  </div>

                  <div
                    className="border-2 border-dashed border-border/40 rounded-2xl p-8 flex flex-col items-center justify-center bg-muted/5 group hover:bg-muted/10 hover:border-primary/30 transition-all cursor-pointer"
                    onClick={() => audioInputRef.current?.click()}
                  >
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm mb-3">
                      <Music className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground">Import your own music</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'captions' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="relative group">
                    <Textarea
                      className="min-h-[140px] bg-muted/40 border-border resize-none pr-12 text-sm rounded-2xl focus-visible:ring-primary/20"
                      placeholder="Enter or generate captions..."
                      defaultValue="In the heart of the neon city, where dreams and reality blur into one, two strangers find themselves on a path that will change their destinies forever. A cinematic journey through the soul of the night."
                    />
                    <Button size="icon" className="absolute bottom-3 right-3 h-8 w-8 rounded-xl shadow-lg">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-border/50">

                  <p className="text-[11px] text-muted-foreground/50 italic text-center py-6 bg-muted/20 rounded-2xl border border-dashed border-border/50">
                    No generated captions
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <History className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-[11px] font-medium tracking-wide text-muted-foreground">External files</span>
                    </div>
                    <button
                      className="text-[11px] font-medium text-primary hover:underline transition-all"
                      onClick={() => captionInputRef.current?.click()}
                    >
                      Import .srt
                    </button>
                  </div>

                  <div
                    className="border-2 border-dashed border-border/40 rounded-2xl p-8 flex flex-col items-center justify-center bg-muted/5 group hover:bg-muted/10 hover:border-primary/30 transition-all cursor-pointer"
                    onClick={() => captionInputRef.current?.click()}
                  >
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm mb-3">
                      <Type className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground">Upload caption files</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transitions' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {["Cut", "Fade", "Dip", "Slide"].map((transition) => (
                      <Button key={transition} variant="outline" className="h-12 rounded-2xl text-xs font-medium border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all">
                        {transition}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-border/50">
                  <span className="text-[11px] font-medium tracking-wide text-muted-foreground px-1">Global duration</span>
                  <div className="flex items-center justify-between border border-border bg-muted/20 px-4 py-3 rounded-2xl">
                    <span className="text-sm font-medium text-foreground">0.4 seconds</span>
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">Default</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <input type="file" ref={sceneInputRef} className="hidden" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, 'scene')} disabled={isUploading} />
      <input type="file" ref={audioInputRef} className="hidden" accept="audio/*" onChange={(e) => handleFileUpload(e, 'audio')} disabled={isUploading} />
      <input type="file" ref={captionInputRef} className="hidden" accept=".srt,.txt,.vtt" onChange={(e) => handleFileUpload(e, 'caption')} disabled={isUploading} />
    </div>
  )
}
