import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  // In a real app, you would fetch these from a CMS or database
  const posts = [
    {
      id: 1,
      title: "Getting Started with Web Development",
      excerpt: "Learn the basics of HTML, CSS, and JavaScript to begin your web development journey.",
      date: "April 2, 2025",
      slug: "getting-started-with-web-development",
    },
    {
      id: 2,
      title: "The Power of Consistent Writing",
      excerpt: "How writing consistently can improve your thinking, communication, and career prospects.",
      date: "March 28, 2025",
      slug: "power-of-consistent-writing",
    },
    {
      id: 3,
      title: "My Favorite Books of 2024 (So Far)",
      excerpt: "A curated list of the best books I've read this year, with brief reviews and recommendations.",
      date: "March 15, 2025",
      slug: "favorite-books-2024",
    },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Quesadilla Fan Club</h1>
        <p className="text-gray-600">About psychology.</p>
      </header>

      <main>
        <div className="space-y-10">
          {posts.map((post) => (
            <article key={post.id} className="border-b pb-8">
              <time className="text-sm text-gray-500">{post.date}</time>
              <h2 className="text-xl font-semibold mt-1 mb-2">
                <Link href={`/posts/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-700 mb-4">{post.excerpt}</p>
              <Link
                href={`/posts/${post.slug}`}
                className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-700"
              >
                Read more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
