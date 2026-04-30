"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { History, Plus, Send, Upload, Type, Play, Pause, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ThumbnailItem {
  name: string
  image: string
}

export interface ThumbnailStripProps {
  items: ThumbnailItem[]
  selectedName: string
  onSelect: (name: string) => void
  onMore: () => void
  showLabels?: boolean
}

export function ThumbnailStrip({
  items,
  selectedName,
  onSelect,
  onMore,
  showLabels = false,
}: ThumbnailStripProps) {
  return (
    <div className="overflow-x-auto custom-scrollbar pb-1">
      <div className="flex gap-2">
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

export function HistoryGallery({ items }: { items: ThumbnailItem[] }) {
  if (items.length === 0) return null
  return (
    <div className="grid grid-cols-1 gap-3">
      {items.map((item, index) => (
        <div 
          key={`${item.name}-${index}`} 
          className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/5 transition-all hover:border-primary/40"
        >
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  )
}

export function AudioList({
  items,
  selectedName,
  onSelect,
  onMore,
  onAdd,
}: {
  items: ThumbnailItem[]
  selectedName: string
  onSelect: (name: string) => void
  onMore?: () => void
  onAdd?: (item: ThumbnailItem) => void
}) {
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isSelected = selectedName === item.name
        return (
          <button
            key={item.name}
            type="button"
            onClick={() => onSelect(item.name)}
            className={cn(
              "group flex w-full items-center gap-3 rounded-xl border p-2 transition-all",
              isSelected
                ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                : "border-border/50 bg-muted/20 hover:border-primary/30 hover:bg-muted/40"
            )}
          >
            <div className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
              isSelected ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground group-hover:text-foreground"
            )}>
              <Play className="h-4 w-4 fill-current" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col text-left">
              <span className="truncate text-xs font-semibold">{item.name}</span>
              <div className="mt-1 flex items-center gap-2">
                <Activity className="h-3 w-12 text-muted-foreground/40" />
                <span className="text-[10px] text-muted-foreground/60 font-medium">0:30</span>
              </div>
            </div>
            {onAdd && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onAdd(item)
                }}
                className="opacity-0 group-hover:opacity-100 h-8 w-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                title="Add to timeline"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </button>
        )
      })}
      {onMore && (
        <button
          type="button"
          onClick={onMore}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-muted/10 py-3 text-[11px] font-semibold text-muted-foreground transition-all hover:border-primary/40 hover:bg-muted/30 hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          View More
        </button>
      )}
    </div>
  )
}

export interface GenerateReference {
  item: ThumbnailItem
  icon?: React.ElementType
  onClick?: () => void
}

export interface GenerateBoxProps {
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

export function GenerateBox({
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
          {references.map((reference, idx) => {
            const Icon = reference.icon
            return (
              <button
                key={`${reference.item.name}-${idx}`}
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
