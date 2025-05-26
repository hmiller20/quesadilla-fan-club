import React from "react"

export default function About() {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">About This Site</h1>
        <div className="prose">
          <p className="mb-4">
            Hey, you made it here. Welcome! <br />
            <br />
            I like writing, but Substack has become just another social media platform, so I made this. <br />
            <br />
            No likes, no comments, no short form "notes," no video feed with endless scrolling. Just ideas.
          </p>
          <h2 className="text-xl font-semibold mt-8 mb-4">Contact</h2>
          <p>
            Send pictures of quesadillas to{" "}
            <a href="mailto:millerh113@gmail.com" className="text-blue-600 hover:underline">
              millerh113@gmail.com
            </a>
          </p>
        </div>
      </div>
    )
  }
  