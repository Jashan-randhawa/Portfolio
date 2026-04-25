"use client"
import { motion } from "motion/react"
import { HeroHighlight } from "../ui/hero-highlight"
import { cn } from "@/lib/utils"

export function HeroBackground({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <HeroHighlight className="min-h-screen">
      {/* FIX: was <motion.h1> which wrapped the entire layout in an h1 — semantically broken */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [20, -5, 0] }}
        transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
        className={cn("w-full", className)}
      >
        {children}
      </motion.div>
    </HeroHighlight>
  )
}
