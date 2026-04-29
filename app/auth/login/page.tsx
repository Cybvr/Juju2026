"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Loader2, PlayCircle, Wand2 } from "lucide-react"
import { auth } from "@/lib/firebase"
import {
    signInWithPopup,
    signInWithRedirect,
    GoogleAuthProvider,
    getRedirectResult
} from "firebase/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useEffect, useState } from "react"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const checkRedirect = async () => {
            try {
                const result = await getRedirectResult(auth)
                if (result) {
                    toast.success("Successfully logged in!")
                    router.push("/dashboard")
                }
            } catch (error: any) {
                console.error("Redirect error:", error)
            }
        }
        checkRedirect()
    }, [router])

    const handleGoogleLogin = async () => {
        if (isLoading) return
        setIsLoading(true)
        const provider = new GoogleAuthProvider()
        try {
            await signInWithPopup(auth, provider)
            toast.success("Logged in with Google")
            router.push("/dashboard")
        } catch (error: any) {
            console.error("Google login error:", error)
            if (error.code === "auth/popup-blocked" || error.code === "auth/cancelled-popup-request") {
                toast.info("Popups blocked. Trying redirect...")
                await signInWithRedirect(auth, provider)
            } else {
                toast.error(error.message || "Failed to login with Google")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
            <main className="relative min-h-screen overflow-hidden">
                <section className="relative flex min-h-screen items-center overflow-hidden py-6">
                    <div className="absolute left-1/2 top-1/2 -z-10 h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[140px]" />

                    <div className="container mx-auto grid items-center gap-8 px-6 lg:grid-cols-[1fr_420px]">
                        <div className="relative order-2 hidden min-h-[430px] lg:order-1 lg:block">
                            <div className="absolute inset-x-0 top-0 flex justify-center gap-4 opacity-40 blur-[1px]">
                                {["/images/marketing/download-1.png", "/images/marketing/download-2.png", "/images/marketing/download.png"].map((image, index) => (
                                    <div
                                        key={image}
                                        className="relative h-64 w-44 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl"
                                        style={{ transform: `translateY(${index === 1 ? "24px" : "0"}) rotate(${index === 0 ? "-8deg" : index === 2 ? "8deg" : "0"})` }}
                                    >
                                        <Image src={image} alt="Juju video sample" fill className="object-cover" sizes="(min-width: 768px) 224px, 176px" />
                                    </div>
                                ))}
                            </div>

                            <div className="relative mx-auto mt-12 aspect-video w-full max-w-2xl overflow-hidden rounded-[2rem] border-[6px] border-border/20 bg-card shadow-2xl">
                                <Image src="/images/marketing/download.png" alt="Juju animation dashboard" fill priority className="object-cover opacity-90" sizes="(min-width: 1024px) 55vw, 90vw" />
                                <div className="absolute inset-0 bg-gradient-to-br from-background/45 to-transparent" />
                                <div className="absolute left-5 top-5 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                                        <Image src="/images/juju.png" alt="Juju" width={24} height={24} className="h-6 w-6 object-contain" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="h-2 w-24 rounded-full bg-foreground/20" />
                                        <div className="h-2 w-16 rounded-full bg-foreground/10" />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-4 left-8 z-20 w-80 rounded-[1.5rem] border border-border bg-background p-5 shadow-2xl">
                                <p className="mb-4 text-lg font-bold leading-snug text-foreground">
                                    Turn a script into a finished cartoon video
                                </p>
                                <div className="flex h-12 items-center justify-center gap-3 rounded-2xl bg-primary text-base font-black text-primary-foreground shadow-xl">
                                    <Wand2 className="size-6" />
                                    GENERATE
                                </div>
                            </div>

                            <div className="absolute bottom-8 right-0 z-20 w-44 rotate-6 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-2xl">
                                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                                    <PlayCircle className="size-6 text-primary" />
                                </div>
                                <h2 className="mb-1 text-xl font-black tracking-tight">JUJU</h2>
                                <p className="text-[10px] font-bold uppercase text-muted-foreground">AI Animation Suite</p>
                            </div>
                        </div>

                        <div className="order-1 mx-auto w-full max-w-md lg:order-2">
                            <div className="rounded-[2rem] border border-border bg-background p-5 shadow-2xl md:p-7">
                                <div className="mb-6">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                                        <Image src="/images/juju.png" alt="Juju" width={28} height={28} className="h-7 w-7 object-contain" />
                                    </div>
                                    <h1 className="mb-2 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
                                        Welcome to Juju
                                    </h1>
                                    <p className="text-sm font-medium leading-6 text-muted-foreground">
                                        Sign in to create epic cartoon videos from your scripts.
                                    </p>
                                </div>

                                <div className="grid gap-3">
                                    <Button
                                        variant="outline"
                                        className="h-12 w-full rounded-2xl text-sm font-bold"
                                        onClick={handleGoogleLogin}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="size-5 animate-spin" />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5">
                                                <path
                                                    fill="currentColor"
                                                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.909 3.264-2.09 4.34-1.206 1.082-3.134 1.955-5.75 1.955-4.638 0-8.374-3.746-8.374-8.374s3.736-8.374 8.374-8.374c2.535 0 4.399.98 5.768 2.278l2.312-2.313C18.505 1.352 15.827 0 12.48 0 5.46 0 0 5.46 0 12.48S5.46 24.96 12.48 24.96c3.742 0 6.551-1.241 8.711-3.492 2.197-2.197 3.011-5.342 3.011-8.031 0-.693-.053-1.355-.152-2.015H12.48z"
                                                />
                                            </svg>
                                        )}
                                        {isLoading ? "Connecting..." : "Continue with Google"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
