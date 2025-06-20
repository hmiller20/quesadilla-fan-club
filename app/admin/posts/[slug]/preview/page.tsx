'use client'

import React, { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }> | undefined
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | undefined
}

async function getParams(params: PageProps['params']) {
  if (!params) throw new Error('No params provided')
  return await params
}

function formatDate(date: string | Date | null): string {
  if (!date) return 'Draft'
  const d = new Date(date)
  // Adjust for local timezone
  const localDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000))
  return format(localDate, 'MMMM d, yyyy')
}

export default async function PreviewPostPage({ params }: PageProps) {
  useEffect(() => {
    // Add target="_blank" to all external links
    const content = document.querySelector('.prose')
    if (content) {
      const links = content.querySelectorAll('a[href^="http"]')
      links.forEach(link => {
        link.setAttribute('target', '_blank')
        link.setAttribute('rel', 'noopener noreferrer')
      })
    }
  }, [])

  try {
    const runtimeParams = await getParams(params)
    
    // Fetch the post from the database using the slug, regardless of published status
    const post = await prisma.post.findFirst({
      where: {
        slug: runtimeParams.slug,
      },
      select: {
        title: true,
        teaser: true,
        content: true,
        publishedAt: true,
        isPublished: true,
        isDraft: true,
      },
    })

    if (!post) {
      notFound()
    }

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href={`/admin/posts/${runtimeParams.slug}/edit`}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Editor
            </Button>
          </Link>
          {!post.isPublished && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-md mb-4">
              This is a preview of an unpublished post
            </div>
          )}
        </div>

        <article>
          <header className="mb-8">
            <time className="text-sm text-gray-500">
              {formatDate(post.publishedAt)}
            </time>
            <h1 className="text-3xl font-bold mt-2">{post.title}</h1>
            {post.teaser && (
              <p className="text-xl text-gray-600 mt-2">{post.teaser}</p>
            )}
          </header>

          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </div>
    )
  } catch (error) {
    console.error('Error in PreviewPostPage:', error)
    throw new Error(`Failed to load post preview: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
} 