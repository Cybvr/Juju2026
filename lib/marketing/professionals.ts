import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  Megaphone,
  Presentation,
  Share2,
  Smile,
} from "lucide-react"

export type MarketingItem = {
  slug: string
  title: string
  eyebrow: string
  description: string
  image: string
  icon: typeof Megaphone
  audience: string
  outcomes: string[]
  videoIdeas: string[]
}

export const professionals: MarketingItem[] = [
  {
    slug: "marketing-professionals",
    title: "Marketing Teams",
    eyebrow: "Campaign videos without production drag",
    description:
      "Turn campaign ideas, product angles, and promotional scripts into cartoon videos for ads, launches, explainers, and social campaigns.",
    image: "/images/marketing/wizard.webp",
    icon: Megaphone,
    audience: "Growth teams, brand marketers, demand gen teams, and content marketers.",
    outcomes: ["Launch more video angles", "Explain offers faster", "Create scroll-stopping ad creative"],
    videoIdeas: ["Product explainers", "Social ads", "Launch videos", "Campaign recaps"],
  },
  {
    slug: "educators",
    title: "Educators",
    eyebrow: "Lessons students actually watch",
    description:
      "Convert lesson plans and classroom topics into animated videos that make difficult ideas easier to understand.",
    image: "/images/marketing/cloud.webp",
    icon: GraduationCap,
    audience: "Teachers, tutors, homeschool creators, and learning teams.",
    outcomes: ["Make abstract topics visual", "Keep lessons friendly", "Reuse scripts across classes"],
    videoIdeas: ["Science explainers", "History stories", "Math walkthroughs", "Classroom recaps"],
  },
  {
    slug: "course-creators",
    title: "Course Creators",
    eyebrow: "Course content from plain scripts",
    description:
      "Build polished modules, summaries, intros, and bonus lessons without filming yourself or hiring an animation team.",
    image: "/images/marketing/artist.webp",
    icon: BookOpen,
    audience: "Online instructors, creators, coaches, and training product builders.",
    outcomes: ["Ship modules faster", "Avoid camera fatigue", "Make lessons feel premium"],
    videoIdeas: ["Module intros", "Concept lessons", "Course trailers", "Student onboarding"],
  },
  {
    slug: "youtubers",
    title: "YouTubers",
    eyebrow: "Animated videos for faceless channels",
    description:
      "Create story-driven cartoon videos for educational, entertainment, and explainer channels from scripts and prompts.",
    image: "/images/marketing/adventure.webp",
    icon: Presentation,
    audience: "Faceless channel operators, storytellers, and niche video creators.",
    outcomes: ["Publish without filming", "Keep a consistent style", "Test more video ideas"],
    videoIdeas: ["Story videos", "List videos", "Explainers", "Channel intros"],
  },
  {
    slug: "social-media-managers",
    title: "Social Media Managers",
    eyebrow: "Fresh content for every channel",
    description:
      "Turn weekly content calendars into short animated posts, explainers, promos, and educational clips.",
    image: "/images/marketing/joyful.webp",
    icon: Share2,
    audience: "Social leads, community managers, and content schedulers.",
    outcomes: ["Fill content calendars", "Repurpose scripts", "Make brand ideas easier to share"],
    videoIdeas: ["Reels", "Short explainers", "Promo clips", "FAQ videos"],
  },
  {
    slug: "agencies",
    title: "Agencies",
    eyebrow: "Client videos without bottlenecks",
    description:
      "Create campaign videos, explainers, mockups, and client-ready creative concepts with a faster production loop.",
    image: "/images/marketing/download-1.png",
    icon: BriefcaseBusiness,
    audience: "Creative agencies, media buyers, content studios, and freelance teams.",
    outcomes: ["Pitch with video concepts", "Deliver more variations", "Reduce production overhead"],
    videoIdeas: ["Client ads", "Pitch videos", "Explainer concepts", "Monthly creative batches"],
  },
  {
    slug: "coaches-consultants",
    title: "Coaches & Consultants",
    eyebrow: "Teach frameworks with animation",
    description:
      "Turn frameworks, advice, case studies, and client education into friendly videos people can replay and share.",
    image: "/images/marketing/download.png",
    icon: BarChart3,
    audience: "Business coaches, consultants, advisors, and subject-matter experts.",
    outcomes: ["Explain frameworks clearly", "Create lead magnets", "Package your expertise"],
    videoIdeas: ["Framework explainers", "Lead magnets", "Client onboarding", "Training clips"],
  },
  {
    slug: "kids-content-creators",
    title: "Kids Content Creators",
    eyebrow: "Safe-feeling educational cartoons",
    description:
      "Create colorful story-led videos for young audiences, from early learning topics to simple moral stories.",
    image: "/images/marketing/robt.webp",
    icon: Smile,
    audience: "Children's educators, kids channel creators, and family learning brands.",
    outcomes: ["Make lessons playful", "Create repeatable characters", "Turn topics into stories"],
    videoIdeas: ["Alphabet lessons", "Science stories", "Moral tales", "Animated songs"],
  },
]

export function getProfessional(slug: string) {
  return professionals.find((item) => item.slug === slug)
}
