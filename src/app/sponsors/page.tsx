import { FullScreen } from "@/components/full-screen"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sponsors | Jashanpreet Singh",
  description: "Sponsors of Jashanpreet Singh",
}

export default function Page() {
  return (
    <FullScreen>
      <HoverBorderGradient
        containerClassName="rounded-[10px]"
        as="button"
        className="dark:bg-[#0d1117] bg-white text-black dark:text-white flex items-center space-x-2 cursor-pointer w-full"
      >
        <iframe
          src="https://github.com/Jashan-randhawa/Sponsors"
          title="Sponsor Jashanpreet Singh"
          className="w-full h-full"
          style={{ border: "0" }}
        ></iframe>
      </HoverBorderGradient>
    </FullScreen>
  )
}
