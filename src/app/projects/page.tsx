import { Metadata } from "next"
import { ProjectCardsCarousel } from "./project-list"

export const metadata: Metadata = {
  title: "Projects | Jashanpreet Singh",
  description:
    "Browse Jashanpreet Singh's projects — from MERN stack apps and real-time chat systems to AI-powered web applications.",
}

export default function Page() {
  return (
    <div className="w-full xl:w-[85%] mx-auto">
      <div className="px-4 pt-8 pb-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Projects</h1>
        <p className="text-muted-foreground text-base">
          A selection of things I&apos;ve built — click any card to explore details.
        </p>
      </div>
      <ProjectCardsCarousel />
    </div>
  )
}
