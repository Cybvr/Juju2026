"use client"

import { Home, Plus, Menu, LogOut, Settings, CreditCard, Sun, Moon, User as UserIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { Album } from "./types"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

import { albumService } from "@/lib/services/albumService"

interface SidebarProps {
  albums: Album[]
  activeAlbumId?: string | null
  onNewAlbum?: () => void
}

export function Sidebar({ albums, activeAlbumId, onNewAlbum }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  const handleNewAlbum = async () => {
    if (!user || isCreating) return

    setIsCreating(true)
    try {
      const albumId = await albumService.createAlbum(user.uid, "Untitled Album")
      onNewAlbum?.()
      router.push(`/dashboard/albums/${albumId}`)
      toast.success("Album created")
    } catch (error) {
      console.error("Error creating album:", error)
      toast.error("Failed to create album")
    } finally {
      setIsCreating(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success("Logged out successfully")
      router.push("/auth/login")
    } catch (error) {
      toast.error("Error logging out")
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <aside
      className={cn(
        "border-r border-border bg-background flex flex-col h-screen transition-all duration-300",
        collapsed ? "w-16" : "w-80"
      )}
    >
      <div className="p-4 border-b border-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <Link
          href="/dashboard"
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
            pathname === "/dashboard" ? "bg-secondary" : "hover:bg-secondary/50"
          )}
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Home</span>}
        </Link>

        <button
          onClick={handleNewAlbum}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors mt-1"
        >
          <Plus className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>New album</span>}
        </button>

        <div className="mt-2 space-y-1">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/dashboard/albums/${album.id}`}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                activeAlbumId === album.id ? "bg-secondary" : "hover:bg-secondary/50"
              )}
            >
              <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                <Image
                  src={album.thumbnail || "/placeholder.svg"}
                  alt={album.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              {!collapsed && <span className="truncate text-sm">{album.name}</span>}
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full hover:bg-secondary/50 p-2 rounded-lg transition-colors text-left outline-none">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium flex-shrink-0 overflow-hidden">
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || "U"
                )}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user?.displayName || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" side="right" align="end" sideOffset={12}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/dashboard/account")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/account/plans")}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Plans</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === "light" ? (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light Mode</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
