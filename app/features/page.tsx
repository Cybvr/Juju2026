import { MarketingIndexPage } from "@/components/marketing/category-pages"
import { useCases } from "@/lib/marketing/use-cases"

export default function FeaturesPage() {
  return (
    <MarketingIndexPage
      eyebrow="Features"
      title="Everything you need to turn scripts into cartoon videos"
      description="Juju combines script-to-video generation, storyboards, cartoon styles, character consistency, voiceover, music, cloud rendering, and an editor for final polish."
      items={useCases.slice(0, 6)}
      basePath="/use-cases"
    />
  )
}
