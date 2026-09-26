"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Search,
  ListMusic,
  Radio,
  ExternalLink,
  Sparkles,
  Loader2,
} from "lucide-react"
import { IconBrandSpotify } from "@tabler/icons-react"
import { DEFAULT_TRACKS, type JioSaavnSong } from "@/lib/jiosaavn"

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`
}

export function MusicPlayer() {
  const [mounted, setMounted] = useState(false)
  const [playerMode, setPlayerMode] = useState<"jiosaavn" | "spotify">("jiosaavn")
  const [tracks, setTracks] = useState<JioSaavnSong[]>(DEFAULT_TRACKS)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [activeTab, setActiveTab] = useState<"player" | "search" | "playlist">("player")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<JioSaavnSong[]>([])
  const [spotifyLoaded, setSpotifyLoaded] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentTrack = tracks[currentTrackIndex] || DEFAULT_TRACKS[0]

  useEffect(() => {
    setMounted(true)
  }, [])

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.streamUrl
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((e) => console.log("Autoplay blocked or stream delayed:", e))
      }
    }
  }, [currentTrack])

  // Volume & Mute listener
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Playback error:", err))
    }
  }

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length)
    setIsPlaying(true)
  }

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length)
    setIsPlaying(true)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || currentTrack.duration || 0)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const res = await fetch(
        `/api/music/search?q=${encodeURIComponent(searchQuery.trim())}`
      )
      const data = await res.json()
      if (data.success && data.songs?.length) {
        setSearchResults(data.songs)
      } else {
        setSearchResults([])
      }
    } catch (err) {
      console.error("Search failed:", err)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const playSongFromList = (song: JioSaavnSong) => {
    // Add to tracks queue if not present
    const existingIndex = tracks.findIndex((t) => t.id === song.id)
    if (existingIndex !== -1) {
      setCurrentTrackIndex(existingIndex)
    } else {
      const newTracks = [song, ...tracks]
      setTracks(newTracks)
      setCurrentTrackIndex(0)
    }
    setIsPlaying(true)
    setActiveTab("player")
  }

  if (!mounted) {
    return (
      <div className="w-full h-[360px] rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 animate-pulse" />
    )
  }

  return (
    <div className="flex flex-col w-full h-full select-none">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
      />

      {/* Top Bar: Mode switcher and navigation tabs */}
      <div className="flex items-center justify-between pb-2.5 px-0.5 border-b border-neutral-200/60 dark:border-neutral-800/60">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200">
            <Radio className="size-3.5 text-emerald-500 animate-pulse" />
            <span>Music Lounge</span>
          </div>

          {/* Equalizer animation when playing */}
          {isPlaying && playerMode === "jiosaavn" && (
            <div className="flex items-end gap-0.5 h-3 ml-1">
              <span className="w-0.5 h-full bg-emerald-500 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-0.5 h-2/3 bg-emerald-500 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-0.5 h-full bg-emerald-500 rounded-full animate-bounce [animation-delay:300ms]" />
              <span className="w-0.5 h-1/2 bg-emerald-500 rounded-full animate-bounce [animation-delay:75ms]" />
            </div>
          )}
        </div>

        {/* Source Selector & Tab buttons */}
        <div className="flex items-center gap-1">
          {playerMode === "jiosaavn" && (
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-800/80 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("player")}
                className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-colors cursor-pointer ${
                  activeTab === "player"
                    ? "bg-white dark:bg-neutral-700 text-black dark:text-white shadow-xs"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}
              >
                Now
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("search")}
                className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === "search"
                    ? "bg-white dark:bg-neutral-700 text-black dark:text-white shadow-xs"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}
              >
                <Search className="size-2.5" />
                <span>Find</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("playlist")}
                className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === "playlist"
                    ? "bg-white dark:bg-neutral-700 text-black dark:text-white shadow-xs"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}
              >
                <ListMusic className="size-2.5" />
                <span>Queue</span>
              </button>
            </div>
          )}

          {/* Toggle between JioSaavn and Spotify */}
          <button
            type="button"
            onClick={() =>
              setPlayerMode(playerMode === "jiosaavn" ? "spotify" : "jiosaavn")
            }
            className="p-1 px-2 text-[10px] font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors flex items-center gap-1 cursor-pointer"
            title={`Switch to ${playerMode === "jiosaavn" ? "Spotify" : "JioSaavn"}`}
          >
            {playerMode === "jiosaavn" ? (
              <>
                <IconBrandSpotify className="size-3 text-[#1DB954]" />
                <span>Spotify</span>
              </>
            ) : (
              <>
                <Radio className="size-3 text-emerald-500" />
                <span>JioSaavn</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Body */}
      {playerMode === "spotify" ? (
        /* Spotify Mode Embed */
        <div className="relative w-full h-[330px] mt-2 rounded-xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-950">
          {!spotifyLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/90 text-neutral-400">
              <IconBrandSpotify className="size-8 text-[#1DB954] animate-pulse mb-2" />
              <span className="text-xs font-medium">Loading Spotify Player...</span>
            </div>
          )}
          <iframe
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator&theme=0"
            width="100%"
            height="330"
            style={{ border: 0 }}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="eager"
            onLoad={() => setSpotifyLoaded(true)}
          />
        </div>
      ) : (
        /* Native JioSaavn Audio Player Mode */
        <div className="relative flex-1 flex flex-col justify-between pt-3">
          <AnimatePresence mode="wait">
            {activeTab === "player" && (
              <motion.div
                key="player"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex flex-col flex-1 justify-between"
              >
                {/* Track Presentation Card */}
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-800/60 shadow-xs backdrop-blur-xs">
                  {/* Rotating Vinyl / Artwork */}
                  <div
                    className={`relative size-20 sm:size-24 rounded-2xl overflow-hidden shrink-0 shadow-md border border-neutral-200/50 dark:border-neutral-700/50 ${
                      isPlaying ? "shadow-emerald-500/10" : ""
                    }`}
                  >
                    <Image
                      src={currentTrack.image || "/images/project-icon.webp"}
                      alt={currentTrack.title}
                      fill
                      className={`object-cover transition-transform duration-700 ${
                        isPlaying ? "scale-105" : "scale-100"
                      }`}
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  {/* Song Meta Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      JioSaavn Stream
                    </span>
                    <h4 className="text-base sm:text-lg font-bold truncate text-neutral-900 dark:text-neutral-100">
                      {currentTrack.title}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                      {currentTrack.artist}
                    </p>
                    {currentTrack.album && (
                      <span className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
                        Album: {currentTrack.album}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar & Timing */}
                <div className="space-y-1 my-3 px-1">
                  <div className="relative group">
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 transition-all focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-medium text-neutral-500 dark:text-neutral-400 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Playback Controls & Volume */}
                <div className="flex items-center justify-between px-2 pt-1 pb-1">
                  {/* Volume Control */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="size-4" />
                      ) : (
                        <Volume2 className="size-4" />
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(Number(e.target.value))
                        setIsMuted(false)
                      }}
                      className="w-14 sm:w-16 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  {/* Transport Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all cursor-pointer"
                      title="Previous song"
                    >
                      <SkipBack className="size-4" />
                    </button>

                    <button
                      type="button"
                      onClick={togglePlay}
                      className="p-3.5 rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <Pause className="size-5 fill-white" />
                      ) : (
                        <Play className="size-5 fill-white translate-x-0.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all cursor-pointer"
                      title="Next song"
                    >
                      <SkipForward className="size-4" />
                    </button>
                  </div>

                  {/* External JioSaavn Link */}
                  <a
                    href={`https://www.jiosaavn.com/search/${encodeURIComponent(
                      currentTrack.title
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors p-1"
                    title="Open on JioSaavn"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                </div>
              </motion.div>
            )}

            {/* Search Tab */}
            {activeTab === "search" && (
              <motion.div
                key="search"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex flex-col flex-1 h-[270px]"
              >
                <form onSubmit={handleSearch} className="flex gap-2 mb-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 size-3.5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search songs or artists (e.g. Arijit, Diljit, Lo-Fi)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isSearching ? <Loader2 className="size-3.5 animate-spin" /> : "Search"}
                  </button>
                </form>

                {/* Results list */}
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
                  {searchResults.length > 0 ? (
                    searchResults.map((song) => (
                      <div
                        key={song.id}
                        onClick={() => playSongFromList(song)}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer group"
                      >
                        <div className="relative size-9 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={song.image || "/images/project-icon.webp"}
                            alt={song.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-500">
                            {song.title}
                          </p>
                          <p className="text-[10px] text-neutral-500 truncate">
                            {song.artist}
                          </p>
                        </div>
                        <Play className="size-3 text-neutral-400 group-hover:text-emerald-500 shrink-0" />
                      </div>
                    ))
                  ) : isSearching ? (
                    <div className="flex flex-col items-center justify-center h-36 text-neutral-400 text-xs">
                      <Loader2 className="size-6 animate-spin text-emerald-500 mb-2" />
                      <span>Fetching songs from JioSaavn...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-36 text-neutral-400 text-xs text-center px-4">
                      <Sparkles className="size-6 text-neutral-400 mb-2" />
                      <span>Search any track from JioSaavn&apos;s massive catalogue to stream instantly.</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Queue / Playlist Tab */}
            {activeTab === "playlist" && (
              <motion.div
                key="playlist"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex flex-col flex-1 h-[270px]"
              >
                <div className="flex items-center justify-between pb-1.5 px-1 text-[11px] font-semibold text-neutral-500">
                  <span>Up Next ({tracks.length} tracks)</span>
                  <span className="text-[10px]">Click to play</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
                  {tracks.map((song, i) => {
                    const isCurrent = i === currentTrackIndex
                    return (
                      <div
                        key={`${song.id}-${i}`}
                        onClick={() => {
                          setCurrentTrackIndex(i)
                          setIsPlaying(true)
                          setActiveTab("player")
                        }}
                        className={`flex items-center gap-2.5 p-2 rounded-xl transition-colors cursor-pointer group ${
                          isCurrent
                            ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20"
                            : "hover:bg-neutral-100 dark:hover:bg-neutral-800/80"
                        }`}
                      >
                        <div className="relative size-9 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={song.image || "/images/project-icon.webp"}
                            alt={song.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-semibold truncate ${
                              isCurrent
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-500"
                            }`}
                          >
                            {song.title}
                          </p>
                          <p className="text-[10px] text-neutral-500 truncate">
                            {song.artist}
                          </p>
                        </div>
                        {isCurrent && isPlaying ? (
                          <div className="flex items-end gap-0.5 h-3 shrink-0 mr-1">
                            <span className="w-0.5 h-full bg-emerald-500 rounded-full animate-bounce [animation-delay:0ms]" />
                            <span className="w-0.5 h-2/3 bg-emerald-500 rounded-full animate-bounce [animation-delay:150ms]" />
                            <span className="w-0.5 h-full bg-emerald-500 rounded-full animate-bounce [animation-delay:300ms]" />
                          </div>
                        ) : (
                          <Play className="size-3 text-neutral-400 group-hover:text-emerald-500 shrink-0" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
