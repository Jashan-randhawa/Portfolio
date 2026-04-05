"use client"
import { Card, Carousel } from "@/components/ui/apple-cards-carousel"
import { PROJECTS } from "@/data/projects"

export function ProjectCardsCarousel() {
  const cards = PROJECTS.map((card, index) => (
    <Card
      key={card.src}
      card={card}
      index={index}
      techStack={card.techStack}
      githubLink={card.githubLink}
      liveLink={card.liveLink}
      description={card.description}
    />
  ))

  return (
    <div className="my-10">
      <Carousel items={cards} />
    </div>
  )
}
