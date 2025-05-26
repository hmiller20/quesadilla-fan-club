'use client'
import React, { useState } from "react"
import Link from "next/link"

export default function Header({ onJoinClick }: { onJoinClick?: () => void }) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-green-50/80 backdrop-blur-sm shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-green-900 font-medium text-xl sm:text-2xl">
              Quesadilla Fan Club
            </Link>
            <div className="ml-auto flex gap-4 sm:gap-6">
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
          </div>
        </nav>
      </header>
    </>
  )
}