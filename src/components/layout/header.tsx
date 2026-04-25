"use client"

import { cn } from "@/lib/utils"
import {
  IconArrowUp,
  IconBrandGithub,
  IconHeart,
  IconMenu2,
  IconX,
} from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { ModeToggle } from "../mode-toggle"
import { Logo } from "../svg/logo"
import { Button } from "../ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer"

const links = [
  { title: "All", href: "/" },
  { title: "Experience", href: "/experience" },
  { title: "Projects", href: "/projects" },
  { title: "About", href: "/about" },
]

// FIX: was [""] (empty string), but Next.js pathname for home is "/"
const pathNameDisableHeaderScroll = ["/"]

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const lastScrollY = useRef(0)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const pathname = usePathname()
  const isDisableHeaderScroll = pathNameDisableHeaderScroll.includes(pathname)

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    if (isDisableHeaderScroll) { setIsScrolled(false); return }
    setIsScrolled(currentScrollY > 0)
    lastScrollY.current = currentScrollY
  }, [isDisableHeaderScroll])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll, isDisableHeaderScroll])

  return (
    <>
      <header className={cn("top-8 sm:top-10 z-50", !isDisableHeaderScroll && "sticky")}>
        <div
          className={cn(
            "mx-auto flex justify-between gap-10 items-center transition-all duration-300 p-4 z-50",
            isScrolled
              ? "bg-white/80 backdrop-blur-md md:p-6 dark:bg-zinc-900/80 xl:w-[90%] shadow -translate-y-8 md:rounded-3xl"
              : "bg-transparent w-full xl:w-[70%]"
          )}
        >
          <div className="flex items-center gap-2">
            <Logo className="size-14" />
          </div>

          <div className="flex-1 items-center gap-3 justify-center hidden sm:flex">
            {links.map((link) => (
              <HeaderLink key={link.title} title={link.title} href={link.href} />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* FIX: was broken <a><h5 style={color:black}>Sponsor</h5></a> */}
            <a
              href="https://github.com/sponsors/Jashan-randhawa"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 border px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-pink-50 dark:hover:bg-pink-950/40 hover:border-pink-300 dark:hover:border-pink-800 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-300"
            >
              <IconHeart className="size-4 text-pink-500" />
              Sponsor
            </a>

            <a
              href="https://github.com/Jashan-randhawa"
              target="_blank"
              rel="noopener noreferrer"
              className="border p-2 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors duration-300"
            >
              <IconBrandGithub />
            </a>
            <ModeToggle />

            {/* FIX: was using Separator from wrong package + broken DrawerClose */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border size-10 rounded-xl p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors duration-300 sm:hidden"
                >
                  <IconMenu2 />
                  <span className="sr-only">Menu</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="min-h-dvh">
                <DrawerHeader className="flex justify-between items-center">
                  <DrawerTitle className="flex items-center gap-2">
                    <Logo className="size-14" />
                    {/* FIX: was "kinhdev.id.vn" (previous dev's domain) */}
                    <span className="text-base font-semibold">Jashanpreet Singh</span>
                  </DrawerTitle>
                  {/* FIX: DrawerClose wrapping Button directly (no nested asChild pattern issue) */}
                  <DrawerClose asChild>
                    <Button variant="outline" size="icon" className="size-8 shrink-0">
                      <IconX className="size-4" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </DrawerClose>
                </DrawerHeader>

                <div className="px-6 flex flex-col gap-1 mt-2">
                  {links.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="flex items-center gap-2 font-medium text-xl py-3 border-b border-border/40 last:border-0"
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      {link.title}
                    </Link>
                  ))}
                  <div className="pt-4">
                    {/* FIX: was <iframe src="github.com/user"> which showed full GitHub page */}
                    <a
                      href="https://github.com/sponsors/Jashan-randhawa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-base font-medium text-pink-500 hover:text-pink-600 transition-colors"
                    >
                      <IconHeart className="size-5" />
                      Sponsor on GitHub
                    </a>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </header>

      {isDisableHeaderScroll && <ScrollToTopButton />}
    </>
  )
}

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 100)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <Button
      variant="outline"
      size="icon"
      className="size-10 !bg-zinc-900/80 backdrop-blur-md rounded-xl p-2 hover:scale-110 duration-300 fixed bottom-4 right-8 md:right-20 z-[9999]"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <IconArrowUp className="text-white" />
    </Button>
  )
}

const HeaderLink = ({ title, href }: { title: string; href: string }) => {
  const pathname = usePathname() || "/"
  const isActive = href === pathname
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-full transition-colors",
        isActive
          ? "dark:bg-white dark:text-black bg-zinc-900 text-white"
          : "dark:hover:bg-zinc-800 hover:bg-zinc-100"
      )}
    >
      <Link href={href}>{title}</Link>
    </div>
  )
}
