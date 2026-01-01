"use client"

import Link from "next/link"
import UserMenu from "@/components/auth/user-menu"
import SearchBar from "@/components/search/search-bar"

export default function SiteHeader() {
  return (
    <header className="bg-card/90 backdrop-blur border-b border-border sticky top-0 z-60">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-4">
        <Link href="/" className="shrink-0">
          <div className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-accent inline-block" aria-hidden />
            <span className="font-semibold tracking-tight">EduNav</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link className="hover:text-primary" href="/search">
            Search
          </Link>
          <Link className="hover:text-primary" href="/reviews">
            Reviews
          </Link>
          <Link className="hover:text-primary" href="/about">
            About
          </Link>
          <Link className="hover:text-primary" href="/dashboard">
            Dashboard
          </Link>
          <Link className="hover:text-primary" href="/profile">
            Profile
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden md:block">
            <SearchBar compact />
          </div>
          <UserMenu />
        </div>
      </div>
      {/* color ribbon */}
      <div className="h-1 w-full bg-primary">
        <div className="h-full w-1/3 bg-accent" />
      </div>
    </header>
  )
}
