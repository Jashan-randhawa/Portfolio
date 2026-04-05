"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"

// FIX: Added fallback playlist ID so the embed doesn't break when env var is unset
const FALLBACK_PLAYLIST_ID = "37i9dQZF1DX4sWSpwq3LiO" // "Peaceful Guitar" – always public

export const SpotifyPlaylist = () => {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { setMounted(true) }, [])

  const currentTheme = theme === "system" ? systemTheme : theme

  useEffect(() => { setIsLoading(true) }, [currentTheme])

  const handleIframeLoad = () => setIsLoading(false)

  const playlistId =
    process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID || FALLBACK_PLAYLIST_ID

  if (!mounted) {
    return (
      <div className="w-full h-[352px] rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
    )
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse">
          <svg
            className="w-8 h-8 text-gray-400 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentTheme}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <iframe
            style={{ borderRadius: "12px" }}
            src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=${
              currentTheme === "dark" ? "0" : "1"
            }`}
            width="100%"
            height="500px"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            onLoad={handleIframeLoad}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
