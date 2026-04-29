"use client"

import { useParams } from "next/navigation"
import { Chat } from "@/app/common/chat"
import { Studio } from "@/app/common/studio"
import type { Project, GalleryImage } from "@/app/common/types"
import { useEffect, useState } from "react"
import { projectService } from "@/lib/services/projectService"
import { db, auth } from "@/lib/firebase"
import { collection, query, where, orderBy, onSnapshot, doc } from "firebase/firestore"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function ProjectPage() {
  const params = useParams()
  const projectId = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [scenes, setScenes] = useState<GalleryImage[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    if (!projectId) return

    const unsubscribe = onSnapshot(doc(db, "projects", projectId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Project & { scenes?: any[] }
        setProject(data)
        
        const projectScenes = data.scenes || []
        setScenes(projectScenes.map((img: any) => ({
          id: img.id,
          url: img.url,
          title: img.title || "Untitled",
          hasAudio: img.hasAudio || false,
          hasCaption: img.hasCaption || false,
          style: img.style
        })))
      }
      setIsInitialLoading(false)
    })

    return () => unsubscribe()
  }, [projectId])

  const projectName = project?.name || (isInitialLoading ? "Loading project..." : "Untitled Video")

  return (
    <Studio
      projectId={projectId}
      projectName={projectName}
      images={scenes}
    />
  )
}
