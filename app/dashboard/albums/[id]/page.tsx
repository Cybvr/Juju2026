"use client"

import { useParams } from "next/navigation"
import { Sidebar } from "@/app/common/sidebar"
import { Chat } from "@/app/common/chat"
import { AlbumContent } from "@/app/common/album-content"
import type { Album } from "@/app/common/types"

const mockAlbums: Album[] = [
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

// Mock images for each album
const mockAlbumImages: Record<string, { id: string; url: string }[]> = {
  "1": [
    { id: "1-1", url: "/images/boxer-1.jpg" },
    { id: "1-2", url: "/images/boxer-2.jpg" },
    { id: "1-3", url: "/images/boxer-3.jpg" },
    { id: "1-4", url: "/images/boxer-4.jpg" },
    { id: "1-5", url: "/images/boxer-1.jpg" },
  ],
  "2": [
    { id: "2-1", url: "/images/boxer-2.jpg" },
    { id: "2-2", url: "/images/boxer-4.jpg" },
  ],
  "3": [
    { id: "3-1", url: "/images/boxer-3.jpg" },
  ],
}

export default function AlbumPage() {
  const params = useParams()
  const albumId = params.id as string
  const currentAlbum = mockAlbums.find(a => a.id === albumId)
  const albumImages = mockAlbumImages[albumId] || []

  const albumName = currentAlbum?.name || `Album ${albumId}`

  return (
    <div className="flex h-screen bg-background">
      <Sidebar albums={mockAlbums} activeAlbumId={albumId} />
      <div className="w-[400px] lg:w-[500px] border-r border-border">
        <Chat />
      </div>
      <div className="flex-1">
        <AlbumContent 
          albumId={albumId} 
          albumName={albumName} 
          images={albumImages} 
        />
      </div>
    </div>
  )
}
