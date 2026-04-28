"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { projectService } from "@/lib/services/projectService"
import type { Project } from "@/app/common/types"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  ExternalLink, 
  Clock, 
  Monitor, 
  Palette, 
  Dice5, 
  Mic2, 
  Type, 
  Music,
  CheckCircle2,
  Sparkles,
  LayoutPanelLeft,
  Smartphone,
  Square,
  Wand2,
  Video
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [selectedMode, setSelectedMode] = useState<"guide" | "studio">("guide")
  const [selectedFormat, setSelectedFormat] = useState<"landscape" | "portrait" | "square">("landscape")
  const [isCreating, setIsCreating] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setShowNewProjectModal(true)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchProjects = async () => {
      if (auth.currentUser) {
        try {
          const userProjects = await projectService.getUserProjects(auth.currentUser.uid)
          setProjects(userProjects)
        } catch (error) {
          console.error("Error fetching projects:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchProjects()
  }, [])

  const handleCreateProject = async () => {
    if (!projectName.trim() || !auth.currentUser) return

    setIsCreating(true)
    try {
      const projectId = await projectService.createProject(auth.currentUser.uid, projectName.trim())
      // In a real app, we'd also save the mode and format
      toast.success("Project created successfully")
      router.push(`/dashboard/projects/${projectId}`)
    } catch (error) {
      console.error("Error creating project:", error)
      toast.error("Failed to create project")
    } finally {
      setIsCreating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-bold uppercase tracking-widest animate-pulse">Loading Projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-muted/30 min-h-screen overflow-y-auto custom-scrollbar relative">
      <div className="max-w-[1400px] mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black text-foreground tracking-tight">Your Projects</h1>
              <div className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-[10px] font-black uppercase tracking-widest border border-border">
                ✨ {projects.length} projects
              </div>
            </div>
            <p className="text-muted-foreground font-medium text-sm">
              Create stunning AI-powered videos in minutes. Your creative studio awaits.
            </p>
          </div>
          <Button 
            onClick={() => setShowNewProjectModal(true)}
            className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
          >
            <div className="w-6 h-6 rounded-full bg-primary-foreground flex items-center justify-center text-primary">
              <Plus className="w-4 h-4 stroke-[3px]" />
            </div>
            New Project
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-14 pr-6 rounded-full bg-card border border-border shadow-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            {[
              { label: "Juju PRO", icon: Sparkles, checked: true },
              { label: "Juju Captions", icon: Type, checked: true },
              { label: "Voice Pack", icon: Mic2, checked: true },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm whitespace-nowrap">
                <div className="w-5 h-5 rounded-md flex items-center justify-center bg-secondary text-secondary-foreground">
                  <badge.icon className="w-3 h-3" />
                </div>
                <span className="text-xs font-bold text-foreground">{badge.label}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary/10" />
              </div>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link 
              key={project.id} 
              href={`/dashboard/projects/${project.id}`}
              className="group bg-card rounded-[2.5rem] overflow-hidden border border-border shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] p-4 pb-0">
                <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-inner bg-muted">
                  <Image 
                    src={project.thumbnail || "/images/marketing/download-1.png"} 
                    alt={project.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Progress Badge */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/90 backdrop-blur-md flex items-center justify-center border border-border shadow-lg">
                    <span className="text-[10px] font-black text-primary">100%</span>
                  </div>

                  {/* Scene Count Overlay */}
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground flex items-center gap-1.5 shadow-lg">
                    <LayoutPanelLeft className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-tight">7 scenes</span>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-card-foreground truncate group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-secondary">
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-secondary">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-muted-foreground mb-6">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    <span>Mar 4</span>
                  </div>
                </div>

                {/* Badges Row */}
                <div className="flex flex-wrap gap-2 mb-8">
                  <div className="px-3 py-1.5 rounded-lg bg-secondary border border-border flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-secondary-foreground">
                    <Monitor className="w-3 h-3" />
                    16:9
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-secondary border border-border flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-secondary-foreground">
                    <Palette className="w-3 h-3" />
                    Animated 3D
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-secondary border border-border flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-primary ml-auto">
                    ✨ JujuGuide
                  </div>
                </div>

                {/* Footer Icons */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <div className="flex items-center gap-3">
                    {[Dice5, Mic2, Type, Music].map((Icon, idx) => (
                      <div key={idx} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground">
                        <Icon className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">7 scenes</span>
                </div>
              </div>
            </Link>
          ))}

          {/* Empty State / Call to Action */}
          {projects.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-[2.5rem] bg-secondary flex items-center justify-center mb-8 border border-border">
                <Plus className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">No projects found</h2>
              <p className="text-muted-foreground max-w-xs mb-8">Start your first video creation and watch the magic happen.</p>
              <Button 
                onClick={() => setShowNewProjectModal(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 h-auto font-bold text-lg shadow-lg"
              >
                Create First Video
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showNewProjectModal} onOpenChange={setShowNewProjectModal}>
        <DialogContent className="flex max-h-[calc(100dvh-1.5rem)] flex-col gap-0 overflow-hidden rounded-3xl border-border/50 p-0 shadow-2xl sm:w-[calc(100%-2rem)] sm:max-w-lg">
          <DialogHeader className="items-center px-5 pb-4 pt-6 text-center sm:px-7 sm:pb-5 sm:pt-7">
            <DialogTitle className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Create New Project
            </DialogTitle>
            <DialogDescription className="max-w-xs text-sm font-medium text-muted-foreground">
              Choose a creation mode and give your project a name
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 sm:px-7 sm:pb-6">
            <div className="space-y-5 sm:space-y-6">
              {/* Creation Mode */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedMode("guide")}
                  className={cn(
                    "relative h-auto min-h-[116px] flex-col items-center justify-center gap-2 whitespace-normal rounded-xl border p-4 text-left shadow-none transition-all group sm:min-h-[132px] sm:p-5",
                    selectedMode === "guide" 
                      ? "border-primary bg-primary/5" 
                      : "border-border bg-background hover:border-primary/30 hover:bg-muted/50"
                  )}
                >
                  <Wand2 className={cn("h-5 w-5", selectedMode === "guide" ? "text-primary" : "text-muted-foreground")} />
                  <div className="text-center">
                    <p className="font-bold text-foreground">JujuGuide</p>
                    <p className="text-[10px] font-medium leading-tight text-muted-foreground">AI-powered creation</p>
                  </div>
                  {selectedMode === "guide" && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                      <CheckCircle2 className="w-3 h-3 fill-current" />
                    </div>
                  )}
                </Button>

                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedMode("studio")}
                  className={cn(
                    "relative h-auto min-h-[116px] flex-col items-center justify-center gap-2 whitespace-normal rounded-xl border p-4 text-left shadow-none transition-all group sm:min-h-[132px] sm:p-5",
                    selectedMode === "studio" 
                      ? "border-primary bg-primary/5" 
                      : "border-border bg-background hover:border-primary/30 hover:bg-muted/50"
                  )}
                >
                  <Video className={cn("h-5 w-5", selectedMode === "studio" ? "text-primary" : "text-muted-foreground")} />
                  <div className="text-center">
                    <p className="font-bold text-foreground">JujuStudio</p>
                    <p className="text-[10px] font-medium leading-tight text-muted-foreground">Full manual control</p>
                  </div>
                  {selectedMode === "studio" && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                      <CheckCircle2 className="w-3 h-3 fill-current" />
                    </div>
                  )}
                </Button>
              </div>

              {/* Video Format */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Video Format</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "landscape", label: "Landscape", icon: Monitor },
                    { id: "portrait", label: "Portrait", icon: Smartphone },
                    { id: "square", label: "Square", icon: Square },
                  ].map((format) => (
                    <Button
                      type="button"
                      variant="outline"
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id as any)}
                      className={cn(
                        "h-auto min-h-16 flex-col items-center justify-center gap-1.5 whitespace-normal rounded-xl border p-3 shadow-none transition-all sm:min-h-20 sm:p-4",
                        selectedFormat === format.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border bg-background hover:border-primary/20"
                      )}
                    >
                      <format.icon className={cn("w-5 h-5", selectedFormat === format.id ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("text-[10px] font-bold uppercase tracking-tight", selectedFormat === format.id ? "text-primary" : "text-muted-foreground")}>
                        {format.label}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Project Name */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Project Name</p>
                <Input 
                  type="text"
                  placeholder="e.g. Royale with cheese"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full h-14 px-6 rounded-2xl bg-muted/30 border border-border outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground placeholder:text-muted-foreground/40"
                  autoFocus
                />
              </div>
            </div>
          </div>

          <DialogFooter className="grid grid-cols-2 gap-3 border-t border-border/70 bg-background px-5 py-4 sm:grid-cols-[1fr_2fr] sm:space-x-0 sm:px-7">
            <Button 
              variant="ghost" 
              onClick={() => setShowNewProjectModal(false)}
              className="h-12 rounded-2xl font-bold text-muted-foreground hover:bg-secondary sm:h-14"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateProject}
              disabled={!projectName.trim() || isCreating}
              className="h-12 rounded-2xl bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98] sm:h-14"
            >
              {isCreating ? "Initializing..." : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
