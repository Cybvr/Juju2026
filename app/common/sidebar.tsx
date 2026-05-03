"use client"

import { Plus, Menu, LogOut, Settings, CreditCard, Sun, Moon, Sparkles, LayoutGrid, Shield, Users, Video } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { Project } from "./types"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
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
import { Button } from "@/components/ui/button"

interface SidebarProps {
  projects: Project[]
  activeProjectId?: string | null
  onNewProject?: () => void
}

export function Sidebar({ projects, activeProjectId, onNewProject }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        setIsAdmin(userDoc.exists() && userDoc.data().role === "admin")
      } else {
        setIsAdmin(false)
      }
    })
    return () => unsubscribe()
  }, [])

  const handleNewProject = () => {
    if (onNewProject) {
      onNewProject()
      return
    }

    router.push("/dashboard?new=true")
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
        "border-r border-border bg-card/50 backdrop-blur-xl flex flex-col h-screen transition-all duration-500 ease-in-out z-20 relative",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Sidebar Header */}
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <Link href="/" className="flex items-center pr-2 group">
            <Image src="/images/juju.png" alt="Juju" width={28} height={28} className="h-7 w-7 object-contain transition-transform group-hover:scale-110" />
          </Link>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "h-9 w-9 rounded-xl text-muted-foreground transition-all duration-300 hover:bg-secondary hover:text-foreground",
            collapsed && "mx-auto"
          )}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* New Project Button */}
      {!pathname.startsWith("/admin") && (
        <div className="px-4 mb-6">
          <Button
            onClick={handleNewProject}
            className={cn(
              "w-full h-12 rounded-2xl bg-foreground text-background font-bold shadow-xl shadow-foreground/10 hover:bg-foreground/90 hover:shadow-foreground/20 transition-all",
              collapsed ? "px-0" : "px-4 gap-2"
            )}
          >
            <Plus className="w-5 h-5" />
            {!collapsed && <span>New Video Project</span>}
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-8 custom-scrollbar">
        {pathname.startsWith("/admin") && isAdmin ? (
          /* Admin Navigation */
          <div className="space-y-1">
            {!collapsed && (
              <div className="flex items-center justify-between px-3 mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/80">Admin Navigation</p>
                <Shield className="w-3 h-3 text-amber-500 animate-pulse" />
              </div>
            )}
            <Button
              asChild
              variant="ghost"
              className={cn(
                "h-auto w-full justify-start gap-3 rounded-2xl px-3 py-2.5 text-muted-foreground transition-all duration-300 group hover:bg-amber-500/10 hover:text-amber-500",
                pathname === "/admin" && "bg-amber-500/10 text-amber-500"
              )}
            >
              <Link href="/admin">
                <LayoutGrid className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="truncate text-sm font-bold">Dashboard</span>}
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className={cn(
                "h-auto w-full justify-start gap-3 rounded-2xl px-3 py-2.5 text-muted-foreground transition-all duration-300 group hover:bg-amber-500/10 hover:text-amber-500",
                pathname === "/admin/users" && "bg-amber-500/10 text-amber-500"
              )}
            >
              <Link href="/admin/users">
                <Users className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="truncate text-sm font-bold">Users</span>}
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className={cn(
                "h-auto w-full justify-start gap-3 rounded-2xl px-3 py-2.5 text-muted-foreground transition-all duration-300 group hover:bg-amber-500/10 hover:text-amber-500",
                pathname === "/admin/projects" && "bg-amber-500/10 text-amber-500"
              )}
            >
              <Link href="/admin/projects">
                <Video className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="truncate text-sm font-bold">Projects</span>}
              </Link>
            </Button>
            
            {/* Link back to app */}
            <div className="pt-4 border-t border-border/20 mt-4">
              <Button
                asChild
                variant="ghost"
                className="h-auto w-full justify-start gap-3 rounded-2xl px-3 py-2.5 text-muted-foreground transition-all duration-300 group hover:bg-secondary hover:text-foreground"
              >
                <Link href="/dashboard">
                  <Sparkles className="w-5 h-5 flex-shrink-0 text-primary" />
                  {!collapsed && <span className="truncate text-sm font-bold">Back to App</span>}
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          /* User Navigation (Projects List) */
          <div>
            {!collapsed && (
              <div className="flex items-center justify-between px-3 mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">My Videos</p>
                <Sparkles className="w-3 h-3 text-primary animate-pulse" />
              </div>
            )}
            <div className="space-y-1">
              {projects.map((project) => (
                <Button
                  asChild
                  variant="ghost"
                  key={project.id}
                  className={cn(
                    "h-auto w-full justify-start gap-3 rounded-2xl px-3 py-2.5 text-muted-foreground transition-all duration-300 group hover:bg-secondary hover:text-foreground",
                    activeProjectId === project.id
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground"
                  )}
                >
                  <Link href={`/dashboard/projects/${project.id}`}>
                    <div className={cn(
                      "w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-border/50 group-hover:scale-110 transition-transform",
                      activeProjectId === project.id && "border-primary/30"
                    )}>
                      <Image
                        src={project.thumbnail || "/images/juju.png"}
                        alt={project.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {!collapsed && <span className="truncate text-sm font-medium">{project.name}</span>}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border/50">
        {mounted && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className={cn(
                  "h-auto w-full justify-start gap-3 rounded-2xl p-2 text-left transition-all duration-300 group hover:bg-secondary",
                  collapsed && "justify-center"
                )}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden border border-border/50 group-hover:border-primary/30 transition-colors">
                  {user?.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-primary">{user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}</span>
                  )}
                </div>
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-sm truncate text-foreground">{user?.displayName || "User"}</p>
                      {isAdmin && <Shield className="w-3 h-3 text-amber-500" />}
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-tight">{user?.email}</p>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2 rounded-2xl border-border/50 backdrop-blur-xl bg-background/90" side={collapsed ? "right" : "top"} align={collapsed ? "end" : "center"} sideOffset={12}>
              <DropdownMenuLabel className="font-bold px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground">Account Settings</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuGroup className="p-1">
                {isAdmin && (
                  <DropdownMenuItem onClick={() => router.push("/admin")} className="rounded-xl p-2.5 cursor-pointer text-amber-500 focus:bg-amber-500/10 focus:text-amber-500">
                    <Shield className="mr-3 h-4 w-4" />
                    <span className="font-bold">Admin Dashboard</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => router.push("/dashboard/account")} className="rounded-xl p-2.5 cursor-pointer">
                  <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Workspace Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info("Billing is not yet implemented.")} className="rounded-xl p-2.5 cursor-pointer">
                  <CreditCard className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Billing & Plans</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem onClick={toggleTheme} className="rounded-xl p-2.5 cursor-pointer">
                {theme === "light" ? (
                  <>
                    <Moon className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Light Mode</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem onClick={handleLogout} className="rounded-xl p-2.5 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                <LogOut className="mr-3 h-4 w-4" />
                <span className="font-bold">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </aside>
  )
}
