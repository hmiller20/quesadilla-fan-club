// this file displays all published posts

import Link from "next/link"
import { prisma } from "@/lib/db"

export const dynamic = 'force-dynamic'

export default async function PostsPage() {
  // Fetch all published posts
  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
      teaser: true,
    },
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">All Posts</h1>
      <ul className="space-y-6">
        {posts.length === 0 ? (
          <li className="text-gray-500">No posts found.</li>
        ) : (
          posts.map(post => (
            <li key={post.id} className="border-b pb-4">
              <Link href={`/posts/${post.slug}`}
                className="text-xl font-semibold text-green-800 hover:underline block">
                {post.title}
              </Link>
              {post.teaser && (
                <p className="text-gray-600 mt-1 mb-2">{post.teaser}</p>
              )}
              <span className="text-sm text-gray-500">
                {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  )
} 