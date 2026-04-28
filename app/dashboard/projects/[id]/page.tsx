"use client"

import { useParams } from "next/navigation"
import { Chat } from "@/app/common/chat"
import { Studio } from "@/app/common/studio"
import type { Project, GalleryImage } from "@/app/common/types"
import { useEffect, useState } from "react"
import { projectService } from "@/lib/services/projectService"
import { db, auth } from "@/lib/firebase"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"
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

    const fetchProject = async () => {
      try {
        const data = await projectService.getProject(projectId)
        setProject(data)
      } catch (e) {
        console.error(e)
      } finally {
        setIsInitialLoading(false)
      }
    }
    fetchProject()

    // Real-time scenes listener
    if (!auth.currentUser) return

    const q = query(
      collection(db, "images"),
      where("projectId", "==", projectId),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectScenes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[]

      setScenes(projectScenes.map(img => ({
        id: img.id,
        url: img.url,
        title: img.title || "Untitled",
        imageCount: 1,
        timeAgo: "Recently"
      })))
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
