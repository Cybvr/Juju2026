import { notFound } from "next/navigation"

import { MarketingDetailPage } from "@/components/marketing/category-pages"
import { getProfessional, professionals } from "@/lib/marketing/professionals"

export function generateStaticParams() {
  return professionals.map((item) => ({ slug: item.slug }))
}

export default function ProfessionalDetailPage({ params }: { params: { slug: string } }) {
  const professional = getProfessional(params.slug)

  if (!professional) {
    notFound()
  }

  return (
    <MarketingDetailPage
      item={professional}
      categoryLabel="Audiences"
      indexHref="/professionals"
      audienceLabel="Who it is for"
      audience={professional.audience}
    />
  )
}
