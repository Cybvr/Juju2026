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

interface ThumbnailItem {
  name: string
  image: string
}

interface ThumbnailStripProps {
  items: ThumbnailItem[]
  selectedName: string
  onSelect: (name: string) => void
  onMore: () => void
  showLabels?: boolean
}

type ThumbnailModalKind = "styles" | "characters" | "locations" | "audio"

interface SceneDraft {
  id: string
  name: string
  style: string
  character: string
  location: string
  prompt: string
}

const defaultScenePrompt = "Cinematic wide shot of two stylish characters in a vintage car driving through a palm-tree lined street in Miami. Pixar-style 3D animation, golden hour lighting, depth of field."

function ThumbnailStrip({
  items,
  selectedName,
  onSelect,
  onMore,
  showLabels = false,
}: ThumbnailStripProps) {
  return (
    <div className="overflow-x-auto custom-scrollbar pb-1">
      <div className="flex gap-1">
        {items.map((item) => {
          const isSelected = selectedName === item.name
          return (
            <button
              key={item.name}
              type="button"
              title={item.name}
              onClick={() => onSelect(item.name)}
              className={cn(
                "group shrink-0 transition-all",
                showLabels ? "w-16" : "w-14",
                isSelected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className={cn(
                "relative block h-14 w-14 overflow-hidden rounded-xl border transition-all",
                isSelected
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border/60 group-hover:border-primary/40"
              )}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </span>
              {showLabels && (
                <span className="mt-1 block w-14 truncate text-center text-[10px] font-medium leading-tight">
                  {item.name}
                </span>
              )}
            </button>
          )
        })}
        <button
          type="button"
          title="More"
          onClick={onMore}
          className={cn(
            "shrink-0 text-muted-foreground transition-all hover:text-foreground",
            showLabels ? "w-16" : "h-14 w-14"
          )}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 transition-all hover:border-primary/40 hover:bg-muted/40">
            <Plus className="h-5 w-5" />
          </span>
          {showLabels && (
            <span className="mt-1 block w-14 text-center text-[10px] font-medium leading-tight">
              More
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

interface SelectedThumbnailProps {
  item: ThumbnailItem
  icon: React.ElementType
  onClick: () => void
}

function SelectedThumbnail({
  item,
  icon: Icon,
  onClick,
}: SelectedThumbnailProps) {
  return (
    <button
      type="button"
      title={item.name}
      onClick={onClick}
      className="group flex min-w-0 items-center gap-2 rounded-xl border border-border/60 bg-muted/20 p-1.5 transition-all hover:border-primary/40 hover:bg-muted/40"
    >
      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </span>
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
    </button>
  )
}

function EmptyHistory({ label, items = [] }: { label: string; items?: ThumbnailItem[] }) {
  return (
    <div className="space-y-3 pt-6 border-t border-border/50">
      <div className="flex items-center gap-2 px-1">
        <History className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-[11px] font-medium tracking-wide text-muted-foreground">History</span>
      </div>
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item, index) => (
            <button
              key={`${item.name}-${index}`}
              type="button"
              title={item.name}
              className="group w-full overflow-hidden rounded-xl border border-border/60 bg-muted/20 transition-all hover:border-primary/40"
            >
              <img
                src={item.image}
                alt={item.name}
                className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-muted-foreground/50 italic text-center py-6 bg-muted/20 rounded-2xl border border-dashed border-border/50">
          No {label} yet
        </p>
      )}
    </div>
  )
}

interface GenerateReference {
  item: ThumbnailItem
  icon?: React.ElementType
  onClick?: () => void
}

interface GenerateBoxProps {
  value?: string
  defaultValue?: string
  placeholder: string
  references?: GenerateReference[]
  addOptions?: ThumbnailItem[]
  selectedAddOption?: string
  onSelectAddOption?: (name: string) => void
  onChange?: (value: string) => void
  onCreate: () => void
  onAdd?: () => void
}

function GenerateBox({
  value,
  defaultValue,
  placeholder,
  references = [],
  addOptions = [],
  selectedAddOption,
  onSelectAddOption,
  onChange,
  onCreate,
  onAdd,
}: GenerateBoxProps) {
  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-3 focus-within:ring-2 focus-within:ring-primary/20">
      <textarea
        className="min-h-[140px] w-full resize-none border-0 bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={(event) => onChange?.(event.target.value)}
      />

      {references.length > 0 && (
        <div className="mt-2 space-y-2">
          {references.map((reference) => {
            const Icon = reference.icon
            return (
              <button
                key={reference.item.name}
                type="button"
                title={reference.item.name}
                onClick={reference.onClick}
                className="flex w-full items-center gap-3 rounded-xl bg-background/60 px-2 py-1.5 text-left transition-colors hover:bg-background"
              >
                <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={reference.item.image}
                    alt={reference.item.name}
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="min-w-0 flex-1 truncate text-xs font-semibold text-foreground">
                  {reference.item.name}
                </span>
                {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
              </button>
            )
          })}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        {addOptions.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/60 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                aria-label="Add"
              >
                <Plus className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-56 rounded-xl p-1.5">
              {addOptions.map((item) => {
                const isSelected = selectedAddOption === item.name
                return (
                  <DropdownMenuItem
                    key={item.name}
                    onSelect={() => onSelectAddOption?.(item.name)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5",
                      isSelected
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span className="h-9 w-9 shrink-0 overflow-hidden rounded-md">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="min-w-0 truncate text-xs font-semibold">
                      {item.name}
                    </span>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/60 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            aria-label="Add"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
        <Button
          size="icon"
          onClick={onCreate}
          aria-label="Create"
          className="h-10 w-10 shrink-0 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

interface LeftPanelProps {
  scenes: AlbumImage[]
  activeTab: string
  contentVisible?: boolean
  onTabChange: (tab: string) => void
  onGenerateScene: (style: string) => void
  onAddAudio: (track: string) => void
  onAddCaption: (text: string) => void
  onClose?: () => void
}

export function LeftPanel({
  activeTab,
  contentVisible = true,
  onTabChange,
  onGenerateScene,
  onAddAudio,
  onAddCaption,
  onClose,
}: LeftPanelProps) {
  const characterInputRef = useRef<HTMLInputElement>(null)
  const locationInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const captionInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState(characterThumbnails[0].name)
  const [selectedLocation, setSelectedLocation] = useState(locationThumbnails[0].name)
  const [selectedAudioStyle, setSelectedAudioStyle] = useState(audioStyles[0].name)
  const [selectedAudio, setSelectedAudio] = useState(audioThumbnails[0].name)
  const [characterHistory, setCharacterHistory] = useState<ThumbnailItem[]>([])
  const [locationHistory, setLocationHistory] = useState<ThumbnailItem[]>([])
  const [audioHistory, setAudioHistory] = useState<ThumbnailItem[]>([])
  const [thumbnailModal, setThumbnailModal] = useState<ThumbnailModalKind | null>(null)
  const [sceneDrafts, setSceneDrafts] = useState<SceneDraft[]>([
    {
      id: "scene-1",
      name: "Scene 1",
      style: sceneStyles[0].name,
      character: characterThumbnails[0].name,
      location: locationThumbnails[0].name,
      prompt: defaultScenePrompt,
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
  const addUniqueHistoryItem = (
    item: ThumbnailItem,
    setHistory: React.Dispatch<React.SetStateAction<ThumbnailItem[]>>
  ) => {
    setHistory((currentItems) => {
      const nextItems = [item, ...currentItems.filter((currentItem) => currentItem.name !== item.name)]
      return nextItems.slice(0, 12)
    })
  }
  const updateActiveSceneDraft = (updates: Partial<SceneDraft>) => {
    updateSceneDraft(activeDraftScene, updates)
  }

  const thumbnailModalConfig = thumbnailModal === "styles"
    ? {
        title: "Styles",
        items: sceneStyles,
        selectedName: activeSceneDraft.style,
        onSelect: (name: string) => updateActiveSceneDraft({ style: name }),
      }
    : thumbnailModal === "characters"
      ? {
          title: "Characters",
          items: characterThumbnails,
          selectedName: selectedCharacter,
          onSelect: setActiveCharacter,
        }
      : thumbnailModal === "locations"
        ? {
            title: "Locations",
            items: locationThumbnails,
            selectedName: selectedLocation,
            onSelect: setActiveLocation,
          }
        : thumbnailModal === "audio"
          ? {
              title: "Audio",
              items: audioThumbnails,
              selectedName: selectedAudio,
              onSelect: setSelectedAudio,
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
              <div className="space-y-6">
                {sceneDrafts.map((scene, sceneIndex) => {
                  const sceneStyleItem =
                    sceneStyles.find((item) => item.name === scene.style) ?? sceneStyles[0]
                  const sceneCharacterItem =
                    characterThumbnails.find((item) => item.name === scene.character) ?? characterThumbnails[0]
                  const sceneLocationItem =
                    locationThumbnails.find((item) => item.name === scene.location) ?? locationThumbnails[0]

                  return (
                    <div
                      key={scene.id}
                      className="space-y-3"
                      onFocusCapture={() => setActiveDraftScene(sceneIndex)}
                    >
                      <div className="flex items-center justify-between gap-2 px-1">
                        <span className="text-xs font-semibold text-foreground">
                          {scene.name}
                        </span>
                        {sceneDrafts.length > 1 && (
                          <TooltipProvider delayDuration={250}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteDraftScene(sceneIndex)}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                  aria-label={`Delete ${scene.name}`}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">Delete scene</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>

                      <GenerateBox
                        placeholder={`Describe ${scene.name.toLowerCase()}...`}
                        value={scene.prompt}
                        onChange={(value) => updateSceneDraft(sceneIndex, { prompt: value })}
                        references={[
                          {
                            item: sceneStyleItem,
                            icon: Film,
                          },
                          {
                            item: sceneCharacterItem,
                            icon: UserRound,
                            onClick: () => {
                              setActiveDraftScene(sceneIndex)
                              setSelectedCharacter(scene.character)
                              onTabChange("characters")
                            },
                          },
                          {
                            item: sceneLocationItem,
                            icon: MapPin,
                            onClick: () => {
                              setActiveDraftScene(sceneIndex)
                              setSelectedLocation(scene.location)
                              onTabChange("locations")
                            },
                          },
                        ]}
                        onAdd={() => {
                          setActiveDraftScene(sceneIndex)
                          toast.info(`${scene.name} added to timeline.`)
                        }}
                        addOptions={sceneStyles}
                        selectedAddOption={scene.style}
                        onSelectAddOption={(name) => {
                          setActiveDraftScene(sceneIndex)
                          updateSceneDraft(sceneIndex, { style: name })
                        }}
                        onCreate={() => {
                          setActiveDraftScene(sceneIndex)
                          onGenerateScene(scene.style)
                        }}
                      />
                    </div>
                  )
                })}

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleAddDraftScene}
                    className="flex min-h-20 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/60 bg-muted/10 text-muted-foreground transition-all hover:border-primary/40 hover:bg-muted/30 hover:text-foreground"
                  >
                    <Plus className="h-5 w-5" />
                    <span className="text-xs font-semibold">
                      Add Scene
                    </span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'characters' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <GenerateBox
                    placeholder="Describe the character..."
                    defaultValue="A warm, quick-witted protagonist in their late twenties with expressive eyes, short textured hair, a vintage bomber jacket, and a calm confidence. Keep the same face, outfit palette, and proportions across every scene."
                    references={[
                      {
                        item: characterThumbnails.find((item) => item.name === selectedCharacter) ?? characterThumbnails[0],
                        icon: UserRound,
                      },
                    ]}
                    addOptions={characterThumbnails}
                    selectedAddOption={selectedCharacter}
                    onSelectAddOption={setActiveCharacter}
                    onCreate={() => toast.info("Character generation is not yet implemented.")}
                  />
                </div>

                <div className="space-y-3 pt-6 border-t border-border/50">
                  <span className="block px-1 text-[11px] font-medium tracking-wide text-muted-foreground">Library</span>
                  <ThumbnailStrip
                    items={characterThumbnails}
                    selectedName={selectedCharacter}
                    onSelect={(name) => {
                      const item = characterThumbnails.find((thumbnail) => thumbnail.name === name)
                      if (item) addUniqueHistoryItem(item, setCharacterHistory)
                    }}
                    onMore={() => setThumbnailModal("characters")}
                  />
                </div>

                <EmptyHistory label="characters" items={characterHistory} />
              </div>
            )}

            {activeTab === 'locations' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <GenerateBox
                    placeholder="Describe the location..."
                    defaultValue="A sunlit coastal market street with pastel storefronts, hanging plants, weathered tile, and a view of blue water between buildings. Preserve the same architecture, color palette, and geography across shots."
                    references={[
                      {
                        item: locationThumbnails.find((item) => item.name === selectedLocation) ?? locationThumbnails[0],
                        icon: MapPin,
                      },
                    ]}
                    addOptions={locationThumbnails}
                    selectedAddOption={selectedLocation}
                    onSelectAddOption={setActiveLocation}
                    onCreate={() => toast.info("Location generation is not yet implemented.")}
                  />
                </div>

                <div className="space-y-3 pt-6 border-t border-border/50">
                  <span className="block px-1 text-[11px] font-medium tracking-wide text-muted-foreground">Library</span>
                  <ThumbnailStrip
                    items={locationThumbnails}
                    selectedName={selectedLocation}
                    onSelect={(name) => {
                      const item = locationThumbnails.find((thumbnail) => thumbnail.name === name)
                      if (item) addUniqueHistoryItem(item, setLocationHistory)
                    }}
                    onMore={() => setThumbnailModal("locations")}
                  />
                </div>

                <EmptyHistory label="locations" items={locationHistory} />
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <GenerateBox
                    placeholder="Prompt music style..."
                    defaultValue="Cinematic orchestral score with rising tension, featuring deep bass and ethereal synth pads. 80bpm, mood: epic and mysterious."
                    references={[
                      {
                        item: audioStyles.find((item) => item.name === selectedAudioStyle) ?? audioStyles[0],
                        icon: Music,
                      },
                    ]}
                    addOptions={audioStyles}
                    selectedAddOption={selectedAudioStyle}
                    onSelectAddOption={setSelectedAudioStyle}
                    onCreate={() => toast.info(`${selectedAudioStyle} audio generation is not yet implemented.`)}
                  />
                </div>

                <div className="space-y-3 pt-6 border-t border-border/50">
                  <span className="block px-1 text-[11px] font-medium tracking-wide text-muted-foreground">Library</span>
                  <ThumbnailStrip
                    items={audioThumbnails}
                    selectedName={selectedAudio}
                    onSelect={(name) => {
                      const item = audioThumbnails.find((thumbnail) => thumbnail.name === name)
                      if (item) addUniqueHistoryItem(item, setAudioHistory)
                    }}
                    onMore={() => setThumbnailModal("audio")}
                  />
                </div>

                <EmptyHistory label="audio generations or uploads" items={audioHistory} />
              </div>
            )}

            {activeTab === 'captions' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Textarea
                      className="min-h-[140px] bg-muted/40 border-border resize-none text-sm rounded-2xl focus-visible:ring-primary/20"
                      placeholder="Enter or generate captions..."
                      defaultValue="In the heart of the neon city, where dreams and reality blur into one, two strangers find themselves on a path that will change their destinies forever. A cinematic journey through the soul of the night."
                    />
                    <Button
                      onClick={() => toast.info("Caption generation is not yet implemented.")}
                      className="h-10 w-full rounded-xl font-semibold shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                      Create
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-border/50">

                  <p className="text-[11px] text-muted-foreground/50 italic text-center py-6 bg-muted/20 rounded-2xl border border-dashed border-border/50">
                    No generated captions
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <History className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-[11px] font-medium tracking-wide text-muted-foreground">Library</span>
                    </div>
                    <button
                      className="text-[11px] font-medium text-primary hover:underline transition-all"
                      onClick={() => captionInputRef.current?.click()}
                    >
                      Upload
                    </button>
                  </div>

                  <div
                    className="border-2 border-dashed border-border/40 rounded-2xl p-8 flex flex-col items-center justify-center bg-muted/5 group hover:bg-muted/10 hover:border-primary/30 transition-all cursor-pointer"
                    onClick={() => captionInputRef.current?.click()}
                  >
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm mb-3">
                      <Type className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground">Click to browse or drag and drop</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transitions' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {["Cut", "Fade", "Dip", "Slide"].map((transition) => (
                      <Button key={transition} variant="outline" className="h-12 rounded-2xl text-xs font-medium border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all">
                        {transition}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-border/50">
                  <span className="text-[11px] font-medium tracking-wide text-muted-foreground px-1">Global duration</span>
                  <div className="flex items-center justify-between border border-border bg-muted/20 px-4 py-3 rounded-2xl">
                    <span className="text-sm font-medium text-foreground">0.4 seconds</span>
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">Default</span>
                  </div>
                </div>
              </div>
            )}
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
              {thumbnailModal === "styles" ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {thumbnailModalConfig.items.map((item) => {
                    const isSelected = thumbnailModalConfig.selectedName === item.name
                    return (
                      <button
                        key={item.name}
                        type="button"
                        title={item.name}
                        onClick={() => {
                          thumbnailModalConfig.onSelect(item.name)
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
                  })}
                </div>
              ) : (
                <Tabs defaultValue="library" className="gap-4">
                  <TabsList className="w-full">
                    <TabsTrigger value="library">Library</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                  </TabsList>
                  <TabsContent value="library">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {thumbnailModalConfig.items.map((item) => {
                        const isSelected = thumbnailModalConfig.selectedName === item.name
                        return (
                          <button
                            key={item.name}
                            type="button"
                            title={item.name}
                            onClick={() => {
                              thumbnailModalConfig.onSelect(item.name)
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
                      })}
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
