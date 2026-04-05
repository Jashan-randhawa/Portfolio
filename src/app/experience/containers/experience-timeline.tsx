import { Timeline } from "@/components/ui/timeline"
import { EXPERIENCE_TIMELINE } from "@/data/experience"
// import BlurImage from "next/image"

export function ExperienceTimeline() {
  return (
    <div className="w-full h-full">
      <Timeline data={EXPERIENCE_TIMELINE} />
    </div>
  )
}
