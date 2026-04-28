"use client"

import { Sidebar } from "@/app/common/sidebar"
import { useState, useEffect } from "react"
import type { Project } from "@/app/common/types"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { projectService } from "@/lib/services/projectService"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchProjects = async (uid: string) => {
        try {
            const userProjects = await projectService.getUserProjects(uid)
            setProjects(userProjects)
        } catch (error) {
            console.error("Error fetching projects:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchProjects(user.uid)
            } else {
                setProjects([])
                setIsLoading(false)
            }
        })
        return () => unsubscribe()
    }, [])

    const handleRefreshProjects = () => {
        if (auth.currentUser) {
            fetchProjects(auth.currentUser.uid)
        }
    }

    return (
        <div className="flex h-screen bg-background text-foreground selection:bg-primary/20 overflow-hidden relative">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            
            <Sidebar
                projects={projects}
                activeProjectId={null}
                onNewProject={handleRefreshProjects}
            />
            <main className="flex-1 flex overflow-hidden relative">
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-muted-foreground font-medium animate-pulse">Loading workspace...</p>
                        </div>
                    </div>
                ) : (
                    children
                )}
            </main>
        </div>
    )
}
