import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, Building2, LifeBuoy, Newspaper, Sparkles } from "lucide-react"

import { MarketingFooter } from "@/components/marketing/footer"
import { MarketingHeader } from "@/components/marketing/header"

const resources = [
  {
    href: "/resources/about-juju",
    title: "About Juju",
    description: "Learn how Juju helps creators and teams turn scripts into animated cartoon videos.",
    icon: Building2,
  },
  {
    href: "/resources/careers",
    title: "Careers",
    description: "Explore the kind of team building Juju and the roles we are shaping around creative AI.",
    icon: BriefcaseBusiness,
  },
  {
    href: "/resources/news",
    title: "News",
    description: "Follow product updates, company notes, and new ways creators are using Juju.",
    icon: Newspaper,
  },
  {
    href: "/resources/case-studies",
    title: "Case Studies",
    description: "See practical examples of Juju workflows across education, marketing, product, and courses.",
    icon: Sparkles,
  },
  {
    href: "/support",
    title: "Support",
    description: "Get help, contact Juju, and find support information in one place.",
    icon: LifeBuoy,
  },
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <MarketingHeader />
      <main className="pt-32">
        <section className="px-4 py-16 md:px-6">
          <div className="container mx-auto">
            <div className="max-w-3xl">
              <p className="mb-4 text-[10px] font-black uppercase tracking-wider text-primary">Resources</p>
              <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">Learn more about Juju</h1>
              <p className="text-sm font-medium leading-relaxed text-muted-foreground md:text-base">
                Company information, updates, and real examples for teams creating animated videos with Juju.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {resources.map((resource) => (
                <Link
                  key={resource.href}
                  href={resource.href}
                  className="group rounded-[2rem] border border-border bg-card p-8 shadow-sm transition-all hover:border-primary hover:shadow-xl"
                >
                  <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background">
                    <resource.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="mb-3 text-2xl font-bold">{resource.title}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-bold text-primary">
                    Open resource <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
