// layout files are used to define the structure of the pages

import React from "react"
import "../globals.css"
import Link from "next/link"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "My Personal Blog",
  description: "A simple personal blog where I share my thoughts and ideas",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 min-h-screen flex flex-col`}>
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm shadow-sm"> {/* This is the header */}
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> {/* This is the navigation bar */}
            <div className="flex justify-between items-center h-16"> {/* This is the container for the navigation bar */}
              <Link href="/" className="font-medium text-xl sm:text-2xl"> {/* This is the link that says Quesadilla Fan Club */}
                Quesadilla Fan Club
              </Link>
              <div className="flex gap-4 sm:gap-6">
                <Link href="/" className="hover:text-gray-600 transition-colors">
                  Home
                </Link>
                <Link href="/about" className="hover:text-gray-600 transition-colors">
                  About
                </Link>
              </div>
            </div>
          </nav>
        </header>
        <main className="flex-grow"> {/* This is the main content */}
          {children} 
        </main>
        <footer className="border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Quesadilla Fan Club.
          </div>
        </footer>
      </body>
    </html>
  )
}
