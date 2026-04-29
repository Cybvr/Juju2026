"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, 
  MousePointer2, 
  Rocket, 
  PlayCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Palette, 
  Wand2, 
  Globe, 
  Users, 
  ShieldCheck, 
  Music, 
  Mic2, 
  Layout, 
  ChevronDown,
  ArrowRight,
  Star,
  Quote
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const marketingImages = [
  "/images/marketing/download.png",
  "/images/marketing/download-1.png",
  "/images/marketing/download-2.png",
  "/images/marketing/1.webp",
  "/images/marketing/2.webp",
  "/images/marketing/3.webp",
  "/images/marketing/4.webp",
  "/images/marketing/adventure.webp",
  "/images/marketing/artist.webp",
  "/images/marketing/cloud.webp",
  "/images/marketing/joyful.webp",
  "/images/marketing/robt.webp",
  "/images/marketing/wizard.webp",
]

const sampleVideos = [
  { title: "The Grand Adventure", image: "/images/marketing/adventure.webp" },
  { title: "Artist at Work", image: "/images/marketing/artist.webp" },
  { title: "How Clouds create Rain", image: "/images/marketing/cloud.webp" },
  { title: "A Joyful Moment", image: "/images/marketing/joyful.webp" },
  { title: "The Robot Story", image: "/images/marketing/robt.webp" },
  { title: "Parisian Dream", image: "/images/marketing/download.png" },
]

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const faqs = [
    { q: "Do I need to install Juju?", a: "No, Juju is a cloud-based platform. You can access it from any browser on MAC or Windows." },
    { q: "Does it work on MAC or Windows?", a: "Yes! Since it's web-based, it works perfectly on both operating systems." },
    { q: "Can I try Juju for free?", a: "We occasionally offer trials, but right now we have a massive launch discount and a 100% money-back guarantee." },
    { q: "How do I get support?", a: "We provide premium support included in your plan. You can reach out via our support portal anytime." },
    { q: "Is there a Money Back Guarantee Policy?", a: "Yes! If you create one video and don't like it, we will refund all your money and let you keep the videos you created." },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/juju.png" alt="Juju" width={32} height={32} className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold tracking-tight text-foreground">Juju</span>
            </Link>
          </div>
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#samples" className="hover:text-foreground transition-colors">Samples</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">Support</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link href="/auth/login">
              <Button className="rounded-full px-6 transition-all hover:scale-105 active:scale-95">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-44 pb-44 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 blur-[160px] rounded-full -z-10" />
          
          <div className="container mx-auto px-6 relative">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border text-foreground text-[10px] font-black uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <Image src="/images/juju.png" alt="Juju Logo" width={16} height={16} className="w-4 h-4 object-contain" />
                <span>AI Powered Storytelling</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tighter leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                Create Epic <span className="text-primary underline decoration-primary/30 underline-offset-4">CARTOON</span> videos <br /> with just a script
              </h1>
            </div>

            {/* Visual Stack Recreated */}
            <div className="relative max-w-6xl mx-auto h-[400px] md:h-[600px] flex items-center justify-center">
              {/* Carousel Background (Thumbnails) */}
              <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-40 scale-90 blur-[1px] pointer-events-none">
                {[7, 8, 9, 10, 11].map((idx, i) => (
                  <div key={i} className={cn(
                    "w-48 h-64 rounded-2xl overflow-hidden border border-border/50 relative",
                    i === 2 ? "z-0 scale-110 opacity-60" : "opacity-40"
                  )}>
                    <Image src={marketingImages[idx]} alt="Gallery" fill className="object-cover" />
                  </div>
                ))}
              </div>

              {/* Main App Mockup */}
              <div className="relative z-10 w-full max-w-4xl bg-card border-[6px] border-border/20 rounded-[2rem] shadow-2xl overflow-hidden aspect-video transform perspective-1000 hover:rotate-x-1 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-transparent" />
                <Image src={marketingImages[3]} alt="Juju Dashboard" fill className="object-cover opacity-90" />
                
                {/* Internal UI elements (Stylized) */}
                <div className="absolute top-6 left-6 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <Image src="/images/juju.png" alt="Juju" width={24} height={24} className="w-6 h-6 object-contain" />
                  </div>
                  <div className="space-y-1">
                    <div className="w-24 h-2 bg-foreground/20 rounded-full" />
                    <div className="w-16 h-2 bg-foreground/10 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Overlapping Prompt Box */}
              <div className="absolute -bottom-10 left-4 md:left-20 z-20 w-72 md:w-96 p-6 md:p-8 bg-background border border-border rounded-[1.5rem] shadow-2xl animate-in fade-in slide-in-from-left-12 duration-1000 delay-300">
                <p className="text-base md:text-xl font-bold mb-6 text-foreground leading-snug">
                  A man driving an open car during summer vacation
                </p>
                <Link href="/auth/login">
                  <Button className="w-full h-14 md:h-16 rounded-2xl bg-primary text-primary-foreground font-black text-xl flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all">
                    <Wand2 className="w-6 h-6" />
                    GENERATE
                  </Button>
                </Link>
              </div>

              {/* Product Box Mockup */}
              <div className="absolute -bottom-10 -right-4 md:right-10 z-20 w-40 md:w-56 aspect-[3/4] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden rotate-6 hover:rotate-0 transition-transform duration-500 animate-in fade-in slide-in-from-right-12 duration-1000 delay-500">
                <div className="absolute inset-0 bg-primary/10" />
                <div className="p-4 h-full flex flex-col justify-between">
                  <Image src="/images/juju.png" alt="Logo" width={32} height={32} className="w-8 h-8 object-contain mb-4" />
                  <div className="mt-auto">
                    <h4 className="text-xl font-black text-foreground mb-1 tracking-tighter">JUJU</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">The Ultimate AI Animation Suite</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Value Prop Under Hero */}
            <div className="max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 text-sm">
              <div className="p-6 rounded-3xl bg-card border border-border group hover:bg-accent transition-all">
                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Breathtaking</h3>
                <p className="text-muted-foreground text-sm">Cartoon Animation Videos In 3 Clicks</p>
              </div>
              <div className="p-6 rounded-3xl bg-card border border-border group hover:bg-accent transition-all">
                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Skyrocket Engagement</h3>
                <p className="text-muted-foreground text-sm">And Boost Sales by 337% with cartoon videos</p>
              </div>
              <div className="p-6 rounded-3xl bg-card border border-border group hover:bg-accent transition-all">
                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Quote className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium  mb-2 text-foreground">“This video was generated using Juju”</h3>
                <p className="text-muted-foreground text-xs">— Trusted by Creators</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Value Prop */}
        <section className="py-24 bg-muted border-y border-border">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-tight text-foreground">
                  Generate fully animated <span className="text-primary underline decoration-primary/30 underline-offset-4">CARTOON</span> videos on demand
                </h2>
                <p className="text-sm text-muted-foreground mb-8 font-medium">
                  Without hiring animators or fighting complicated timelines. Juju handles the entire creative process.
                </p>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center">
                      <Layout className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1 text-foreground">Full Length Text-To-Video</h4>
                      <p className="text-xs text-muted-foreground font-medium">Create long videos with same style: 5 minute long not 5 second.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center">
                      <Palette className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1 text-foreground">Multi-Style Cartoon Library</h4>
                      <p className="text-xs text-muted-foreground font-medium">3D, Classic Cartoon, Modern, Comic Book, and More.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <div className="aspect-video rounded-3xl overflow-hidden border border-border bg-card flex items-center justify-center shadow-2xl relative">
                  <Image 
                    src={marketingImages[0]} 
                    alt="Juju animated video preview" 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-background/10" />
                  <PlayCircle className="w-12 h-12 text-white drop-shadow-lg opacity-90 group-hover:opacity-100 transition-opacity z-10" />
                </div>
                <div className="absolute -bottom-6 -right-6 p-6 bg-primary text-primary-foreground rounded-3xl shadow-2xl hidden md:block">
                  <p className="text-2xl font-bold ">“So Simple a child can master it”</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Click Workflow */}
        <section className="py-12 px-4 md:px-6">
          <div className="container mx-auto bg-card border border-border rounded-[2rem] p-8 md:p-16">
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-3  text-foreground uppercase tracking-tight">Juju Builds The <span className="text-primary underline decoration-primary/30 underline-offset-4">ENTIRE</span> Video For You</h2>
              <p className="text-lg text-muted-foreground font-bold ">With Just 3 Clicks!</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connector lines (Desktop) */}
              <div className="hidden md:block absolute top-20 left-[10%] right-[10%] h-px bg-border" />
              
              {[
                {
                  step: "Click 1",
                  title: "Describe IT",
                  desc: "Paste your script… or just type your idea. It can be as simple as: “a bee explaining the law of gravity”",
                  icon: MousePointer2,
                },
                {
                  step: "Click 2",
                  title: "Generate IT",
                  desc: "Hit Generate and Juju turns your words into a complete video: Storyboard, Characters, Animations, Voiceover + Music.",
                  icon: Wand2,
                },
                {
                  step: "Click 3",
                  title: "DOWNLOAD IT",
                  desc: "Download the finished video… Or jump into the editor and customize anything you want before you export.",
                  icon: Rocket,
                }
              ].map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="w-20 h-20 rounded-3xl bg-muted border border-border text-primary flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110">
                    <item.icon className="w-10 h-10" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">{item.step}</span>
                    <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-bold">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16">
              <Link href="/auth/login">
                <Button size="default" className="text-sm py-6 px-8 rounded-full font-black shadow-xl transition-all hover:scale-105 active:scale-95">
                  Click Below To Secure Your Access <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-4 mt-6 text-[10px] text-muted-foreground font-black uppercase tracking-wider">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-primary" /> Support Included!</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-primary" /> Monthly Access</span>
              </div>
            </div>
          </div>
        </section>

        {/* Samples Section */}
        <section id="samples" className="py-12 px-4 md:px-6">
          <div className="container mx-auto bg-background border border-border rounded-[2rem] p-8 md:p-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-left text-foreground uppercase tracking-tight">Check Out Our <span className="text-primary underline decoration-primary/30 underline-offset-4">SAMPLES</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleVideos.map((sample, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-video rounded-2xl bg-card border border-border flex items-center justify-center mb-4 transition-all group-hover:border-primary relative overflow-hidden shadow-sm">
                    <Image 
                      src={sample.image} 
                      alt={`${sample.title} sample`} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-background/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <PlayCircle className="w-10 h-10 text-white drop-shadow-lg group-hover:scale-110 transition-all z-10" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">{sample.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-24 bg-muted border-b border-border">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground uppercase tracking-tight">Competitors Vs <span className="text-primary underline decoration-primary/30 underline-offset-4">JUJU</span></h2>
              <p className="text-sm text-muted-foreground max-w-2xl font-bold">
                Juju isn’t just a replacement for stock footage - it’s a faster, scalable, and fully customizable evolution of it.
              </p>
            </div>

            <div className="overflow-x-auto rounded-[2rem] border border-border bg-card shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-6 text-sm font-bold text-foreground uppercase tracking-wider">Features</th>
                    <th className="p-6 text-sm font-bold text-primary uppercase tracking-wider text-center bg-primary/5">Juju AI</th>
                    <th className="p-6 text-sm font-bold text-muted-foreground uppercase tracking-wider text-center">Freepik</th>
                    <th className="p-6 text-sm font-bold text-muted-foreground uppercase tracking-wider text-center">Higgsfield</th>
                    <th className="p-6 text-sm font-bold text-muted-foreground uppercase tracking-wider text-center">Runway</th>
                    <th className="p-6 text-sm font-bold text-muted-foreground uppercase tracking-wider text-center">Pika</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { f: "True 3D/2D Cartoon Styles", j: true, c1: false, c2: "Partial", c3: "Realistic", c4: "Realistic" },
                    { f: "Script-to-Full-Video (5m+)", j: true, c1: false, c2: false, c3: false, c4: false },
                    { f: "Character Consistency Engine", j: true, c1: false, c2: true, c3: "Difficult", c4: "Limited" },
                    { f: "AI Storyboard Generation", j: true, c1: false, c2: false, c3: false, c4: false },
                    { f: "Integrated Voiceover & Music", j: true, c1: false, c2: false, c3: false, c4: false },
                    { f: "Affordable Flat Monthly Rate", j: true, c1: "Varies", c2: "Expensive", c3: "High Usage Fees", c4: "Credits Based" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-accent/50 transition-colors">
                      <td className="p-6 text-sm font-medium text-foreground">{row.f}</td>
                      <td className="p-6 text-center bg-primary/5">
                        <CheckCircle2 className="w-6 h-6 text-primary mx-auto" />
                      </td>
                      <td className="p-6 text-center text-xs text-muted-foreground">
                        {typeof row.c1 === 'boolean' ? (row.c1 ? <CheckCircle2 className="w-5 h-5 text-muted-foreground mx-auto" /> : <XCircle className="w-5 h-5 text-destructive/50 mx-auto" />) : row.c1}
                      </td>
                      <td className="p-6 text-center text-xs text-muted-foreground">
                        {typeof row.c2 === 'boolean' ? (row.c2 ? <CheckCircle2 className="w-5 h-5 text-muted-foreground mx-auto" /> : <XCircle className="w-5 h-5 text-destructive/50 mx-auto" />) : row.c2}
                      </td>
                      <td className="p-6 text-center text-xs text-muted-foreground">
                        {typeof row.c3 === 'boolean' ? (row.c3 ? <CheckCircle2 className="w-5 h-5 text-muted-foreground mx-auto" /> : <XCircle className="w-5 h-5 text-destructive/50 mx-auto" />) : row.c3}
                      </td>
                      <td className="p-6 text-center text-xs text-muted-foreground">
                        {typeof row.c4 === 'boolean' ? (row.c4 ? <CheckCircle2 className="w-5 h-5 text-muted-foreground mx-auto" /> : <XCircle className="w-5 h-5 text-destructive/50 mx-auto" />) : row.c4}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-12 px-4 md:px-6">
          <div className="container mx-auto bg-card border border-border rounded-[2rem] p-8 md:p-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-16 text-left  text-foreground uppercase tracking-tight">Juju <span className="text-primary underline decoration-primary/30 underline-offset-4">UNMATCHED</span> Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">
              {[
                { title: "AI Video Wizard Engine", desc: "Type an idea or paste a script - Juju generates storyboard, scenes, voiceover, music, and final video automatically.", icon: Wand2, image: "/images/marketing/wizard.webp" },
                { title: "Create Unlimited Toon Videos", desc: "Generate as many toon videos as you desire, empowering you to express your creativity without boundaries.", icon: Rocket, image: "/images/marketing/adventure.webp" },
                { title: "10+ Visual Styles Included", desc: "Instantly switch the look of your entire video: 3D, classic, modern, comic book, illustration, and more.", icon: Palette, image: "/images/marketing/artist.webp" },
                { title: "Cloud-Rendered HD Exports", desc: "No heavy processing on your computer — Juju renders in the cloud and delivers a ready-to-download HD video.", icon: Globe, image: "/images/marketing/cloud.webp" },
                { title: "Character Consistency Engine", desc: "Create a character once - and keep the same look across the entire video (same face, same outfit).", icon: Users, image: "/images/marketing/joyful.webp" },
                { title: "AI Music Composer", desc: "Generate original background music by mood — plus ducking, fade-in/out, and multiple variations.", icon: Music, image: "/images/marketing/robt.webp" },
              ].map((f, i) => (
                <div key={i} className="rounded-[2rem] bg-card border border-border hover:border-primary transition-all group shadow-sm hover:shadow-lg overflow-hidden">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    <Image
                      src={f.image}
                      alt={`${f.title} feature preview`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 w-14 h-14 rounded-2xl bg-background/80 backdrop-blur border border-border flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <f.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold mb-4 text-foreground">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-12 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto rounded-[2.5rem] bg-border p-px shadow-2xl">
              <div className="bg-card rounded-[2.5rem] overflow-hidden relative">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -ml-48 -mt-48" />
                
                <div className="grid lg:grid-cols-2 items-stretch">
                  {/* Left Side: Pricing Info */}
                  <div className="p-10 md:p-16 relative z-10 border-r border-border/50">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground uppercase tracking-tight"><span className="text-primary underline decoration-primary/30 underline-offset-4">MONTHLY</span> Plan</h2>
                    <div className="flex items-center gap-2 mb-8 text-foreground">
                      <span className="text-5xl md:text-6xl font-extrabold">$80</span>
                      <span className="text-lg text-muted-foreground font-bold">/ month</span>
                    </div>
                    
                    <ul className="max-w-md space-y-3 mb-12 text-left text-xs font-bold">
                      {[
                        "Generate fully animated cartoon videos",
                        "Styles included: 3D, classic, modern, comic",
                        "Storyboard + characters + animations auto-generated",
                        "Voiceover + background music included",
                        "Advanced editor customization",
                        "Free updates and support",
                        "Cancel anytime"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                          <span className="text-foreground/80">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/auth/login">
                      <Button size="lg" className="w-full sm:w-auto text-xl py-8 px-12 rounded-full font-bold shadow-xl transition-all hover:scale-105 active:scale-95">
                        Subscribe Now <ArrowRight className="ml-2 w-6 h-6" />
                      </Button>
                    </Link>

                    <div className="mt-8 p-6 rounded-2xl bg-muted border border-border backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm">
                        <ShieldCheck className="w-4 h-4" />
                        <span>100% Money Back Guarantee</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Image Content */}
                  <div className="relative group hidden lg:block bg-muted/30">
                    <Image 
                      src={marketingImages[1]} 
                      alt="Juju interface preview" 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-background/20 via-transparent to-transparent" />
                    <div className="absolute bottom-10 left-10 right-10 p-6 bg-background/60 backdrop-blur-xl border border-border rounded-3xl shadow-2xl">
                      <p className="text-xl font-bold mb-2">Create Professional Videos</p>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Join 5,000+ happy creators today</p>
                    </div>
                    <div className="absolute top-10 right-10 p-6 bg-primary text-primary-foreground rounded-3xl shadow-2xl font-black text-2xl tracking-tighter transform rotate-3">
                      SAVE 81%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-muted border-b border-border">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-left text-foreground uppercase tracking-tight">Frequently Asked <span className="text-primary underline decoration-primary/30 underline-offset-4">QUESTIONS</span></h2>
            <div className="space-y-3 max-w-4xl text-sm">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-border bg-background overflow-hidden transition-all hover:shadow-sm">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-accent transition-colors"
                  >
                    <span className="text-lg font-bold text-foreground">{faq.q}</span>
                    <ChevronDown className={cn("w-5 h-5 transition-transform text-muted-foreground", activeFaq === i && "rotate-180")} />
                  </button>
                  {activeFaq === i && (
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 px-4 md:px-6">
          <div className="container mx-auto bg-card border border-border rounded-[2rem] p-8 md:p-16 relative overflow-hidden">
            <h2 className="text-2xl md:text-3xl font-bold mb-4  text-left text-foreground uppercase tracking-tight">Get Juju <span className="text-primary underline decoration-primary/30 underline-offset-4">RIGHT NOW</span></h2>
            <p className="text-lg text-primary font-bold mb-12  text-left">Get it now with 81% OFF.</p>
            
            <div className="p-10 rounded-[2rem] bg-card border border-border relative max-w-3xl group shadow-xl">
              <div className="absolute -inset-1 bg-border rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000" />
              <div className="relative">
                <h3 className="text-xl font-bold mb-8 text-foreground uppercase tracking-wide">Right now, you're one click away from:</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-left mb-12 text-xs font-bold uppercase tracking-tight">
                  {[
                    "Never needing to be on camera again",
                    "Speaking to global audiences",
                    "Creating content 100x faster",
                    "Building a real video business"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <span className="font-medium text-foreground/80">{text}</span>
                    </div>
                  ))}
                </div>
                <Link href="/auth/login">
                  <Button className="w-full text-2xl py-10 px-16 rounded-full font-extrabold shadow-2xl transition-all hover:scale-105 active:scale-95">
                    CLAIM YOUR ACCESS NOW
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-24 border-t border-border bg-card">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-24">
            <div className="max-w-sm">
              <div className="flex items-center gap-2 mb-6">
                <Image src="/images/juju.png" alt="Juju" width={24} height={24} className="w-6 h-6 object-contain" />
                <span className="text-lg font-bold text-foreground">Juju</span>
              </div>
              <p className="text-muted-foreground text-[10px] font-bold leading-relaxed uppercase tracking-tight">
                Create Epic CARTOON videos with just a script. AI-Powered Storytelling for modern creators and businesses.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-24">
              <div>
                <h4 className="font-bold mb-6 text-foreground">Product</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                  <li><a href="#samples" className="hover:text-foreground transition-colors">Samples</a></li>
                  <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-foreground">Company</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Terms & Conditions</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Refund Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-foreground">Support</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-xs text-muted-foreground text-center md:text-left max-w-3xl">
              DISCLAIMER - The results mentioned are not typical. Individual results will vary. We are not affiliated with Google, YouTube, Facebook, Instagram, TikTok. FACEBOOK is a trademark of FACEBOOK, Inc.
            </p>
            <p className="text-xs text-muted-foreground">
              Copyright © 2026 Juju. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
