import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MarketingFooter } from "@/components/marketing/footer"
import { MarketingHeader } from "@/components/marketing/header"

type CategoryItem = {
  slug: string
  title: string
  eyebrow: string
  description: string
  image: string
  icon: typeof Sparkles
  outcomes: string[]
  videoIdeas: string[]
}

export function MarketingIndexPage({
  eyebrow,
  title,
  description,
  items,
  basePath,
}: {
  eyebrow: string
  title: string
  description: string
  items: CategoryItem[]
  basePath: string
}) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <MarketingHeader />
      <main className="pt-32">
        <section className="px-4 py-16 md:px-6">
          <div className="container mx-auto">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-primary" />
                {eyebrow}
              </div>
              <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">{title}</h1>
              <p className="text-sm font-medium leading-relaxed text-muted-foreground md:text-base">{description}</p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.slug}
                  href={`${basePath}/${item.slug}`}
                  className="group overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition-all hover:border-primary hover:shadow-xl"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <Image src={item.image} alt={`${item.title} preview`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background/85 backdrop-blur">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="p-7">
                    <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-primary">{item.eyebrow}</p>
                    <h2 className="mb-3 text-xl font-bold text-foreground">{item.title}</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    <div className="mt-6 flex items-center gap-2 text-sm font-bold text-primary">
                      Explore page <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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

export function MarketingDetailPage({
  item,
  categoryLabel,
  indexHref,
  audienceLabel,
  audience,
}: {
  item: CategoryItem
  categoryLabel: string
  indexHref: string
  audienceLabel: string
  audience: string
}) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <MarketingHeader />
      <main className="pt-32">
        <section className="px-4 py-16 md:px-6">
          <div className="container mx-auto grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <Link href={indexHref} className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground">
                {categoryLabel}
              </Link>
              <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
                {item.title} can create cartoon videos from any script
              </h1>
              <p className="mb-8 text-base font-medium leading-relaxed text-muted-foreground">{item.description}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/auth/login">
                  <Button className="rounded-full px-8 py-6 font-black">
                    Start creating <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/use-cases/explainer-videos">
                  <Button variant="outline" className="rounded-full px-8 py-6 font-black">
                    See explainer videos
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl">
              <div className="relative aspect-video">
                <Image src={item.image} alt={`${item.title} animated video example`} fill className="object-cover" priority />
              </div>
              <div className="p-6">
                <p className="text-[10px] font-black uppercase tracking-wider text-primary">{item.eyebrow}</p>
                <p className="mt-2 text-sm font-bold text-foreground">{audienceLabel}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{audience}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-muted px-4 py-16 md:px-6">
          <div className="container mx-auto grid gap-8 md:grid-cols-2">
            <div className="rounded-[2rem] border border-border bg-background p-8">
              <h2 className="mb-6 text-2xl font-bold">What Juju helps you do</h2>
              <div className="space-y-4">
                {item.outcomes.map((outcome) => (
                  <div key={outcome} className="flex items-center gap-3 text-sm font-bold text-foreground/85">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                    {outcome}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-border bg-background p-8">
              <h2 className="mb-6 text-2xl font-bold">Video ideas to create</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {item.videoIdeas.map((idea) => (
                  <div key={idea} className="rounded-2xl border border-border bg-card p-4 text-sm font-bold text-foreground/85">
                    {idea}
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
