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
  Volume1,
  Search,
  ListMusic,
  Radio,
  ExternalLink,
  Sparkles,
  Loader2,
  Shuffle,
  Repeat,
  Repeat1,
  Music,
  Plus,
  Trash2,
  X,
  Disc3,
  Maximize2,
} from "lucide-react"
import {
  DEFAULT_TRACKS,
  PUNJABI_GENRES,
  type JioSaavnSong,
  type MoodCategory,
} from "@/lib/jiosaavn"

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`
}

const SEARCH_PRESETS = [
  "Sidhu Moose Wala",
  "Diljit Dosanjh",
  "Karan Aujla",
  "Shubh",
  "AP Dhillon",
  "Guru Randhawa",
  "Ammy Virk",
  "Nooran Sisters",
  "Satinder Sartaaj",
  "Daler Mehndi",
]

const GENRE_CONFIG: Record<
  string,
  {
    badge: string
    color: string
    activeBg: string
    border: string
    gradient: string
  }
> = {
  bhangra: {
    badge: "🎉 Bhangra",
    color: "text-amber-500 dark:text-amber-400",
    activeBg: "bg-amber-500 text-white shadow-amber-500/25",
    border: "border-amber-500/40",
    gradient: "from-amber-500 to-orange-500",
  },
  motivational: {
    badge: "⚡ Motivation",
    color: "text-cyan-500 dark:text-cyan-400",
    activeBg: "bg-cyan-500 text-white shadow-cyan-500/25",
    border: "border-cyan-500/40",
    gradient: "from-cyan-500 to-blue-500",
  },
  rap: {
    badge: "🎤 Hip-Hop",
    color: "text-emerald-500 dark:text-emerald-400",
    activeBg: "bg-emerald-500 text-white shadow-emerald-500/25",
    border: "border-emerald-500/40",
    gradient: "from-emerald-500 to-teal-500",
  },
  sufi: {
    badge: "🕊️ Sufi",
    color: "text-violet-500 dark:text-violet-400",
    activeBg: "bg-violet-500 text-white shadow-violet-500/25",
    border: "border-violet-500/40",
    gradient: "from-violet-500 to-purple-500",
  },
  folk: {
    badge: "🪕 Folk",
    color: "text-rose-500 dark:text-rose-400",
    activeBg: "bg-rose-500 text-white shadow-rose-500/25",
    border: "border-rose-500/40",
    gradient: "from-rose-500 to-pink-500",
  },
}

export function MusicPlayer() {
  const [mounted, setMounted] = useState(false)
  const [tracks, setTracks] = useState<JioSaavnSong[]>(DEFAULT_TRACKS)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.85)
  const [previousVolume, setPreviousVolume] = useState(0.85)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("all")

  // Navigation tabs: player (Now Playing), genres (5 Punjabi Genres), search, queue
  const [activeTab, setActiveTab] = useState<
    "player" | "genres" | "search" | "queue"
  >("player")

  // Active selected genre in the Genres tab
  const [selectedGenreId, setSelectedGenreId] = useState<string>(
    PUNJABI_GENRES[0]?.id || "bhangra"
  )

  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<JioSaavnSong[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentTrack = tracks[currentTrackIndex] || DEFAULT_TRACKS[0]
  const currentGenre =
    PUNJABI_GENRES.find((g) => g.id === selectedGenreId) || PUNJABI_GENRES[0]
  const genreMeta = GENRE_CONFIG[selectedGenreId] || GENRE_CONFIG.bhangra

  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync audio source when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack?.streamUrl) {
      audioRef.current.src = currentTrack.streamUrl
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((err) =>
            console.log("Playback interrupted or autoplay blocked:", err)
          )
      }
    }
  }, [currentTrack])

  // Volume & Mute handling
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
        .catch((err) => console.error("Audio playback error:", err))
    }
  }

  const handleNext = () => {
    if (tracks.length === 0) return
    if (isShuffle && tracks.length > 1) {
      let nextIndex = Math.floor(Math.random() * tracks.length)
      if (nextIndex === currentTrackIndex) {
        nextIndex = (currentTrackIndex + 1) % tracks.length
      }
      setCurrentTrackIndex(nextIndex)
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length)
    }
    setIsPlaying(true)
  }

  const handlePrev = () => {
    if (tracks.length === 0) return
    // Rewind to beginning if >3 seconds into the song
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
      setCurrentTime(0)
      return
    }

    if (isShuffle && tracks.length > 1) {
      let prevIndex = Math.floor(Math.random() * tracks.length)
      if (prevIndex === currentTrackIndex) {
        prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length
      }
      setCurrentTrackIndex(prevIndex)
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length)
    }
    setIsPlaying(true)
  }

  const handleSongEnded = () => {
    if (repeatMode === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(console.error)
      }
    } else if (repeatMode === "all") {
      handleNext()
    } else {
      // Repeat off
      if (currentTrackIndex < tracks.length - 1) {
        handleNext()
      } else {
        setIsPlaying(false)
      }
    }
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

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false)
      setVolume(previousVolume || 0.85)
    } else {
      setPreviousVolume(volume)
      setIsMuted(true)
    }
  }

  const toggleRepeatMode = () => {
    if (repeatMode === "off") setRepeatMode("all")
    else if (repeatMode === "all") setRepeatMode("one")
    else setRepeatMode("off")
  }

  const executeSearch = async (queryText: string) => {
    if (!queryText.trim()) return
    setIsSearching(true)
    setHasSearched(true)
    try {
      const res = await fetch(
        `/api/music/search?q=${encodeURIComponent(queryText.trim())}`
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeSearch(searchQuery)
  }

  const playSongDirectly = (song: JioSaavnSong) => {
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

  const addSongToQueue = (song: JioSaavnSong) => {
    const exists = tracks.some((t) => t.id === song.id)
    if (!exists) {
      setTracks((prev) => [...prev, song])
    }
  }

  const removeSongFromQueue = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (tracks.length <= 1) return // Keep at least one song
    const newTracks = tracks.filter((_, idx) => idx !== indexToRemove)
    setTracks(newTracks)
    if (indexToRemove === currentTrackIndex) {
      const nextIdx = indexToRemove >= newTracks.length ? 0 : indexToRemove
      setCurrentTrackIndex(nextIdx)
    } else if (indexToRemove < currentTrackIndex) {
      setCurrentTrackIndex((prev) => prev - 1)
    }
  }

  const loadGenrePlaylist = (genre: MoodCategory, songIndex = 0) => {
    setTracks(genre.tracks)
    setCurrentTrackIndex(songIndex)
    setIsPlaying(true)
    setActiveTab("player")
  }

  if (!mounted) {
    return (
      <div className="w-full h-[480px] rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 animate-pulse" />
    )
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="flex flex-col w-full h-full select-none justify-between">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleSongEnded}
      />

      {/* Modern Top Header with Brand Badge & Tabs */}
      <div className="flex items-center justify-between pb-2.5 px-0.5 border-b border-neutral-200/60 dark:border-neutral-800/60 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200">
            <Radio className="size-3.5 text-emerald-500 animate-pulse" />
            <span className="tracking-tight bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent font-extrabold">
              JioSaavn
            </span>
            <span className="text-[10px] text-neutral-400 font-normal">Hi-Fi</span>
          </div>

          {/* Equalizer animation when playing */}
          {isPlaying && (
            <div
              className="flex items-end gap-0.5 h-3 ml-0.5"
              title="Streaming 160kbps AAC direct audio"
            >
              <span className="w-0.5 h-full bg-emerald-500 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-0.5 h-2/3 bg-emerald-500 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-0.5 h-full bg-emerald-500 rounded-full animate-bounce [animation-delay:300ms]" />
              <span className="w-0.5 h-1/2 bg-emerald-500 rounded-full animate-bounce [animation-delay:75ms]" />
            </div>
          )}
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center bg-neutral-100 dark:bg-neutral-800/80 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("player")}
            className={`px-2.5 py-0.5 rounded-md font-medium text-[11px] transition-colors cursor-pointer ${
              activeTab === "player"
                ? "bg-white dark:bg-neutral-700 text-black dark:text-white shadow-xs font-semibold"
                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            Now
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("genres")}
            className={`px-2.5 py-0.5 rounded-md font-medium text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === "genres"
                ? "bg-white dark:bg-neutral-700 text-black dark:text-white shadow-xs font-semibold"
                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            <Disc3 className="size-2.5" />
            <span>Genres</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("search")}
            className={`px-2.5 py-0.5 rounded-md font-medium text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === "search"
                ? "bg-white dark:bg-neutral-700 text-black dark:text-white shadow-xs font-semibold"
                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            <Search className="size-2.5" />
            <span>Search</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("queue")}
            className={`px-2.5 py-0.5 rounded-md font-medium text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === "queue"
                ? "bg-white dark:bg-neutral-700 text-black dark:text-white shadow-xs font-semibold"
                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            <ListMusic className="size-2.5" />
            <span>Queue</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content View */}
      <div className="relative flex-1 flex flex-col justify-between pt-2 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* TAB 1: NOW PLAYING SCREEN */}
          {activeTab === "player" && (
            <motion.div
              key="player"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col flex-1 justify-between"
            >
              {/* Turntable Showcase Card */}
              <div className="relative flex items-center gap-3.5 p-3 rounded-2xl bg-neutral-50/90 dark:bg-neutral-900/90 border border-neutral-200/70 dark:border-neutral-800/70 shadow-xs backdrop-blur-md overflow-hidden group">
                {/* Ambient dynamic glow behind artwork */}
                <div
                  className={`absolute -left-6 -top-6 size-32 rounded-full blur-2xl pointer-events-none transition-opacity duration-700 ${
                    isPlaying
                      ? "opacity-35 bg-emerald-500/40"
                      : "opacity-15 bg-neutral-500/20"
                  }`}
                />

                {/* Rotating Vinyl Record Artwork with Tonearm */}
                <div className="relative size-24 sm:size-28 shrink-0 flex items-center justify-center">
                  {/* Vinyl Record */}
                  <div
                    className="relative size-24 sm:size-28 rounded-full bg-neutral-950 p-1 shadow-xl ring-1 ring-black/10 dark:ring-white/10 overflow-hidden cursor-pointer"
                    style={{
                      animation: "spin 8s linear infinite",
                      animationPlayState: isPlaying ? "running" : "paused",
                    }}
                    onClick={togglePlay}
                  >
                    {/* Vinyl concentric groove patterns */}
                    <div className="absolute inset-1.5 rounded-full border border-neutral-800/80 pointer-events-none" />
                    <div className="absolute inset-3 rounded-full border border-neutral-800/50 pointer-events-none" />
                    <div className="absolute inset-5 rounded-full border border-neutral-800/30 pointer-events-none" />

                    {/* Album Art Centerpiece */}
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={currentTrack.image || "/images/project-icon.webp"}
                        alt={currentTrack.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Central Vinyl Spindle Hole */}
                    <div className="absolute inset-0 m-auto size-3 rounded-full bg-neutral-950 border border-neutral-600 shadow-inner z-10" />
                  </div>

                  {/* Play / Pause overlay on hover */}
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto size-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20 backdrop-blur-xs shadow-md"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="size-4 fill-white" />
                    ) : (
                      <Play className="size-4 fill-white translate-x-0.5" />
                    )}
                  </button>
                </div>

                {/* Track Details & Soundwave */}
                <div className="flex-1 min-w-0 flex flex-col justify-center z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      160kbps AAC
                    </span>
                    {currentTrack.year && (
                      <span className="text-[10px] text-neutral-400 font-medium">
                        {currentTrack.year}
                      </span>
                    )}
                  </div>

                  <h4
                    className="text-base sm:text-lg font-bold truncate text-neutral-900 dark:text-neutral-100 mt-1"
                    title={currentTrack.title}
                  >
                    {currentTrack.title}
                  </h4>

                  <p
                    className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5"
                    title={currentTrack.artist}
                  >
                    {currentTrack.artist}
                  </p>

                  {/* 12-Bar Animated Soundwave Visualizer */}
                  <div className="flex items-end gap-1 h-3.5 mt-2.5">
                    {Array.from({ length: 12 }).map((_, idx) => (
                      <span
                        key={idx}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          isPlaying
                            ? "bg-gradient-to-t from-emerald-500 to-teal-400 animate-pulse"
                            : "bg-neutral-300 dark:bg-neutral-700"
                        }`}
                        style={{
                          height: isPlaying
                            ? `${Math.sin(idx * 0.7 + 1) * 35 + 55}%`
                            : "20%",
                          animationDelay: `${(idx * 110) % 800}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Progress Bar & Timestamps */}
              <div className="space-y-1 my-2 px-1">
                <div className="relative group flex items-center">
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

              {/* Main Playback Controls Bar */}
              <div className="flex items-center justify-between px-2 pt-0.5 pb-1">
                {/* Shuffle Mode Toggle */}
                <button
                  type="button"
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isShuffle
                      ? "text-emerald-500 bg-emerald-500/10 font-bold"
                      : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                  }`}
                  title={isShuffle ? "Shuffle On" : "Shuffle Off"}
                >
                  <Shuffle className="size-4" />
                </button>

                {/* Previous Track */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all cursor-pointer"
                  title="Previous track"
                >
                  <SkipBack className="size-4" />
                </button>

                {/* Primary Play / Pause Button */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-3.5 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="size-5 fill-white" />
                  ) : (
                    <Play className="size-5 fill-white translate-x-0.5" />
                  )}
                </button>

                {/* Next Track */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all cursor-pointer"
                  title="Next track"
                >
                  <SkipForward className="size-4" />
                </button>

                {/* Repeat Mode Toggle */}
                <button
                  type="button"
                  onClick={toggleRepeatMode}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    repeatMode !== "off"
                      ? "text-emerald-500 bg-emerald-500/10 font-bold"
                      : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                  }`}
                  title={
                    repeatMode === "one"
                      ? "Repeat One Song"
                      : repeatMode === "all"
                      ? "Repeat All Songs"
                      : "Repeat Off"
                  }
                >
                  {repeatMode === "one" ? (
                    <Repeat1 className="size-4" />
                  ) : (
                    <Repeat className="size-4" />
                  )}
                </button>
              </div>

              {/* Utility Footer Bar: Volume & External JioSaavn Link */}
              <div className="flex items-center justify-between px-2 pt-2 border-t border-neutral-200/50 dark:border-neutral-800/50 text-xs">
                {/* Volume slider */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="size-3.5" />
                    ) : volume < 0.5 ? (
                      <Volume1 className="size-3.5" />
                    ) : (
                      <Volume2 className="size-3.5" />
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
                    className="w-16 sm:w-20 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Track Queue indicator and External Link */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {currentTrackIndex + 1}/{tracks.length}
                  </span>
                  <a
                    href={`https://www.jiosaavn.com/search/${encodeURIComponent(
                      currentTrack.title
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                    title="Open on JioSaavn web"
                  >
                    <span>JioSaavn</span>
                    <ExternalLink className="size-2.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: PUNJABI GENRES (5 Genres x 20 Songs each) */}
          {activeTab === "genres" && (
            <motion.div
              key="genres"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col flex-1 h-[270px] justify-between"
            >
              {/* Genre Selector Pills */}
              <div className="flex items-center gap-1 pb-1.5 overflow-x-auto no-scrollbar shrink-0">
                {PUNJABI_GENRES.map((genre) => {
                  const isSelected = genre.id === selectedGenreId
                  const config = GENRE_CONFIG[genre.id] || GENRE_CONFIG.bhangra
                  return (
                    <button
                      key={genre.id}
                      type="button"
                      onClick={() => setSelectedGenreId(genre.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? `${config.activeBg} font-semibold shadow-xs`
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      }`}
                    >
                      <span>{config.badge}</span>
                      <span className="text-[10px] opacity-75">(20)</span>
                    </button>
                  )
                })}
              </div>

              {/* Genre Banner & Play All CTA */}
              <div
                className={`flex items-center justify-between p-2 mb-1.5 rounded-xl border bg-neutral-50/80 dark:bg-neutral-900/80 ${genreMeta.border} shrink-0`}
              >
                <div className="min-w-0 pr-2">
                  <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                    {currentGenre.name}
                  </h5>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                    {currentGenre.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => loadGenrePlaylist(currentGenre, 0)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-gradient-to-r ${genreMeta.gradient} text-white flex items-center gap-1 hover:scale-105 transition-transform shrink-0 shadow-xs cursor-pointer`}
                >
                  <Play className="size-3 fill-white" />
                  <span>Play All (20)</span>
                </button>
              </div>

              {/* List of 20 songs in this genre */}
              <div className="flex-1 overflow-y-auto space-y-1 pr-1 no-scrollbar">
                {currentGenre.tracks.map((song, i) => {
                  const isThisPlaying =
                    isPlaying && currentTrack.id === song.id
                  return (
                    <div
                      key={`${song.id}-${i}`}
                      className={`flex items-center gap-2 p-1.5 rounded-xl transition-colors group ${
                        isThisPlaying
                          ? "bg-emerald-500/10 border border-emerald-500/30"
                          : "hover:bg-neutral-100 dark:hover:bg-neutral-800/80"
                      }`}
                    >
                      <span className="text-[10px] font-mono text-neutral-400 w-4 text-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="relative size-8 rounded-lg overflow-hidden shrink-0 bg-neutral-200 dark:bg-neutral-800">
                        <Image
                          src={song.image || "/images/project-icon.webp"}
                          alt={song.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => loadGenrePlaylist(currentGenre, i)}
                      >
                        <p
                          className={`text-xs font-semibold truncate ${
                            isThisPlaying
                              ? "text-emerald-500"
                              : "text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-500"
                          } transition-colors`}
                        >
                          {song.title}
                        </p>
                        <p className="text-[10px] text-neutral-500 truncate">
                          {song.artist}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {isThisPlaying && (
                          <div className="flex items-end gap-0.5 h-2.5 mr-1">
                            <span className="w-0.5 h-full bg-emerald-500 rounded-full animate-bounce [animation-delay:0ms]" />
                            <span className="w-0.5 h-2/3 bg-emerald-500 rounded-full animate-bounce [animation-delay:150ms]" />
                            <span className="w-0.5 h-full bg-emerald-500 rounded-full animate-bounce [animation-delay:300ms]" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => addSongToQueue(song)}
                          className="p-1 rounded text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                          title="Add to queue"
                        >
                          <Plus className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => loadGenrePlaylist(currentGenre, i)}
                          className="p-1 rounded text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                          title="Play now"
                        >
                          <Play className="size-3.5 fill-current" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 3: LIVE SEARCH */}
          {activeTab === "search" && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col flex-1 h-[270px] justify-between"
            >
              {/* Search Input Field */}
              <form onSubmit={handleSearchSubmit} className="flex gap-1.5 mb-2 shrink-0">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 size-3.5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search Punjabi songs or artists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-emerald-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1"
                >
                  {isSearching ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <span>Search</span>
                  )}
                </button>
              </form>

              {/* Quick Preset Search Chips */}
              <div className="flex items-center gap-1 pb-1.5 overflow-x-auto no-scrollbar shrink-0">
                {SEARCH_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setSearchQuery(preset)
                      executeSearch(preset)
                    }}
                    className="px-2 py-0.5 rounded-full text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-emerald-500/10 hover:text-emerald-500 dark:hover:text-emerald-400 whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Search Results List */}
              <div className="flex-1 overflow-y-auto space-y-1 pr-1 no-scrollbar">
                {searchResults.length > 0 ? (
                  searchResults.map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors group"
                    >
                      <div className="relative size-9 rounded-lg overflow-hidden shrink-0 bg-neutral-200 dark:bg-neutral-800">
                        <Image
                          src={song.image || "/images/project-icon.webp"}
                          alt={song.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => playSongDirectly(song)}
                      >
                        <p className="text-xs font-semibold truncate text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-500 transition-colors">
                          {song.title}
                        </p>
                        <p className="text-[10px] text-neutral-500 truncate">
                          {song.artist}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => addSongToQueue(song)}
                          className="p-1 rounded-md text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                          title="Add to queue"
                        >
                          <Plus className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => playSongDirectly(song)}
                          className="p-1 rounded-md text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                          title="Play now"
                        >
                          <Play className="size-3.5 fill-current" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : isSearching ? (
                  <div className="flex flex-col items-center justify-center h-32 text-neutral-400 text-xs">
                    <Loader2 className="size-6 animate-spin text-emerald-500 mb-2" />
                    <span>Searching JioSaavn catalogue...</span>
                  </div>
                ) : hasSearched ? (
                  <div className="flex flex-col items-center justify-center h-32 text-neutral-400 text-xs text-center px-4">
                    <Music className="size-6 text-neutral-400 mb-2" />
                    <span>
                      No results found for &ldquo;{searchQuery}&rdquo;. Try another title or artist.
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-neutral-400 text-xs text-center px-4">
                    <Sparkles className="size-6 text-emerald-500 mb-2" />
                    <span>
                      Search millions of tracks directly on JioSaavn or pick a top Punjabi artist above.
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 4: QUEUE / UP NEXT */}
          {activeTab === "queue" && (
            <motion.div
              key="queue"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col flex-1 h-[270px] justify-between"
            >
              <div className="flex items-center justify-between pb-1.5 px-1 text-[11px] font-semibold text-neutral-500 shrink-0">
                <span>Playlist Queue ({tracks.length} tracks)</span>
                <button
                  type="button"
                  onClick={() => {
                    setTracks(DEFAULT_TRACKS)
                    setCurrentTrackIndex(0)
                  }}
                  className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Reset to Default
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 pr-1 no-scrollbar">
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
                      <div className="relative size-9 rounded-lg overflow-hidden shrink-0 bg-neutral-200 dark:bg-neutral-800">
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

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isCurrent && isPlaying ? (
                          <div className="flex items-end gap-0.5 h-3 mr-1">
                            <span className="w-0.5 h-full bg-emerald-500 rounded-full animate-bounce [animation-delay:0ms]" />
                            <span className="w-0.5 h-2/3 bg-emerald-500 rounded-full animate-bounce [animation-delay:150ms]" />
                            <span className="w-0.5 h-full bg-emerald-500 rounded-full animate-bounce [animation-delay:300ms]" />
                          </div>
                        ) : (
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {formatTime(song.duration)}
                          </span>
                        )}

                        {tracks.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => removeSongFromQueue(i, e)}
                            className="p-1 rounded text-neutral-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Remove from queue"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Docked Mini-Player Bar (Visible when browsing Genres, Search, or Queue) */}
      {activeTab !== "player" && (
        <div className="relative mt-2 pt-2 border-t border-neutral-200/70 dark:border-neutral-800/70 shrink-0">
          {/* Continuous Progress Indicator Line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-neutral-200 dark:bg-neutral-800">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200/50 dark:border-neutral-800/50">
            {/* Click to expand Now Playing */}
            <div
              onClick={() => setActiveTab("player")}
              className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer group"
            >
              <div className="relative size-8 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={currentTrack.image || "/images/project-icon.webp"}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-500 transition-colors">
                  {currentTrack.title}
                </p>
                <p className="text-[10px] text-neutral-500 truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Quick Playback Transport in Docked Bar */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Previous track"
              >
                <SkipBack className="size-3.5" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="p-1.5 rounded-full bg-emerald-500 text-white shadow-xs hover:bg-emerald-600 transition-colors cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="size-3 fill-white" />
                ) : (
                  <Play className="size-3 fill-white translate-x-0.2" />
                )}
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="p-1 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Next track"
              >
                <SkipForward className="size-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("player")}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors ml-0.5 cursor-pointer"
                title="Open Full Player"
              >
                <Maximize2 className="size-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
