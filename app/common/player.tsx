"use client"

import { useState } from "react"
import Image from "next/image"
import { Maximize2, Pause, Play, Square, ZoomIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface PlayerProps {
  mediaUrl: string
  mediaType?: "image" | "video"
  aspectRatio: "landscape" | "portrait" | "square"
  isPlaying: boolean
  activeTool?: string
  currentTime?: string
  totalTime?: string
  remainingTime?: string
  onAspectRatioChange: (aspectRatio: "landscape" | "portrait" | "square") => void
  onPlayingChange: (isPlaying: boolean) => void
}

interface PlayerControlsProps {
  aspectRatio: PlayerProps["aspectRatio"]
  isPlaying: boolean
  currentTime: string
  totalTime: string
  remainingTime: string
  zoom: number
  onZoomChange: (zoom: number) => void
  onAspectRatioChange: PlayerProps["onAspectRatioChange"]
  onPlayingChange: PlayerProps["onPlayingChange"]
}

interface PlayerMediaProps {
  mediaUrl: string
  mediaType: "image" | "video"
  aspectRatio: PlayerProps["aspectRatio"]
  zoom: number
  activeTool?: string
  onMediaClick?: () => void
}

function PlayerMedia({ mediaUrl, mediaType, aspectRatio, zoom, activeTool, onMediaClick }: PlayerMediaProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 items-center justify-center p-5",
        activeTool === "select" ? "cursor-crosshair" : "cursor-default"
      )}
      onClick={onMediaClick}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-muted",
          aspectRatio === "landscape"
            ? "aspect-[16/9] w-full max-h-full"
            : aspectRatio === "portrait"
              ? "aspect-[9/16] h-full max-w-full"
              : "aspect-square h-full max-w-full"
        )}
      >
        {mediaUrl ? (
          mediaType === "video" ? (
            <video
              src={mediaUrl}
              className="h-full w-full object-contain opacity-90 transition-transform duration-200"
              style={{ transform: `scale(${zoom / 100})` }}
              controls
              playsInline
            />
          ) : (
            <Image
              src={mediaUrl}
              alt="Scene Preview"
              fill
              className="object-contain opacity-90 transition-transform duration-200"
              style={{ transform: `scale(${zoom / 100})` }}
            />
          )
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50">
          </div>
        )}
      </div>
    </div>
  )
}

function PlayerControls({
  aspectRatio,
  isPlaying,
  currentTime,
  totalTime,
  remainingTime,
  zoom,
  onZoomChange,
  onAspectRatioChange,
  onPlayingChange,
}: PlayerControlsProps) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border bg-background px-3 py-2 shadow-lg">
      {/* Time */}
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground shrink-0">
        <span className="text-foreground">{currentTime}</span>
        <span>/</span>
        <span>{totalTime}</span>
        <span className="hidden sm:inline rounded-md bg-muted px-1.5 py-0.5 text-[10px]">{remainingTime}</span>
      </div>

      {/* Play button */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => onPlayingChange(!isPlaying)}
          className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-secondary"
        >
          {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
        </Button>
      </div>

      {/* Right controls */}
      <div className="flex items-center justify-end gap-1 shrink-0">
        <div className="hidden sm:flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Player zoom"
              className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-secondary"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 p-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Zoom</span>
                <span className="text-muted-foreground">{zoom}%</span>
              </div>
              <Slider
                aria-label="Player zoom"
                min={10}
                max={200}
                step={5}
                value={[zoom]}
                onValueChange={([value]) => onZoomChange(value)}
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        </div>
        <Select value={aspectRatio} onValueChange={(value) => onAspectRatioChange(value as PlayerProps["aspectRatio"])}>
          <SelectTrigger
            aria-label="Aspect ratio"
            className="h-8 w-[72px] rounded-lg border-border bg-background px-2 text-xs font-bold shadow-sm"
          >
            <Square className="mr-1 h-3 w-3 shrink-0 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end" className="min-w-[72px]">
            <SelectItem value="landscape" className="text-xs font-bold">16:9</SelectItem>
            <SelectItem value="portrait" className="text-xs font-bold">9:16</SelectItem>
            <SelectItem value="square" className="text-xs font-bold">1:1</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-secondary">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function Player({
  mediaUrl,
  mediaType = "image",
  aspectRatio,
  isPlaying,
  activeTool = "select",
  currentTime = "0:12",
  totalTime = "0:24",
  remainingTime = "-0:12",
  onAspectRatioChange,
  onPlayingChange,
}: PlayerProps) {
  const [zoom, setZoom] = useState(100)

  const handleMediaClick = () => {
    if (activeTool === "select") {
      setZoom(100)
    }
  }

  return (
    <div
      className="relative flex h-full w-full max-w-5xl flex-col overflow-hidden bg-background transition-all duration-700"
    >
      <PlayerMedia
        mediaUrl={mediaUrl}
        mediaType={mediaType}
        aspectRatio={aspectRatio}
        zoom={zoom}
        activeTool={activeTool}
        onMediaClick={handleMediaClick}
      />
      <PlayerControls
        aspectRatio={aspectRatio}
        isPlaying={isPlaying}
        currentTime={currentTime}
        totalTime={totalTime}
        remainingTime={remainingTime}
        zoom={zoom}
        onZoomChange={setZoom}
        onAspectRatioChange={onAspectRatioChange}
        onPlayingChange={onPlayingChange}
      />
    </div>
  )
}
