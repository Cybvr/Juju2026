"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import {
  Film,
  MousePointer,
  Music,
  RotateCcw,
  RotateCw,
  Type,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface TimelineScene {
  id: string
  url: string
  title?: string
  hasAudio?: boolean
  hasCaption?: boolean
  style?: string
}

interface TimelineProps {
  scenes: TimelineScene[]
  activeSceneIndex: number
  progress: number
  activeTool?: string
  onToolSelect?: (tool: string) => void
  onSceneSelect: (index: number) => void
  onProgressChange: (progress: number) => void
}

export function Timeline({
  scenes,
  activeSceneIndex,
  progress,
  activeTool = "select",
  onToolSelect,
  onSceneSelect,
  onProgressChange,
}: TimelineProps) {
  const [timelineZoom, setTimelineZoom] = useState(128)
  const rulerRef = useRef<HTMLDivElement>(null)
  const rulerTicks = Array.from({ length: 25 }, (_, index) => index)
  const waveformBars = Array.from({ length: 28 }, (_, index) => 20 + ((index * 17) % 58))
  const captionScenes = scenes.filter((scene) => scene.hasCaption)
  const audioScenes = scenes.filter((scene) => scene.hasAudio)

  const tracksWidth = scenes.length > 0 ? scenes.length * timelineZoom : 800

  const updateScrubFromPointer = (clientX: number) => {
    const rect = rulerRef.current?.getBoundingClientRect()
    if (!rect) return

    const nextProgress = ((clientX - rect.left) / rect.width) * 100
    onProgressChange(Math.min(100, Math.max(0, Math.round(nextProgress))))
  }

  return (
    <div className="relative z-30 border-t border-border bg-card text-muted-foreground">
      <div className="flex h-7 items-center justify-between border-b border-border px-2">
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onToolSelect?.("select")}
              className={cn(
                "h-6 w-6 rounded-md transition-colors",
                activeTool === "select"
                  ? "bg-foreground text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <MousePointer className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => toast.info("Undo")}
              className="h-6 w-6 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => toast.info("Redo")}
              className="h-6 w-6 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => toast.info("Delete")}
              className="h-6 w-6 rounded-md text-muted-foreground hover:bg-secondary hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ZoomOut className="h-3.5 w-3.5" />
          <div className="w-32">
            <Slider
              aria-label="Timeline zoom"
              min={88}
              max={184}
              step={8}
              value={[timelineZoom]}
              onValueChange={([value]) => setTimelineZoom(value)}
            />
          </div>
          <ZoomIn className="h-3.5 w-3.5" />
        </div>
      </div>

      <div className="relative overflow-x-auto border-b border-border custom-scrollbar p-2">
        <div className="relative" style={{ width: tracksWidth }}>
          <div
            className="pointer-events-none absolute -bottom-2 -top-2 z-30 w-px bg-primary"
            style={{ left: `${progress}%` }}
          >
            <div className="absolute -left-1.5 top-0 h-4 w-3 rounded-b-md border border-primary bg-background shadow-sm" />
          </div>

          {/* Ruler */}
          <div
            ref={rulerRef}
            className="relative h-5 cursor-ew-resize border-b border-border bg-muted/30 overflow-hidden flex"
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId)
              updateScrubFromPointer(event.clientX)
            }}
            onPointerMove={(event) => {
              if (event.buttons === 1) updateScrubFromPointer(event.clientX)
            }}
          >
            {rulerTicks.map((tick) => (
              <div key={tick} className="relative flex-1 border-l border-border/30">
                <div className="absolute left-1 top-0.5 font-mono text-[8px] font-medium text-muted-foreground/60">
                  {tick % 10 === 0 ? `00:${String(tick).padStart(2, "0")}` : ""}
                </div>
              </div>
            ))}
          </div>

          {/* Tracks */}
          <div className="h-10 border-b border-border py-1">
            <div className="flex items-stretch w-full h-full">
              {scenes.length > 0 ? (
                scenes.map((scene, index) => (
                  <Button
                    key={scene.id}
                    type="button"
                    variant="ghost"
                    onClick={() => onSceneSelect(index)}
                    className={cn(
                      "flex-1 h-full flex-col items-stretch gap-0 overflow-hidden rounded-none border-r bg-card p-0 shadow-none hover:bg-card",
                      activeSceneIndex === index
                        ? "border-primary ring-1 ring-primary/40 z-10"
                        : "border-border"
                    )}
                  >
                    <div className="flex h-4 items-center bg-primary/15 px-1.5 text-left text-[9px] font-medium text-foreground">
                      <span className="truncate">{scene.title || `${index + 1}.mp4`}</span>
                    </div>
                    <div className="relative min-h-0 flex-1 overflow-hidden bg-muted">
                      <Image
                        src={scene.url || "/images/juju.png"}
                        alt={scene.title || `Scene ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Button>
                ))
              ) : (
                <div className="flex h-10 w-full items-center justify-start border border-dashed border-border bg-muted/30 px-3">
                  <Film className="h-4 w-4 text-muted-foreground/40" />
                </div>
              )}
            </div>
          </div>

          <div className="h-6 border-b border-border bg-muted/10 py-0.5">
            <div className="flex items-stretch w-full h-full">
              {captionScenes.length > 0 ? (
                scenes.map((scene, index) => scene.hasCaption ? (
                  <Button
                    key={`${scene.id}-caption`}
                    type="button"
                    variant="ghost"
                    onClick={() => onSceneSelect(index)}
                    className={cn(
                      "flex-1 h-full justify-start overflow-hidden rounded-none border-r bg-background px-2 text-left text-[9px] font-medium text-foreground shadow-none hover:bg-secondary",
                      activeSceneIndex === index ? "border-primary z-10" : "border-border"
                    )}
                  >
                    <span className="truncate">Caption {index + 1}</span>
                  </Button>
                ) : (
                  <div key={`${scene.id}-no-caption`} className="flex-1 border-r border-transparent" />
                ))
              ) : (
                <div className="flex h-full w-full items-center justify-start border border-dashed border-border bg-muted/30 px-3">
                  <Type className="h-3 w-3 text-muted-foreground/40" />
                </div>
              )}
            </div>
          </div>

          <div className="h-6 bg-muted/20 py-0.5">
            <div className="flex items-stretch w-full h-full">
              {audioScenes.length > 0 ? (
                scenes.map((scene, index) => scene.hasAudio ? (
                  <Button
                    key={`${scene.id}-audio`}
                    type="button"
                    variant="ghost"
                    onClick={() => onSceneSelect(index)}
                    className={cn(
                      "flex-1 h-full flex-col items-stretch gap-0 overflow-hidden rounded-none border-r bg-primary/10 p-0 shadow-none hover:bg-primary/15",
                      activeSceneIndex === index ? "border-primary z-10" : "border-border"
                    )}
                  >
                    <div className="flex h-0 items-center overflow-hidden px-1.5 text-left text-[10px] font-bold text-foreground">
                      <span className="truncate">Audio {index + 1}</span>
                    </div>
                    <div className="flex min-h-0 flex-1 items-end gap-px px-1 py-0.5">
                      {waveformBars.map((height, barIndex) => (
                        <div
                          key={barIndex}
                          className="w-0.5 rounded-t-sm bg-primary"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </Button>
                ) : (
                  <div key={`${scene.id}-no-audio`} className="flex-1 border-r border-transparent" />
                ))
              ) : (
                <div className="flex h-full w-full items-center justify-start border border-dashed border-border bg-muted/30 px-3">
                  <Music className="h-3 w-3 text-muted-foreground/40" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
