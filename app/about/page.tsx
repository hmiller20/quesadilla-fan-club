import React from "react"

export default function About() {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">About Me</h1>
        <div className="prose">
          <p className="mb-4">
            Hey, so, you made it here. Welcome!
            Once I become famous, I'll be sure to make this page more interesting.
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
  