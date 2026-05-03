"use client"

import { useState, useEffect } from "react"
import { adminService } from "@/lib/services/adminService"
import type { User } from "@/app/common/types"
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
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash, Shield, User as UserIcon, Loader2, Search } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function UsersManagement() {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setIsLoading(true)
        try {
            const data = await adminService.getAllUsers()
            setUsers(data)
        } catch (error) {
            console.error("Error fetching users:", error)
            toast.error("Failed to load users")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return
        
        try {
            await adminService.deleteUser(userId)
            setUsers(users.filter(u => u.id !== userId))
            toast.success("User deleted successfully")
        } catch (error) {
            toast.error("Failed to delete user")
        }
    }

    const handleToggleRole = async (user: User) => {
        const newRole = user.role === "admin" ? "user" : "admin"
        try {
            await adminService.updateUser(user.id, { role: newRole })
            setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u))
            toast.success(`User role updated to ${newRole}`)
        } catch (error) {
            toast.error("Failed to update role")
        }
    }

    const filteredUsers = users.filter(user => {
        const displayName = user.displayName || ""

        return (
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            displayName.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Users</h1>
                    <p className="text-muted-foreground font-medium">Manage your platform's users and their roles.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search users..." 
                        className="pl-12 h-12 rounded-md bg-card/50 border-border/50 focus:ring-primary/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-sm border border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-secondary/30">
                        <TableRow className="border-border/50 hover:bg-transparent">
                            <TableHead className="w-[300px] font-bold text-xs uppercase tracking-widest px-6 py-5">User</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-widest">Plan</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-widest">Role</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-widest">Joined</TableHead>
                            <TableHead className="text-right px-6 font-bold text-xs uppercase tracking-widest">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                        <p className="font-medium text-muted-foreground">Fetching users...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground font-medium">
                                    No users found matching your search.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => {
                                const displayName = user.displayName || user.email || "User"

                                return (
                                    <TableRow key={user.id} className="border-border/50 hover:bg-secondary/20 transition-colors">
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-md bg-primary/10 overflow-hidden flex-shrink-0 border border-border/50">
                                                    {user.photoURL ? (
                                                        <Image src={user.photoURL} alt={`${displayName} profile photo`} width={40} height={40} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center font-bold text-primary">
                                                            {displayName[0]?.toUpperCase() || "U"}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-bold truncate">{displayName}</span>
                                                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                user.plan === "enterprise" ? "bg-purple-500/10 text-purple-500" :
                                                user.plan === "pro" ? "bg-primary/10 text-primary" :
                                                "bg-secondary text-muted-foreground"
                                            }`}>
                                                {user.plan}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {user.role === "admin" ? (
                                                    <Shield className="w-3 h-3 text-amber-500" />
                                                ) : (
                                                    <UserIcon className="w-3 h-3 text-muted-foreground" />
                                                )}
                                                <span className={`text-sm font-bold ${user.role === "admin" ? "text-amber-500" : "text-foreground"}`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm font-medium text-muted-foreground">
                                            {user.createdAt.toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right px-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-md hover:bg-secondary">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-md border-border/50 backdrop-blur-xl">
                                                    <DropdownMenuLabel className="px-3 py-2 text-xs uppercase font-black text-muted-foreground tracking-widest">Management</DropdownMenuLabel>
                                                    <DropdownMenuItem 
                                                        onClick={() => handleToggleRole(user)}
                                                        className="rounded-md p-2.5 cursor-pointer font-bold"
                                                    >
                                                        <Shield className="mr-3 h-4 w-4" />
                                                        {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="rounded-md p-2.5 cursor-pointer font-bold text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                    >
                                                        <Trash className="mr-3 h-4 w-4" />
                                                        Delete User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
