"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Palette, Zap, Lock, ArrowRight, Plus } from "lucide-react"
import { PromptBox } from "@/components/prompt-box"
import { cn } from "@/lib/utils"

export default function Home() {
  const router = useRouter()
  const [attachments, setAttachments] = useState<string[]>([])
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLandingGenerate = (prompt: string, currentAttachments: string[]) => {
    // Save prompt and attachments to session storage so it can be picked up after login
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pending_prompt', prompt)
      sessionStorage.setItem('pending_attachments', JSON.stringify(currentAttachments))
    }
    router.push("/auth/login")
  }

  const toggleAttachment = (url: string) => {
    setAttachments(prev =>
      prev.includes(url)
        ? prev.filter(a => a !== url)
        : [...prev, url]
    )
  }

  const featuredImages = [
    {
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
      title: "Abstract Flow",
    },
    {
      url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2564&auto=format&fit=crop",
      title: "Neon Dreams",
    },
    {
      url: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=2564&auto=format&fit=crop",
      title: "Cyberpunk City",
    },
    {
      url: "https://images.unsplash.com/photo-1614728263952-84ea206f99b6?q=80&w=2564&auto=format&fit=crop",
      title: "Floating Islands",
    }
  ]

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <header className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-serif font-semibold tracking-tight">Juju</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground mr-8">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#showcase" className="hover:text-foreground transition-colors">Showcase</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link href="/auth/login">
              <Button size="sm" className="rounded-full px-5">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-48">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pb-24 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Next-gen AI image engine is here
            </div>
            <h2 className="text-6xl lg:text-8xl font-serif italic mb-8 tracking-tighter leading-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Reimagine <br /> <span className="text-primary">your reality</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
              Transform your wildest ideas into stunning visuals with Juju's intuitive AI suite.
              The most beautiful way to create and organize your visual universe.
            </p>
          </div>
        </section>

        {/* Visual Showcase */}
        <section id="showcase" className="py-24 bg-muted/30 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
              <div className="max-w-xl">
                <h3 className="text-3xl font-serif italic mb-4">Curated by Juju</h3>
                <p className="text-muted-foreground">Every image tells a story. Click an image to use it as a <b>reference</b> for your next generation.</p>
              </div>
              <Button variant="ghost" className="group">
                View all inspiration <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => toggleAttachment(img.url)}
                  className={cn(
                    "group relative aspect-[4/5] rounded-3xl overflow-hidden bg-background shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer",
                    attachments.includes(img.url) ? "ring-4 ring-primary ring-offset-4 ring-offset-background scale-[0.98]" : "hover:-translate-y-2"
                  )}
                >
                  <Image
                    src={img.url}
                    alt={img.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-white">
                    <p className="text-xs uppercase tracking-widest mb-1 opacity-70">Style: {img.title}</p>
                    <h4 className="text-xl font-serif italic flex items-center justify-between">
                      {img.title}
                      <Plus className={cn("w-5 h-5 transition-transform", attachments.includes(img.url) && "rotate-45")} />
                    </h4>
                  </div>
                  {attachments.includes(img.url) && (
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium text-sm shadow-lg">
                        Added as reference
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="container mx-auto px-6 py-32 border-t border-border/50">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Sparkles, title: "AI Generation", desc: "State-of-the-art models for hyper-realistic and artistic visuals." },
              { icon: Palette, title: "Infinite Style", desc: "Choose from hundreds of presets or create your own custom aesthetics." },
              { icon: Zap, title: "Real-time Magic", desc: "See your ideas come to life in seconds with our optimized processing." },
              { icon: Lock, title: "Private Vault", desc: "Your generations are private by default and stored with enterprise security." },
            ].map((f, i) => (
              <div key={i} className="group space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-6 py-32">
          <div className="relative rounded-[3rem] bg-primary p-12 md:p-24 overflow-hidden text-center">
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-black/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-2xl mx-auto text-primary-foreground">
              <h3 className="text-4xl lg:text-6xl font-serif italic mb-8">
                Ready to bring your vision to life?
              </h3>
              <p className="text-primary-foreground/80 mb-12 text-lg">
                Join thousands of creators who are already reimagining reality with Juju.
              </p>
              <Link href="/auth/login">
                <Button size="lg" variant="secondary" className="text-lg px-12 py-8 rounded-2xl shadow-xl hover:scale-105 transition-transform">
                  Start Creating for Free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Bottom Prompt Box */}
      <div className={cn(
        "fixed bottom-0 left-0 w-full z-40 p-6 md:p-8 transition-all duration-500 bg-gradient-to-t from-background via-background/80 to-transparent",
        isScrolled ? "opacity-100 translate-y-0" : "opacity-100"
      )}>
        <PromptBox
          onSubmit={handleLandingGenerate}
          variant="landing"
          attachments={attachments}
          onRemoveAttachment={(idx) => {
            const newAttachments = [...attachments]
            newAttachments.splice(idx, 1)
            setAttachments(newAttachments)
          }}
          className="max-w-4xl"
        />
      </div>

      <footer className="border-t border-border/50 py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-serif font-semibold tracking-tight">Juju</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2026 Juju. All rights reserved. Crafted for creators.
            </p>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

