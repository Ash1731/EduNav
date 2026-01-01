"use client"
import { useEffect, useRef, useState } from "react"
import { useUser } from "@/components/user-provider"

export default function SimpleAuthModal({ open, onClose }) {
  const { login } = useUser()
  const ref = useRef(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  function submit(e) {
    e.preventDefault()
    if (!name || !email) return
    login({ name, email })
    onClose?.()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in"
    >
      <div
        ref={ref}
        className="w-full max-w-md rounded-xl bg-card text-card-foreground border border-border p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-2">Welcome back</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Sign in to access your profile, saved colleges, and reviews.
        </p>
        <form onSubmit={submit} className="grid gap-3">
          <div className="grid gap-1.5">
            <label className="text-sm">Name</label>
            <input
              className="h-10 rounded-md border border-input bg-input px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm">Email</label>
            <input
              type="email"
              className="h-10 rounded-md border border-input bg-input px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            className="mt-2 h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
            type="submit"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border border-border bg-card text-sm hover:bg-muted transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}
