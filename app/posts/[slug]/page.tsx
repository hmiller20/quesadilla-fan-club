// this file displays a single post
// it retrieves the slug from the url.
// it uses the slug to query the SQLite database via Prisma to find the corresponding published post.
// this is the destination for links from the home page and posts page.

import React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react" // for the back button
import { prisma } from "@/lib/db" // for the database

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Post({ params }: PageProps) {
  const resolvedParams = await params
  // Fetch the post from the database using the slug
  const post = await prisma.post.findFirst({
    where: {
      slug: resolvedParams.slug,
      isPublished: true,
    },
    select: {
      title: true,
      teaser: true,
      content: true,
      publishedAt: true,
    },
  })

  if (!post) {
    return <div className="max-w-2xl mx-auto px-4 py-12">Post not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">

      <article>
        <header className="mb-8">
          <time className="text-sm text-gray-500">
            {new Date(post.publishedAt).toLocaleDateString()}
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
}
