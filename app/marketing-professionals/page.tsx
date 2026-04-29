import { notFound } from "next/navigation"

import { MarketingDetailPage } from "@/components/marketing/category-pages"
import { getProfessional } from "@/lib/marketing/professionals"

export default function MarketingProfessionalsPage() {
  const professional = getProfessional("marketing-professionals")

  if (!professional) {
    notFound()
  }

  return (
    <MarketingDetailPage
      item={professional}
      categoryLabel="Audiences"
      indexHref="/professionals"
      audienceLabel="Who it is for"
      audience="Marketing teams that need explainer videos, social ads, product promos, campaign stories, and launch creative without filming or waiting on production."
    />
  )
}
