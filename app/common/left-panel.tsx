"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Film,
  MapPin,
  Music,
  Rows3,
  Type,
  UserRound,
  SplitSquareHorizontal,
  Send,
  History,
  Upload,
  Plus,
  Trash2,
  PanelLeftClose
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { auth, storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore"
import { useEffect } from "react"
import { ScenesTab } from "./tabs/scenes-tab"
import { CharactersTab } from "./tabs/characters-tab"
import { LocationsTab } from "./tabs/locations-tab"
import { AudioTab } from "./tabs/audio-tab"
import { CaptionsTab } from "./tabs/captions-tab"
import { EffectsTab } from "./tabs/effects-tab"
import { ThumbnailItem, ThumbnailStrip, AudioList } from "./tabs/shared"

interface AlbumImage {
  id: string
  url: string
  type?: "image" | "video"
  title?: string
  hasAudio?: boolean
  hasCaption?: boolean
  style?: string
}

const sceneStyles = [
  { name: "Pixar-style 3D", image: "/images/marketing/joyful.webp" },
  { name: "Anime", image: "/images/marketing/adventure.webp" },
  { name: "Claymation", image: "/images/marketing/wizard.webp" },
  { name: "Comic book", image: "/images/marketing/artist.webp" },
  { name: "Watercolor", image: "/images/marketing/cloud.webp" },
  { name: "Cinematic realistic", image: "/images/marketing/1.webp" },
]

const characterThumbnails = [
  { name: "Kid", image: "/images/dashboard/Characters/Albanian%20Boy.png" },
  { name: "Woman", image: "/images/dashboard/Characters/Nigerian%20Woman.png" },
  { name: "Man", image: "/images/dashboard/Characters/Chinese%20Man.png" },
  { name: "Elder", image: "/images/dashboard/Characters/Indian%20Elder.png" },
  { name: "Monster", image: "/images/dashboard/Characters/Purple%20Monster%20v5.png" },
  { name: "Robot", image: "/images/dashboard/Characters/White%20Robot.png" },
]

const locationThumbnails = [
  { name: "Modern office", image: "/images/dashboard/locations/Pixar%20Modern%20Office.png" },
  { name: "Classroom", image: "/images/dashboard/locations/Pixar%20Classroom.png" },
  { name: "Retail store", image: "/images/dashboard/locations/Pixar%20Retail%20Store.png" },
  { name: "Home", image: "/images/dashboard/locations/Pixar%20Home%20Interior.png" },
  { name: "Enchanted forest", image: "/images/dashboard/locations/Pixar%20Enchanted%20Forest.png" },
  { name: "City street", image: "/images/dashboard/locations/Pixar%20City%20Street.png" },
]

const audioStyles = [
  { name: "Cinematic", image: "/images/marketing/1.webp" },
  { name: "Lo-fi", image: "/images/marketing/cloud.webp" },
  { name: "Orchestral", image: "/images/marketing/adventure.webp" },
  { name: "Upbeat", image: "/images/marketing/joyful.webp" },
  { name: "Ambient", image: "/images/marketing/2.webp" },
  { name: "Playful", image: "/images/marketing/wizard.webp" },
]

const audioThumbnails = [
  { name: "Trailer score", image: "/images/marketing/adventure.webp" },
  { name: "Soft piano", image: "/images/marketing/cloud.webp" },
  { name: "Kids theme", image: "/images/marketing/joyful.webp" },
  { name: "Product beat", image: "/images/marketing/3.webp" },
]


interface LeftPanelProps {
  scenes: AlbumImage[]
  activeTab: string
  contentVisible?: boolean
  onTabChange: (tab: string) => void
  onGenerateScene: (prompt: string, style: string) => Promise<void>
  onGenerateCharacter: (prompt: string) => Promise<string | void>
  onGenerateLocation: (prompt: string) => Promise<string | void>
  onAddAudio: (track: string) => void
  onAddCaption: (text: string) => void
  onClose?: () => void
}

export function LeftPanel({
  activeTab,
  contentVisible = true,
  onTabChange,
  onGenerateScene,
  onGenerateCharacter,
  onGenerateLocation,
  onAddAudio,
  onAddCaption,
  onClose,
}: LeftPanelProps) {
  const handleGenerateCharacterInternal = async (prompt: string) => {
    const url = await onGenerateCharacter(prompt)
    if (url) {
      const newItem = { name: `Gen ${Date.now()}`, image: url }
      setCharacterHistory(prev => [newItem, ...prev])
      setSelectedCharacter(newItem.name)
      updateActiveSceneDraft({ character: newItem.name })
      saveHistoryItem('characters', newItem)
    }
  }

  const handleGenerateLocationInternal = async (prompt: string) => {
    const url = await onGenerateLocation(prompt)
    if (url) {
      const newItem = { name: `Gen ${Date.now()}`, image: url }
      setLocationHistory(prev => [newItem, ...prev])
      setSelectedLocation(newItem.name)
      updateActiveSceneDraft({ location: newItem.name })
      saveHistoryItem('locations', newItem)
    }
  }
  const characterInputRef = useRef<HTMLInputElement>(null)
  const locationInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const captionInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  
  // Library State (Loaded from Firestore)
  const [libraryStyles, setLibraryStyles] = useState<ThumbnailItem[]>(sceneStyles)
  const [libraryCharacters, setLibraryCharacters] = useState<ThumbnailItem[]>(characterThumbnails)
  const [libraryLocations, setLibraryLocations] = useState<ThumbnailItem[]>(locationThumbnails)
  const [libraryAudioStyles, setLibraryAudioStyles] = useState<ThumbnailItem[]>(audioStyles)
  const [libraryAudio, setLibraryAudio] = useState<ThumbnailItem[]>(audioThumbnails)

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const collections = [
          { name: 'library_styles', setter: setLibraryStyles, initial: sceneStyles },
          { name: 'library_characters', setter: setLibraryCharacters, initial: characterThumbnails },
          { name: 'library_locations', setter: setLibraryLocations, initial: locationThumbnails },
          { name: 'library_audio_styles', setter: setLibraryAudioStyles, initial: audioStyles },
          { name: 'library_audio', setter: setLibraryAudio, initial: audioThumbnails }
        ]

        for (const col of collections) {
          const q = query(collection(db, col.name), orderBy('name', 'asc'))
          const querySnapshot = await getDocs(q)
          if (!querySnapshot.empty) {
            const items = querySnapshot.docs.map(doc => doc.data() as ThumbnailItem)
            col.setter(items)
          } else {
            // Seed the collection if empty
            console.log(`Seeding collection ${col.name}...`)
            for (const item of col.initial) {
              await addDoc(collection(db, col.name), item)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching or seeding library:", error)
      }
    }

    fetchLibrary()
  }, [])

  const [selectedCharacter, setSelectedCharacter] = useState(libraryCharacters[0]?.name || "")
  const [selectedLocation, setSelectedLocation] = useState(libraryLocations[0]?.name || "")
  const [selectedAudioStyle, setSelectedAudioStyle] = useState(libraryAudioStyles[0]?.name || "")
  const [selectedAudio, setSelectedAudio] = useState(libraryAudio[0]?.name || "")
  const [characterHistory, setCharacterHistory] = useState<ThumbnailItem[]>([])
  const [locationHistory, setLocationHistory] = useState<ThumbnailItem[]>([])
  const [audioHistory, setAudioHistory] = useState<ThumbnailItem[]>([])
  const [sceneHistory, setSceneHistory] = useState<ThumbnailItem[]>([])

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser
      if (!user) return

      try {
        const types = ['characters', 'locations', 'audio', 'scenes']
        for (const type of types) {
          const q = query(
            collection(db, `users/${user.uid}/history_${type}`),
            orderBy('createdAt', 'desc')
          )
          const querySnapshot = await getDocs(q)
          const items = querySnapshot.docs.map(doc => doc.data() as ThumbnailItem)
          if (type === 'characters') setCharacterHistory(items)
          else if (type === 'locations') setLocationHistory(items)
          else if (type === 'audio') setAudioHistory(items)
          else if (type === 'scenes') setSceneHistory(items)
        }
      } catch (error) {
        console.error("Error fetching history:", error)
      }
    }

    fetchHistory()
  }, [])

  const saveHistoryItem = async (type: string, item: ThumbnailItem) => {
    const user = auth.currentUser
    if (!user) return

    try {
      await addDoc(collection(db, `users/${user.uid}/history_${type}`), {
        ...item,
        createdAt: serverTimestamp()
      })
    } catch (error) {
      console.error(`Error saving ${type} history:`, error)
    }
  }

  const handleGenerateSceneInternal = async (prompt: string, style: string) => {
    const url = await onGenerateScene(prompt, style)
    if (url) {
      const newItem = { name: `Gen ${Date.now()}`, image: url }
      setSceneHistory(prev => [newItem, ...prev])
      saveHistoryItem('scenes', newItem)
    }
  }
  const [thumbnailModal, setThumbnailModal] = useState<"styles" | "characters" | "locations" | "audio" | null>(null)
  const [modalMode, setModalMode] = useState<"picker" | "library">("library")

  const handleOpenModal = (kind: "styles" | "characters" | "locations" | "audio" | null, mode: "picker" | "library" = "library") => {
    setModalMode(mode)
    setThumbnailModal(kind)
  }
  const [sceneDrafts, setSceneDrafts] = useState<{
    id: string
    name: string
    style: string
    character: string
    location: string
    prompt: string
    audio: string
  }[]>([
    {
      id: "scene-1",
      name: "Scene 1",
      style: libraryStyles[0]?.name || "",
      character: libraryCharacters[0]?.name || "",
      location: libraryLocations[0]?.name || "",
      audio: libraryAudio[0]?.name || "",
      prompt: "Cinematic wide shot of two stylish characters in a vintage car driving through a palm-tree lined street in Miami. Pixar-style 3D animation, golden hour lighting, depth of field.",
    },
  ])
  const [activeDraftScene, setActiveDraftScene] = useState(0)
  const activeSceneDraft = sceneDrafts[activeDraftScene] ?? sceneDrafts[0]
  const updateSceneDraft = (sceneIndex: number, updates: Partial<SceneDraft>) => {
    setSceneDrafts((currentScenes) =>
      currentScenes.map((scene, index) =>
        index === sceneIndex ? { ...scene, ...updates } : scene
      )
    )
  }
  const setActiveCharacter = (name: string) => {
    setSelectedCharacter(name)
    updateActiveSceneDraft({ character: name })
  }
  const setActiveLocation = (name: string) => {
    setSelectedLocation(name)
    updateActiveSceneDraft({ location: name })
  }
  const updateActiveSceneDraft = (updates: Partial<SceneDraft>) => {
    updateSceneDraft(activeDraftScene, updates)
  }

  const thumbnailModalConfig = thumbnailModal === "styles"
    ? {
      title: "Styles",
      items: libraryStyles,
      history: sceneHistory,
      selectedName: activeSceneDraft.style,
      onSelect: (item: ThumbnailItem) => {
        updateActiveSceneDraft({ style: item.name })
        setSceneHistory(prev => {
          if (prev.find(i => i.name === item.name)) return prev
          saveHistoryItem('scenes', item)
          return [item, ...prev]
        })
      },
    }
    : thumbnailModal === "characters"
      ? {
        title: "Characters",
        items: libraryCharacters,
        history: characterHistory,
        selectedName: selectedCharacter,
        onSelect: (item: ThumbnailItem) => {
          setActiveCharacter(item.name)
          setCharacterHistory(prev => {
            if (prev.find(i => i.name === item.name)) return prev
            saveHistoryItem('characters', item)
            return [item, ...prev]
          })
        },
      }
      : thumbnailModal === "locations"
        ? {
          title: "Locations",
          items: libraryLocations,
          history: locationHistory,
          selectedName: selectedLocation,
          onSelect: (item: ThumbnailItem) => {
            setActiveLocation(item.name)
            setLocationHistory(prev => {
              if (prev.find(i => i.name === item.name)) return prev
              saveHistoryItem('locations', item)
              return [item, ...prev]
            })
          },
        }
        : thumbnailModal === "audio"
          ? {
            title: "Audio",
            items: libraryAudio,
            history: audioHistory,
            selectedName: selectedAudio,
            isAudio: true,
            onSelect: (item: ThumbnailItem) => {
              setSelectedAudio(item.name)
              setAudioHistory(prev => {
                if (prev.find(i => i.name === item.name)) return prev
                saveHistoryItem('audio', item)
                return [item, ...prev]
              })
            },
          }
          : null

  const openUploadForModal = () => {
    if (thumbnailModal === "characters") characterInputRef.current?.click()
    else if (thumbnailModal === "locations") locationInputRef.current?.click()
    else if (thumbnailModal === "audio") audioInputRef.current?.click()
  }

  const uploadFile = async (file: File, type: 'character' | 'location' | 'audio' | 'caption') => {
    if (!file) return

    const user = auth.currentUser
    if (!user) {
      toast.error("You must be logged in to upload media.")
      return
    }

    setIsUploading(true)
    const toastId = toast.loading(`Uploading ${type}...`)
    try {
      const fileRef = ref(storage, `users/${user.uid}/${Date.now()}_${file.name}`)
      await uploadBytes(fileRef, file)
      const url = await getDownloadURL(fileRef)

      toast.success(`Upload complete`, { id: toastId })

      if (type === 'audio') onAddAudio(file.name)
      else if (type === 'caption') onAddCaption(file.name)
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(`Upload failed`, { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'character' | 'location' | 'audio' | 'caption') => {
    const file = event.target.files?.[0]
    if (file) {
      await uploadFile(file, type)
    }
    event.target.value = ''
  }

  const handleVisualAssetDrop = async (
    event: React.DragEvent<HTMLDivElement>,
    type: 'character' | 'location'
  ) => {
    event.preventDefault()

    const file = event.dataTransfer.files?.[0]
    if (!file || isUploading) return

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Upload an image or video file.")
      return
    }

    await uploadFile(file, type)
  }

  const handleAddDraftScene = () => {
    const nextSceneIndex = sceneDrafts.length
    const sourceScene = sceneDrafts[activeDraftScene]
    setSceneDrafts([
      ...sceneDrafts,
      {
        ...sourceScene,
        id: `scene-${Date.now()}`,
        name: `Scene ${nextSceneIndex + 1}`,
      },
    ])
    setActiveDraftScene(nextSceneIndex)
  }

  const handleDeleteDraftScene = (sceneIndex: number) => {
    if (sceneDrafts.length <= 1) return

    const nextScenes = sceneDrafts
      .filter((_, index) => index !== sceneIndex)
      .map((scene, index) => ({
        ...scene,
        name: `Scene ${index + 1}`,
      }))
    let nextActiveScene = activeDraftScene

    if (activeDraftScene === sceneIndex) {
      nextActiveScene = Math.min(sceneIndex, nextScenes.length - 1)
    } else if (activeDraftScene > sceneIndex) {
      nextActiveScene = activeDraftScene - 1
    }

    setSceneDrafts(nextScenes)
    setActiveDraftScene(nextActiveScene)
  }

  return (
    <div className={cn(
      "flex h-full overflow-hidden rounded-2xl bg-card shadow-sm transition-[width] duration-300",
      contentVisible ? "w-[300px]" : "w-[64px]"
    )}>
      {/* Custom Vertical Navigation Sidebar */}
      <div className="w-[64px] shrink-0 bg-muted/5 flex flex-col py-4 items-center gap-2">
        <TooltipProvider delayDuration={250}>
          {[
            { id: 'scenes', icon: Film, label: 'Scenes' },
            { id: 'characters', icon: UserRound, label: 'Character' },
            { id: 'locations', icon: MapPin, label: 'Locations' },
            { id: 'audio', icon: Music, label: 'Audio' },
            { id: 'captions', icon: Type, label: 'Captions' },
            { id: 'transitions', icon: SplitSquareHorizontal, label: 'Effects' }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <Tooltip key={tab.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                      "group relative flex h-16 w-14 flex-col items-center justify-center rounded-xl transition-all duration-300",
                      isActive
                        ? "bg-card text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5 mb-1.5 transition-transform duration-300",
                      isActive ? "scale-110" : "group-hover:scale-110"
                    )} />
                    <span className={cn("text-[11px] font-medium tracking-tight leading-none", !isActive && "text-muted-foreground")}>
                      {tab.label}
                    </span>

                    {isActive && (
                      <div className="absolute -left-[1px] h-4 w-1 rounded-r-full bg-primary" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{tab.label}</TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
        <div className="flex-1" />
        {onClose && (
          <TooltipProvider delayDuration={250}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onClose}
                  className="flex h-16 w-16 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all mt-auto"
                >
                  <PanelLeftClose className={cn("h-4 w-4 transition-transform", !contentVisible && "rotate-180")} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{contentVisible ? "Hide panel" : "Show panel"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Main Content Area */}
      {contentVisible && (
        <div className="flex flex-1 flex-col min-w-0 bg-background/30">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2.5">
            {activeTab === 'scenes' && (
              <ScenesTab
                sceneDrafts={sceneDrafts}
                activeDraftScene={activeDraftScene}
                setActiveDraftScene={setActiveDraftScene}
                updateSceneDraft={updateSceneDraft}
                handleDeleteDraftScene={handleDeleteDraftScene}
                handleAddDraftScene={handleAddDraftScene}
                onTabChange={onTabChange}
                onGenerateScene={handleGenerateSceneInternal}
                setSelectedCharacter={setSelectedCharacter}
                setSelectedLocation={setSelectedLocation}
                sceneHistory={sceneHistory}
                characterThumbnails={libraryCharacters}
                locationThumbnails={libraryLocations}
                audioThumbnails={libraryAudio}
                sceneStyles={libraryStyles}
              />
            )}

            {activeTab === 'characters' && (
              <CharactersTab
                selectedCharacter={selectedCharacter}
                setActiveCharacter={setActiveCharacter}
                characterHistory={characterHistory}
                setCharacterHistory={setCharacterHistory}
                setThumbnailModal={handleOpenModal}
                characterThumbnails={libraryCharacters}
                onGenerate={handleGenerateCharacterInternal}
              />
            )}

            {activeTab === 'locations' && (
              <LocationsTab
                selectedLocation={selectedLocation}
                setActiveLocation={setActiveLocation}
                locationHistory={locationHistory}
                setLocationHistory={setLocationHistory}
                setThumbnailModal={handleOpenModal}
                locationThumbnails={libraryLocations}
                onGenerate={handleGenerateLocationInternal}
              />
            )}

            {activeTab === 'audio' && (
              <AudioTab
                selectedAudioStyle={selectedAudioStyle}
                setSelectedAudioStyle={setSelectedAudioStyle}
                selectedAudio={selectedAudio}
                setSelectedAudio={setSelectedAudio}
                audioHistory={audioHistory}
                setAudioHistory={setAudioHistory}
                setThumbnailModal={handleOpenModal}
                audioThumbnails={libraryAudio}
                audioStyles={libraryAudioStyles}
                audioInputRef={audioInputRef}
              />
            )}

            {activeTab === 'captions' && <CaptionsTab />}

            {activeTab === 'transitions' && <EffectsTab />}
          </div>
        </div>
      )}

      <input type="file" ref={characterInputRef} className="hidden" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, 'character')} disabled={isUploading} />
      <input type="file" ref={locationInputRef} className="hidden" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, 'location')} disabled={isUploading} />
      <input type="file" ref={audioInputRef} className="hidden" accept="audio/*" onChange={(e) => handleFileUpload(e, 'audio')} disabled={isUploading} />
      <input type="file" ref={captionInputRef} className="hidden" accept=".srt,.txt,.vtt" onChange={(e) => handleFileUpload(e, 'caption')} disabled={isUploading} />

      <Dialog open={thumbnailModal !== null} onOpenChange={(open) => !open && setThumbnailModal(null)}>
        <DialogContent className="max-w-4xl">
          {thumbnailModalConfig && (
            <>
              <DialogHeader>
                <DialogTitle>{thumbnailModalConfig.title}</DialogTitle>
              </DialogHeader>

              {modalMode === "picker" ? (
                thumbnailModalConfig.history && thumbnailModalConfig.history.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {(thumbnailModalConfig as any).isAudio ? (
                      <div className="col-span-full">
                        <AudioList
                          items={thumbnailModalConfig.history!}
                          selectedName={thumbnailModalConfig.selectedName}
                          onSelect={(name) => {
                            const item = thumbnailModalConfig.history?.find(i => i.name === name)
                            if (item) thumbnailModalConfig.onSelect(item)
                            setThumbnailModal(null)
                          }}
                        />
                      </div>
                    ) : (
                      thumbnailModalConfig.history.map((item, idx) => {
                        const isSelected = thumbnailModalConfig.selectedName === item.name
                        return (
                          <button
                            key={`${item.name}-${idx}`}
                            type="button"
                            title={item.name}
                            onClick={() => {
                              thumbnailModalConfig.onSelect(item)
                              setThumbnailModal(null)
                            }}
                            className={cn(
                              "relative aspect-square overflow-hidden rounded-xl border transition-all",
                              isSelected
                                ? "border-primary ring-2 ring-primary/30"
                                : "border-border/60 hover:border-primary/40"
                            )}
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </button>
                        )
                      })
                    )}
                  </div>
                ) : (
                  <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 bg-muted/10 text-muted-foreground">
                    <History className="mb-4 h-12 w-12 opacity-20" />
                    <div className="text-center">
                      <p className="text-sm font-semibold">No history items yet</p>
                      <p className="text-xs opacity-50">Select items from the Library to add them here.</p>
                    </div>
                  </div>
                )
              ) : (
                <Tabs defaultValue="library" className="gap-4">
                  <TabsList className="w-full">
                    <TabsTrigger value="library">Library</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                  </TabsList>
                  <TabsContent value="library">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {(thumbnailModalConfig as any).isAudio ? (
                        <div className="col-span-full">
                          <AudioList
                            items={thumbnailModalConfig.items}
                            selectedName={thumbnailModalConfig.selectedName}
                            onSelect={(name) => {
                              const item = thumbnailModalConfig.items.find(i => i.name === name)
                              if (item) thumbnailModalConfig.onSelect(item)
                              setThumbnailModal(null)
                            }}
                          />
                        </div>
                      ) : (
                        thumbnailModalConfig.items.map((item) => {
                          const isSelected = thumbnailModalConfig.selectedName === item.name
                          return (
                            <button
                              key={item.name}
                              type="button"
                              title={item.name}
                              onClick={() => {
                                thumbnailModalConfig.onSelect(item)
                                setThumbnailModal(null)
                              }}
                              className={cn(
                                "relative aspect-square overflow-hidden rounded-xl border transition-all",
                                isSelected
                                  ? "border-primary ring-2 ring-primary/30"
                                  : "border-border/60 hover:border-primary/40"
                              )}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </button>
                          )
                        })
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="upload">
                    <button
                      type="button"
                      onClick={openUploadForModal}
                      className="flex min-h-52 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60 bg-muted/10 text-muted-foreground transition-all hover:border-primary/40 hover:bg-muted/30 hover:text-foreground"
                    >
                      <Upload className="h-6 w-6" />
                      <span className="text-sm font-semibold">Upload</span>
                    </button>
                  </TabsContent>
                </Tabs>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
