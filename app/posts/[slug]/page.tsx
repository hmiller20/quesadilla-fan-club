// this file displays a single post
// it retrieves the slug from the url.
// it uses the slug to query the SQLite database via Prisma to find the corresponding published post.
// this is the destination for links from the home page and posts page.

import React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react" // for the back button
import { prisma } from "@/lib/db" // for the database
import { notFound } from "next/navigation"

// Force dynamic rendering to ensure proper server-side behavior
export const dynamic = 'force-dynamic'

// Add runtime configuration to help with debugging
export const runtime = 'nodejs'

// Type for the actual runtime params
type RuntimeParams = {
  slug: string
}

// Type that satisfies Next.js's build system
interface PageProps {
  params: Promise<RuntimeParams>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Helper function to safely extract params
async function getParams(params: Promise<RuntimeParams> | RuntimeParams): Promise<RuntimeParams> {
  if (params instanceof Promise) {
    return params
  }
  return params
}

export default async function PostPage({ params }: PageProps) {
  try {
    // Safely handle params whether they're a Promise or not
    const runtimeParams = await getParams(params)
    console.log('Fetching post with slug:', runtimeParams.slug)
    
    // Fetch the post from the database using the slug
    const post = await prisma.post.findFirst({
      where: {
        slug: runtimeParams.slug,
        isPublished: true,
      },
      select: {
        title: true,
        teaser: true,
        content: true,
        publishedAt: true,
      },
    }).catch(error => {
      console.error('Database error:', error)
      throw new Error('Failed to fetch post from database')
    })

    if (!post) {
      console.log('Post not found for slug:', runtimeParams.slug)
      notFound()
    }

    console.log('Successfully fetched post:', post.title)

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <article>
          <header className="mb-8">
            <time className="text-sm text-gray-500">
              {new Date(post.publishedAt).toLocaleDateString('en-US', { timeZone: 'America/New_York' })}
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
    // Log the full error details
    console.error('Error in PostPage:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      params: params instanceof Promise ? 'Promise' : params
    })
    
    // Rethrow with a more specific error message
    throw new Error(`Failed to load post: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
