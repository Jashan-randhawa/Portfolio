import { FullScreen } from "@/components/full-screen"
import { ExperienceTimeline } from "./containers/experience-timeline"

export const metadata = {
  title: "Experience | Jashanpreet Singh",
  description:
    "Explore the professional journey of Jashanpreet Singh - frontend developer with experience in modern JavaScript frameworks.",
  openGraph: {
    title: "Experience | Jashanpreet Singh",
    description:
      "Frontend Developer with hands-on experience in React, MERN Stack, and modern UI/UX design.",
    url: "https://jashan2978.vercel.app/experience",
    siteName: "Jashanpreet Singh Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Experience | Jashanpreet Singh",
    description:
      "Check out Jashanpreet Singh's past work and achievements in frontend development.",
  },
  alternates: {
    canonical: "https://jashan2978.vercel.app/experience",
  },
}

export default function Page() {
  return (
    <div>
      <FullScreen>
        <ExperienceTimeline />
      </FullScreen>
    </div>
  )
}
