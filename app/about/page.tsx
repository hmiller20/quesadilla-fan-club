import React from "react"
import type { NextPage } from 'next'

const About: NextPage = () => {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">About This Site</h1>
        <div className="prose">
          <p className="mb-4">
            Hey, you made it here. Welcome! <br />
            <br />
            I like writing, and I dabbled with writing on Substack. But Substack has added short form content, like on X, and endless video scrolling, like on [insert every platform]. It's become just another social media site. Writing shouldn't be about getting people hooked on short form content. It should be about the honest expression of ideas that matter to the author. So I made this.
          </p>
          <h2 className="text-xl font-semibold mt-8 mb-4">Contact</h2>
          <p>
            Send pictures of quesadillas to{" "}
            <a href="mailto:millerh113@gmail.com" className="text-blue-600 hover:underline">
              millerh113@gmail.com
            </a>.
          </p>
        </div>
      </div>
    )
  }
  
export default About
  