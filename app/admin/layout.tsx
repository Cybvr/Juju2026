"use client"

import { Sidebar } from "@/app/common/sidebar"
import { useState, useEffect } from "react"
import type { Project } from "@/app/common/types"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { projectService } from "@/lib/services/projectService"
import { usePathname } from "next/navigation"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const pathname = usePathname()

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

    return (
        <div className="flex h-screen bg-background text-foreground selection:bg-primary/20 overflow-hidden relative font-sans">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            
            <Sidebar
                projects={projects}
                activeProjectId={null}
            />
            
            <main className="flex-1 flex overflow-hidden relative">
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-muted-foreground font-medium animate-pulse">Loading Admin Panel...</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
