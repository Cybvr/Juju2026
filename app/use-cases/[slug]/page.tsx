import { notFound } from "next/navigation"

import { MarketingDetailPage } from "@/components/marketing/category-pages"
import { getUseCase, useCases } from "@/lib/marketing/use-cases"

export function generateStaticParams() {
  return useCases.map((item) => ({ slug: item.slug }))
}

export default async function UseCaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const useCase = getUseCase(slug)

  if (!useCase) {
    notFound()
  }

  return (
    <MarketingDetailPage
      item={useCase}
      categoryLabel="Use Cases"
      indexHref="/use-cases"
      audienceLabel="Best for"
      audience={useCase.bestFor}
    />
  )
}
