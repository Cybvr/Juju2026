"use client"

import { Music, History, Upload, Eye } from "lucide-react"
import { GenerateBox, AudioList, ThumbnailItem } from "./shared"
import { toast } from "sonner"

interface AudioTabProps {
  selectedAudioStyle: string
  setSelectedAudioStyle: (name: string) => void
  selectedAudio: string
  setSelectedAudio: (name: string) => void
  audioHistory: ThumbnailItem[]
  setAudioHistory: React.Dispatch<React.SetStateAction<ThumbnailItem[]>>
  setThumbnailModal: (kind: "styles" | "characters" | "locations" | "audio" | null, mode?: "picker" | "library") => void
  audioThumbnails: ThumbnailItem[]
  audioStyles: ThumbnailItem[]
  audioInputRef: React.RefObject<HTMLInputElement>
}

export function AudioTab({
  selectedAudioStyle,
  setSelectedAudioStyle,
  selectedAudio,
  setSelectedAudio,
  audioHistory,
  setAudioHistory,
  setThumbnailModal,
  audioThumbnails,
  audioStyles,
  audioInputRef,
}: AudioTabProps) {
  return (
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
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground">Library</span>
          <button
            type="button"
            onClick={() => setThumbnailModal("audio")}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Open library"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        </div>
        <AudioList
          items={audioThumbnails}
          selectedName={selectedAudio}
          onSelect={(name) => {
            const item = audioThumbnails.find((a) => a.name === name)
            if (item) setAudioHistory((prev) => [item, ...prev])
            setSelectedAudio(name)
          }}
          onAdd={(item) => toast.info(`${item.name} added to timeline.`)}
          onMore={() => setThumbnailModal("audio")}
        />
      </div>

      <div className="space-y-4 pt-6 border-t border-border/50">
        <div className="flex items-center gap-2 px-1">
          <History className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground">History</span>
        </div>
        {audioHistory.length > 0 && (
          <AudioList
            items={audioHistory}
            selectedName={selectedAudio}
            onSelect={setSelectedAudio}
            onAdd={(item) => toast.info(`${item.name} added to timeline.`)}
          />
        )}
        
      </div>
    </div>
  )
}
