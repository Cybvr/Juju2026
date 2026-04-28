"use client"

import { Sidebar } from "@/app/common/sidebar"
import { useState, useEffect } from "react"
import type { Album } from "@/app/common/types"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { albumService } from "@/lib/services/albumService"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [albums, setAlbums] = useState<Album[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchAlbums = async (uid: string) => {
        try {
            const userAlbums = await albumService.getUserAlbums(uid)
            setAlbums(userAlbums)
        } catch (error) {
            console.error("Error fetching albums:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchAlbums(user.uid)
            } else {
                setAlbums([])
                setIsLoading(false)
            }
        })
        return () => unsubscribe()
    }, [])

    const handleRefreshAlbums = () => {
        if (auth.currentUser) {
            fetchAlbums(auth.currentUser.uid)
        }
    }

    return (
        <div className="flex h-screen bg-background">
            <Sidebar
                albums={albums}
                activeAlbumId={null}
                onNewAlbum={handleRefreshAlbums}
            />
            <main className="flex-1 flex overflow-hidden">
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-muted-foreground">Loading albums...</p>
                    </div>
                ) : (
                    children
                )}
            </main>
        </div>
    )
}
