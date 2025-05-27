'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/auth-context'
import { Button } from '@/components/ui/button'
import { Trash2, Eye, Calendar, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  teaser?: string
  content: string
  createdAt: string
  updatedAt: string
  slug: string
  publishedAt: string
}

export default function ManagePosts() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/admin/signin')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    const fetchPosts = async () => {
      if (!isAuthenticated) return

      try {
        const response = await fetch('/api/posts?published=true')
        if (!response.ok) throw new Error('Failed to fetch posts')
        const data = await response.json()
        setPosts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [isAuthenticated])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to move this post to trash?')) return

    try {
      const response = await fetch(`/api/posts?id=${id}&action=trash`, {
        method: 'PATCH',
      })
      if (!response.ok) throw new Error('Failed to move post to trash')
      setPosts(posts.filter(post => post.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move post to trash')
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
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Posts</h1>
          <p className="text-gray-600 mt-2">Manage your published posts</p>
        </div>
        <Link href="/admin/posts/new">
          <Button>New Post</Button>
        </Link>
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No published posts found</p>
          <Link href="/admin/posts/new" className="text-blue-600 hover:underline mt-2 inline-block">
            Create your first post
          </Link>
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
                  <time dateTime={post.publishedAt}>
                    Published {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                  </time>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.content.replace(/<[^>]*>/g, '')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link 
                    href={`/admin/posts/${post.slug}/preview`} 
                    target="_blank"
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </Link>
                  <Link href={`/admin/posts/${post.slug}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={async () => {
                      if (!window.confirm("Send this post to all subscribers now?")) return
                      try {
                        const response = await fetch(`/api/posts?id=${post.id}&action=share`, {
                          method: 'PATCH',
                        })
                        if (!response.ok) throw new Error('Failed to share post')
                        alert('Post shared with all subscribers!')
                      } catch (err) {
                        alert('Failed to share post')
                      }
                    }}
                  >
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Move to Trash
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