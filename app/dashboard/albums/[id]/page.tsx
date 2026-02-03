"use client"

import { useParams } from "next/navigation"
import { Chat } from "@/app/common/chat"
import { AlbumContent } from "@/app/common/album-content"
import type { Album, GalleryImage } from "@/app/common/types"
import { useEffect, useState } from "react"
import { albumService } from "@/lib/services/albumService"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function AlbumPage() {
  const params = useParams()
  const albumId = params.id as string
  const [album, setAlbum] = useState<Album | null>(null)
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    if (!albumId) return

    const fetchAlbum = async () => {
      try {
        const data = await albumService.getAlbum(albumId)
        setAlbum(data)
      } catch (e) {
        console.error(e)
      } finally {
        setIsInitialLoading(false)
      }
    }
    fetchAlbum()

    // Real-time images listener
    const q = query(
      collection(db, "images"),
      where("albumId", "==", albumId),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const albumImages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[]

      setImages(albumImages.map(img => ({
        id: img.id,
        url: img.url,
        title: img.title || "Untitled",
        imageCount: 1,
        timeAgo: "Recently"
      })))
    })

    return () => unsubscribe()
  }, [albumId])

  // Instead of blocking with full-screen loading, we show the UI shell
  // If album is not found but we are no longer loading, we can show a placeholder name
  const albumName = album?.name || (isInitialLoading ? "Loading album..." : "Untitled Album")

  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1">
      <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
        <Chat albumId={albumId} />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={70}>
        <AlbumContent
          albumId={albumId}
          albumName={albumName}
          images={images}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
