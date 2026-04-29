import { BarChart3, BookOpenCheck, BriefcaseBusiness, GraduationCap, Megaphone } from "lucide-react"

export type CaseStudy = {
  slug: string
  title: string
  eyebrow: string
  description: string
  image: string
  icon: typeof BarChart3
  industry: string
  result: string
  challenge: string
  solution: string
  outcomes: string[]
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "launch-week-product-explainers",
    title: "Launch Week Product Explainers",
    eyebrow: "SaaS product launch",
    description:
      "How a product team turned launch notes into a set of clear animated videos for homepage, email, and social campaigns.",
    image: "/images/marketing/download-2.png",
    icon: Megaphone,
    industry: "SaaS & Product",
    result: "6 launch videos created from one messaging brief",
    challenge:
      "The team needed polished launch creative without slowing engineering, design, or sales enablement.",
    solution:
      "Juju helped the team convert feature notes into short story-led explainers with consistent scenes, narration, and visual pacing.",
    outcomes: ["Reusable homepage video", "Short clips for social", "Clearer feature education"],
  },
  {
    slug: "classroom-science-story-series",
    title: "Classroom Science Story Series",
    eyebrow: "Education content",
    description:
      "How an educator created a repeatable cartoon lesson format for younger students across science and reading topics.",
    image: "/images/marketing/cloud.webp",
    icon: GraduationCap,
    industry: "Education",
    result: "12 lesson videos planned around one reusable format",
    challenge:
      "Students needed visual examples, but producing new videos every week was too time-consuming.",
    solution:
      "Juju turned lesson scripts into friendly animated stories that could be reused in class, homework, and review sessions.",
    outcomes: ["More visual lessons", "Reusable scripts", "Student-friendly pacing"],
  },
  {
    slug: "agency-client-ad-variations",
    title: "Agency Client Ad Variations",
    eyebrow: "Marketing agency",
    description:
      "How an agency used Juju to package more animated ad concepts for client reviews and campaign testing.",
    image: "/images/marketing/download-1.png",
    icon: BriefcaseBusiness,
    industry: "Marketing & Advertising",
    result: "4 creative angles prepared before the next client call",
    challenge:
      "The agency wanted more video angles for testing, but traditional animation timelines made iteration expensive.",
    solution:
      "Juju made it practical to draft multiple animated concepts from campaign hooks, objections, and offer scripts.",
    outcomes: ["Faster creative reviews", "More testable hooks", "Client-ready concepts"],
  },
  {
    slug: "course-module-animation-system",
    title: "Course Module Animation System",
    eyebrow: "Course creator",
    description:
      "How a course creator built a repeatable animated module style without recording new camera footage.",
    image: "/images/marketing/artist.webp",
    icon: BookOpenCheck,
    industry: "Online Education",
    result: "A consistent video style for lessons, recaps, and module intros",
    challenge:
      "The creator had strong lesson scripts but needed a faster way to make modules feel polished and visual.",
    solution:
      "Juju converted scripts into animated lesson scenes, letting the creator keep a consistent style across the course.",
    outcomes: ["Less camera setup", "Clearer lesson recaps", "More polished modules"],
  },
]

export function getCaseStudy(slug: string) {
  return caseStudies.find((item) => item.slug === slug)
}
