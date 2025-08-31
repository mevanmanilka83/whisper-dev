"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import UserDropdown from "./UserDropdown"
import Image from "next/image"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 space-x-4">
        <div className="ml-4 mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 transition-all duration-200 hover:opacity-80">
            <Image
              src="/logo.jpg"
              alt="Whisper logo"
              width={32}
              height={32}
              className="rounded-full shadow-sm"
            />
            <span className="hidden sm:inline-block text-primary uppercase font-bold text-xl tracking-wide ml-2">
              Whisper
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">{/* You can add a search bar here if needed */}</div>
          <nav className="flex items-center space-x-3 flex-shrink-0">
            <div>
            <ThemeToggle />
            </div>
            {session?.user ? (
              <div className="flex-shrink-0 w-10 h-10">
                <UserDropdown user={session.user} />
              </div>
            ) : (
              <div>
              <Link href="/sign-in">
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium h-8 rounded-md gap-1.5 px-3 relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 shadow-md text-primary-foreground no-hover no-transition"
                  style={{ transform: 'none !important', transition: 'none !important' }}
                >
                  <span className="relative z-10">Sign In</span>
                </button>
              </Link>
              </div>
            )}
          </nav>
        </div>
          </div>
    </nav>
  )
}
