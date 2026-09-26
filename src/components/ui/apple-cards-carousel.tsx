/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  JSX,
} from "react"
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
  IconExternalLink,
  IconBrandGithub,
  IconArrowUpRight,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import Image, { ImageProps } from "next/image"
import { useOutsideClick } from "@/hooks/use-outside-click"

interface CarouselProps {
  items: JSX.Element[]
  initialScroll?: number
}

export type CardType = {
  src: string
  title: string
  category: string
  content?: React.ReactNode
  techStack?: string[]
  githubLink?: string
  liveLink?: string
  description?: string
}

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void
  currentIndex: number
}>({
  onCardClose: () => {},
  currentIndex: 0,
})

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll
      checkScrollability()
    }
  }, [initialScroll])

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -360, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 360, behavior: "smooth" })
    }
  }

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 320 : 440
      const gap = isMobile() ? 16 : 24
      const scrollPosition = (cardWidth + gap) * index
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
      setCurrentIndex(index)
    }
  }

  const isMobile = () => {
    return typeof window !== "undefined" && window.innerWidth < 768
  }

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        {/* Navigation Arrows */}
        <div className="flex justify-end gap-2 mb-4 px-2">
          <button
            className="size-9 md:size-10 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            title="Scroll left"
          >
            <IconArrowNarrowLeft className="size-5 text-neutral-700 dark:text-neutral-200" />
          </button>
          <button
            className="size-9 md:size-10 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            onClick={scrollRight}
            disabled={!canScrollRight}
            title="Scroll right"
          >
            <IconArrowNarrowRight className="size-5 text-neutral-700 dark:text-neutral-200" />
          </button>
        </div>

        {/* Horizontal Carousel Track */}
        <div
          className="flex w-full overflow-x-auto overscroll-x-contain py-4 pb-8 scroll-smooth no-scrollbar"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div className="flex flex-row justify-start gap-5 md:gap-6 px-2">
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.4,
                    delay: 0.05 * index,
                    ease: "easeOut",
                  },
                }}
                key={"card" + index}
                className="shrink-0"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </CarouselContext.Provider>
  )
}

export const Card = ({
  card,
  index,
  layout = false,
  techStack,
  githubLink,
  liveLink,
  description,
  isGrid = false,
}: {
  card: CardType
  index: number
  layout?: boolean
  techStack?: string[]
  githubLink?: string
  liveLink?: string
  description?: string
  isGrid?: boolean
}) => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { onCardClose } = useContext(CarouselContext)

  const handleClose = useCallback(() => {
    setOpen(false)
    onCardClose(index)
  }, [onCardClose, index])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose()
      }
    }

    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, handleClose])

  useOutsideClick(containerRef as any, handleClose)

  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <>
      {/* Detailed Modal Dialog */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 h-screen z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-black/80 backdrop-blur-md fixed inset-0 z-40"
              onClick={handleClose}
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              ref={containerRef}
              className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 z-50 p-6 md:p-8 rounded-3xl font-sans border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden my-auto max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 z-50 size-9 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
                onClick={handleClose}
                title="Close"
              >
                <IconX className="size-5 text-neutral-700 dark:text-neutral-200" />
              </button>

              {/* Category Pill */}
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {card.category}
                </span>
                {liveLink && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500 text-white flex items-center gap-1.5 shadow-xs">
                    <span className="size-1.5 rounded-full bg-white animate-pulse" />
                    Live
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                {card.title}
              </h2>

              {/* High-Resolution Mockup Showcase Frame */}
              <div className="relative w-full aspect-[16/10] max-h-[460px] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 shadow-xl my-5 p-2 sm:p-4 flex items-center justify-center">
                <Image
                  src={card.src}
                  alt={card.title}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>

              {/* Description */}
              {description && (
                <p className="text-neutral-700 dark:text-neutral-300 text-base leading-relaxed">
                  {description}
                </p>
              )}

              {/* Tech Stack Pills */}
              {techStack && techStack.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons: Live Demo & GitHub */}
              {(githubLink || liveLink) && (
                <div className="mt-7 flex gap-3 flex-wrap pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60">
                  {liveLink && (
                    <a
                      href={liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-md shadow-emerald-500/25 transition-all cursor-pointer"
                    >
                      <span>Launch Live Demo</span>
                      <IconExternalLink className="size-4" />
                    </a>
                  )}
                  {githubLink && (
                    <a
                      href={githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-sm font-semibold transition-all cursor-pointer"
                    >
                      <IconBrandGithub className="size-4" />
                      <span>View on GitHub</span>
                    </a>
                  )}
                </div>
              )}

              {card.content && <div className="py-6">{card.content}</div>}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Redesigned Project Card with Dedicated 16:10 Media Showcase */}
      <motion.div
        onClick={handleOpen}
        className={cn(
          "rounded-2xl overflow-hidden bg-white dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800/80 hover:border-emerald-500/50 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col group text-left cursor-pointer",
          isGrid
            ? "w-full"
            : "w-[320px] sm:w-[380px] md:w-[420px] h-[440px]"
        )}
        whileHover={{
          y: -4,
        }}
        transition={{
          duration: 0.2,
        }}
      >
        {/* Top Media Showcase Container (Aspect 16:10 for perfect uncropped mockups) */}
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800/60 p-2 sm:p-2.5 flex items-center justify-center">
          {/* Subtle glow behind mockup on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />

          {/* Clean Image with Object-Contain (No Cropping!) */}
          <Image
            src={card.src}
            alt={card.title}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            unoptimized
          />

          {/* Floating Category Pill on Top-Left */}
          <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/70 text-white backdrop-blur-md border border-white/10 shadow-sm">
            {card.category}
          </span>

          {/* Live indicator on Top-Right if liveLink exists */}
          {liveLink && (
            <span className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow-sm">
              <span className="size-1.5 rounded-full bg-white animate-pulse" />
              Live
            </span>
          )}
        </div>

        {/* Bottom Details Section */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-2.5">
          <div>
            {/* Title with Arrow Icon on Hover */}
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors truncate">
                {card.title}
              </h3>
              <IconArrowUpRight className="size-4 text-neutral-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </div>

            {/* Description (Clean 2-line clamp) */}
            {description && (
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed mt-1">
                {description}
              </p>
            )}
          </div>

          {/* Tech Stack Badges */}
          {techStack && techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60"
                >
                  {tech}
                </span>
              ))}
              {techStack.length > 4 && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] text-neutral-400 font-medium">
                  +{techStack.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Card Footer: Quick Actions */}
          <div className="flex items-center justify-between pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 text-xs">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 group-hover:underline">
              View Project Details
            </span>

            <div className="flex items-center gap-1.5 text-neutral-400">
              {githubLink && (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded-md hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="View GitHub Repository"
                >
                  <IconBrandGithub className="size-3.5" />
                </a>
              )}
              {liveLink && (
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded-md hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                  title="Open Live Preview"
                >
                  <IconExternalLink className="size-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true)
  return (
    <Image
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={typeof src === "string" ? src : undefined}
      alt={alt ? alt : "Background of a beautiful view"}
      {...rest}
    />
  )
}
