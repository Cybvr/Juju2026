"use client"

import { UserRound, History } from "lucide-react"
import { GenerateBox, ThumbnailStrip, HistoryGallery, ThumbnailItem } from "./shared"
import { toast } from "sonner"

interface CharactersTabProps {
  selectedCharacter: string
  setActiveCharacter: (name: string) => void
  characterHistory: ThumbnailItem[]
  setCharacterHistory: React.Dispatch<React.SetStateAction<ThumbnailItem[]>>
  setThumbnailModal: (kind: "styles" | "characters" | "locations" | "audio" | null) => void
  characterThumbnails: ThumbnailItem[]
}

export function CharactersTab({
  selectedCharacter,
  setActiveCharacter,
  characterHistory,
  setCharacterHistory,
  setThumbnailModal,
  characterThumbnails,
}: CharactersTabProps) {
  return (
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
            const item = characterThumbnails.find((c) => c.name === name)
            if (item) setCharacterHistory((prev) => [item, ...prev])
          }}
          onMore={() => setThumbnailModal("characters")}
          showLabels
        />
      </div>

      <div className="space-y-4 pt-6 border-t border-border/50">
        <div className="flex items-center gap-2 px-1">
          <History className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground">History</span>
        </div>
        {characterHistory.length > 0 ? (
          <HistoryGallery items={characterHistory} />
        ) : (
          <p className="text-[11px] text-muted-foreground/50 italic text-center py-6 bg-muted/20 rounded-2xl border border-dashed border-border/50">
            No characters yet
          </p>
        )}
      </div>
    </div>
  )
}
