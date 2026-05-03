"use client"

import { useEffect, useState } from "react"
import { Users, Video, Activity, ArrowUpRight, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { adminService } from "@/lib/services/adminService"
import { cn } from "@/lib/utils"

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true)
    const [recentActivity, setRecentActivity] = useState<any[]>([])
    const [realStats, setRealStats] = useState({
        totalUsers: 0,
        totalProjects: 0,
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [stats, activity] = await Promise.all([
                    adminService.getStats(),
                    adminService.getRecentActivity()
                ])
                setRealStats(stats)
                setRecentActivity(activity)
            } catch (error) {
                console.error("Error fetching admin data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const stats = [
        {
            title: "Total Users",
            value: realStats.totalUsers.toLocaleString(),
            change: "+100%",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "Total Projects",
            value: realStats.totalProjects.toLocaleString(),
            change: "+100%",
            icon: Video,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            title: "Active Sessions",
            value: "1",
            change: "Live",
            icon: Activity,
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
    ]

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-black tracking-tight mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground font-medium">Overview of your platform's performance and management.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.title} className="border-border/50 bg-card/50 backdrop-blur-xl rounded-sm overflow-hidden group hover:border-primary/30 transition-all duration-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{stat.title}</CardTitle>
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-md`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black mb-1">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-border/50 bg-card/50 backdrop-blur-xl rounded-sm p-6 space-y-4">
                    <h2 className="text-xl font-bold">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Button asChild className="h-24 rounded-md flex flex-col gap-2 bg-secondary hover:bg-secondary/80 text-foreground border-none">
                            <Link href="/admin/users">
                                <Users className="w-6 h-6" />
                                <span className="font-bold">Manage Users</span>
                            </Link>
                        </Button>
                        <Button asChild className="h-24 rounded-md flex flex-col gap-2 bg-secondary hover:bg-secondary/80 text-foreground border-none">
                            <Link href="/admin/projects">
                                <Video className="w-6 h-6" />
                                <span className="font-bold">Manage Projects</span>
                            </Link>
                        </Button>
                    </div>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur-xl rounded-sm p-6">
                    <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {recentActivity.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">No recent activity.</p>
                        ) : (
                            recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-md hover:bg-secondary/50 transition-colors">
                                    <div className={cn(
                                        "w-10 h-10 rounded-md flex items-center justify-center font-bold",
                                        activity.type === 'user' ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
                                    )}>
                                        {activity.type === 'user' ? <Users className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate">{activity.text}</p>
                                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-tight">
                                            {activity.timestamp.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}
