import Link from "next/link"
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react"

import { MarketingFooter } from "@/components/marketing/footer"
import { MarketingHeader } from "@/components/marketing/header"
import { Button } from "@/components/ui/button"

export default function PricingPage() {
  const features = [
    "Generate fully animated cartoon videos",
    "Styles included: 3D, classic, modern, comic",
    "Storyboard, characters, animations, voiceover, and music",
    "Advanced editor customization",
    "Cloud-rendered HD exports",
    "Free updates and support",
    "Cancel anytime",
  ]

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <MarketingHeader />
      <main className="px-4 py-32 md:px-6">
        <section className="container mx-auto">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl">
            <div className="grid lg:grid-cols-[1fr_0.8fr]">
              <div className="p-10 md:p-16">
                <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-primary">Monthly plan</p>
                <h1 className="mb-5 text-3xl font-extrabold tracking-tight md:text-5xl">Create cartoon videos for $80/month</h1>
                <div className="mb-8 flex items-end gap-2">
                  <span className="text-6xl font-extrabold">$80</span>
                  <span className="pb-2 text-lg font-bold text-muted-foreground">/ month</span>
                </div>
                <ul className="mb-10 space-y-3 text-sm font-bold">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/login">
                  <Button className="rounded-full px-10 py-7 text-lg font-black">
                    Subscribe now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="border-t border-border bg-muted p-10 md:p-16 lg:border-l lg:border-t-0">
                <ShieldCheck className="mb-6 h-12 w-12 text-primary" />
                <h2 className="mb-4 text-2xl font-bold">100% Money Back Guarantee</h2>
                <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                  If you create one video and do not like it, Juju refunds your money and lets you keep the videos you created.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
