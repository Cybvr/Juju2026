import { MarketingIndexPage } from "@/components/marketing/category-pages"
import { professionals } from "@/lib/marketing/professionals"

export default function ProfessionalsPage() {
  return (
    <MarketingIndexPage
      eyebrow="Audiences"
      title="Cartoon video creation for every audience"
      description="Juju helps marketers, educators, creators, agencies, coaches, and kids content teams turn scripts into animated videos without filming or animation bottlenecks."
      items={professionals}
      basePath="/professionals"
    />
  )
}
