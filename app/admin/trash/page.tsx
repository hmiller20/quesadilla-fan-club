'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/auth-context'
import { Button } from '@/components/ui/button'
import { Trash2, RotateCcw, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface TrashedPost {
  id: string
  title: string
  teaser?: string
  content: string
  createdAt: string
  updatedAt: string
  slug: string
  publishedAt: string
  trashedAt: string
}

export default function Trash() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()
  const [posts, setPosts] = useState<TrashedPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/admin/signin')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    const fetchTrashedPosts = async () => {
      if (!isAuthenticated) return

      try {
        const response = await fetch('/api/posts?trashed=true')
        if (!response.ok) throw new Error('Failed to fetch trashed posts')
        const data = await response.json()
        setPosts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trashed posts')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrashedPosts()
  }, [isAuthenticated])

  const handleRestore = async (id: string) => {
    try {
      const response = await fetch(`/api/posts?id=${id}&action=restore`, {
        method: 'PATCH',
      })
      if (!response.ok) throw new Error('Failed to restore post')
      setPosts(posts.filter(post => post.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore post')
    }
  }

  const handleDeletePermanently = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this post? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/posts?id=${id}&action=delete`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete post permanently')
      setPosts(posts.filter(post => post.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post permanently')
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // This prevents flash of content before redirect
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Trash</h1>
        <p className="text-gray-600 mt-2">Manage your deleted posts</p>
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No trashed posts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h2>
                {post.teaser && (
                  <p className="text-gray-600 mb-2 line-clamp-2">{post.teaser}</p>
                )}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <time dateTime={post.trashedAt}>
                    Trashed {formatDistanceToNow(new Date(post.trashedAt), { addSuffix: true })}
                  </time>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.content.replace(/<[^>]*>/g, '')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleRestore(post.id)}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Restore
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeletePermanently(post.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Permanently
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
} 