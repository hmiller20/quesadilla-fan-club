import React from "react"
import "./globals.css"
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
      <body className={`${inter.className} bg-white text-gray-900 min-h-screen`}>
        <nav className="border-b">
          <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="font-medium">
              My Blog
            </Link>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-gray-600">
                Home
              </Link>
              <Link href="/about" className="hover:text-gray-600">
                About
              </Link>
            </div>
          </div>
        </nav>
        {children}
        <footer className="border-t mt-12">
          <div className="max-w-2xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} My Personal Blog. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}
