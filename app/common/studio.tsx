"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { projectService } from "@/lib/services/projectService"
import { Player } from "@/app/common/player"
import { Timeline } from "@/app/common/timeline"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  CreditCard,
  Download,
  Home,
  LogOut,
  Moon,
  Share2,
  Settings,
  Sun,
  Save,
  Plus,
  Copy,
  Trash2,
  ChevronDown,
  Cloud,
  Check,
  FileText,
  FileUser,
  PanelLeft,
  PanelRight,
  Globe,
  LayoutTemplate,
} from "lucide-react"
import { toast } from "sonner"
import { LeftPanel } from "@/app/common/left-panel"
import { RightPanel } from "@/app/common/right-panel"
import { auth, db, storage } from "@/lib/firebase"
import { doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { generateImage } from "@/lib/generate-image"

interface AlbumImage {
  id: string
  url: string
  type?: "image" | "video"
  title?: string
  hasAudio?: boolean
  hasCaption?: boolean
  style?: string
}

interface StudioProps {
  projectId: string
  projectName: string
  isPublic: boolean
  isJujuTemplate: boolean
  images: AlbumImage[]
}

export function Studio({ projectId, projectName, isPublic, isJujuTemplate, images }: StudioProps) {
  const [allScenes, setAllScenes] = useState<AlbumImage[]>(images)
  const [isPublicLocal, setIsPublicLocal] = useState(isPublic)
  const [isTemplateLocal, setIsTemplateLocal] = useState(isJujuTemplate)
  const scenes = allScenes
  const [aspectRatio, setAspectRatio] = useState<"landscape" | "portrait" | "square">("landscape")
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(35)
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [leftTab, setLeftTab] = useState<"scenes" | "characters" | "locations" | "captions" | "transitions" | "audio">("scenes")
  const [activeTool, setActiveTool] = useState<string>("select")

  const [leftPanelVisible, setLeftPanelVisible] = useState(true)
  const [rightPanelVisible, setRightPanelVisible] = useState(true)
  const [mobileLeftOpen, setMobileLeftOpen] = useState(false)
  const [mobileRightOpen, setMobileRightOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const dummySceneImage = "/images/boxer-1.jpg"
  const totalSeconds = 24
  const currentSeconds = Math.round((progress / 100) * totalSeconds)
  const remainingSeconds = Math.max(totalSeconds - currentSeconds, 0)

  useEffect(() => {
    setAllScenes(images)
    setIsPublicLocal(isPublic)
    setIsTemplateLocal(isJujuTemplate)
  }, [images, isPublic, isJujuTemplate])

  const togglePublic = async () => {
    if (!projectId) return
    const newValue = !isPublicLocal
    setIsPublicLocal(newValue)
    try {
      await updateDoc(doc(db, "projects", projectId), {
        isPublic: newValue,
        updatedAt: serverTimestamp()
      })
      toast.success(newValue ? "Project is now public" : "Project is now private")
    } catch (error) {
      setIsPublicLocal(!newValue)
      toast.error("Failed to update privacy settings")
    }
  }

  const toggleTemplate = async () => {
    if (!projectId) return
    const newValue = !isTemplateLocal
    setIsTemplateLocal(newValue)
    try {
      await updateDoc(doc(db, "projects", projectId), {
        isJujuTemplate: newValue,
        updatedAt: serverTimestamp()
      })
      toast.success(newValue ? "Marked as JujuTemplate" : "Removed from JujuTemplates")
    } catch (error) {
      setIsTemplateLocal(!newValue)
      toast.error("Failed to update template status")
    }
  }

  useEffect(() => {
    setMounted(true)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

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

  const handleCopyTemplate = async () => {
    if (!user) {
      toast.error("Please log in to copy this template")
      return
    }
    const toastId = toast.loading("Copying template to your account...")
    try {
      const newProjectId = await projectService.copyProject(user.uid, projectId)
      toast.success("Project copied successfully!", { id: toastId })
      router.push(`/dashboard/projects/${newProjectId}`)
    } catch (error) {
      console.error("Error copying template:", error)
      toast.error("Failed to copy template", { id: toastId })
    }
  }

  const currentScene = scenes[activeSceneIndex]
  const currentMediaUrl = currentScene?.url || ""
  const currentMediaType = currentScene?.type || "image"

  const getProjectThumbnail = (newScenes: AlbumImage[], sceneIndex = activeSceneIndex) =>
    newScenes[sceneIndex]?.url ?? newScenes[0]?.url ?? ""

  const prepareScenesForFirebase = (newScenes: AlbumImage[]) =>
    newScenes.map((scene) => ({
      id: scene.id,
      url: scene.url,
      type: scene.type || "image",
      ...(scene.title ? { title: scene.title } : {}),
      ...(scene.hasAudio !== undefined ? { hasAudio: scene.hasAudio } : {}),
      ...(scene.hasCaption !== undefined ? { hasCaption: scene.hasCaption } : {}),
      ...(scene.style ? { style: scene.style } : {}),
    }))

  const saveToFirebase = async (newScenes: AlbumImage[], thumbnailSceneIndex = activeSceneIndex) => {
    if (!projectId) return
    try {
      const projectRef = doc(db, "projects", projectId)
      await updateDoc(projectRef, {
        scenes: prepareScenesForFirebase(newScenes),
        thumbnail: getProjectThumbnail(newScenes, thumbnailSceneIndex),
        thumbnailType: newScenes[thumbnailSceneIndex]?.type || newScenes[0]?.type || "image",
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error saving to Firebase:", error)
    }
  }

  const handleDeleteScene = () => {
    if (scenes.length === 0) return;
    
    // Remove the active scene
    const newScenes = scenes.filter((_, idx) => idx !== activeSceneIndex);
    
    setAllScenes(newScenes);
    saveToFirebase(newScenes);
    
    // Adjust active index
    if (activeSceneIndex >= newScenes.length) {
      setActiveSceneIndex(Math.max(0, newScenes.length - 1));
    }
  };

  const handleGenerateScene = async (prompt: string, style: string): Promise<string | void> => {
    const toastId = toast.loading("Generating scene...")
    try {
      const imageUrl = await generateImage(`${prompt}. Style: ${style}`);
      
      // Upload to Firebase Storage
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `scene_${Date.now()}.webp`, { type: "image/webp" });
      
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      
      const fileRef = ref(storage, `users/${user.uid}/scenes/${file.name}`);
      await uploadBytes(fileRef, file);
      const permanentUrl = await getDownloadURL(fileRef);

      const nextIndex = allScenes.length;
      const nextScene: AlbumImage = {
        id: `scene-${Date.now()}`,
        url: permanentUrl,
        type: "image",
        title: `${style} ${nextIndex + 1}.jpg`,
        hasAudio: false,
        hasCaption: false,
        style,
      };
      
      const nextScenes = [...allScenes, nextScene];
      setAllScenes(nextScenes);
      saveToFirebase(nextScenes, nextIndex);
      handleSceneSelect(nextIndex);
      toast.success("Scene generated!", { id: toastId });
      return permanentUrl;
    } catch (error: any) {
      console.error("Scene generation error:", error);
      toast.error(error.message || "Failed to generate scene", { id: toastId });
    }
  }

  const handleGenerateCharacter = async (prompt: string) => {
    const toastId = toast.loading("Generating character...")
    try {
      const imageUrl = await generateImage(prompt);
      
      // Upload to Firebase Storage
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `character_${Date.now()}.webp`, { type: "image/webp" });
      
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      
      const fileRef = ref(storage, `users/${user.uid}/characters/${file.name}`);
      await uploadBytes(fileRef, file);
      const permanentUrl = await getDownloadURL(fileRef);

      // In a real app, we'd add this to a characters collection.
      // For now, we'll just show it in toast or update a local state if we had one for custom characters.
      toast.success("Character generated and saved to library!", { id: toastId });
      
      // We should probably return the URL or update the history in LeftPanel.
      // Since Studio doesn't manage character history directly (it's in LeftPanel),
      // we might need to pass this back.
      return permanentUrl;
    } catch (error: any) {
      console.error("Character generation error:", error);
      toast.error(error.message || "Failed to generate character", { id: toastId });
    }
  }

  const handleGenerateLocation = async (prompt: string) => {
    const toastId = toast.loading("Generating location...")
    try {
      const imageUrl = await generateImage(prompt);
      
      // Upload to Firebase Storage
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `location_${Date.now()}.webp`, { type: "image/webp" });
      
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      
      const fileRef = ref(storage, `users/${user.uid}/locations/${file.name}`);
      await uploadBytes(fileRef, file);
      const permanentUrl = await getDownloadURL(fileRef);

      toast.success("Location generated and saved to library!", { id: toastId });
      return permanentUrl;
    } catch (error: any) {
      console.error("Location generation error:", error);
      toast.error(error.message || "Failed to generate location", { id: toastId });
    }
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

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success("Logged out successfully")
      router.push("/auth/login")
    } catch (error) {
      toast.error("Error logging out")
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background font-sans text-foreground">
      <div className="relative z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-3 dark sm:px-5">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <TooltipProvider delayDuration={250}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard" className="flex items-center pr-1 sm:pr-2">
                  <Image src="/images/juju.png" alt="Juju" width={28} height={28} className="h-7 w-7 object-contain" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">Dashboard</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" aria-label="File menu" className="h-9 w-9 gap-1 rounded-lg px-0 text-sm font-medium text-muted-foreground hover:bg-secondary sm:w-auto sm:px-2">
                <FileText className="h-4 w-4 sm:hidden" />
                <span className="hidden sm:inline">File</span>
                <ChevronDown className="hidden h-3 w-3 opacity-50 sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => router.push("/dashboard")} className="gap-2 text-sm font-medium">
                <Home className="h-4 w-4" />
                Back home
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => saveToFirebase(allScenes)} className="gap-2 text-sm font-medium">
                <Save className="h-4 w-4" />
                Save
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-sm font-medium">
                <Plus className="h-4 w-4" />
                New Project
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-sm font-medium">
                <Copy className="h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-sm font-medium text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4" />
                Move to Trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex min-w-0 items-center gap-2">
            <h1 className="max-w-20 truncate text-sm font-medium tracking-tight text-white sm:max-w-64">{projectName}</h1>
            
            <div className="flex items-center gap-1.5 ml-2 border-l border-border/50 pl-3">
              <TooltipProvider delayDuration={250}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={togglePublic}
                      className={cn(
                        "h-8 w-8 rounded-lg transition-all duration-300",
                        isPublicLocal ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      <Globe className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{isPublicLocal ? "Public" : "Private"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={250}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTemplate}
                      className={cn(
                        "h-8 w-8 rounded-lg transition-all duration-300",
                        isTemplateLocal ? "text-amber-500 bg-amber-500/10" : "text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      <LayoutTemplate className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{isTemplateLocal ? "JujuTemplate" : "Mark as Template"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {isJujuTemplate && (
              <Button
                onClick={handleCopyTemplate}
                className="h-8 gap-2 bg-primary text-primary-foreground font-black px-4 rounded-lg shadow-lg hover:bg-primary/90 transition-all text-xs ml-2"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy Template
              </Button>
            )}

            <TooltipProvider delayDuration={250}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="hidden h-6 w-6 items-center justify-center rounded-full bg-white/5 text-muted-foreground sm:flex ml-1">
                    <div className="relative">
                      <Cloud className="h-3 w-3" />
                      <Check className="absolute -bottom-0.5 -right-0.5 h-2 w-2 text-primary" />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">Saved</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <TooltipProvider delayDuration={250}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setRightPanelVisible((visible) => !visible)}
                  aria-label="Toggle inspector"
                  className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-secondary"
                >
                  <FileUser className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">{rightPanelVisible ? "Hide inspector" : "Show inspector"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="ghost" aria-label="Share" className="h-9 w-9 gap-1.5 rounded-lg px-0 text-sm font-medium text-muted-foreground hover:bg-secondary sm:w-auto sm:px-3">
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button aria-label="Export" className="h-9 w-9 gap-1.5 rounded-lg px-0 text-sm font-medium sm:w-auto sm:px-4">
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 overflow-hidden rounded-lg border border-border/50 p-0 text-muted-foreground hover:bg-secondary"
                >
                  {user?.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium">
                      {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 rounded-2xl border-border/50 bg-background/90 p-2 backdrop-blur-xl" side="bottom" align="end" sideOffset={8}>
                <DropdownMenuLabel className="px-3 py-2 text-xs font-medium text-muted-foreground">Account settings</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuGroup className="p-1">
                  <DropdownMenuItem onClick={() => router.push("/dashboard/account")} className="cursor-pointer rounded-xl p-2.5">
                    <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Workspace Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Billing is not yet implemented.")} className="cursor-pointer rounded-xl p-2.5">
                    <CreditCard className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Billing & Plans</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer rounded-xl p-2.5">
                  {theme === "light" ? (
                    <>
                      <Moon className="mr-3 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="mr-3 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Light Mode</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer rounded-xl p-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="font-medium">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Mobile Left Drawer */}
      {mobileLeftOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileLeftOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[85vw] bg-card border-r border-border flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm font-bold">Scenes</span>
              <Button variant="ghost" size="icon" onClick={() => setMobileLeftOpen(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <LeftPanel
                scenes={scenes}
                activeTab={leftTab}
                contentVisible={true}
                onTabChange={(tab) => { handleLeftTabChange(tab); }}
                onGenerateScene={handleGenerateScene}
                onGenerateCharacter={handleGenerateCharacter}
                onGenerateLocation={handleGenerateLocation}
                onAddAudio={handleAddAudio}
                onAddCaption={handleAddCaption}
                onClose={() => setMobileLeftOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Right Drawer */}
      {mobileRightOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileRightOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[85vw] bg-card border-l border-border flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm font-bold">Inspector</span>
              <Button variant="ghost" size="icon" onClick={() => setMobileRightOpen(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <RightPanel
                projectName={projectName}
                aspectRatio={aspectRatio}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-0 flex-1 overflow-hidden p-2 gap-2">
        {/* Mobile floating panel triggers */}
        <div className="md:hidden fixed top-20 left-3 z-20 flex flex-col gap-2">
          <button
            onClick={() => setMobileLeftOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border shadow-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Scenes"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        </div>
        <div className="md:hidden fixed top-20 right-3 z-20 flex flex-col gap-2">
          <button
            onClick={() => setMobileRightOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border shadow-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Inspector"
          >
            <PanelRight className="h-4 w-4" />
          </button>
        </div>
        <div className="hidden md:flex shrink-0">
          <LeftPanel
            scenes={scenes}
            activeTab={leftTab}
            contentVisible={leftPanelVisible}
            onTabChange={handleLeftTabChange}
            onGenerateScene={handleGenerateScene}
            onGenerateCharacter={handleGenerateCharacter}
            onGenerateLocation={handleGenerateLocation}
            onAddAudio={handleAddAudio}
            onAddCaption={handleAddCaption}
            onClose={() => setLeftPanelVisible((visible) => !visible)}
          />
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-muted/30 group">
          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden group">
            <Player
              mediaUrl={currentMediaUrl}
              mediaType={currentMediaType}
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
            onDelete={handleDeleteScene}
          />
        </div>

        {rightPanelVisible && (
          <div className="hidden md:flex shrink-0 animate-in slide-in-from-right duration-300">
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
