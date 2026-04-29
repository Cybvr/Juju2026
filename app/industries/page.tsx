import { MarketingIndexPage } from "@/components/marketing/category-pages"
import { industries } from "@/lib/marketing/industries"

export default function IndustriesPage() {
  return (
    <MarketingIndexPage
      eyebrow="Industries"
      title="Animated video pages for every market"
      description="Juju fits education, marketing, ecommerce, SaaS, training, entertainment, nonprofits, and local businesses that need clearer video content without a production team."
      items={industries}
      basePath="/industries"
    />
  )
}
