import { notFound } from "next/navigation"

import { MarketingDetailPage } from "@/components/marketing/category-pages"
import { getIndustry, industries } from "@/lib/marketing/industries"

export function generateStaticParams() {
  return industries.map((item) => ({ slug: item.slug }))
}

export default async function IndustryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const industry = getIndustry(slug)

  if (!industry) {
    notFound()
  }

  return (
    <MarketingDetailPage
      item={industry}
      categoryLabel="Industries"
      indexHref="/industries"
      audienceLabel="Teams"
      audience={industry.teams}
    />
  )
}
