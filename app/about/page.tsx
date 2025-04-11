import React from "react"

export default function About() {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">About Me</h1>
        <div className="prose">
          <p className="mb-4">
            Hello! I'm the author of this blog. I'm passionate about sharing my thoughts, experiences, and knowledge with
            the world.
          </p>
          <p className="mb-4">
            This blog is a space where I write about topics that interest me, including technology, books, personal
            development, and more.
          </p>
          <p className="mb-4">
            Feel free to explore my posts and reach out if you'd like to connect or discuss any of the topics I write
            about.
          </p>
          <h2 className="text-xl font-semibold mt-8 mb-4">Contact</h2>
          <p>
            You can reach me at{" "}
            <a href="mailto:example@email.com" className="text-blue-600 hover:underline">
              example@email.com
            </a>
          </p>
        </div>
      </div>
    )
  }
  