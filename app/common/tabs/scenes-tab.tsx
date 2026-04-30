"use client"

import { UserRound, MapPin, Film, Trash2, Plus, History, Music } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { GenerateBox, HistoryGallery, ThumbnailItem } from "./shared"
import { toast } from "sonner"

interface SceneDraft {
  id: string
  name: string
  style: string
  character: string
  location: string
  audio: string
  prompt: string
}

interface ScenesTabProps {
  sceneDrafts: SceneDraft[]
  activeDraftScene: number
  setActiveDraftScene: (index: number) => void
  updateSceneDraft: (index: number, updates: Partial<SceneDraft>) => void
  handleDeleteDraftScene: (index: number) => void
  handleAddDraftScene: () => void
  onTabChange: (tab: string) => void
  onGenerateScene: (style: string) => void
  setSelectedCharacter: (name: string) => void
  setSelectedLocation: (name: string) => void
  setThumbnailModal: (kind: "styles" | "characters" | "locations" | "audio" | null, mode?: "picker" | "library") => void
  sceneHistory: ThumbnailItem[]
  characterThumbnails: ThumbnailItem[]
  locationThumbnails: ThumbnailItem[]
  audioThumbnails: ThumbnailItem[]
  sceneStyles: ThumbnailItem[]
}

export function ScenesTab({
  sceneDrafts,
  activeDraftScene,
  setActiveDraftScene,
  updateSceneDraft,
  handleDeleteDraftScene,
  handleAddDraftScene,
  onTabChange,
  onGenerateScene,
  setSelectedCharacter,
  setSelectedLocation,
  setThumbnailModal,
  sceneHistory,
  characterThumbnails,
  locationThumbnails,
  audioThumbnails,
  sceneStyles,
}: ScenesTabProps) {
  return (
    <div className="space-y-6">
      {sceneDrafts.map((scene, sceneIndex) => {
        const sceneCharacterItem =
          characterThumbnails.find((item) => item.name === scene.character) ?? characterThumbnails[0]
        const sceneLocationItem =
          locationThumbnails.find((item) => item.name === scene.location) ?? locationThumbnails[0]
        const sceneAudioItem =
          audioThumbnails.find((item) => item.name === scene.audio) ?? audioThumbnails[0]

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
                  item: sceneCharacterItem,
                  icon: UserRound,
                  onClick: () => {
                    setActiveDraftScene(sceneIndex)
                    setThumbnailModal("characters", "picker")
                  },
                },
                {
                  item: sceneLocationItem,
                  icon: MapPin,
                  onClick: () => {
                    setActiveDraftScene(sceneIndex)
                    setThumbnailModal("locations", "picker")
                  },
                },
                {
                  item: sceneAudioItem,
                  icon: Music,
                  onClick: () => {
                    setActiveDraftScene(sceneIndex)
                    setThumbnailModal("audio", "picker")
                  },
                },
                {
                  item: sceneStyles.find((s) => s.name === scene.style) ?? sceneStyles[0],
                  icon: Film,
                  onClick: () => {
                    setActiveDraftScene(sceneIndex)
                    setThumbnailModal("styles", "picker")
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
            <button
              type="button"
              onClick={() => {
                setActiveDraftScene(sceneIndex)
                toast.info(`${scene.name} added to timeline.`)
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 py-3 text-xs font-bold text-primary transition-all hover:bg-primary/10 hover:border-primary/40 active:scale-[0.98]"
            >
              <div className="flex -space-x-1.5">
                <Plus className="h-3.5 w-3.5" />
                <Plus className="h-3.5 w-3.5" />
              </div>
              Add to Timeline
            </button>
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

      <div className="space-y-4 pt-6 border-t border-border/50">
        <div className="flex items-center gap-2 px-1">
          <History className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground">History</span>
        </div>
        {sceneHistory.length > 0 ? (
          <HistoryGallery items={sceneHistory} />
        ) : (
          <p className="text-[11px] text-muted-foreground/50 italic text-center py-6 bg-muted/20 rounded-2xl border border-dashed border-border/50">
            No generated scenes yet
          </p>
        )}
      </div>
    </div>
  )
}
