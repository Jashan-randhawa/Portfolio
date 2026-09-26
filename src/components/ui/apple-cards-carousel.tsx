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
import { Play, Pause } from "lucide-react"

interface CarouselProps {
  items: JSX.Element[]
  initialScroll?: number
  autoSlideInterval?: number
  autoSlide?: boolean
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
  isModalOpen?: boolean
  setIsModalOpen?: (open: boolean) => void
}>({
  onCardClose: () => {},
  currentIndex: 0,
  isModalOpen: false,
  setIsModalOpen: () => {},
})

export const Carousel = ({
  items,
  initialScroll = 0,
  autoSlideInterval = 5000,
  autoSlide = true,
}: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoSlide)
  const [isHovered, setIsHovered] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  const totalItems = items.length

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll
    }
  }, [initialScroll])

  // Scroll to target card index smoothly
  const scrollToCard = useCallback((index: number) => {
    if (!carouselRef.current || totalItems === 0) return
    const track = carouselRef.current
    const targetIdx = Math.max(0, Math.min(index, totalItems - 1))

    if (targetIdx === 0) {
      track.scrollTo({ left: 0, behavior: "smooth" })
      setCurrentIndex(0)
      return
    }

    const cardElements = track.querySelectorAll<HTMLElement>(".carousel-card-item")
    if (cardElements[targetIdx]) {
      const targetCard = cardElements[targetIdx]
      const trackRect = track.getBoundingClientRect()
      const cardRect = targetCard.getBoundingClientRect()
      const offset = cardRect.left - trackRect.left

      track.scrollBy({
        left: offset,
        behavior: "smooth",
      })
      setCurrentIndex(targetIdx)
    }
  }, [totalItems])

  // Circular navigation: Next (wraps circularly to first card at the end)
  const scrollRight = useCallback(() => {
    if (totalItems <= 1) return
    const nextIdx = (currentIndex + 1) % totalItems
    scrollToCard(nextIdx)
    setProgress(0)
  }, [currentIndex, totalItems, scrollToCard])

  // Circular navigation: Prev (wraps circularly to last card at the beginning)
  const scrollLeft = useCallback(() => {
    if (totalItems <= 1) return
    const prevIdx = (currentIndex - 1 + totalItems) % totalItems
    scrollToCard(prevIdx)
    setProgress(0)
  }, [currentIndex, totalItems, scrollToCard])

  // Track manual scrolling to keep currentIndex synchronized
  const handleScroll = useCallback(() => {
    if (!carouselRef.current || totalItems === 0) return
    const track = carouselRef.current
    const cardElements = track.querySelectorAll<HTMLElement>(".carousel-card-item")
    if (cardElements.length === 0) return

    const trackLeft = track.getBoundingClientRect().left + 80
    let closestIndex = 0
    let minDiff = Infinity

    cardElements.forEach((el, idx) => {
      const diff = Math.abs(el.getBoundingClientRect().left - trackLeft)
      if (diff < minDiff) {
        minDiff = diff
        closestIndex = idx
      }
    })

    if (closestIndex !== currentIndex) {
      setCurrentIndex(closestIndex)
    }
  }, [totalItems, currentIndex])

  // Auto-slide: 5-second circular interval with 50ms smooth tick updates
  useEffect(() => {
    if (!isPlaying || isHovered || isModalOpen || totalItems <= 1) {
      return
    }

    const TICK_INTERVAL = 50
    const increment = (TICK_INTERVAL / autoSlideInterval) * 100

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        if (next >= 100) {
          scrollRight()
          return 0
        }
        return next
      })
    }, TICK_INTERVAL)

    return () => clearInterval(timer)
  }, [isPlaying, isHovered, isModalOpen, totalItems, autoSlideInterval, scrollRight])

  // Pause when browser tab is inactive
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setIsPlaying(false)
      } else {
        setIsPlaying(true)
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [])

  const handleCardClose = (index: number) => {
    scrollToCard(index)
  }

  // Circular progress SVG values
  const radius = 9
  const circumference = 2 * Math.PI * radius
  const strokeOffset = circumference - (progress / 100) * circumference

  return (
    <CarouselContext.Provider
      value={{
        onCardClose: handleCardClose,
        currentIndex,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      <div className="relative w-full">
        {/* Controls Bar: Circular Auto-Slide Badge, Slide Counter & Circular Arrows */}
        <div className="flex items-center justify-between gap-3 mb-4 px-2">
          {/* Circular Countdown Progress Badge & Play/Pause */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700/80 border border-neutral-200/80 dark:border-neutral-700/80 transition-all cursor-pointer text-xs font-medium text-neutral-700 dark:text-neutral-300 shadow-xs"
              title={isPlaying ? "Click to pause 5s circular slide" : "Click to resume 5s circular slide"}
            >
              <div className="relative size-5 flex items-center justify-center">
                {/* Background Ring */}
                <svg className="size-full -rotate-90" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-neutral-300 dark:text-neutral-700"
                  />
                  {/* Animated Circular Progress Ring */}
                  <circle
                    cx="12"
                    cy="12"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    className="text-emerald-500 transition-[stroke-dashoffset] duration-75 ease-linear"
                  />
                </svg>
                {/* Play / Pause Icon */}
                <span className="absolute inset-0 flex items-center justify-center">
                  {isPlaying && !isHovered && !isModalOpen ? (
                    <Pause className="size-2 text-emerald-500 fill-emerald-500" />
                  ) : (
                    <Play className="size-2 text-neutral-500 ml-0.5 fill-neutral-500" />
                  )}
                </span>
              </div>
              <span className="font-semibold text-[11px] tracking-wide">
                {isPlaying
                  ? isHovered
                    ? "Paused (Hover)"
                    : isModalOpen
                    ? "Paused (Modal)"
                    : "5s Circular Slide"
                  : "Paused"}
              </span>
            </button>
          </div>

          {/* Slide Counter & Circular Navigation Arrows */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400 mr-1 hidden sm:inline-block">
              {String(currentIndex + 1).padStart(2, "0")} / {String(totalItems).padStart(2, "0")}
            </span>

            <button
              className="size-9 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-200 transition-all shadow-xs cursor-pointer active:scale-95"
              onClick={scrollLeft}
              title="Previous slide (loops circularly)"
              aria-label="Previous slide"
            >
              <IconArrowNarrowLeft className="size-5" />
            </button>
            <button
              className="size-9 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-200 transition-all shadow-xs cursor-pointer active:scale-95"
              onClick={scrollRight}
              title="Next slide (loops circularly)"
              aria-label="Next slide"
            >
              <IconArrowNarrowRight className="size-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel Track */}
        <div
          className="flex w-full overflow-x-auto overscroll-x-contain py-4 pb-4 scroll-smooth no-scrollbar snap-x snap-proximity"
          ref={carouselRef}
          onScroll={handleScroll}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => {
            setTimeout(() => setIsHovered(false), 1500)
          }}
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
                className="shrink-0 carousel-card-item snap-start"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Circular Pagination Dots */}
        {totalItems > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-2 pb-2">
            {items.map((_, idx) => {
              const isActive = idx === currentIndex
              return (
                <button
                  key={`carousel-dot-${idx}`}
                  type="button"
                  onClick={() => {
                    scrollToCard(idx)
                    setProgress(0)
                  }}
                  className={cn(
                    "rounded-full transition-all duration-300 cursor-pointer",
                    isActive
                      ? "w-6 h-2 bg-emerald-500 shadow-xs shadow-emerald-500/50"
                      : "w-2 h-2 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-500"
                  )}
                  title={`Go to slide ${idx + 1}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              )
            })}
          </div>
        )}
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
  const { onCardClose, setIsModalOpen } = useContext(CarouselContext)

  const handleClose = useCallback(() => {
    setOpen(false)
    setIsModalOpen?.(false)
    onCardClose(index)
  }, [onCardClose, setIsModalOpen, index])

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
    setIsModalOpen?.(true)
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
