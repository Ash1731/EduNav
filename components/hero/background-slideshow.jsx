"use client"
import { useEffect, useState } from "react"

const images = ["/images/college-1.jpg", "/images/college-2.jpg", "/images/college-3.jpg", "/images/college-4.jpg"]

export default function BackgroundSlideshow() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((p) => (p + 1) % images.length), 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
        >
          {/* Use native img for simplicity with Next.js */}
          <img
            src={src || "/placeholder.svg"}
            alt="University campus background"
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
          {/* Solid overlay for contrast (no gradients) */}
          <div
            className="absolute inset-0"
            style={{ background: "color-mix(in oklch, var(--color-background) 30%, transparent)" }}
          />
        </div>
      ))}
    </div>
  )
}
