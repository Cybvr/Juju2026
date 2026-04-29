import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { MarketingFooter } from "@/components/marketing/footer"
import { MarketingHeader } from "@/components/marketing/header"
import { caseStudies } from "@/lib/marketing/csestudies"

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <MarketingHeader />
      <main className="pt-32">
        <section className="px-4 py-16 md:px-6">
          <div className="container mx-auto">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-primary" />
                Case Studies
              </div>
              <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">Real Juju workflows in action</h1>
              <p className="text-sm font-medium leading-relaxed text-muted-foreground md:text-base">
                Explore how teams use Juju to turn scripts, briefs, and lessons into animated videos for launches, learning, and campaigns.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {caseStudies.map((study) => (
                <Link
                  key={study.slug}
                  href={`/resources/case-studies/${study.slug}`}
                  className="group overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition-all hover:border-primary hover:shadow-xl"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <Image src={study.image} alt={`${study.title} preview`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background/85 backdrop-blur">
                      <study.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="p-7">
                    <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-primary">{study.eyebrow}</p>
                    <h2 className="mb-3 text-xl font-bold text-foreground">{study.title}</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">{study.description}</p>
                    <p className="mt-5 text-sm font-black text-foreground">{study.result}</p>
                    <div className="mt-6 flex items-center gap-2 text-sm font-bold text-primary">
                      Read case study <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
