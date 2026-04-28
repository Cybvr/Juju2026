"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, ChevronDown, Download, Share2, MoreVertical, LayoutGrid, List, Play } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface AlbumImage {
  id: string
  url: string
}

interface ProjectContentProps {
  projectId: string
  projectName: string
  images: AlbumImage[]
}

export function ProjectContent({ projectName, images }: ProjectContentProps) {
  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-border/50 bg-background/50 backdrop-blur-md relative z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link>
            <span className="opacity-40">/</span>
            <span className="text-foreground/40">Videos</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-foreground">{projectName}</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 hover:bg-secondary rounded-lg transition-all">
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="rounded-2xl p-2 border-border/50">
                <DropdownMenuItem className="rounded-xl px-3 py-2 text-sm font-medium">Rename Project</DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-3 py-2 text-sm font-medium">Duplicate</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem className="rounded-xl px-3 py-2 text-sm font-bold text-destructive">Delete Permanently</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-muted/50 p-1 rounded-xl border border-border/50 mr-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-background shadow-sm">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground">
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" className="h-10 rounded-xl px-4 font-bold border-border/50 hover:bg-secondary transition-all gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button size="sm" className="h-10 rounded-xl px-6 font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all gap-2">
            <Play className="h-4 w-4 fill-current" />
            Export HD
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
        {images.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
            <div className="w-20 h-20 rounded-[2.5rem] bg-muted/50 flex items-center justify-center mb-8 border border-border/50">
              <Play className="w-8 h-8 text-muted-foreground/30 fill-current" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Video Timeline Empty</h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Your cartoon video scenes will appear here as they are generated. Start by describing your first scene in the AI Director.
            </p>
          </div>
        ) : (
          <div className="columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {images.map((image, index) => (
              <div 
                key={image.id} 
                className="group break-inside-avoid relative rounded-3xl overflow-hidden cursor-pointer bg-card border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-500"
              >
                <div className="relative aspect-auto">
                  <Image
                    src={image.url || "/images/juju.png"}
                    alt="Generated content"
                    width={500}
                    height={index % 3 === 0 ? 700 : index % 2 === 0 ? 500 : 400}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-5">
                    <div className="flex justify-end gap-2 translate-y-[-10px] group-hover:translate-y-0 transition-transform duration-500">
                      <Button variant="secondary" size="icon" className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur-md border-white/20 hover:bg-white/40 text-white">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" size="icon" className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur-md border-white/20 hover:bg-white/40 text-white">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="translate-y-[10px] group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Scene ID: {image.id.substring(0, 8)}</p>
                      <h4 className="text-sm font-bold text-white truncate">Scene #{index + 1}</h4>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
