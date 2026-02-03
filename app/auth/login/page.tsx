"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GalleryVerticalEnd, Loader2 } from "lucide-react"
import { auth } from "@/lib/firebase"
import {
    signInWithPopup,
    signInWithRedirect,
    GoogleAuthProvider,
    GithubAuthProvider,
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

    const handleGithubLogin = async () => {
        if (isLoading) return
        setIsLoading(true)
        const provider = new GithubAuthProvider()
        try {
            await signInWithPopup(auth, provider)
            toast.success("Logged in with GitHub")
            router.push("/dashboard")
        } catch (error: any) {
            console.error("GitHub login error:", error)
            if (error.code === "auth/popup-blocked" || error.code === "auth/cancelled-popup-request") {
                toast.info("Popups blocked. Trying redirect...")
                await signInWithRedirect(auth, provider)
            } else {
                toast.error(error.message || "Failed to login with GitHub")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-medium">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        <span className="text-xl font-serif font-semibold">Juju</span>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Welcome to Juju</h1>
                                <p className="text-balance text-sm text-muted-foreground">
                                    Login with your social account to continue
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <Button
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2 h-11"
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
                                <Button
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2 h-11"
                                    onClick={handleGithubLogin}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="size-5 animate-spin" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5">
                                            <path
                                                fill="currentColor"
                                                d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"
                                            />
                                        </svg>
                                    )}
                                    {isLoading ? "Connecting..." : "Continue with GitHub"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <img
                    src="/images/boxer-1.jpg"
                    alt="Login Background"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
