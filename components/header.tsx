'use client'
import React, { useState, useEffect } from "react"
import Link from "next/link"

export default function Header({ onJoinClick }: { onJoinClick?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (menuOpen) {
      document.documentElement.classList.add('header-mobile-menu-open')
    } else {
      document.documentElement.classList.remove('header-mobile-menu-open')
    }
    return () => {
      document.documentElement.classList.remove('header-mobile-menu-open')
    }
  }, [menuOpen])

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-green-50/80 backdrop-blur-sm shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 relative">
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-green-900 font-medium text-xl sm:text-2xl">
              Quesadilla Fan Club
            </Link>
            {/* Hamburger for mobile */}
            <button
              className="sm:hidden ml-auto z-20 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-700"
              aria-label="Open menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="block w-6 h-0.5 bg-green-900 mb-1"></span>
              <span className="block w-6 h-0.5 bg-green-900 mb-1"></span>
              <span className="block w-6 h-0.5 bg-green-900"></span>
            </button>
            {/* Desktop nav */}
            <div className="ml-auto flex gap-4 sm:gap-6 items-center max-sm:hidden">
              <Link href="/" className="hover:text-gray-600 transition-colors">
                Home
              </Link>
              <Link href="/posts" className="hover:text-gray-600 transition-colors">
                Posts
              </Link>
              <Link href="/about" className="hover:text-gray-600 transition-colors">
                About
              </Link>
              <button
                className="text-black hover:text-gray-600 transition-colors"
                onClick={onJoinClick}
                type="button"
              >
                Join
              </button>
              <Link href="/sky" className="hover:text-gray-600 transition-colors ml-auto">
                Relax
              </Link>
            </div>
            {/* Mobile dropdown */}
            {menuOpen && (
              <div className="absolute right-0 top-16 w-48 bg-white rounded shadow-lg flex flex-col gap-2 p-4 animate-fade-in sm:hidden z-30">
                <Link href="/" className="hover:text-gray-600 transition-colors" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
                <Link href="/posts" className="hover:text-gray-600 transition-colors" onClick={() => setMenuOpen(false)}>
                  Posts
                </Link>
                <Link href="/about" className="hover:text-gray-600 transition-colors" onClick={() => setMenuOpen(false)}>
                  About
                </Link>
                <button
                  className="text-black hover:text-gray-600 transition-colors text-left"
                  onClick={() => { setMenuOpen(false); onJoinClick && onJoinClick(); }}
                  type="button"
                >
                  Join
                </button>
                <Link href="/sky" className="hover:text-gray-600 transition-colors" onClick={() => setMenuOpen(false)}>
                  Relax
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>
    </>
  )
}