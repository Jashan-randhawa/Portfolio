"use client"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { IconX } from "@tabler/icons-react"
import { BlurImage } from "@/components/ui/apple-cards-carousel"
import type { ImageProps } from "next/image"

export const ExpandableImage = ({ className, ...rest }: ImageProps) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    if (open) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", onKeyDown)
    }

    return () => {
      document.body.style.overflow = "auto"
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in p-0 border-0 bg-transparent"
      >
        <BlurImage className={className} {...rest} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="fixed top-4 right-4 h-10 w-10 z-[110] bg-white dark:bg-black rounded-full flex items-center justify-center"
            >
              <IconX className="h-6 w-6 text-black dark:text-white" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              src={typeof rest.src === "string" ? rest.src : undefined}
              alt={typeof rest.alt === "string" ? rest.alt : "expanded view"}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
