"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function CaptionsTab() {
  return (
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
    </div>
  )
}
