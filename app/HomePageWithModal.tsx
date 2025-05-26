'use client'
import React, { useState } from "react"
import Header from "@/components/header"
import SubscribeModal from "@/components/SubscribeModal"
import Link from "next/link"

export default function HomePageWithModal({ posts }: { posts: any[] }) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Header onJoinClick={() => setModalOpen(true)} />
      <header className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Welcome to the Quesadilla Fan Club!</h1>
        <p className="text-gray-600">An optimistic place.</p>
      </header>
      <main>
        <section>
          <h2 className="text-2xl text-center font-semibold mb-8">Recent Posts</h2>
          <ul className="space-y-6">
            {posts.length === 0 ? (
              <li className="text-gray-500">No posts yet. Check back soon!</li>
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
        </section>
        <section className="mt-16 text-center">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-join-modal'))}
            className="bg-black hover:bg-black/90 text-white rounded px-4 py-2"
          >
            Join mailing list
          </button>
        </section>
      </main>
    </div>
  )
}
