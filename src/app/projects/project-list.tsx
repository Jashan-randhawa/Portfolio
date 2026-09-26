"use client"

import { useState, useMemo } from "react"
import { Card, Carousel } from "@/components/ui/apple-cards-carousel"
import { PROJECTS } from "@/data/projects"
import {
  Search,
  LayoutGrid,
  SlidersHorizontal,
  X,
  Sparkles,
} from "lucide-react"

const CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "ai", label: "AI & Machine Learning" },
  { id: "web", label: "Full-Stack Web" },
  { id: "automation", label: "Automation & Tools" },
  { id: "systems", label: "Management Systems & C++" },
]

export function ProjectCardsCarousel() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel")

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((project) => {
      // Category match
      let matchesCategory = true
      if (selectedCategory === "ai") {
        matchesCategory = project.category.toLowerCase().includes("intelligence")
      } else if (selectedCategory === "automation") {
        matchesCategory =
          project.category.toLowerCase().includes("automation") ||
          project.category.toLowerCase().includes("open source")
      } else if (selectedCategory === "web") {
        matchesCategory =
          project.category.toLowerCase().includes("web") ||
          project.category.toLowerCase().includes("chat") ||
          project.category.toLowerCase().includes("job portal") ||
          project.category.toLowerCase().includes("e-commerce") ||
          project.category.toLowerCase().includes("animation") ||
          project.category.toLowerCase().includes("event") ||
          project.category.toLowerCase().includes("platform")
      } else if (selectedCategory === "systems") {
        matchesCategory = project.category.toLowerCase().includes("management")
      }

      // Search match
      let matchesSearch = true
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const titleMatch = project.title.toLowerCase().includes(q)
        const descMatch = (project.description || "").toLowerCase().includes(q)
        const techMatch = (project.techStack || []).some((t) =>
          t.toLowerCase().includes(q)
        )
        const categoryMatch = project.category.toLowerCase().includes(q)
        matchesSearch = titleMatch || descMatch || techMatch || categoryMatch
      }

      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  const carouselCards = filteredProjects.map((card, index) => (
    <Card
      key={`${card.title}-${card.src}`}
      card={card}
      index={index}
      techStack={card.techStack}
      githubLink={card.githubLink}
      liveLink={card.liveLink}
      description={card.description}
      isGrid={false}
    />
  ))

  return (
    <div className="w-full my-6">
      {/* Controls Bar: Search, Category Filters, and Grid/Carousel Switcher */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Top row: Search input + View Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Live Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-3 size-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by title, keyword, or tech stack (e.g. React, C++, Gemini)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-xl text-sm bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-emerald-500 focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* View Mode Toggle & Project Count */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Showing {filteredProjects.length} of {PROJECTS.length}
            </span>

            <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg border border-neutral-200/60 dark:border-neutral-700/60 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("carousel")}
                className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === "carousel"
                    ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
                title="Slider / Carousel view"
              >
                <SlidersHorizontal className="size-3.5" />
                <span>Slider</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="size-3.5" />
                <span>Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-sm"
                    : "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Showcase: Grid View or Carousel View */}
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 my-8">
          <Sparkles className="size-8 text-neutral-400 mb-2" />
          <h4 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
            No projects found
          </h4>
          <p className="text-xs text-neutral-500 max-w-sm mt-1">
            Try adjusting your search query or select another category filter to explore projects.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all")
              setSearchQuery("")
            }}
            className="mt-4 px-4 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === "carousel" ? (
        /* Apple-style Smooth Horizontal Carousel */
        <Carousel items={carouselCards} />
      ) : (
        /* Responsive Grid: 1 col on mobile, 2 cols on md, 3 cols on xl */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((card, index) => (
            <Card
              key={`${card.title}-${card.src}`}
              card={card}
              index={index}
              techStack={card.techStack}
              githubLink={card.githubLink}
              liveLink={card.liveLink}
              description={card.description}
              isGrid={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
