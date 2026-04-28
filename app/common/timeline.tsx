"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import {
  ChevronDown,
  Eye,
  Lock,
  MoreHorizontal,
  MousePointer,
  RotateCcw,
  RotateCw,
  Scissors,
  SplitSquareHorizontal,
  Type,
  Trash2,
  Volume2,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface TimelineScene {
  id: string
  url: string
  title?: string
  hasAudio?: boolean
  hasCaption?: boolean
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
  const toolbarItems = [
    { id: "select", label: "Select", icon: MousePointer },
    { id: "undo", label: "Undo", icon: RotateCcw },
    { id: "redo", label: "Redo", icon: RotateCw },
    { id: "delete", label: "Delete", icon: Trash2 },
  ]

  const tracksWidth = scenes.length > 0 ? scenes.length * timelineZoom : 800

  const updateScrubFromPointer = (clientX: number) => {
    const rect = rulerRef.current?.getBoundingClientRect()
    if (!rect) return

    const nextProgress = ((clientX - rect.left) / rect.width) * 100
    onProgressChange(Math.min(100, Math.max(0, Math.round(nextProgress))))
  }

  return (
    <div className="relative z-30 border-t border-border bg-card text-muted-foreground">
      <div className="flex h-8 items-center justify-between border-b border-border px-2">
        <div className="flex items-center gap-1">
          {toolbarItems.map((item, index) => (
            <div key={item.id} className={cn("flex items-center", index === 1 && "ml-3 border-l border-border pl-3")}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onToolSelect?.(item.id)}
                aria-label={item.label}
                className={cn(
                  "h-7 w-7 rounded-md transition-colors",
                  activeTool === item.id
                    ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
              </Button>
              {index === 0 && <ChevronDown className="ml-0.5 h-3.5 w-3.5" />}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ZoomOut className="h-4 w-4" />
          <div className="w-40">
            <Slider
              aria-label="Timeline zoom"
              min={88}
              max={184}
              step={8}
              value={[timelineZoom]}
              onValueChange={([value]) => setTimelineZoom(value)}
            />
          </div>
          <ZoomIn className="h-4 w-4" />
        </div>
      </div>

      <div className="grid grid-cols-[13rem_1fr]">
        {/* Left Side: Fixed Controls */}
        <div className="border-r border-b border-border">
          <div className="h-8 border-b border-border bg-muted/30" />
          
          <div className="flex h-[4.5rem] items-center gap-4 border-b border-border px-3">
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7 rounded-md text-muted-foreground hover:bg-secondary">
              <Eye className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7 rounded-md text-muted-foreground hover:bg-secondary">
              <Lock className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7 rounded-md text-muted-foreground hover:bg-secondary">
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="ml-auto h-7 w-7 rounded-md text-muted-foreground hover:bg-secondary">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex h-8 items-center gap-3 border-b border-border bg-muted/10 px-3">
            <Button type="button" variant="ghost" size="icon" className="h-6 w-6 rounded-md text-muted-foreground hover:bg-secondary">
              <Type className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-6 w-6 rounded-md text-muted-foreground hover:bg-secondary">
              <Lock className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="ml-auto h-6 w-6 rounded-md text-muted-foreground hover:bg-secondary">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex h-7 items-center gap-3 bg-muted/20 px-3">
            <Button type="button" variant="ghost" size="icon" className="h-5 w-5 rounded-md text-muted-foreground hover:bg-secondary">
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-5 w-5 rounded-md text-muted-foreground hover:bg-secondary">
              <Lock className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="ml-auto h-5 w-5 rounded-md text-muted-foreground hover:bg-secondary">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right Side: Scrollable Timeline */}
        <div className="relative overflow-x-auto border-b border-border custom-scrollbar p-4">
          <div className="relative" style={{ width: tracksWidth }}>
            <div
              className="pointer-events-none absolute -bottom-4 -top-4 z-30 w-px bg-primary"
              style={{ left: `${progress}%` }}
            >
              <div className="absolute -left-2 top-0 h-5 w-4 rounded-b-md border border-primary bg-background shadow-sm" />
            </div>

            {/* Ruler */}
            <div
              ref={rulerRef}
              className="relative h-8 cursor-ew-resize border-b border-border bg-muted/30 overflow-hidden flex"
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId)
                updateScrubFromPointer(event.clientX)
              }}
              onPointerMove={(event) => {
                if (event.buttons === 1) updateScrubFromPointer(event.clientX)
              }}
            >
              {rulerTicks.map((tick) => (
                <div key={tick} className="relative flex-1 border-l border-border/50">
                  <div className="absolute left-1.5 top-1 font-mono text-[10px] font-bold text-muted-foreground">
                    {tick % 2 === 0 ? `00:${String(tick).padStart(2, "0")}` : ""}
                  </div>
                  <div className="absolute bottom-0 left-1/4 h-1.5 w-px bg-border/50" />
                  <div className="absolute bottom-0 left-1/2 h-2 w-px bg-border/50" />
                  <div className="absolute bottom-0 left-3/4 h-1.5 w-px bg-border/50" />
                </div>
              ))}
            </div>

            {/* Tracks */}
            <div className="h-[4.5rem] border-b border-border py-2">
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
                      <div className="flex h-5 items-center bg-primary/15 px-1.5 text-left text-[10px] font-bold text-foreground">
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
                  <div className="flex h-14 w-full items-center border border-dashed border-border bg-muted px-3">
                    <p className="text-xs font-bold text-muted-foreground">No scenes generated yet</p>
                  </div>
                )}
              </div>
            </div>

            <div className="h-8 border-b border-border bg-muted/10 py-1">
              <div className="flex items-stretch w-full h-full">
                {captionScenes.length > 0 ? (
                  scenes.map((scene, index) => scene.hasCaption ? (
                    <Button
                      key={`${scene.id}-caption`}
                      type="button"
                      variant="ghost"
                      onClick={() => onSceneSelect(index)}
                      className={cn(
                        "flex-1 h-full justify-start overflow-hidden rounded-none border-r bg-background px-2 text-left text-[10px] font-bold text-foreground shadow-none hover:bg-secondary",
                        activeSceneIndex === index ? "border-primary z-10" : "border-border"
                      )}
                    >
                      <span className="truncate">Caption {index + 1}</span>
                    </Button>
                  ) : (
                    <div key={`${scene.id}-no-caption`} className="flex-1 border-r border-transparent" />
                  ))
                ) : (
                  <div className="flex h-full w-full items-center border border-dashed border-border bg-muted px-3">
                    <p className="text-[10px] font-bold text-muted-foreground">No captions yet</p>
                  </div>
                )}
              </div>
            </div>

            <div className="h-7 bg-muted/20 py-1">
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
                  <div className="flex h-full w-full items-center border border-dashed border-border bg-muted px-3">
                    <p className="text-[10px] font-bold text-muted-foreground">No audio yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
