"use client"

import { GeneratePanel } from "@/app/common/generate"
import { Gallery } from "@/app/common/gallery"
import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { albumService } from "@/lib/services/albumService"
import type { GalleryImage } from "@/app/common/types"

export default function DashboardPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
      if (auth.currentUser) {
        try {
          const userImages = await albumService.getUserImages(auth.currentUser.uid)
          setImages(userImages)
        } catch (error) {
          console.error("Error fetching images:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchImages()
  }, [])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Loading images...</p>
      </div>
    )
  }

  return (
    <>
      <GeneratePanel />
      <Gallery images={images} />
    </>
  )
}
