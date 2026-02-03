"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Search, Plus, MoreHorizontal, Download, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AlbumImage {
  id: string
  url: string
  createdAt: string
}

interface AlbumContentProps {
  albumId: string
  albumName: string
  images: AlbumImage[]
}

export function AlbumContent({ albumName, images }: AlbumContentProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-lg font-medium">{albumName}</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Plus className="h-4 w-4" />
            Add Image
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p className="text-lg mb-2">No images yet</p>
            <p className="text-sm">Generate your first image using the chat</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="group relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt="Generated image"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-white truncate">{image.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
