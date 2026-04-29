import { redirect } from "next/navigation"

export default async function IndustrySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  redirect(`/industries/${slug}`)
}
