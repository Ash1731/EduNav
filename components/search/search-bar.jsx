"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function SearchBar({ compact = false, className = "" }) {
  const router = useRouter()
  const params = useSearchParams()
  const initial = params?.get("query") || ""
  const [q, setQ] = useState(initial)

  function submit(e) {
    e.preventDefault()
    const term = q.trim()
    router.push(`/search?query=${encodeURIComponent(term)}`)
  }

  return (
    <form
      onSubmit={submit}
      className={`flex items-center gap-2 ${compact ? "" : "max-w-xl w-full"} ${className}`}
      role="search"
      aria-label="Search colleges and universities in India"
    >
      <input
        className="flex-1 h-11 rounded-md border border-input bg-input px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        placeholder="Search colleges or universities in India..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button
        type="submit"
        className="h-11 rounded-md bg-primary text-white px-4 text-sm font-medium hover:opacity-90 transition"
      >
        Search
      </button>
    </form>
  )
}
