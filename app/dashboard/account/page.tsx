"use client"

import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function AccountPage() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Please log in to view this page.</p>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto bg-background">
            <div className="max-w-4xl mx-auto p-10">
                <h1 className="text-3xl font-serif mb-8">Account Settings</h1>

                <div className="space-y-8">
                    <div className="grid gap-4 p-6 border rounded-xl bg-card">
                        <h2 className="text-xl font-semibold">Profile Information</h2>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Display Name</Label>
                            <Input id="name" defaultValue={user.displayName || ""} disabled />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" defaultValue={user.email || ""} disabled />
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                            Profile editing is managed through your social login provider.
                        </p>
                    </div>

                    <div className="grid gap-4 p-6 border rounded-xl bg-card border-destructive/20 text-destructive">
                        <h2 className="text-xl font-semibold">Danger Zone</h2>
                        <p className="text-sm">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <Button variant="destructive" className="w-fit" onClick={() => toast.error("Account deletion is not yet implemented.")}>
                            Delete Account
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
