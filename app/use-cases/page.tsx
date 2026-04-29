import { MarketingIndexPage } from "@/components/marketing/category-pages"
import { useCases } from "@/lib/marketing/use-cases"

export default function UseCasesPage() {
  return (
    <MarketingIndexPage
      eyebrow="Use Cases"
      title="The videos Juju helps you make"
      description="Create explainers, kids educational videos, product demos, social ads, course lessons, training videos, brand stories, and client campaign videos from plain scripts."
      items={useCases}
      basePath="/use-cases"
    />
  )
}
