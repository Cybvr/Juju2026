import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MarketingFooter } from "@/components/marketing/footer"
import { MarketingHeader } from "@/components/marketing/header"

const pillars = ["Script-first video creation", "Cartoon storytelling for any topic", "A faster path from idea to finished asset"]

export default function AboutJujuPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <MarketingHeader />
      <main className="pt-32">
        <section className="px-4 py-16 md:px-6">
          <div className="container mx-auto max-w-4xl">
            <p className="mb-4 text-[10px] font-black uppercase tracking-wider text-primary">About Juju</p>
            <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">Juju helps ideas become animated videos</h1>
            <p className="text-base font-medium leading-relaxed text-muted-foreground">
              Juju is built for creators, educators, marketers, and teams who want to turn scripts into polished cartoon videos without filming, editing timelines, or managing animation production.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {pillars.map((pillar) => (
                <div key={pillar} className="rounded-[2rem] border border-border bg-card p-6 text-sm font-bold">
                  <CheckCircle2 className="mb-4 h-5 w-5 text-primary" />
                  {pillar}
                </div>
              ))}
            </div>
            <Link href="/auth/login" className="mt-10 inline-block">
              <Button className="rounded-full px-8 py-6 font-black">
                Start creating <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
