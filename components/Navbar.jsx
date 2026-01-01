// components/Navbar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { GraduationCap, ChevronDown } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function onDoc(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/search", label: "Search" },
    // reviews handled below as dropdown
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profile/edit", label: "Edit Profile" },
    { href: "/login", label: "Login" },
  ];

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-7 w-7 text-primary" />
          <span className="font-bold text-lg">EduNav</span>
        </div>

        <nav className="flex items-center gap-3 relative">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1 rounded-md text-sm font-medium hover:bg-muted ${
                isActive(item.href) ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Reviews dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((s) => !s)}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium hover:bg-muted ${
                pathname.startsWith("/reviews") ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
              aria-expanded={open}
            >
              Reviews
              <ChevronDown className="h-4 w-4" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 rounded-md border bg-card shadow-lg z-50">
                <div className="py-2">
                  <Link
                    href="/reviews?type=student"
                    className="block px-4 py-2 text-sm hover:bg-muted"
                    onClick={() => setOpen(false)}
                  >
                    Student Reviews
                  </Link>

                  <Link
                    href="/reviews/faculty?type=faculty"
                    className="block px-4 py-2 text-sm hover:bg-muted"
                    onClick={() => setOpen(false)}
                  >
                    Faculty Reviews (GBU)
                  </Link>

                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="h-1 w-full bg-gradient-to-r from-[var(--accent)] via-[var(--primary)] to-[var(--secondary)]" />
    </header>
  );
}
