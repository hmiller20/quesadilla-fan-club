// this editor form will call an api route that updates an existing post (draft or
// published) by its id. this is what the editor calls when you click save changes or publish

import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import PostEditor from "@/app/components/PostEditor"

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Define the Post type based on our Prisma schema
type Post = {
  id: string
  slug: string
  title: string
  teaser: string | null
  content: string
  isDraft: boolean
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
  authorId: string
  publishedAt: Date
}

export default async function EditPost({ params, searchParams }: PageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams])
  // Query the database using Prisma
  const post = await prisma.post.findFirst({
    where: {
      slug: resolvedParams.slug,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      teaser: true,
      content: true,
      isDraft: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
      authorId: true,
      publishedAt: true,
    },
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <p className="text-sm text-gray-500 mt-1">
          {post.isDraft ? 'Draft' : 'Published'} • Last updated {new Date(post.updatedAt).toLocaleDateString()}
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <PostEditor
          initialContent={post.content}
          initialTitle={post.title}
          initialTeaser={post.teaser || ''}
          postId={post.id}
          isPublished={post.isPublished}
        />
      </div>
    </div>
  )
} 