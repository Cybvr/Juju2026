"use client"

import { useState, useEffect } from "react"
import { adminService } from "@/lib/services/adminService"
import type { Project } from "@/app/common/types"
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash, ExternalLink, Video, Loader2, Search, Calendar, Globe, LayoutTemplate, Pencil, Save } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import { projectService } from "@/lib/services/projectService"

export default function ProjectsManagement() {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        setIsLoading(true)
        try {
            const data = await adminService.getAllProjects()
            setProjects(data)
        } catch (error) {
            console.error("Error fetching projects:", error)
            toast.error("Failed to load projects")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteProject = async (projectId: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return
        
        try {
            await adminService.deleteProject(projectId)
            setProjects(projects.filter(p => p.id !== projectId))
            toast.success("Project deleted successfully")
        } catch (error) {
            toast.error("Failed to delete project")
        }
    }

    const handleUpdateProject = async () => {
        if (!editingProject) return
        setIsUpdating(true)
        try {
            await projectService.updateProject(editingProject.id, {
                name: editingProject.name || "",
                category: editingProject.category || "",
                isPublic: !!editingProject.isPublic,
                isJujuTemplate: !!editingProject.isJujuTemplate
            })
            setProjects(projects.map(p => p.id === editingProject.id ? {
                ...editingProject,
                name: editingProject.name || "",
                category: editingProject.category || "",
                isPublic: !!editingProject.isPublic,
                isJujuTemplate: !!editingProject.isJujuTemplate
            } : p))
            toast.success("Project updated successfully")
            setEditingProject(null)
        } catch (error) {
            console.error("Error updating project:", error)
            toast.error("Failed to update project")
        } finally {
            setIsUpdating(false)
        }
    }

    const seedTemplates = async () => {
        setIsLoading(true)
        try {
            const templatesToSeed = [
                { name: "Science Explainer: Law of Gravity", category: "Education" },
                { name: "SaaS Feature Walkthrough", category: "SaaS & Product" },
                { name: "E-commerce Spring Sale Promo", category: "E-commerce" },
                { name: "Employee Onboarding Intro", category: "Training & Development" },
                { name: "Nonprofit Impact Story", category: "Nonprofits" },
                { name: "Local Bakery Promo", category: "Local Businesses" }
            ]

            const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")
            const { db } = await import("@/lib/firebase")

            for (const t of templatesToSeed) {
                await addDoc(collection(db, "projects"), {
                    name: t.name,
                    category: t.category,
                    isPublic: true,
                    isJujuTemplate: true,
                    thumbnail: "",
                    userId: "system", // Or the admin's ID
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            }
            toast.success("Templates seeded successfully!")
            fetchProjects()
        } catch (error) {
            console.error("Error seeding templates:", error)
            toast.error("Failed to seed templates")
        } finally {
            setIsLoading(false)
        }
    }

    const filteredProjects = projects.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        project.userId.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tight">Projects</h1>
                    <p className="text-sm font-bold text-muted-foreground mt-1">Manage user projects and templates</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button onClick={seedTemplates} disabled={isLoading} variant="outline" className="font-bold border-primary text-primary hover:bg-primary/10">
                        Seed Templates
                    </Button>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 bg-secondary/50 border-border/50 rounded-lg focus-visible:ring-primary/20"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-sm border border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-secondary/30">
                        <TableRow className="border-border/50 hover:bg-transparent">
                            <TableHead className="w-[350px] font-bold text-xs uppercase tracking-widest px-6 py-5">Project</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-widest">User ID</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-widest">Last Updated</TableHead>
                            <TableHead className="text-right px-6 font-bold text-xs uppercase tracking-widest">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-48 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                        <p className="font-medium text-muted-foreground">Fetching projects...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredProjects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-48 text-center text-muted-foreground font-medium">
                                    No projects found matching your search.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProjects.map((project) => (
                                <TableRow key={project.id} className="border-border/50 hover:bg-secondary/20 transition-colors">
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-10 rounded-md bg-secondary overflow-hidden flex-shrink-0 border border-border/50">
                                                {project.thumbnail ? (
                                                    <Image src={project.thumbnail} alt={project.name} width={64} height={40} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Video className="w-4 h-4 text-muted-foreground/50" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <button 
                                                    onClick={() => setEditingProject(project)}
                                                    className="font-bold truncate text-sm text-left hover:text-primary transition-colors cursor-pointer"
                                                >
                                                    {project.name}
                                                </button>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">ID: {project.id}</span>
                                                    {project.isPublic && (
                                                        <Globe className="w-3 h-3 text-primary" />
                                                    )}
                                                    {project.isJujuTemplate && (
                                                        <LayoutTemplate className="w-3 h-3 text-amber-500" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                                            {project.userId.substring(0, 12)}...
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            {project.updatedAt.toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right px-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-10 w-10 p-0 rounded-md hover:bg-secondary">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-md border-border/50 backdrop-blur-xl">
                                                <DropdownMenuLabel className="px-3 py-2 text-xs uppercase font-black text-muted-foreground tracking-widest">Options</DropdownMenuLabel>
                                                <DropdownMenuItem asChild className="rounded-md p-2.5 cursor-pointer font-bold">
                                                    <Link href={`/dashboard/projects/${project.id}`}>
                                                        <ExternalLink className="mr-3 h-4 w-4" />
                                                        View Project
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => setEditingProject(project)}
                                                    className="rounded-md p-2.5 cursor-pointer font-bold"
                                                >
                                                    <Pencil className="mr-3 h-4 w-4" />
                                                    Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => handleDeleteProject(project.id)}
                                                    className="rounded-md p-2.5 cursor-pointer font-bold text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                >
                                                    <Trash className="mr-3 h-4 w-4" />
                                                    Delete Project
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
                <DialogContent className="max-w-md rounded-xl border-border/50 backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Edit Project</DialogTitle>
                    </DialogHeader>
                    {editingProject && (
                        <div className="space-y-6 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Project Name</Label>
                                <Input 
                                    id="name" 
                                    value={editingProject.name || ""} 
                                    onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                                    className="h-12 rounded-md bg-secondary/30 border-border/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Category</Label>
                                <Input 
                                    id="category" 
                                    placeholder="e.g. Education, E-commerce..."
                                    value={editingProject.category || ""} 
                                    onChange={(e) => setEditingProject({...editingProject, category: e.target.value})}
                                    className="h-12 rounded-md bg-secondary/30 border-border/50"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-md bg-secondary/30 border border-border/50">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold">Public Project</Label>
                                    <p className="text-xs text-muted-foreground">Make this project visible in the gallery</p>
                                </div>
                                <input 
                                    type="checkbox" 
                                    checked={!!editingProject.isPublic}
                                    onChange={(e) => setEditingProject({...editingProject, isPublic: e.target.checked})}
                                    className="h-5 w-5 rounded border-border/50 text-primary focus:ring-primary/20 accent-primary"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-md bg-secondary/30 border border-border/50">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold">Juju Template</Label>
                                    <p className="text-xs text-muted-foreground">Feature this project as a reusable template</p>
                                </div>
                                <input 
                                    type="checkbox" 
                                    checked={!!editingProject.isJujuTemplate}
                                    onChange={(e) => setEditingProject({...editingProject, isJujuTemplate: e.target.checked})}
                                    className="h-5 w-5 rounded border-border/50 text-primary focus:ring-primary/20 accent-amber-500"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setEditingProject(null)} className="rounded-md font-bold">Cancel</Button>
                        <Button 
                            onClick={handleUpdateProject} 
                            disabled={isUpdating}
                            className="rounded-md font-bold bg-foreground text-background hover:bg-foreground/90 gap-2"
                        >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
