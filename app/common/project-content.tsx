"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  ChevronDown, 
  Download, 
  Share2, 
  MoreVertical, 
  Play, 
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize2,
  Monitor, 
  Smartphone, 
  Square,
  Clock,
  Plus,
  Settings2,
  Trash2,
  Layers,
  ArrowLeft,
  Wand2,
  Sparkles,
  Music,
  Video,
  Type
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AlbumImage {
  id: string
  url: string
  title?: string
}

interface ProjectContentProps {
  projectId: string
  projectName: string
  images: AlbumImage[]
}

export function ProjectContent({ projectName, images }: ProjectContentProps) {
  const [aspectRatio, setAspectRatio] = useState<"landscape" | "portrait" | "square">("landscape")
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(35)
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)

  const currentImage = images[activeSceneIndex]?.url || "/images/juju.png"

  return (
    <div className="flex h-full w-full bg-[#F9FAFB] text-foreground relative overflow-hidden font-sans">
      {/* Main Studio Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100 relative z-30">
          <div className="flex items-center gap-5">
            <Link href="/dashboard" className="group">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <ArrowLeft className="w-5 h-5" />
              </div>
            </Link>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">Production Studio</span>
              </div>
              <h1 className="text-xl font-black tracking-tight text-gray-900">{projectName}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" className="h-10 rounded-xl px-4 font-bold text-gray-500 hover:bg-gray-50 gap-2">
              <Share2 className="h-4 w-4" />
              Collaborate
            </Button>
            <Button className="h-10 rounded-xl px-6 font-bold bg-[#111111] text-white hover:bg-black transition-all gap-2">
              <Download className="h-4 w-4" />
              Export Video
            </Button>
          </div>
        </div>

        {/* Player Stage */}
        <div className="flex-1 flex items-center justify-center p-12 bg-[#F3F4F6] relative">
          <div className={cn(
            "relative rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] bg-black transition-all duration-700",
            aspectRatio === "landscape" ? "aspect-[16/9] w-full max-w-5xl" : 
            aspectRatio === "portrait" ? "aspect-[9/16] h-full" : "aspect-square h-full max-h-[600px]"
          )}>
            <Image 
              src={currentImage} 
              alt="Scene Preview"
              fill
              className="object-cover opacity-90"
            />
            
            {/* Player Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            {/* Top Scene Indicator */}
            <div className="absolute top-8 left-8">
               <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-primary" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Scene {activeSceneIndex + 1} / {images.length || 1}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Playback & Timeline Controls */}
        <div className="bg-white border-t border-gray-100 p-8 pt-6 relative z-30">
          {/* Progress Bar */}
          <div className="relative w-full h-1.5 bg-gray-100 rounded-full mb-8 group cursor-pointer">
            <div 
              className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
            </div>
            
            {/* Time Indicators */}
            <div className="absolute -bottom-6 left-0 text-[10px] font-bold text-gray-400">0:12</div>
            <div className="absolute -bottom-6 right-0 text-[10px] font-bold text-gray-400">0:24</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
                 <Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg text-[10px] font-black uppercase text-gray-400 hover:text-primary">Preview</Button>
                 <div className="w-[1px] h-4 bg-gray-200" />
                 <div className="flex items-center gap-2 px-2">
                    <Music className="w-3.5 h-3.5 text-gray-400" />
                    <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                       <div className="w-[65%] h-full bg-primary" />
                    </div>
                    <span className="text-[9px] font-black text-primary">65%</span>
                 </div>
              </div>
            </div>

            <div className="flex items-center gap-8 translate-x-[-20px]">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
                <SkipBack className="w-5 h-5 fill-current" />
              </Button>
              <Button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-primary text-white shadow-xl shadow-primary/30 hover:scale-110 transition-all flex items-center justify-center p-0"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
                <SkipForward className="w-5 h-5 fill-current" />
              </Button>
            </div>

            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
                  <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase text-gray-500 bg-white shadow-sm border border-gray-100 px-3">Scene</Button>
                  <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase text-gray-400 px-3">All</Button>
               </div>
               <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-gray-50 rounded-xl">
                 <Maximize2 className="w-4 h-4" />
               </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Inspector Panel */}
      <div className="w-[380px] bg-white border-l border-gray-100 flex flex-col relative z-40">
        <div className="p-6 border-b border-gray-100">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Inspector</h3>
           <h2 className="text-lg font-black text-gray-900">Scene Properties</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Visual Settings */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Aspect Ratio</span>
                <span className="text-[10px] font-bold text-primary">16:9 Landscape</span>
             </div>
             <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "landscape", icon: Monitor, label: "16:9" },
                  { id: "portrait", icon: Smartphone, label: "9:16" },
                  { id: "square", icon: Square, label: "1:1" },
                ].map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setAspectRatio(ratio.id as any)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all",
                      aspectRatio === ratio.id 
                        ? "bg-gray-50 border-primary/30 text-primary shadow-sm" 
                        : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                    )}
                  >
                    <ratio.icon className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-tighter">{ratio.label}</span>
                  </button>
                ))}
             </div>
          </div>

          {/* Prompt Section */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">AI Director Script</span>
                <Button variant="ghost" size="sm" className="h-6 text-[9px] font-black text-primary px-2 rounded-lg bg-primary/5 hover:bg-primary/10">REGENERATE</Button>
             </div>
             <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 relative group">
                <p className="text-xs font-medium text-gray-600 leading-relaxed">
                  Cinematic wide shot of two stylish characters in a vintage car driving through a palm-tree lined street in Miami. Pixar-style 3D animation, golden hour lighting, depth of field.
                </p>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button size="icon" variant="ghost" className="h-6 w-6 rounded-lg bg-white shadow-sm">
                      <Settings2 className="w-3 h-3 text-gray-400" />
                   </Button>
                </div>
             </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4 pt-4">
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quick Tools</span>
             <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12 rounded-xl justify-start gap-3 border-gray-100 text-gray-600 font-bold hover:bg-gray-50">
                  <Video className="w-4 h-4 text-primary" />
                  Motion
                </Button>
                <Button variant="outline" className="h-12 rounded-xl justify-start gap-3 border-gray-100 text-gray-600 font-bold hover:bg-gray-50">
                  <Music className="w-4 h-4 text-purple-500" />
                  SFX
                </Button>
                <Button variant="outline" className="h-12 rounded-xl justify-start gap-3 border-gray-100 text-gray-600 font-bold hover:bg-gray-50">
                  <Type className="w-4 h-4 text-blue-500" />
                  Captions
                </Button>
                <Button variant="outline" className="h-12 rounded-xl justify-start gap-3 border-gray-100 text-gray-600 font-bold hover:bg-gray-50">
                  <Plus className="w-4 h-4 text-green-500" />
                  Scene
                </Button>
             </div>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                 <Wand2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-900 uppercase">Juju Director</p>
                 <p className="text-[9px] font-bold text-gray-400 uppercase">Ready for instructions</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
