import {
  BadgeHelp,
  BookOpenCheck,
  Boxes,
  Clapperboard,
  GraduationCap,
  Megaphone,
  MonitorPlay,
  Presentation,
} from "lucide-react"

export type UseCaseItem = {
  slug: string
  title: string
  eyebrow: string
  description: string
  image: string
  icon: typeof MonitorPlay
  bestFor: string
  outcomes: string[]
  videoIdeas: string[]
}

export const useCases: UseCaseItem[] = [
  {
    slug: "explainer-videos",
    title: "Explainer Videos",
    eyebrow: "Make any idea easier to understand",
    description:
      "Turn scripts, product notes, and complex ideas into animated explainers with scenes, voiceover, music, and a consistent cartoon style.",
    image: "/images/marketing/wizard.webp",
    icon: BadgeHelp,
    bestFor: "Products, services, educational topics, and offers that need a clear visual walkthrough.",
    outcomes: ["Simplify complex ideas", "Keep viewers engaged", "Create videos without filming"],
    videoIdeas: ["How it works videos", "FAQ explainers", "Service walkthroughs", "Problem-solution stories"],
  },
  {
    slug: "kids-educational-videos",
    title: "Kids Educational Videos",
    eyebrow: "Learning content that feels playful",
    description:
      "Create bright cartoon lessons for young audiences, from science basics to reading, social skills, and classroom stories.",
    image: "/images/marketing/cloud.webp",
    icon: GraduationCap,
    bestFor: "Teachers, kids channels, tutors, and family-friendly learning brands.",
    outcomes: ["Make learning visual", "Hold attention longer", "Turn topics into stories"],
    videoIdeas: ["Alphabet lessons", "Science facts", "Moral stories", "Math basics"],
  },
  {
    slug: "product-demo-videos",
    title: "Product Demo Videos",
    eyebrow: "Show the value before the call",
    description:
      "Create animated demos that explain what a product does, who it helps, and why the viewer should care.",
    image: "/images/marketing/download-2.png",
    icon: MonitorPlay,
    bestFor: "SaaS teams, ecommerce brands, founders, and product marketers.",
    outcomes: ["Clarify features", "Improve launch assets", "Support sales conversations"],
    videoIdeas: ["Feature demos", "Launch clips", "Onboarding explainers", "Sales page videos"],
  },
  {
    slug: "social-media-ads",
    title: "Social Media Ads",
    eyebrow: "More creative angles, faster",
    description:
      "Generate animated ad concepts and short promos for TikTok, Instagram, YouTube Shorts, and paid campaigns.",
    image: "/images/marketing/joyful.webp",
    icon: Megaphone,
    bestFor: "Marketers, agencies, ecommerce teams, and social media managers.",
    outcomes: ["Test more hooks", "Create visual variety", "Reduce production delays"],
    videoIdeas: ["Hook-driven ads", "Offer explainers", "Promo clips", "Retargeting videos"],
  },
  {
    slug: "course-videos",
    title: "Course Videos",
    eyebrow: "Lessons without camera setup",
    description:
      "Build course modules and teaching videos from plain scripts, with visuals that help learners follow each step.",
    image: "/images/marketing/artist.webp",
    icon: BookOpenCheck,
    bestFor: "Course creators, educators, coaches, and training teams.",
    outcomes: ["Ship lessons faster", "Increase clarity", "Make modules feel polished"],
    videoIdeas: ["Module intros", "Lesson summaries", "Concept breakdowns", "Student onboarding"],
  },
  {
    slug: "training-videos",
    title: "Training Videos",
    eyebrow: "Turn SOPs into watchable videos",
    description:
      "Convert training scripts, checklists, and internal docs into animated videos for teams, customers, and partners.",
    image: "/images/marketing/1.webp",
    icon: Presentation,
    bestFor: "HR teams, operators, support teams, and business owners.",
    outcomes: ["Standardize training", "Reduce repeated explanations", "Make onboarding easier"],
    videoIdeas: ["Employee onboarding", "Customer tutorials", "Policy explainers", "Process videos"],
  },
  {
    slug: "brand-storytelling",
    title: "Brand Storytelling",
    eyebrow: "Make your message memorable",
    description:
      "Create narrative-driven cartoon videos that explain your mission, values, origin story, or customer transformation.",
    image: "/images/marketing/adventure.webp",
    icon: Clapperboard,
    bestFor: "Brands, founders, nonprofits, creators, and community-led businesses.",
    outcomes: ["Humanize your message", "Create emotional context", "Build trust"],
    videoIdeas: ["Founder stories", "Mission videos", "Customer journeys", "Campaign stories"],
  },
  {
    slug: "client-campaign-videos",
    title: "Client Campaign Videos",
    eyebrow: "Client-ready videos at campaign speed",
    description:
      "Produce polished campaign videos for clients, from first pitch concepts to final deliverables and monthly creative batches.",
    image: "/images/marketing/download-1.png",
    icon: Boxes,
    bestFor: "Agencies, freelancers, studios, and client-facing marketing teams.",
    outcomes: ["Deliver more creative", "Speed up approvals", "Package video as a service"],
    videoIdeas: ["Client ads", "Campaign explainers", "Pitch videos", "Monthly creative sets"],
  },
]

export function getUseCase(slug: string) {
  return useCases.find((item) => item.slug === slug)
}
