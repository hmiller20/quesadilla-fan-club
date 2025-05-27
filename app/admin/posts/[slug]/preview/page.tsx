import React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string }
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined }
}

async function getParams(params: PageProps['params']) {
  return params instanceof Promise ? await params : params
}

export default async function PreviewPostPage({ params }: PageProps) {
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
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
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