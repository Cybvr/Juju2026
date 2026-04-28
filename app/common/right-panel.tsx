"use client"

interface RightPanelProps {
  projectName: string
  aspectRatio: "landscape" | "portrait" | "square"
}

export function RightPanel({
  projectName,
  aspectRatio,
}: RightPanelProps) {
  return (
    <div className="flex flex-col h-full w-[280px] overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="m-0 p-4 space-y-6">
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-muted-foreground">Project Detail</span>
              <div className="border border-border bg-background px-3 py-2 text-sm font-bold text-foreground truncate rounded-lg">
                {projectName}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-muted-foreground">Metadata</span>
              <div className="space-y-2.5 border border-border bg-muted/40 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Length</span>
                  <span className="text-xs font-bold text-foreground">0:24s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Format</span>
                  <span className="text-xs font-bold text-foreground">4K / 30FPS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Aspect</span>
                  <span className="text-xs font-bold text-foreground">
                    {aspectRatio === "landscape" ? "16:9" : aspectRatio === "portrait" ? "9:16" : "1:1"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
