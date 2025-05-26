import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-gray-50/40">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
          <nav className="space-y-2">
            <Link href="/admin" className="block hover:bg-gray-100 p-2 rounded-md">
              Overview
            </Link>
            <Link href="/admin/managePosts" className="block hover:bg-gray-100 p-2 rounded-md">
              Manage Posts
            </Link>
            <Link href="/admin/posts/new" className="block hover:bg-gray-100 p-2 rounded-md">
              New Post
            </Link>
            <Link href="/admin/drafts" className="block hover:bg-gray-100 p-2 rounded-md">
              Drafts
            </Link>
            <Link href="/admin/trash" className="block hover:bg-gray-100 p-2 rounded-md text-red-600">
              Trash
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
} 