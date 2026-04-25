"use client"

import { Pointer } from "@/components/magicui/pointer"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { EvervaultCard } from "@/components/ui/evervault-card"
import { cn } from "@/lib/utils"
import { IconClipboardCopy } from "@tabler/icons-react"
import { Blocks, Music2, Rss } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { SpotifyPlaylist } from "./spotify-playlist"
import { StackCloud } from "./stack-cloud"
import { BlurImage } from "@/components/ui/apple-cards-carousel"
import { LEARNING_RESOURCES } from "@/data/learning-resource"

export function PersonalInterests() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-[352px] rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
    )
  }
  return (
    <>
      <BentoGrid className="w-full mx-auto md:auto-rows-[20rem]">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={cn("[&>p:text-lg]", item.className)}
            icon={item.icon}
          />
        ))}
      </BentoGrid>
    </>
  )
}

const SkeletonOne = () => {
  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      <EvervaultCard
        text={
          <a
            href="/files/Jashanpreet_Singh_Resume.pdf"
            download
            className="flex flex-col items-center justify-center"
          >
            Resume
            <div className="text-sm text-gray-500">(Click to download)</div>
          </a>
        }
      />

      <Pointer>
        <motion.div
          animate={{
            scale: [0.8, 1, 0.8],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-pink-600"
          >
            <motion.path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="currentColor"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </svg>
        </motion.div>
      </Pointer>
    </motion.div>
  )
}
const SkeletonTwo = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2 "
    >
      <div className="relative flex h-full w-full flex-col items-center justify-center">
        <StackCloud />
        <Pointer>
          <div className="text-2xl">👆</div>
        </Pointer>
      </div>
    </motion.div>
  )
}
const SkeletonThree = () => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  }
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{
        duration: 5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col space-y-2"
    >
      <motion.div className="h-full w-full rounded-lg flex-1">
        <SpotifyPlaylist />
      </motion.div>
    </motion.div>
  )
}
const SkeletonFour = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  }
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  }
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2"
    >
      {LEARNING_RESOURCES.map(
        ({ href, imgSrc, alt, description, imageWrapperClass }, index) => {
          const variant = index === 0 ? first : index === 2 ? second : undefined

          return (
            <motion.a
              key={href}
              variants={variant}
              className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center cursor-none relative z-20"
              href={href}
              target="_blank"
            >
              <div className={imageWrapperClass}>
                <BlurImage src={imgSrc} alt={alt} height={100} width={100} />
              </div>
              <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
                {description}
              </p>
            </motion.a>
          )
        }
      )}
      <Pointer className="fill-blue-500" />
    </motion.div>
  )
}

const items = [
  {
    title: "Download My Resume",
    description: (
      <span className="text-sm">
        A quick summary of my experience, projects, and skills — available for
        download.
      </span>
    ),
    header: <SkeletonOne />,
    className: "md:col-span-1",
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Tech Stack",
    description: (
      <span className="text-sm">
        The tools I rely on to build performant, modern web apps.
      </span>
    ),
    header: <SkeletonTwo />,
    className: "md:col-span-1",
    icon: <Blocks className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Music & Mood",
    description: (
      <span className="text-sm">
        From deep focus to feel-good vibes, I create playlists that fuel my day
        — &ldquo;Working Energy&ldquo; is one of my favorites.
      </span>
    ),
    header: <SkeletonThree />,
    className: "md:col-span-1 row-span-2 min-h-[520px]",
    icon: <Music2 className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Go-To Dev Blogs",
    description: (
      <span className="text-sm">
        Where I learn, stay up-to-date, and explore new frontend trends.
      </span>
    ),
    header: <SkeletonFour />,
    className: "md:col-span-2",
    icon: <Rss className="h-4 w-4 text-neutral-500" />,
  },
]
