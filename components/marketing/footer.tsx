import Image from "next/image"
import Link from "next/link"

const footerGroups = [
  {
    title: "Audiences",
    links: [
      { label: "Marketing Teams", href: "/professionals/marketing-professionals" },
      { label: "Educators", href: "/professionals/educators" },
      { label: "Course Creators", href: "/professionals/course-creators" },
      { label: "YouTubers", href: "/professionals/youtubers" },
      { label: "Agencies", href: "/professionals/agencies" },
    ],
  },
  {
    title: "Use Cases",
    links: [
      { label: "Explainer Videos", href: "/use-cases/explainer-videos" },
      { label: "Kids Educational Videos", href: "/use-cases/kids-educational-videos" },
      { label: "Product Demos", href: "/use-cases/product-demo-videos" },
      { label: "Social Ads", href: "/use-cases/social-media-ads" },
      { label: "Training Videos", href: "/use-cases/training-videos" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Education", href: "/industries/education" },
      { label: "Marketing & Advertising", href: "/industries/marketing-advertising" },
      { label: "E-commerce", href: "/industries/ecommerce" },
      { label: "SaaS/Product", href: "/industries/saas-product" },
      { label: "Entertainment", href: "/industries/entertainment" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Juju", href: "/resources/about-juju" },
      { label: "Careers", href: "/resources/careers" },
      { label: "News", href: "/resources/news" },
      { label: "Case Studies", href: "/resources/case-studies" },
      { label: "Help Center", href: "/support" },
      { label: "Contact Us", href: "/support" },
      { label: "Status", href: "/support" },
    ],
  },
]

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-card py-24">
      <div className="container mx-auto px-6">
        <div className="mb-24 flex flex-col items-start justify-between gap-12 lg:flex-row">
          <div className="max-w-sm">
            <Link href="/" className="mb-6 flex items-center gap-2">
              <Image src="/images/juju.png" alt="Juju" width={24} height={24} className="h-6 w-6 object-contain" />
              <span className="text-lg font-bold text-foreground">Juju</span>
            </Link>
            <p className="text-[10px] font-bold uppercase leading-relaxed tracking-tight text-muted-foreground">
              Create epic cartoon videos with just a script. AI-powered storytelling for modern creators and businesses.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-4">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h4 className="mb-6 font-bold text-foreground">{group.title}</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  {group.links.map((link) => (
                    <li key={`${group.title}-${link.href}-${link.label}`}>
                      <Link href={link.href} className="transition-colors hover:text-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-8 border-t border-border pt-12 md:flex-row">
          <p className="max-w-3xl text-center text-xs text-muted-foreground md:text-left">
            DISCLAIMER - The results mentioned are not typical. Individual results will vary. We are not affiliated with Google,
            YouTube, Facebook, Instagram, TikTok. FACEBOOK is a trademark of FACEBOOK, Inc.
          </p>
          <p className="text-xs text-muted-foreground">Copyright © 2026 Juju. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
