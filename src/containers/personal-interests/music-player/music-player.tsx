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
  Heart,
  Laptop2,
  ExternalLink,
  Loader2,
  Shuffle,
  Repeat,
  Repeat1,
  Music,
  Plus,
  Trash2,
  X,
  Maximize2,
  Check,
} from "lucide-react"
import { IconBrandSpotify } from "@tabler/icons-react"
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

  // Liked songs set
  const [likedSongIds, setLikedSongIds] = useState<Set<string>>(
    () => new Set(["3hTPwXPr", "U3hhczTF", "FDK_XUST"])
  )

  // Navigation tabs: player (Now Playing), playlists (5 Punjabi Genres), search, queue
  const [activeTab, setActiveTab] = useState<
    "player" | "playlists" | "search" | "queue"
  >("player")

  // Active selected playlist/genre
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

  const toggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setLikedSongIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
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
    if (tracks.length <= 1) return
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
      <div className="w-full h-[480px] rounded-2xl bg-[#121212] animate-pulse border border-[#282828]" />
    )
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  const isCurrentLiked = likedSongIds.has(currentTrack.id)

  return (
    <div className="flex flex-col w-full h-full select-none justify-between bg-[#121212] text-white rounded-2xl p-3 sm:p-4 border border-[#282828] shadow-2xl overflow-hidden font-sans">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleSongEnded}
      />

      {/* Spotify Top Header */}
      <div className="flex items-center justify-between pb-3 px-1 border-b border-[#282828] shrink-0">
        <div className="flex items-center gap-2">
          <IconBrandSpotify className="size-5 text-[#1ED760]" />
          <span className="text-xs font-black tracking-tight text-white">
            Spotify
          </span>

          {/* Equalizer animation when playing */}
          {isPlaying && (
            <div
              className="flex items-end gap-0.5 h-3 ml-1"
              title="Streaming 160kbps AAC audio"
            >
              <span className="w-0.5 h-full bg-[#1ED760] rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-0.5 h-2/3 bg-[#1ED760] rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-0.5 h-full bg-[#1ED760] rounded-full animate-bounce [animation-delay:300ms]" />
              <span className="w-0.5 h-1/2 bg-[#1ED760] rounded-full animate-bounce [animation-delay:75ms]" />
            </div>
          )}
        </div>

        {/* Spotify Tab Navigation Pills */}
        <div className="flex items-center bg-[#242424] p-0.5 rounded-full text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("player")}
            className={`px-3 py-1 rounded-full font-bold text-[11px] transition-all cursor-pointer ${
              activeTab === "player"
                ? "bg-white text-black shadow-md font-extrabold"
                : "text-[#B3B3B3] hover:text-white"
            }`}
          >
            Now
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("playlists")}
            className={`px-3 py-1 rounded-full font-bold text-[11px] transition-all cursor-pointer ${
              activeTab === "playlists"
                ? "bg-white text-black shadow-md font-extrabold"
                : "text-[#B3B3B3] hover:text-white"
            }`}
          >
            Playlists
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("search")}
            className={`px-3 py-1 rounded-full font-bold text-[11px] transition-all cursor-pointer ${
              activeTab === "search"
                ? "bg-white text-black shadow-md font-extrabold"
                : "text-[#B3B3B3] hover:text-white"
            }`}
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("queue")}
            className={`px-3 py-1 rounded-full font-bold text-[11px] transition-all cursor-pointer ${
              activeTab === "queue"
                ? "bg-white text-black shadow-md font-extrabold"
                : "text-[#B3B3B3] hover:text-white"
            }`}
          >
            Queue
          </button>
        </div>
      </div>

      {/* Main Tab Content View */}
      <div className="relative flex-1 flex flex-col justify-between pt-3 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* TAB 1: SPOTIFY NOW PLAYING SCREEN */}
          {activeTab === "player" && (
            <motion.div
              key="player"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col flex-1 justify-between"
            >
              {/* Spotify Album Art Showcase Card */}
              <div className="relative flex items-center gap-3.5 p-3 rounded-xl bg-[#181818] border border-[#282828] shadow-lg group">
                {/* Album Cover Art */}
                <div className="relative size-24 sm:size-28 shrink-0 rounded-lg overflow-hidden shadow-2xl bg-[#282828]">
                  <Image
                    src={currentTrack.image || "/images/project-icon.webp"}
                    alt={currentTrack.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {/* Hover Overlay with Green Play Button */}
                  <div
                    onClick={togglePlay}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <div className="size-10 rounded-full bg-[#1ED760] text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                      {isPlaying ? (
                        <Pause className="size-5 fill-black" />
                      ) : (
                        <Play className="size-5 fill-black translate-x-0.5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Track Details & Heart Like Action */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1ED760]">
                      Spotify Audio
                    </span>
                    {/* Heart / Like Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleLike(currentTrack.id, e)}
                      className="p-1 text-[#B3B3B3] hover:text-white transition-colors cursor-pointer"
                      title={isCurrentLiked ? "Remove from Liked Songs" : "Save to Liked Songs"}
                    >
                      <Heart
                        className={`size-4 transition-all ${
                          isCurrentLiked
                            ? "fill-[#1ED760] text-[#1ED760] scale-110"
                            : "hover:scale-110"
                        }`}
                      />
                    </button>
                  </div>

                  <h4
                    className="text-base sm:text-lg font-bold truncate text-white hover:underline cursor-pointer mt-0.5"
                    title={currentTrack.title}
                  >
                    {currentTrack.title}
                  </h4>

                  <p
                    className="text-xs text-[#B3B3B3] hover:text-white hover:underline cursor-pointer truncate mt-0.5"
                    title={currentTrack.artist}
                  >
                    {currentTrack.artist}
                  </p>

                  {currentTrack.album && (
                    <span
                      className="text-[11px] text-[#727272] truncate mt-0.5"
                      title={currentTrack.album}
                    >
                      {currentTrack.album} {currentTrack.year ? `• ${currentTrack.year}` : ""}
                    </span>
                  )}
                </div>
              </div>

              {/* Spotify Progress Bar Scrubber */}
              <div className="space-y-1 my-2.5 px-1 group">
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-[#4D4D4D] rounded-full appearance-none cursor-pointer accent-[#1ED760] group-hover:h-1.5 transition-all focus:outline-none"
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono font-medium text-[#B3B3B3]">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Spotify Playback Controls Bar */}
              <div className="flex items-center justify-between px-3 pt-0.5 pb-1">
                {/* Shuffle Button with green dot */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={`p-1.5 transition-colors cursor-pointer ${
                      isShuffle
                        ? "text-[#1ED760]"
                        : "text-[#B3B3B3] hover:text-white"
                    }`}
                    title={isShuffle ? "Disable shuffle" : "Enable shuffle"}
                  >
                    <Shuffle className="size-4" />
                  </button>
                  {isShuffle && (
                    <span className="size-1 rounded-full bg-[#1ED760] -mt-0.5" />
                  )}
                </div>

                {/* Previous Button */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2 text-[#B3B3B3] hover:text-white transition-colors cursor-pointer"
                  title="Previous"
                >
                  <SkipBack className="size-5 fill-current" />
                </button>

                {/* Big Spotify Circular Green Play/Pause Button */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-3 rounded-full bg-[#1ED760] text-black shadow-lg shadow-[#1ED760]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="size-5 fill-black" />
                  ) : (
                    <Play className="size-5 fill-black translate-x-0.5" />
                  )}
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 text-[#B3B3B3] hover:text-white transition-colors cursor-pointer"
                  title="Next"
                >
                  <SkipForward className="size-5 fill-current" />
                </button>

                {/* Repeat Button with green dot */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={toggleRepeatMode}
                    className={`p-1.5 transition-colors cursor-pointer ${
                      repeatMode !== "off"
                        ? "text-[#1ED760]"
                        : "text-[#B3B3B3] hover:text-white"
                    }`}
                    title={
                      repeatMode === "one"
                        ? "Repeat one"
                        : repeatMode === "all"
                        ? "Repeat all"
                        : "Enable repeat"
                    }
                  >
                    {repeatMode === "one" ? (
                      <Repeat1 className="size-4" />
                    ) : (
                      <Repeat className="size-4" />
                    )}
                  </button>
                  {repeatMode !== "off" && (
                    <span className="size-1 rounded-full bg-[#1ED760] -mt-0.5" />
                  )}
                </div>
              </div>

              {/* Spotify Utility Footer: Volume & Connected Device */}
              <div className="flex items-center justify-between px-2 pt-2 border-t border-[#282828] text-xs">
                {/* Volume Slider with Mute */}
                <div className="flex items-center gap-2 group">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="text-[#B3B3B3] hover:text-white transition-colors cursor-pointer"
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
                    className="w-16 sm:w-20 h-1 bg-[#4D4D4D] rounded-full appearance-none cursor-pointer accent-[#1ED760] group-hover:h-1.5 transition-all"
                  />
                </div>

                {/* Spotify Device Connect Status */}
                <div className="flex items-center gap-1.5 text-[11px] text-[#1ED760]">
                  <Laptop2 className="size-3.5" />
                  <span className="font-medium">Web Player</span>
                  <a
                    href={`https://www.jiosaavn.com/search/${encodeURIComponent(
                      currentTrack.title
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#727272] hover:text-[#1ED760] transition-colors ml-1"
                    title="Open on JioSaavn"
                  >
                    <ExternalLink className="size-2.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: SPOTIFY PLAYLISTS VIEW (5 Punjabi Genres x 20 Songs) */}
          {activeTab === "playlists" && (
            <motion.div
              key="playlists"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col flex-1 h-[270px] justify-between"
            >
              {/* Spotify Playlist Chips */}
              <div
                className="flex items-center gap-1.5 pb-2 overflow-x-auto no-scrollbar shrink-0 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {PUNJABI_GENRES.map((genre) => {
                  const isSelected = genre.id === selectedGenreId
                  return (
                    <button
                      key={genre.id}
                      type="button"
                      onClick={() => setSelectedGenreId(genre.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#1ED760] text-black font-extrabold shadow-sm"
                          : "bg-[#242424] text-[#B3B3B3] hover:text-white hover:bg-[#2A2A2A]"
                      }`}
                    >
                      {genre.badge}
                    </button>
                  )
                })}
              </div>

              {/* Playlist Header Card with Play All CTA */}
              <div className="flex items-center justify-between p-2.5 mb-1.5 rounded-xl bg-[#181818] border border-[#282828] shrink-0">
                <div className="min-w-0 pr-2">
                  <span className="text-[9px] uppercase font-bold text-[#B3B3B3] tracking-wider">
                    Playlist
                  </span>
                  <h5 className="text-xs sm:text-sm font-extrabold text-white truncate">
                    {currentGenre.name}
                  </h5>
                  <p className="text-[10px] text-[#B3B3B3] truncate">
                    20 songs • {currentGenre.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => loadGenrePlaylist(currentGenre, 0)}
                  className="size-9 rounded-full bg-[#1ED760] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md shrink-0 cursor-pointer"
                  title="Play all tracks"
                >
                  <Play className="size-4 fill-black translate-x-0.5" />
                </button>
              </div>

              {/* Spotify Tracklist Table */}
              <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 no-scrollbar">
                {currentGenre.tracks.map((song, i) => {
                  const isThisPlaying =
                    isPlaying && currentTrack.id === song.id
                  const isSongLiked = likedSongIds.has(song.id)

                  return (
                    <div
                      key={`${song.id}-${i}`}
                      className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors group cursor-pointer ${
                        isThisPlaying
                          ? "bg-[#282828] text-[#1ED760]"
                          : "hover:bg-[#242424] text-white"
                      }`}
                    >
                      {/* Track number or Play icon / Animated equalizer */}
                      <div className="size-4 flex items-center justify-center shrink-0">
                        {isThisPlaying ? (
                          <div className="flex items-end gap-0.5 h-3">
                            <span className="w-0.5 h-full bg-[#1ED760] rounded-full animate-bounce [animation-delay:0ms]" />
                            <span className="w-0.5 h-2/3 bg-[#1ED760] rounded-full animate-bounce [animation-delay:150ms]" />
                            <span className="w-0.5 h-full bg-[#1ED760] rounded-full animate-bounce [animation-delay:300ms]" />
                          </div>
                        ) : (
                          <>
                            <span className="text-[11px] font-mono text-[#B3B3B3] group-hover:hidden">
                              {i + 1}
                            </span>
                            <Play
                              onClick={() => loadGenrePlaylist(currentGenre, i)}
                              className="size-3 fill-current text-white hidden group-hover:block cursor-pointer"
                            />
                          </>
                        )}
                      </div>

                      {/* Album thumbnail */}
                      <div className="relative size-8 rounded-sm overflow-hidden shrink-0 bg-[#282828]">
                        <Image
                          src={song.image || "/images/project-icon.webp"}
                          alt={song.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      {/* Song Title & Artist */}
                      <div
                        className="flex-1 min-w-0"
                        onClick={() => loadGenrePlaylist(currentGenre, i)}
                      >
                        <p
                          className={`text-xs font-semibold truncate ${
                            isThisPlaying
                              ? "text-[#1ED760]"
                              : "text-white group-hover:underline"
                          }`}
                        >
                          {song.title}
                        </p>
                        <p className="text-[10px] text-[#B3B3B3] truncate">
                          {song.artist}
                        </p>
                      </div>

                      {/* Actions: Heart + Queue + Duration */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => toggleLike(song.id, e)}
                          className={`p-1 transition-colors cursor-pointer ${
                            isSongLiked
                              ? "text-[#1ED760]"
                              : "text-[#B3B3B3] opacity-0 group-hover:opacity-100 hover:text-white"
                          }`}
                          title={isSongLiked ? "Liked" : "Like"}
                        >
                          <Heart
                            className={`size-3.5 ${
                              isSongLiked ? "fill-[#1ED760]" : ""
                            }`}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            addSongToQueue(song)
                          }}
                          className="p-1 text-[#B3B3B3] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Add to queue"
                        >
                          <Plus className="size-3.5" />
                        </button>

                        <span className="text-[10px] text-[#B3B3B3] font-mono">
                          {formatTime(song.duration)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 3: SPOTIFY SEARCH VIEW */}
          {activeTab === "search" && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col flex-1 h-[270px] justify-between"
            >
              {/* Spotify Search Pill Input */}
              <form onSubmit={handleSearchSubmit} className="flex gap-1.5 mb-2 shrink-0">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 size-3.5 text-[#B3B3B3]" />
                  <input
                    type="text"
                    placeholder="What do you want to play?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-1.5 text-xs rounded-full bg-[#242424] hover:bg-[#2A2A2A] focus:bg-[#2A2A2A] border border-transparent focus:border-[#1ED760] text-white placeholder:text-[#727272] transition-colors focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-2 text-[#B3B3B3] hover:text-white"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-3.5 py-1.5 bg-[#1ED760] text-black font-bold rounded-full text-xs hover:scale-105 active:scale-95 transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
                >
                  {isSearching ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <span>Search</span>
                  )}
                </button>
              </form>

              {/* Quick Artist Filter Pills */}
              <div
                className="flex items-center gap-1.5 pb-2 overflow-x-auto no-scrollbar shrink-0 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {SEARCH_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setSearchQuery(preset)
                      executeSearch(preset)
                    }}
                    className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#242424] text-[#B3B3B3] hover:text-white hover:bg-[#2A2A2A] whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Search Results List */}
              <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 no-scrollbar">
                {searchResults.length > 0 ? (
                  searchResults.map((song) => {
                    const isThisPlaying =
                      isPlaying && currentTrack.id === song.id
                    return (
                      <div
                        key={song.id}
                        className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors group cursor-pointer ${
                          isThisPlaying
                            ? "bg-[#282828] text-[#1ED760]"
                            : "hover:bg-[#242424] text-white"
                        }`}
                      >
                        <div className="relative size-8 rounded-sm overflow-hidden shrink-0 bg-[#282828]">
                          <Image
                            src={song.image || "/images/project-icon.webp"}
                            alt={song.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div
                          className="flex-1 min-w-0"
                          onClick={() => playSongDirectly(song)}
                        >
                          <p
                            className={`text-xs font-semibold truncate ${
                              isThisPlaying
                                ? "text-[#1ED760]"
                                : "text-white group-hover:underline"
                            }`}
                          >
                            {song.title}
                          </p>
                          <p className="text-[10px] text-[#B3B3B3] truncate">
                            {song.artist}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              addSongToQueue(song)
                            }}
                            className="p-1 text-[#B3B3B3] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Add to queue"
                          >
                            <Plus className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => playSongDirectly(song)}
                            className="p-1 text-white hover:text-[#1ED760] transition-colors cursor-pointer"
                            title="Play"
                          >
                            <Play className="size-3.5 fill-current" />
                          </button>
                        </div>
                      </div>
                    )
                  })
                ) : isSearching ? (
                  <div className="flex flex-col items-center justify-center h-32 text-[#B3B3B3] text-xs">
                    <Loader2 className="size-6 animate-spin text-[#1ED760] mb-2" />
                    <span>Searching Spotify catalogue...</span>
                  </div>
                ) : hasSearched ? (
                  <div className="flex flex-col items-center justify-center h-32 text-[#B3B3B3] text-xs text-center px-4">
                    <Music className="size-6 text-[#727272] mb-2" />
                    <span>
                      No results found for &ldquo;{searchQuery}&rdquo;. Try another title or artist.
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-[#B3B3B3] text-xs text-center px-4">
                    <IconBrandSpotify className="size-8 text-[#1ED760] mb-2" />
                    <span>
                      Search millions of tracks or explore top Punjabi artists above.
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 4: SPOTIFY QUEUE VIEW */}
          {activeTab === "queue" && (
            <motion.div
              key="queue"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col flex-1 h-[270px] justify-between"
            >
              <div className="flex items-center justify-between pb-2 px-1 text-[11px] font-bold text-[#B3B3B3] shrink-0 border-b border-[#282828]">
                <span>Queue ({tracks.length} songs)</span>
                <button
                  type="button"
                  onClick={() => {
                    setTracks(DEFAULT_TRACKS)
                    setCurrentTrackIndex(0)
                  }}
                  className="text-[10px] text-[#1ED760] hover:underline cursor-pointer"
                >
                  Clear Queue
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-0.5 pt-1 pr-1 no-scrollbar">
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
                      className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors cursor-pointer group ${
                        isCurrent
                          ? "bg-[#282828] text-[#1ED760]"
                          : "hover:bg-[#242424] text-white"
                      }`}
                    >
                      <div className="relative size-8 rounded-sm overflow-hidden shrink-0 bg-[#282828]">
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
                              ? "text-[#1ED760]"
                              : "text-white group-hover:underline"
                          }`}
                        >
                          {song.title}
                        </p>
                        <p className="text-[10px] text-[#B3B3B3] truncate">
                          {song.artist}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isCurrent && isPlaying ? (
                          <div className="flex items-end gap-0.5 h-3 mr-1">
                            <span className="w-0.5 h-full bg-[#1ED760] rounded-full animate-bounce [animation-delay:0ms]" />
                            <span className="w-0.5 h-2/3 bg-[#1ED760] rounded-full animate-bounce [animation-delay:150ms]" />
                            <span className="w-0.5 h-full bg-[#1ED760] rounded-full animate-bounce [animation-delay:300ms]" />
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#B3B3B3] font-mono">
                            {formatTime(song.duration)}
                          </span>
                        )}

                        {tracks.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => removeSongFromQueue(i, e)}
                            className="p-1 text-[#727272] hover:text-[#e91429] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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

      {/* Docked Spotify Bottom Player Bar (Shown when browsing Playlists, Search, or Queue) */}
      {activeTab !== "player" && (
        <div className="relative mt-2 pt-2 border-t border-[#282828] shrink-0">
          {/* Continuous Spotify Green Progress Line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#4D4D4D]">
            <div
              className="h-full bg-[#1ED760] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-[#181818] border border-[#282828]">
            {/* Click to expand Now Playing */}
            <div
              onClick={() => setActiveTab("player")}
              className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer group"
            >
              <div className="relative size-8 rounded-sm overflow-hidden shrink-0 bg-[#282828]">
                <Image
                  src={currentTrack.image || "/images/project-icon.webp"}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate text-white group-hover:underline">
                  {currentTrack.title}
                </p>
                <p className="text-[10px] text-[#B3B3B3] truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Quick Transport in Spotify Mini Player */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={(e) => toggleLike(currentTrack.id, e)}
                className="p-1 text-[#B3B3B3] hover:text-white transition-colors cursor-pointer mr-0.5"
                title={isCurrentLiked ? "Liked" : "Like"}
              >
                <Heart
                  className={`size-3.5 ${
                    isCurrentLiked ? "fill-[#1ED760] text-[#1ED760]" : ""
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={handlePrev}
                className="p-1 text-[#B3B3B3] hover:text-white transition-colors cursor-pointer"
                title="Previous"
              >
                <SkipBack className="size-3.5 fill-current" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="p-1.5 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="size-3 fill-black" />
                ) : (
                  <Play className="size-3 fill-black translate-x-0.2" />
                )}
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="p-1 text-[#B3B3B3] hover:text-white transition-colors cursor-pointer"
                title="Next"
              >
                <SkipForward className="size-3.5 fill-current" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("player")}
                className="p-1 text-[#727272] hover:text-white transition-colors ml-1 cursor-pointer"
                title="Expand Now Playing"
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
