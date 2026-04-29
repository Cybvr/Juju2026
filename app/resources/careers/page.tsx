import Link from "next/link"
import { ArrowRight, BriefcaseBusiness } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MarketingFooter } from "@/components/marketing/footer"
import { MarketingHeader } from "@/components/marketing/header"

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <MarketingHeader />
      <main className="pt-32">
        <section className="px-4 py-16 md:px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-[10px] font-black uppercase tracking-wider">
              <BriefcaseBusiness className="h-4 w-4 text-primary" />
              Careers
            </div>
            <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">Build the next creative video workflow</h1>
            <p className="text-base font-medium leading-relaxed text-muted-foreground">
              Juju is building tools for people who want to create faster, teach clearer, market better, and bring more stories to life. Career updates will appear here as the team grows.
            </p>
            <Link href="/support" className="mt-10 inline-block">
              <Button className="rounded-full px-8 py-6 font-black">
                Contact Juju <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
