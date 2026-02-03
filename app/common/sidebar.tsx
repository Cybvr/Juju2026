"use client"

import { Home, Plus, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Album } from "./types"

interface SidebarProps {
  albums: Album[]
  activeAlbumId?: string | null
  onNewAlbum?: (album: Album) => void
}

export function Sidebar({ albums, activeAlbumId, onNewAlbum }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()

  const handleNewAlbum = () => {
    const newId = `new-${Date.now()}`
    const newAlbum: Album = {
      id: newId,
      name: "Untitled Album",
      thumbnail: "/images/boxer-1.jpg"
    }
    onNewAlbum?.(newAlbum)
    router.push(`/dashboard/albums/${newId}`)
  }

  return (
    <aside 
      className={cn(
        "border-r border-border bg-background flex flex-col h-screen transition-all duration-300",
        collapsed ? "w-16" : "w-80"
      )}
    >
      <div className="p-4 border-b border-border">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-2">
        <Link
          href="/dashboard"
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
            !activeAlbumId ? "bg-secondary" : "hover:bg-secondary/50"
          )}
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Home</span>}
        </Link>
        
        <button 
          onClick={handleNewAlbum}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors mt-1"
        >
          <Plus className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>New album</span>}
        </button>
        
        <div className="mt-2 space-y-1">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/dashboard/albums/${album.id}`}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                activeAlbumId === album.id ? "bg-secondary" : "hover:bg-secondary/50"
              )}
            >
              <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                <Image
                  src={album.thumbnail || "/placeholder.svg"}
                  alt={album.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              {!collapsed && <span className="truncate text-sm">{album.name}</span>}
            </Link>
          ))}
        </div>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium flex-shrink-0">
            J
          </div>
          {!collapsed && (
            <div>
              <p className="font-medium text-sm">JP</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                Free <span className="text-green-500">||</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
