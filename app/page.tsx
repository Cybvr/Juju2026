import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Palette, Zap, Lock } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif font-semibold">Reve</h1>
          <Link href="/dashboard">
            <Button variant="outline">Get Started</Button>
          </Link>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl lg:text-7xl font-serif italic mb-6 tracking-tight">
              Reimagine reality
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Transform your ideas into stunning visuals with AI-powered image generation.
              Create, organize, and refine your visual content effortlessly.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="text-base px-8">
                Start Creating
              </Button>
            </Link>
          </div>
        </section>

        <section className="border-t border-border bg-muted/30">
          <div className="container mx-auto px-6 py-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold">AI-Powered Generation</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Turn text descriptions into stunning images using advanced AI technology
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center">
                  <Palette className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold">Smart Organization</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Keep your creations organized with albums and intuitive management tools
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold">Lightning Fast</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Generate high-quality images in seconds with optimized processing
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold">Secure & Private</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your creations are stored securely with enterprise-grade protection
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="container mx-auto px-6 py-20 text-center">
            <h3 className="text-3xl lg:text-4xl font-serif italic mb-6">
              Ready to bring your vision to life?
            </h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Join creators who are reimagining reality with Reve
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="text-base px-8">
                Start Creating for Free
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2026 Reve. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
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
