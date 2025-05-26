'use client'
import React, { useState } from "react"
import Link from "next/link"

export default function Header({ onJoinClick }: { onJoinClick?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-green-50/80 backdrop-blur-sm shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 relative">
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 text-green-900 font-medium text-xl sm:text-2xl"
            >
              Quesadilla Fan Club
            </Link>
            {/* Desktop nav */}
            <div className="ml-auto gap-4 sm:gap-6 hidden sm:flex">
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
            {/* Mobile hamburger */}
            <button
              className="ml-auto sm:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-700"
              aria-label="Open menu"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              {/* Hamburger icon */}
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* Mobile dropdown menu */}
            {menuOpen && (
              <div className="absolute right-0 top-16 w-48 bg-white border rounded shadow-lg flex flex-col z-50 sm:hidden animate-fade-in">
                <Link
                  href="/"
                  className="px-4 py-3 hover:bg-green-50 text-left text-green-900"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/posts"
                  className="px-4 py-3 hover:bg-green-50 text-left text-green-900"
                  onClick={() => setMenuOpen(false)}
                >
                  Posts
                </Link>
                <Link
                  href="/about"
                  className="px-4 py-3 hover:bg-green-50 text-left text-green-900"
                  onClick={() => setMenuOpen(false)}
                >
                  About
                </Link>
                <button
                  className="px-4 py-3 text-left text-green-900 hover:bg-green-50 w-full"
                  onClick={() => {
                    setMenuOpen(false)
                    onJoinClick && onJoinClick()
                  }}
                  type="button"
                >
                  Join
                </button>
                <Link
                  href="/sky"
                  className="px-4 py-3 hover:bg-green-50 text-left text-green-900"
                  onClick={() => setMenuOpen(false)}
                >
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
// Add a simple fade-in animation for the dropdown
// Tailwind users can add this to their global CSS:
// @layer utilities {
//   .animate-fade-in { animation: fadeIn 0.15s ease; }
//   @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
// }