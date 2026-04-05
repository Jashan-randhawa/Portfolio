import { Metadata } from "next"
import { AboutContent } from "@/containers/about-me/about-content"

export const metadata: Metadata = {
  title: "About | Jashanpreet Singh",
  description:
    "Learn more about Jashanpreet Singh - Frontend Developer, JavaScript enthusiast, and tech explorer.",
  keywords: [
    "Jashanpreet Singh",
    "About Jashanpreet",
    "Frontend Developer",
    "JavaScript",
    "MERN Stack Expert",
    "Indian Developer",
  ],
  openGraph: {
    title: "About | Jashanpreet Singh",
    description:
      "Discover the story and journey of Jashanpreet Singh in the world of web development.",
    url: "https://Jashandev.id.vn/about",
    siteName: "Jashandev",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Jashanpreet Singh",
    description:
      "Learn more about Jashanpreet Singh - Frontend Developer and tech enthusiast.",
  },
  alternates: {
    canonical: "https://Jashandev.id.vn/about",
  },
}

export default function Page() {
  return <AboutContent />
}
