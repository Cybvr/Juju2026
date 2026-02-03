"use client"

import { Search } from "lucide-react"
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
    <div className="w-[500px] border-l border-border bg-background flex flex-col h-screen">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("my-work")}
            className={cn(
              "text-sm font-medium transition-colors",
              activeTab === "my-work" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            My work
          </button>
          <button
            onClick={() => setActiveTab("inspiration")}
            className={cn(
              "text-sm font-medium transition-colors",
              activeTab === "inspiration" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Inspiration
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <Button variant="outline" size="sm">
            New Folder
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {images.map((image) => (
            <div key={image.id} className="group cursor-pointer">
              <div className="aspect-[4/5] rounded-lg overflow-hidden bg-secondary mb-2">
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={image.title}
                  width={300}
                  height={375}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-medium text-sm truncate">{image.title}</h3>
              <p className="text-xs text-muted-foreground">
                {image.imageCount} images · {image.timeAgo}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
