'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Eye, Calendar, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '@/lib/context/auth-context'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/ConfirmDialog'

interface DraftPost {
  id: string
  title: string
  teaser?: string
  content: string
  createdAt: string
  updatedAt: string
  slug: string
}

export default function DraftsPage() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()
  const [drafts, setDrafts] = useState<DraftPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingPublishId, setPendingPublishId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/admin/signin')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    const fetchDrafts = async () => {
      if (!isAuthenticated) return

      try {
        const response = await fetch('/api/posts?drafts=true')
        if (!response.ok) throw new Error('Failed to fetch drafts')
        const data = await response.json()
        setDrafts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load drafts')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDrafts()
  }, [isAuthenticated])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) return

    try {
      const response = await fetch(`/api/posts?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete draft')
      setDrafts(drafts.filter(draft => draft.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete draft')
    }
  }

  const handlePublish = async (id: string) => {
    setPendingPublishId(id)
    setShowConfirm(true)
  }

  const actuallyPublish = async (id: string, share: boolean) => {
    try {
      const response = await fetch(`/api/posts?id=${id}&action=publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ share }), // <-- pass share flag to backend
      })
      if (!response.ok) throw new Error('Failed to publish post')
      setDrafts(drafts.filter(draft => draft.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish post')
    }
  }

  const handleConfirm = async () => {
    setShowConfirm(false)
    if (!pendingPublishId) return
    // After confirming, show Share or Silent dialog
    const result = window.confirm("Would you like to share this post with all subscribers?\n\nPress Yes for 'Share', No for 'Silent'.")
    await actuallyPublish(pendingPublishId, result)
    setPendingPublishId(null)
  }

  const handleCancel = () => {
    setShowConfirm(false)
    setPendingPublishId(null)
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
          <h1 className="text-3xl font-bold">Draft Posts</h1>
          <p className="text-gray-600 mt-2">Manage your unpublished posts</p>
        </div>
        <Link href="/admin/posts/new">
          <Button>New Post</Button>
        </Link>
      </header>

      {drafts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No draft posts found</p>
          <Link href="/admin/posts/new" className="text-blue-600 hover:underline mt-2 inline-block">
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drafts.map((draft) => (
            <article
              key={draft.id}
              className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">{draft.title}</h2>
                {draft.teaser && (
                  <p className="text-gray-600 mb-2 line-clamp-2">{draft.teaser}</p>
                )}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <time dateTime={draft.updatedAt}>
                    Updated {formatDistanceToNow(new Date(draft.updatedAt), { addSuffix: true })}
                  </time>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {draft.content.replace(/<[^>]*>/g, '')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePublish(draft.id)}
                  >
                    Publish
                  </Button>
                  <Link 
                    href={`/admin/posts/${draft.slug}/preview`} 
                    target="_blank"
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </Link>
                  <Link href={`/admin/posts/${draft.slug}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(draft.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={showConfirm}
        message="Are you sure you want to publish?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  )
} 