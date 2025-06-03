'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Editor from "@/components/editor"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import PostEditor from '@/app/components/PostEditor'
import ConfirmDialog from '@/components/ConfirmDialog'

export default function NewPost() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingSave, setPendingSave] = useState<{
    title: string
    teaser: string
    content: string
    isDraft: boolean
  } | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/admin/signin')
    }
  }, [loading, isAuthenticated, router])

  const handleSave = async (title: string, teaser: string, content: string, isDraft: boolean) => {
    if (!user) {
      setError('You must be signed in to create a post')
      return
    }
    if (!title.trim()) {
      setError('Please enter a title')
      return
    }
    if (!isDraft) {
      // Show confirmation dialog before proceeding
      setPendingSave({ title, teaser, content, isDraft })
      setShowConfirm(true)
      return
    }
    // If saving as draft, proceed as before
    await actuallySave(title, teaser, content, isDraft, false)
  }

  const actuallySave = async (title: string, teaser: string, content: string, isDraft: boolean, share: boolean) => {
    if (!user) {
      setError('You must be signed in to create a post')
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          teaser,
          content,
          isDraft,
          isPublished: !isDraft,
          authorId: user.uid,
          share, // <-- pass share flag to backend
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to save post')
      }
      const post = await response.json()
      if (isDraft) {
        router.push('/admin/drafts')
      } else {
        router.push('/admin/managePosts')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirm = async () => {
    setShowConfirm(false)
    if (!pendingSave) return
    // After confirming, show Share or Silent dialog
    const result = window.confirm("Would you like to share this post with all subscribers?\n\nPress Yes for 'Share', No for 'Silent'.")
    await actuallySave(pendingSave.title, pendingSave.teaser, pendingSave.content, pendingSave.isDraft, result)
    setPendingSave(null)
  }

  const handleCancel = () => {
    setShowConfirm(false)
    setPendingSave(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // This prevents flash of content before redirect
  }

  return (
    <div className="max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-gray-600 mt-2">Write and preview your post</p>
      </header>
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <PostEditor
        initialContent=""
        initialTitle=""
        initialTeaser=""
        postId=""
        slug=""
        isPublished={false}
        onSave={handleSave}
        isSaving={isSubmitting}
      />
      <ConfirmDialog
        open={showConfirm}
        message="Are you sure you want to publish?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  )
} 