"use client"

import { Music, History, Upload } from "lucide-react"
import { GenerateBox, ThumbnailStrip, HistoryGallery, ThumbnailItem } from "./shared"
import { toast } from "sonner"

interface AudioTabProps {
  selectedAudioStyle: string
  setSelectedAudioStyle: (name: string) => void
  selectedAudio: string
  setSelectedAudio: (name: string) => void
  audioHistory: ThumbnailItem[]
  setAudioHistory: React.Dispatch<React.SetStateAction<ThumbnailItem[]>>
  setThumbnailModal: (kind: "styles" | "characters" | "locations" | "audio" | null) => void
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
        <span className="block px-1 text-[11px] font-medium tracking-wide text-muted-foreground">Library</span>
        <ThumbnailStrip
          items={audioThumbnails}
          selectedName={selectedAudio}
          onSelect={(name) => {
            const item = audioThumbnails.find((a) => a.name === name)
            if (item) setAudioHistory((prev) => [item, ...prev])
          }}
          onMore={() => setThumbnailModal("audio")}
          showLabels
        />
      </div>

      <div className="space-y-4 pt-6 border-t border-border/50">
        <div className="flex items-center gap-2 px-1">
          <History className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground">History</span>
        </div>
        {audioHistory.length > 0 && (
          <HistoryGallery items={audioHistory} />
        )}
        
        <div className="flex items-center justify-between px-1 mt-2">
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground">Uploads</span>
          <button
            className="text-[11px] font-medium text-primary hover:underline transition-all"
            onClick={() => audioInputRef.current?.click()}
          >
            Upload
          </button>
        </div>

        <div
          className="border-2 border-dashed border-border/40 rounded-2xl p-8 flex flex-col items-center justify-center bg-muted/5 group hover:bg-muted/10 hover:border-primary/30 transition-all cursor-pointer"
          onClick={() => audioInputRef.current?.click()}
        >
          <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm mb-3">
            <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">Click to browse or drag and drop</span>
        </div>
      </div>
    </div>
  )
}
