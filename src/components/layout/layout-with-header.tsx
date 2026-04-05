import React from "react"
import { Header } from "./header"
import { HeroBackground } from "./hero-background"

export const LayoutWithHeader = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="font-[family-name:var(--font-exo2)] font-medium w-screen">
      <HeroBackground>
        <Header />

        <main className="overflow-auto overflow-x-hidden container mx-auto flex-1 p-4">
          {children}
        </main>
        <footer className="text-sm md:text-lg row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-zinc-600 p-4">
          © 2025 Jashanpreet Singh. All rights reserved.
        </footer>
      </HeroBackground>
    </div>
  )
}
