import { redirect } from "next/navigation"

export default async function UseCaseSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  redirect(`/use-cases/${slug}`)
}
