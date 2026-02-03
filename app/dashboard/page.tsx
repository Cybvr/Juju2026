"use client"

import { useState } from "react"
import { Sidebar } from "@/app/common/sidebar"
import { GeneratePanel } from "@/app/common/generate" // Fixed import for GeneratePanel
import { Gallery } from "@/app/common/gallery"
import type { Album, GalleryImage } from "@/app/common/types"

const initialAlbums: Album[] = [
  { id: "1", name: "Blonde Boxer Reimagined", thumbnail: "/images/boxer-1.jpg" },
  { id: "2", name: "Blonde Boxer", thumbnail: "/images/boxer-2.jpg" },
  { id: "3", name: "Ace Boxer", thumbnail: "/images/boxer-3.jpg" },
  { id: "4", name: "Boxing Gym Photoshoot", thumbnail: "/images/boxer-4.jpg" },
  { id: "5", name: "Golden Gloves", thumbnail: "/images/boxer-1.jpg" },
  { id: "6", name: "Lily's Boxing Journey", thumbnail: "/images/boxer-2.jpg" },
  { id: "7", name: "Boxing Outfit Change", thumbnail: "/images/boxer-3.jpg" },
  { id: "8", name: "Petr Yan", thumbnail: "/images/boxer-4.jpg" },
  { id: "9", name: "Boxer Standing Photorealist...", thumbnail: "/images/boxer-1.jpg" },
  { id: "10", name: "Similar Portrait", thumbnail: "/images/boxer-2.jpg" },
]

const mockImages: GalleryImage[] = [
  { id: "1", url: "/images/boxer-1.jpg", title: "Blonde Boxer Reimagined", imageCount: 6, timeAgo: "16 hours ago" },
  { id: "2", url: "/images/boxer-2.jpg", title: "Blonde Boxer", imageCount: 3, timeAgo: "16 hours ago" },
  { id: "3", url: "/images/boxer-3.jpg", title: "Ace Boxer", imageCount: 4, timeAgo: "1 day ago" },
  { id: "4", url: "/images/boxer-4.jpg", title: "Boxing Gym", imageCount: 8, timeAgo: "2 days ago" },
]

export default function DashboardPage() {
  const [albums, setAlbums] = useState<Album[]>(initialAlbums)

  const handleNewAlbum = (album: Album) => {
    setAlbums(prev => [album, ...prev])
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        albums={albums}
        activeAlbumId={null}
        onNewAlbum={handleNewAlbum}
      />
      <GeneratePanel />
      <Gallery images={mockImages} />
    </div>
  )
}
