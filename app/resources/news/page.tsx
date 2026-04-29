import Link from "next/link"
import { ArrowRight, Newspaper } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MarketingFooter } from "@/components/marketing/footer"
import { MarketingHeader } from "@/components/marketing/header"

const updates = [
  "New resource pages for company updates and customer stories.",
  "Expanded marketing pages for creators, use cases, and industries.",
  "More animated video examples for creators and teams.",
]

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <MarketingHeader />
      <main className="pt-32">
        <section className="px-4 py-16 md:px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-[10px] font-black uppercase tracking-wider">
              <Newspaper className="h-4 w-4 text-primary" />
              News
            </div>
            <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">Juju news and updates</h1>
            <p className="text-base font-medium leading-relaxed text-muted-foreground">
              Product notes, company updates, and new resources for creators using Juju to make animated videos.
            </p>
            <div className="mt-10 space-y-4">
              {updates.map((update) => (
                <div key={update} className="rounded-[2rem] border border-border bg-card p-6 text-sm font-bold">
                  {update}
                </div>
              ))}
            </div>
            <Link href="/resources/case-studies" className="mt-10 inline-block">
              <Button className="rounded-full px-8 py-6 font-black">
                Read case studies <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
