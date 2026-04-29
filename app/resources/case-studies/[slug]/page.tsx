import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MarketingFooter } from "@/components/marketing/footer"
import { MarketingHeader } from "@/components/marketing/header"
import { caseStudies, getCaseStudy } from "@/lib/marketing/csestudies"

export function generateStaticParams() {
  return caseStudies.map((study) => ({
    slug: study.slug,
  }))
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const study = getCaseStudy(slug)

  if (!study) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <MarketingHeader />
      <main className="pt-32">
        <section className="px-4 py-16 md:px-6">
          <div className="container mx-auto grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <Link href="/resources/case-studies" className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground">
                Case Studies
              </Link>
              <p className="mb-4 text-[10px] font-black uppercase tracking-wider text-primary">{study.industry}</p>
              <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">{study.title}</h1>
              <p className="mb-8 text-base font-medium leading-relaxed text-muted-foreground">{study.description}</p>
              <Link href="/auth/login">
                <Button className="rounded-full px-8 py-6 font-black">
                  Start creating <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl">
              <div className="relative aspect-video">
                <Image src={study.image} alt={`${study.title} animated video example`} fill className="object-cover" priority />
              </div>
              <div className="p-6">
                <p className="text-[10px] font-black uppercase tracking-wider text-primary">Result</p>
                <p className="mt-2 text-sm font-bold text-foreground">{study.result}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-muted px-4 py-16 md:px-6">
          <div className="container mx-auto grid gap-8 md:grid-cols-3">
            <div className="rounded-[2rem] border border-border bg-background p-8">
              <h2 className="mb-4 text-2xl font-bold">Challenge</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{study.challenge}</p>
            </div>
            <div className="rounded-[2rem] border border-border bg-background p-8">
              <h2 className="mb-4 text-2xl font-bold">Solution</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{study.solution}</p>
            </div>
            <div className="rounded-[2rem] border border-border bg-background p-8">
              <h2 className="mb-4 text-2xl font-bold">Outcomes</h2>
              <div className="space-y-4">
                {study.outcomes.map((outcome) => (
                  <div key={outcome} className="flex items-center gap-3 text-sm font-bold text-foreground/85">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                    {outcome}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
