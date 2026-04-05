"use client"

import Image from "next/image"
import { FollowerPointerCard } from "@/components/ui/following-pointer"

export function Resume() {
  return (
    <div className="mx-auto w-80">
      <FollowerPointerCard
        title={
          <TitleComponent
            title={resumeCard.author}
            avatar={resumeCard.authorAvatar}
          />
        }
      >
        <div className="group relative h-full overflow-hidden rounded-2xl border border-zinc-100 bg-white transition duration-200 hover:shadow-xl">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-tl-lg rounded-tr-lg bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center">
            <span className="text-white text-4xl font-black tracking-tight">JS</span>
          </div>
          <div className="p-4">
            <h2 className="my-4 text-lg font-bold text-zinc-700">
              {resumeCard.title}
            </h2>
            <p className="my-2 text-sm font-normal text-zinc-500">
              {resumeCard.description}
            </p>
            <div className="mt-6 flex flex-row items-center justify-between">
              <span className="text-sm text-gray-500">{resumeCard.date}</span>
              <a
                href="/files/Jashanpreet_Singh_Resume.pdf"
                download
                className="relative z-10 block rounded-xl bg-black px-6 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition-colors"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      </FollowerPointerCard>
    </div>
  )
}

const resumeCard = {
  author: "Jashanpreet Singh",
  date: "2025",
  title: "Jashanpreet Singh — Resume",
  description:
    "Frontend Developer & MERN Stack Engineer. React, TypeScript, Node.js, MongoDB, Tailwind CSS.",
  authorAvatar: "/images/emoji.webp",
}

const TitleComponent = ({
  title,
  avatar,
}: {
  title: string
  avatar: string
}) => (
  <div className="flex items-center space-x-2">
    <Image
      src={avatar}
      height="20"
      width="20"
      alt="avatar"
      className="rounded-full border-2 border-white"
    />
    <p>{title}</p>
  </div>
)
