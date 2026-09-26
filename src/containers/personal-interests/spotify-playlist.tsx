"use client"

import { useEffect, useState } from "react"
import { IconBrandSpotify, IconExternalLink } from "@tabler/icons-react"

const PLAYLISTS = [
  {
    id: "37i9dQZF1DWZeKCadgRdKQ",
    name: "Deep Focus",
    genre: "Ambient Beats",
  },
  {
    id: "37i9dQZF1DXdLEN7aqioXM",
    name: "Lo-Fi Coding",
    genre: "Chillhop",
  },
  {
    id: "37i9dQZF1DX4sWSpwq3LiO",
    name: "Peaceful Acoustic",
    genre: "Guitar",
  },
]

export const SpotifyPlaylist = () => {
  const [mounted, setMounted] = useState(false)
  const customId = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID
  const [activePlaylistId, setActivePlaylistId] = useState(
    customId || PLAYLISTS[0].id
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-clear loading state after 2 seconds so iframe is never blocked by a stuck spinner
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [activePlaylistId])

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  if (!mounted) {
    return (
      <div className="w-full h-[352px] rounded-xl bg-neutral-100 dark:bg-neutral-800/60 animate-pulse" />
    )
  }

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header with Spotify indicator & Open in Spotify action */}
      <div className="flex items-center justify-between pb-2 px-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200">
          <IconBrandSpotify className="size-4 text-[#1DB954]" />
          <span>Curated Playlists</span>
        </div>
        <a
          href={`https://open.spotify.com/playlist/${activePlaylistId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-[#1DB954] dark:hover:text-[#1DB954] transition-colors"
          title="Open in Spotify app or web"
        >
          <span>Open in Spotify</span>
          <IconExternalLink className="size-3" />
        </a>
      </div>

      {/* Playlist Selector Chips */}
      <div className="flex items-center gap-1.5 pb-2.5 px-0.5 overflow-x-auto no-scrollbar">
        {PLAYLISTS.map((pl) => {
          const isActive = activePlaylistId === pl.id
          return (
            <button
              key={pl.id}
              type="button"
              onClick={() => {
                if (activePlaylistId !== pl.id) {
                  setIsLoading(true)
                  setActivePlaylistId(pl.id)
                }
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#1DB954] text-black font-semibold shadow-xs"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              {pl.name}
            </button>
          )
        })}
      </div>

      {/* Embedded Spotify Player with Fallback & Smooth Loading */}
      <div className="relative w-full h-[352px] rounded-xl overflow-hidden shadow-xs border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-950">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-neutral-900/80 backdrop-blur-xs transition-opacity duration-300 pointer-events-none">
            <IconBrandSpotify className="w-8 h-8 text-[#1DB954] animate-pulse mb-2" />
            <span className="text-xs text-neutral-400 font-medium">
              Loading player...
            </span>
          </div>
        )}

        <iframe
          key={activePlaylistId}
          src={`https://open.spotify.com/embed/playlist/${activePlaylistId}?utm_source=generator&theme=0`}
          width="100%"
          height="352"
          style={{ border: 0, borderRadius: "12px" }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="eager"
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  )
}
