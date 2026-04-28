"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Clock,
  Plus,
  Send,
  Settings2,
  Layers,
  Music,
  Type,
  SplitSquareHorizontal,
  History,
  RefreshCcw,
  Upload
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { auth, storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

interface AlbumImage {
  id: string
  url: string
  title?: string
  hasAudio?: boolean
  hasCaption?: boolean
}

interface InspectorPanelProps {
  projectName: string
  scenes: AlbumImage[]
  aspectRatio: "landscape" | "portrait" | "square"
  activeTab: string
  onTabChange: (tab: string) => void
  onGenerateScene: () => void
  onAddScene: (url: string) => void
  onAddAudio: (track: string) => void
  onAddCaption: (text: string) => void
}

export function InspectorPanel({
  projectName,
  scenes,
  aspectRatio,
  activeTab,
  onTabChange,
  onGenerateScene,
  onAddScene,
  onAddAudio,
  onAddCaption,
}: InspectorPanelProps) {
  const sceneInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const captionInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'scene' | 'audio' | 'caption') => {
    const file = event.target.files?.[0]
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
      
      if (type === 'scene') onAddScene(url)
      else if (type === 'audio') onAddAudio(file.name)
      else if (type === 'caption') onAddCaption(file.name)
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(`Upload failed`, { id: toastId })
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="flex flex-col h-full w-[300px] border-l border-border bg-card">
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex flex-col h-full">
        <div className="border-b border-border bg-muted/20">
          <TabsList className="w-full h-12 bg-transparent rounded-none p-0">
            <TabsTrigger
              value="properties"
              className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent transition-all"
            >
              <Settings2 className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger
              value="scenes"
              className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent transition-all"
            >
              <Layers className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger
              value="audio"
              className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent transition-all"
            >
              <Music className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger
              value="captions"
              className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent transition-all"
            >
              <Type className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger
              value="transitions"
              className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent transition-all"
            >
              <SplitSquareHorizontal className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <TabsContent value="properties" className="m-0 p-4 space-y-6">
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-muted-foreground">Project Detail</span>
              <div className="border border-border bg-background px-3 py-2 text-sm font-bold text-foreground truncate rounded-lg">
                {projectName}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-muted-foreground">Metadata</span>
              <div className="space-y-2.5 border border-border bg-muted/40 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Length</span>
                  <span className="text-xs font-bold text-foreground">0:24s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Format</span>
                  <span className="text-xs font-bold text-foreground">4K / 30FPS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Aspect</span>
                  <span className="text-xs font-bold text-foreground">
                    {aspectRatio === "landscape" ? "16:9" : aspectRatio === "portrait" ? "9:16" : "1:1"}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scenes" className="m-0 p-4 space-y-6">
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-muted-foreground">Scene</span>
              <div className="relative group">
                <Textarea
                  className="min-h-[120px] bg-muted/40 border-border resize-none pr-10 text-sm font-medium leading-relaxed rounded-xl"
                  placeholder="Describe the scene..."
                  defaultValue="Cinematic wide shot of two stylish characters in a vintage car driving through a palm-tree lined street in Miami. Pixar-style 3D animation, golden hour lighting, depth of field."
                />
                <Button size="icon" className="absolute bottom-2 right-2 h-7 w-7 rounded-lg">
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-bold text-muted-foreground">Generated Scenes</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 empty:hidden">
                <p className="col-span-2 text-[10px] text-muted-foreground/60 italic text-center py-2">No generated scenes</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-bold text-muted-foreground">All</span>
                </div>
                <span 
                  className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                  onClick={() => sceneInputRef.current?.click()}
                >
                  Upload
                </span>
              </div>
              
              <div 
                className="border-2 border-dashed border-border/50 rounded-xl p-4 flex flex-col items-center justify-center bg-muted/5 group hover:bg-muted/10 transition-colors cursor-pointer"
                onClick={() => sceneInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 text-muted-foreground mb-1 group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-medium text-muted-foreground">Drag & drop or click</span>
              </div>

              <div className="grid grid-cols-4 gap-2 empty:hidden">
                <p className="col-span-4 text-[10px] text-muted-foreground/60 italic text-center py-2">No scenes uploaded</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audio" className="m-0 p-4 space-y-6">
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-muted-foreground">Audio</span>
              <div className="relative group">
                <Textarea
                  className="min-h-[120px] bg-muted/40 border-border resize-none pr-10 text-sm font-medium rounded-xl"
                  placeholder="Prompt music style..."
                  defaultValue="Cinematic orchestral score with rising tension, featuring deep bass and ethereal synth pads. 80bpm, mood: epic and mysterious."
                />
                <Button size="icon" className="absolute bottom-2 right-2 h-7 w-7 rounded-lg">
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-bold text-muted-foreground">Generated Tracks</span>
                </div>
              </div>
              <div className="space-y-2 empty:hidden">
                <p className="text-[10px] text-muted-foreground/60 italic text-center py-2">No generated tracks</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-bold text-muted-foreground">All</span>
                </div>
                <span 
                  className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                  onClick={() => audioInputRef.current?.click()}
                >
                  Upload
                </span>
              </div>

              <div 
                className="border-2 border-dashed border-border/50 rounded-xl p-4 flex flex-col items-center justify-center bg-muted/5 group hover:bg-muted/10 transition-colors cursor-pointer"
                onClick={() => audioInputRef.current?.click()}
              >
                <Music className="w-4 h-4 text-muted-foreground mb-1 group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-medium text-muted-foreground">Drag & drop or click</span>
              </div>

              <div className="space-y-2 empty:hidden">
                <p className="text-[10px] text-muted-foreground/60 italic text-center py-2">No tracks uploaded</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="captions" className="m-0 p-4 space-y-6">
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-muted-foreground">Captions</span>
              <div className="relative group">
                <Textarea
                  className="min-h-[120px] bg-muted/40 border-border resize-none pr-10 text-sm font-medium rounded-xl"
                  placeholder="Enter or generate captions..."
                  defaultValue="In the heart of the neon city, where dreams and reality blur into one, two strangers find themselves on a path that will change their destinies forever. A cinematic journey through the soul of the night."
                />
                <Button size="icon" className="absolute bottom-2 right-2 h-7 w-7 rounded-lg">
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

              <div className="space-y-3 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-bold text-muted-foreground">Generated Captions</span>
                  </div>
                </div>
                <div className="space-y-2 empty:hidden">
                  <p className="text-[10px] text-muted-foreground/60 italic text-center py-2">No generated captions</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-bold text-muted-foreground">All</span>
                  </div>
                  <span 
                    className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                    onClick={() => captionInputRef.current?.click()}
                  >
                    Upload
                  </span>
                </div>

                <div 
                  className="border-2 border-dashed border-border/50 rounded-xl p-4 flex flex-col items-center justify-center bg-muted/5 group hover:bg-muted/10 transition-colors cursor-pointer"
                  onClick={() => captionInputRef.current?.click()}
                >
                  <Type className="w-4 h-4 text-muted-foreground mb-1 group-hover:text-primary transition-colors" />
                  <span className="text-[10px] font-medium text-muted-foreground">Drag & drop or click</span>
                </div>

                <div className="space-y-2 empty:hidden">
                  <p className="text-[10px] text-muted-foreground/60 italic text-center py-2">No captions uploaded</p>
                </div>
              </div>
          </TabsContent>

          <TabsContent value="transitions" className="m-0 p-4 space-y-6">
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-muted-foreground">Transitions</span>
              <div className="grid grid-cols-2 gap-2">
                {["Cut", "Fade", "Dip", "Slide"].map((transition) => (
                  <Button key={transition} variant="outline" className="h-9 rounded-lg text-sm font-bold border-border/50">
                    {transition}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-bold text-muted-foreground">Duration</span>
              <div className="flex items-center justify-between border border-border bg-background px-3 py-2 rounded-lg">
                <span className="text-sm font-bold text-foreground">0.4 seconds</span>
                <span className="text-xs font-bold text-muted-foreground uppercase">default</span>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <input type="file" ref={sceneInputRef} className="hidden" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, 'scene')} disabled={isUploading} />
      <input type="file" ref={audioInputRef} className="hidden" accept="audio/*" onChange={(e) => handleFileUpload(e, 'audio')} disabled={isUploading} />
      <input type="file" ref={captionInputRef} className="hidden" accept=".srt,.txt,.vtt" onChange={(e) => handleFileUpload(e, 'caption')} disabled={isUploading} />
    </div>
  )
}
