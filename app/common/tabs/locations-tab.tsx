"use client"

import { MapPin, History, Eye } from "lucide-react"
import { GenerateBox, ThumbnailStrip, HistoryGallery, ThumbnailItem } from "./shared"
import { toast } from "sonner"

interface LocationsTabProps {
  selectedLocation: string
  setActiveLocation: (name: string) => void
  locationHistory: ThumbnailItem[]
  setLocationHistory: React.Dispatch<React.SetStateAction<ThumbnailItem[]>>
  setThumbnailModal: (kind: "styles" | "characters" | "locations" | "audio" | null, mode?: "picker" | "library") => void
  locationThumbnails: ThumbnailItem[]
}

export function LocationsTab({
  selectedLocation,
  setActiveLocation,
  locationHistory,
  setLocationHistory,
  setThumbnailModal,
  locationThumbnails,
}: LocationsTabProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <GenerateBox
          placeholder="Describe the location..."
          defaultValue="A sunlit coastal market street with pastel storefronts, hanging plants, weathered tile, and a view of blue water between buildings. Preserve the same architecture, color palette, and geography across shots."
          references={[
            {
              item: locationThumbnails.find((item) => item.name === selectedLocation) ?? locationThumbnails[0],
              icon: MapPin,
            },
          ]}
          addOptions={locationThumbnails}
          selectedAddOption={selectedLocation}
          onSelectAddOption={setActiveLocation}
          onCreate={() => toast.info("Location generation is not yet implemented.")}
        />
      </div>

      <div className="space-y-3 pt-6 border-t border-border/50">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground">Library</span>
          <button
            type="button"
            onClick={() => setThumbnailModal("locations")}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Open library"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        </div>
        <ThumbnailStrip
          items={locationThumbnails}
          selectedName={selectedLocation}
          onSelect={(name) => {
            const item = locationThumbnails.find((l) => l.name === name)
            if (item) setLocationHistory((prev) => [item, ...prev])
          }}
          onMore={() => setThumbnailModal("locations")}
          showLabels
        />
      </div>

      <div className="space-y-4 pt-6 border-t border-border/50">
        <div className="flex items-center gap-2 px-1">
          <History className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground">History</span>
        </div>
        {locationHistory.length > 0 ? (
          <HistoryGallery items={locationHistory} />
        ) : (
          <p className="text-[11px] text-muted-foreground/50 italic text-center py-6 bg-muted/20 rounded-2xl border border-dashed border-border/50">
            No locations yet
          </p>
        )}
      </div>
    </div>
  )
}
