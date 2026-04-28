"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Player } from "@/app/common/player"
import { Timeline } from "@/app/common/timeline"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  Download,
  Share2,
  Plus,
  Copy,
  Trash2,
  ChevronDown,
  Cloud,
  Check,
  PanelRightClose,
} from "lucide-react"
import { toast } from "sonner"
import { LeftPanel } from "@/app/common/left-panel"
import { RightPanel } from "@/app/common/right-panel"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { cn } from "@/lib/utils"

interface AlbumImage {
  id: string
  url: string
  title?: string
  hasAudio?: boolean
  hasCaption?: boolean
}

interface StudioProps {
  projectId: string
  projectName: string
  images: AlbumImage[]
}

export function Studio({ projectId, projectName, images }: StudioProps) {
  const [allScenes, setAllScenes] = useState<AlbumImage[]>(images)
  const scenes = allScenes
  const [aspectRatio, setAspectRatio] = useState<"landscape" | "portrait" | "square">("landscape")
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(35)
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [leftTab, setLeftTab] = useState<"scenes" | "captions" | "transitions" | "audio">("scenes")
  const [activeTool, setActiveTool] = useState<string>("select")

  const [leftPanelVisible, setLeftPanelVisible] = useState(true)
  const [rightPanelVisible, setRightPanelVisible] = useState(true)

  const dummySceneImage = "/images/boxer-1.jpg"
  const totalSeconds = 24
  const currentSeconds = Math.round((progress / 100) * totalSeconds)
  const remainingSeconds = Math.max(totalSeconds - currentSeconds, 0)

  useEffect(() => {
    setAllScenes(images)
  }, [images])

  useEffect(() => {
    if (scenes.length > 0) {
      const calculatedIndex = Math.min(
        Math.floor((progress / 100) * scenes.length),
        scenes.length - 1
      )
      if (calculatedIndex !== activeSceneIndex) {
        setActiveSceneIndex(calculatedIndex)
      }
    }
  }, [progress, scenes.length, activeSceneIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.code === "Space") {
        e.preventDefault()
        setIsPlaying((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (!isPlaying) return

    const playbackTimer = window.setInterval(() => {
      setProgress((currentProgress) => {
        // Precise increment to match 24s duration over 32ms steps
        const nextProgress = currentProgress + (100 / (24000 / 32))

        if (nextProgress >= 100) {
          window.clearInterval(playbackTimer)
          setIsPlaying(false)
          return 100
        }

        return nextProgress
      })
    }, 32)

    return () => window.clearInterval(playbackTimer)
  }, [isPlaying])

  const currentImage = scenes[activeSceneIndex]?.url || ""

  const saveToFirebase = async (newScenes: AlbumImage[]) => {
    if (!projectId) return
    try {
      const projectRef = doc(db, "projects", projectId)
      await updateDoc(projectRef, { scenes: newScenes })
    } catch (error) {
      console.error("Error saving to Firebase:", error)
    }
  }

  const handleGenerateDummyScene = () => {
    const nextIndex = allScenes.length
    const nextScene: AlbumImage = {
      id: `dummy-scene-${Date.now()}`,
      url: dummySceneImage,
      title: `Generated ${nextIndex + 1}.jpg`,
      hasAudio: false,
      hasCaption: false,
    }
    const nextScenes = [...allScenes, nextScene]
    setAllScenes(nextScenes)
    saveToFirebase(nextScenes)
    handleSceneSelect(nextIndex)
  }

  const handleAddScene = (imageUrl: string) => {
    const nextIndex = allScenes.length
    const nextScene: AlbumImage = {
      id: `gen-scene-${Date.now()}`,
      url: imageUrl,
      title: `Generated Scene.jpg`,
      hasAudio: false,
      hasCaption: false,
    }
    const nextScenes = [...allScenes, nextScene]
    setAllScenes(nextScenes)
    saveToFirebase(nextScenes)
    handleSceneSelect(nextIndex)
  }

  const handleSceneSelect = (index: number) => {
    setActiveSceneIndex(index)
    // Update progress to the start of the selected scene
    if (allScenes.length > 0) {
      setProgress((index / allScenes.length) * 100)
    }
  }

  const handleLeftTabChange = (tab: string) => {
    if (tab === leftTab) {
      setLeftPanelVisible((visible) => !visible)
      return
    }

    setLeftTab(tab as typeof leftTab)
    setLeftPanelVisible(true)
  }

  const handleAddAudio = (trackName: string) => {
    const nextScenes = allScenes.map((scene, i) =>
      i === activeSceneIndex ? { ...scene, hasAudio: true } : scene
    )
    setAllScenes(nextScenes)
    saveToFirebase(nextScenes)
    toast.success(`Track added to Scene ${activeSceneIndex + 1}`)
  }

  const handleAddCaption = (text: string) => {
    const nextScenes = allScenes.map((scene, i) =>
      i === activeSceneIndex ? { ...scene, hasCaption: true } : scene
    )
    setAllScenes(nextScenes)
    saveToFirebase(nextScenes)
    toast.success(`Caption added to Scene ${activeSceneIndex + 1}`)
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background font-sans text-foreground">
      <div className="relative z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-5 dark">
        <div className="flex items-center gap-2">
          <div className="flex items-center pr-2">
            <Image src="/images/juju.png" alt="Juju" width={28} height={28} className="h-7 w-7 object-contain" />
          </div>

          <Link href="/dashboard" className="group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors group-hover:bg-primary">
              <Home className="h-4 w-4" />
            </div>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-1 rounded-lg px-2 text-xs font-bold text-white hover:bg-white/10">
                File
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem className="gap-2 font-bold">
                <Plus className="h-4 w-4" />
                New Project
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 font-bold">
                <Copy className="h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 font-bold text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4" />
                Move to Trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-2">
            <h1 className="text-sm font-medium tracking-tight text-white">{projectName}</h1>
            <div className="flex items-center justify-center rounded-full bg-white/5 w-6 h-6 text-white/50">
              <div className="relative">
                <Cloud className="h-3 w-3" />
                <Check className="absolute -bottom-0.5 -right-0.5 h-2 w-2 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setRightPanelVisible((visible) => !visible)}
            aria-label="Toggle inspector"
            className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-secondary"
          >
            <PanelRightClose className={cn("h-4 w-4 transition-transform", !rightPanelVisible && "rotate-180")} />
          </Button>
          <Button variant="ghost" className="h-9 gap-1.5 rounded-lg px-3 text-xs font-bold text-muted-foreground hover:bg-secondary">
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
          <Button className="h-9 gap-1.5 rounded-lg px-4 text-xs font-bold">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden p-2 gap-2">
        <div className="flex shrink-0">
          <LeftPanel
            scenes={scenes}
            activeTab={leftTab}
            contentVisible={leftPanelVisible}
            onTabChange={handleLeftTabChange}
            onGenerateScene={handleGenerateDummyScene}
            onAddScene={handleAddScene}
            onAddAudio={handleAddAudio}
            onAddCaption={handleAddCaption}
            onClose={() => setLeftPanelVisible((visible) => !visible)}
          />
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-muted/30 group">
          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden group">
            <Player
              imageUrl={currentImage}
              aspectRatio={aspectRatio}
              isPlaying={isPlaying}
              activeTool={activeTool}
              onAspectRatioChange={setAspectRatio}
              onPlayingChange={setIsPlaying}
              currentTime={`0:${String(currentSeconds).padStart(2, "0")}`}
              totalTime={`0:${totalSeconds}`}
              remainingTime={`-0:${String(remainingSeconds).padStart(2, "0")}`}
            />
          </div>

          <Timeline
            scenes={scenes}
            activeSceneIndex={activeSceneIndex}
            progress={progress}
            activeTool={activeTool}
            onToolSelect={setActiveTool}
            onSceneSelect={handleSceneSelect}
            onProgressChange={setProgress}
          />
        </div>

        {rightPanelVisible && (
          <div className="flex shrink-0 animate-in slide-in-from-right duration-300">
            <RightPanel
              projectName={projectName}
              aspectRatio={aspectRatio}
            />
          </div>
        )}
      </div>
    </div>
  )
}
