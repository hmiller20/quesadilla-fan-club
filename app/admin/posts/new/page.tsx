'use client'

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import Editor from "@/components/editor"

export default function NewPost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async (isDraft: boolean) => {
    // TODO: Implement post creation
    console.log({ title, content, isDraft })
  }

  return (
    <div className="max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-gray-600 mt-2">Write and preview your post</p>
      </header>

      <div className="space-y-6">
        {/* Title input */}
        <div>
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold border-0 border-b-2 border-gray-200 focus:border-black focus:ring-0 pb-2"
          />
        </div>

        {/* Rich text editor */}
        <Editor content={content} onChange={setContent} />

        {/* Action buttons */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => handleSubmit(true)}>Save as Draft</Button>
          <Button onClick={() => handleSubmit(false)}>Publish</Button>
        </div>
      </div>
    </div>
  )
} 