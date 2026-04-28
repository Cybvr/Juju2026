"use client"

import Link from "next/link"
import { Search, FolderPlus, Grid, LayoutPanelLeft } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ImageItem {
  id: string
  url: string
  title: string
  imageCount: number
  timeAgo: string
}

interface GalleryProps {
  images: ImageItem[]
}

export function Gallery({ images }: GalleryProps) {
  const [activeTab, setActiveTab] = useState<"my-work" | "inspiration">("my-work")

  return (
    <div className="w-[450px] border-l border-border bg-card/30 backdrop-blur-xl flex flex-col h-screen z-10 relative">
      {/* Gallery Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Library</h2>
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-secondary rounded-xl transition-all">
              <Search className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-xl transition-all">
              <FolderPlus className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-muted/50 p-1 rounded-2xl border border-border/50">
          <button
            onClick={() => setActiveTab("my-work")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-300",
              activeTab === "my-work" 
                ? "bg-background text-foreground shadow-sm border border-border/50" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Grid className="w-3.5 h-3.5" />
            My Work
          </button>
          <button
            onClick={() => setActiveTab("inspiration")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-300",
              activeTab === "inspiration" 
                ? "bg-background text-foreground shadow-sm border border-border/50" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutPanelLeft className="w-3.5 h-3.5" />
            Inspiration
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {images.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-[2rem] bg-muted/20">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Grid className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">No projects yet</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Your creative masterpieces will appear here once you start generating.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {images.map((image) => (
              <Link
                key={image.id}
                href={`/dashboard/albums/${image.id}`}
                className="group cursor-pointer block"
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary border border-border/50 relative mb-3 group-hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-primary/5">
                  <Image
                    src={image.url || "/images/juju.png"}
                    alt={image.title}
                    width={300}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{image.imageCount} items</span>
                  </div>
                </div>
                <div className="px-1">
                  <h3 className="font-bold text-xs truncate text-foreground group-hover:text-primary transition-colors">{image.title}</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mt-0.5">
                    {image.timeAgo}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
