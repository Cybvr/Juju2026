"use client"

import { useState, useEffect } from "react"
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { LayoutTemplate, Sparkles, Plus } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Project } from "../types"
import { toast } from "sonner"

interface TemplatesTabProps {
  onSelectTemplate: (template: Project) => void
}

export function TemplatesTab({ onSelectTemplate }: TemplatesTabProps) {
  const [templates, setTemplates] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, "projects"),
      where("isJujuTemplate", "==", true),
      orderBy("updatedAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTemplates = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Project))
      setTemplates(fetchedTemplates)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching templates:", error)
      toast.error("Failed to load templates")
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Community Templates
        </h3>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-muted-foreground animate-pulse">Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-3 rounded-2xl border-2 border-dashed border-border/50 bg-muted/5">
            <LayoutTemplate className="w-10 h-10 text-muted-foreground/20" />
            <div className="space-y-1">
              <p className="text-sm font-bold">No templates yet</p>
              <p className="text-xs text-muted-foreground">Projects marked as JujuTemplates will appear here.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="group relative flex flex-col w-full overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={template.thumbnail || "/images/juju.png"}
                    alt={template.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-bold text-xs transform translate-y-4 transition-transform group-hover:translate-y-0">
                      <Plus className="w-3 h-3" />
                      Use Template
                    </div>
                  </div>
                </div>
                <div className="p-3 text-left">
                  <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{template.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter mt-1">JujuTemplate</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
