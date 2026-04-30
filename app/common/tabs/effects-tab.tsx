"use client"

import { Button } from "@/components/ui/button"

export function EffectsTab() {
  return (
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
  )
}
