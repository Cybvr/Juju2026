import { MarketingIndexPage } from "@/components/marketing/category-pages"
import { professionals } from "@/lib/marketing/professionals"

export default function SupportPage() {
  return (
    <MarketingIndexPage
      eyebrow="Support"
      title="Support for Juju creators and teams"
      description="Get help with planning videos, choosing the right page for your goal, understanding the guarantee, and creating cartoon videos for your audience."
      items={professionals.slice(0, 6)}
      basePath="/professionals"
    />
  )
}
