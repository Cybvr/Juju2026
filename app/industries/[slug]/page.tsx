import { notFound } from "next/navigation"

import { MarketingDetailPage } from "@/components/marketing/category-pages"
import { getIndustry, industries } from "@/lib/marketing/industries"

export function generateStaticParams() {
  return industries.map((item) => ({ slug: item.slug }))
}

export default function IndustryDetailPage({ params }: { params: { slug: string } }) {
  const industry = getIndustry(params.slug)

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
