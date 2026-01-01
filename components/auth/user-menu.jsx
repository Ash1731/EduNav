"use client"
import { useState } from "react"
import { useUser } from "@/components/user-provider"
import SimpleAuthModal from "@/components/auth/simple-auth-modal"
import Link from "next/link"

export default function UserMenu() {
  const { user, logout } = useUser()
  const [open, setOpen] = useState(false)
  const [modal, setModal] = useState(false)

  if (!user) {
    return (
      <>
        <button
          onClick={() => setModal(true)}
          className="h-9 rounded-md bg-primary text-white px-3 text-sm font-medium hover:opacity-90 transition"
        >
          Sign in
        </button>
        <SimpleAuthModal open={modal} onClose={() => setModal(false)} />
      </>
    )
  }

  const initials = user.name
    ?.split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-9 w-9 rounded-full bg-accent text-accent-foreground text-sm font-semibold grid place-items-center"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initials || "U"}
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 rounded-md border border-border bg-card shadow-lg p-2 text-sm"
        >
          <Link href="/profile" className="block rounded px-2 py-1.5 hover:bg-muted" onClick={() => setOpen(false)}>
            Profile
          </Link>
          <Link href="/reviews" className="block rounded px-2 py-1.5 hover:bg-muted" onClick={() => setOpen(false)}>
            My Reviews
          </Link>
          <button
            className="mt-1 w-full rounded px-2 py-1.5 text-left text-destructive hover:bg-muted"
            onClick={() => {
              logout()
              setOpen(false)
            }}
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  )
}
