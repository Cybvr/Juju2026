"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { industries } from "@/lib/marketing/industries"
import { professionals } from "@/lib/marketing/professionals"
import { useCases } from "@/lib/marketing/use-cases"

const primaryProfessionals = professionals.filter((item) =>
  ["marketing-professionals", "educators", "course-creators", "youtubers", "agencies"].includes(item.slug),
)

const primaryUseCases = useCases.filter((item) =>
  ["explainer-videos", "kids-educational-videos", "product-demo-videos", "social-media-ads", "training-videos"].includes(item.slug),
)

const primaryIndustries = industries.filter((item) =>
  ["education", "marketing-advertising", "ecommerce", "saas-product", "entertainment"].includes(item.slug),
)

const resources = [
  {
    slug: "about-juju",
    title: "About Juju",
    description: "Learn what Juju is building for AI-powered cartoon video creation.",
  },
  {
    slug: "careers",
    title: "Careers",
    description: "Follow opportunities to help build the future of creative AI video.",
  },
  {
    slug: "news",
    title: "News",
    description: "Read company notes, product updates, and new Juju resources.",
  },
  {
    slug: "case-studies",
    title: "Case Studies",
    description: "See real workflows for launches, lessons, campaigns, and courses.",
  },
  {
    slug: "support",
    title: "Support",
    description: "Get help, contact Juju, and find support information.",
    href: "/support",
  },
]

function NavDropdown({
  label,
  items,
  baseHref,
}: {
  label: string
  items: { slug: string; title: string; description: string; href?: string }[]
  baseHref: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 hover:text-foreground transition-colors outline-none">
        {label}
        <ChevronDown className="h-3.5 w-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[34rem] rounded-2xl border-border/70 bg-background/95 p-2 backdrop-blur-xl">
        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
          {label}
        </DropdownMenuLabel>
        <div className="grid grid-cols-2 gap-1">
          {items.map((item) => (
            <DropdownMenuItem key={item.slug} asChild className="cursor-pointer rounded-xl p-3">
              <Link href={item.href ?? `${baseHref}/${item.slug}`}>
                <div>
                  <div className="text-sm font-bold text-foreground">{item.title}</div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function MarketingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  const mobileNavLinks = [
    { name: "Audiences", href: "/professionals" },
    { name: "Use Cases", href: "/use-cases" },
    { name: "Industries", href: "/industries" },
    { name: "Resources", href: "/resources" },
    { name: "Pricing", href: "/pricing" },
  ]
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/juju.png" alt="Juju" width={32} height={32} className="h-8 w-8 object-contain" />
          <span className="text-xl font-bold tracking-tight text-foreground">Juju</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground lg:flex">
          <NavDropdown label="Audiences" items={primaryProfessionals} baseHref="/professionals" />
          <NavDropdown label="Use Cases" items={primaryUseCases} baseHref="/use-cases" />
          <NavDropdown label="Industries" items={primaryIndustries} baseHref="/industries" />
          <NavDropdown label="Resources" items={resources} baseHref="/resources" />
          <Link href="/pricing" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="hidden text-sm font-medium transition-colors hover:text-primary sm:block">
            Sign In
          </Link>
          <Link href="/auth/login" className="hidden md:block">
            <Button className="rounded-full px-6 transition-all hover:scale-105 active:scale-95">Get Started</Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="p-2 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed top-[73px] left-0 right-0 bottom-0 h-[calc(100vh-73px)] w-full z-40 bg-background transition-transform duration-300 ease-in-out lg:hidden border-t border-border",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <nav className="flex h-full flex-col items-start justify-start gap-6 p-8">
          {mobileNavLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-foreground transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
          <Link href="/auth/login" className="mt-4 w-full" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="w-full rounded-full h-14 text-lg font-bold">
              Get Started
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
