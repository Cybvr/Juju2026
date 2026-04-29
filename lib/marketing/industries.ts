import {
  Building2,
  GraduationCap,
  HeartHandshake,
  Megaphone,
  MonitorCog,
  Music2,
  ShoppingBag,
  Store,
} from "lucide-react"

export type IndustryItem = {
  slug: string
  title: string
  eyebrow: string
  description: string
  image: string
  icon: typeof GraduationCap
  teams: string
  outcomes: string[]
  videoIdeas: string[]
}

export const industries: IndustryItem[] = [
  {
    slug: "education",
    title: "Education",
    eyebrow: "Animated lessons for every learner",
    description:
      "Help students understand lessons faster with cartoon videos that turn topics into visual stories.",
    image: "/images/marketing/cloud.webp",
    icon: GraduationCap,
    teams: "Schools, tutors, homeschool creators, and learning businesses.",
    outcomes: ["Make concepts visual", "Create classroom-ready videos", "Support younger learners"],
    videoIdeas: ["Science lessons", "Reading practice", "History stories", "Math explainers"],
  },
  {
    slug: "marketing-advertising",
    title: "Marketing & Advertising",
    eyebrow: "Campaign creative made faster",
    description:
      "Create animated ads, product explainers, and brand videos that help campaigns stand out.",
    image: "/images/marketing/wizard.webp",
    icon: Megaphone,
    teams: "Marketing teams, media buyers, agencies, and founders.",
    outcomes: ["Test more messages", "Launch more creative", "Explain offers clearly"],
    videoIdeas: ["Social ads", "Product explainers", "Launch videos", "Retargeting clips"],
  },
  {
    slug: "ecommerce",
    title: "E-commerce",
    eyebrow: "Product stories that sell",
    description:
      "Turn product benefits, objections, and use cases into short animated videos for stores and ads.",
    image: "/images/marketing/download-2.png",
    icon: ShoppingBag,
    teams: "DTC brands, marketplace sellers, and ecommerce marketers.",
    outcomes: ["Explain products quickly", "Create offer videos", "Improve ad variety"],
    videoIdeas: ["Product demos", "Benefit videos", "Bundle promos", "FAQ clips"],
  },
  {
    slug: "saas-product",
    title: "SaaS & Product",
    eyebrow: "Explain software without screen fatigue",
    description:
      "Create product-led animated videos for onboarding, feature launches, sales pages, and education.",
    image: "/images/marketing/1.webp",
    icon: MonitorCog,
    teams: "SaaS founders, product marketers, customer success teams, and sales teams.",
    outcomes: ["Clarify workflows", "Support launches", "Improve onboarding"],
    videoIdeas: ["Feature explainers", "Product demos", "Onboarding videos", "Help center clips"],
  },
  {
    slug: "training-development",
    title: "Training & Development",
    eyebrow: "Internal knowledge people can replay",
    description:
      "Turn company processes, policies, and onboarding scripts into watchable animated training videos.",
    image: "/images/marketing/artist.webp",
    icon: Building2,
    teams: "HR, operations, enablement, and support teams.",
    outcomes: ["Standardize onboarding", "Reduce repeated training", "Make SOPs easier to follow"],
    videoIdeas: ["Employee onboarding", "Policy explainers", "Process walkthroughs", "Customer training"],
  },
  {
    slug: "entertainment",
    title: "Entertainment",
    eyebrow: "Stories, sketches, and channel content",
    description:
      "Create cartoon stories, character-led clips, and animated channel content from scripts and prompts.",
    image: "/images/marketing/adventure.webp",
    icon: Music2,
    teams: "Creators, storytellers, YouTubers, and entertainment brands.",
    outcomes: ["Publish without filming", "Keep characters consistent", "Turn ideas into episodes"],
    videoIdeas: ["Animated stories", "Comedy sketches", "Channel intros", "Short episodes"],
  },
  {
    slug: "nonprofits",
    title: "Nonprofits",
    eyebrow: "Mission videos with heart",
    description:
      "Explain causes, programs, donor impact, and community stories in a clear animated format.",
    image: "/images/marketing/joyful.webp",
    icon: HeartHandshake,
    teams: "Nonprofits, community organizations, fundraisers, and advocacy teams.",
    outcomes: ["Explain impact", "Support campaigns", "Make causes easier to share"],
    videoIdeas: ["Donor videos", "Impact stories", "Program explainers", "Awareness campaigns"],
  },
  {
    slug: "local-businesses",
    title: "Local Businesses",
    eyebrow: "Simple videos for local offers",
    description:
      "Create approachable cartoon videos for services, promotions, seasonal campaigns, and customer education.",
    image: "/images/marketing/download.png",
    icon: Store,
    teams: "Local service providers, clinics, restaurants, shops, and neighborhood brands.",
    outcomes: ["Promote offers", "Explain services", "Create affordable video content"],
    videoIdeas: ["Service explainers", "Promo videos", "FAQ clips", "Seasonal campaigns"],
  },
]

export function getIndustry(slug: string) {
  return industries.find((item) => item.slug === slug)
}
