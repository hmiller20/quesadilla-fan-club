import React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// In a real app, you would fetch this data from a CMS or database
const posts = {
  "getting-started-with-web-development": {
    title: "Getting Started with Web Development",
    date: "April 2, 2025",
    content: `
      <p>Web development is an exciting field that allows you to create interactive websites and applications. If you're just starting out, here's what you need to know.</p>
      
      <h2>The Three Core Technologies</h2>
      
      <p>Web development is built on three fundamental technologies:</p>
      
      <ul>
        <li><strong>HTML</strong> - The structure of web pages</li>
        <li><strong>CSS</strong> - The styling and appearance</li>
        <li><strong>JavaScript</strong> - The interactive functionality</li>
      </ul>
      
      <p>Start by learning HTML to understand how web pages are structured. Then move on to CSS to make your pages look good. Finally, learn JavaScript to add interactivity.</p>
      
      <h2>Tools You'll Need</h2>
      
      <p>To get started, you only need a few basic tools:</p>
      
      <ul>
        <li>A text editor (like VS Code, Sublime Text, or even Notepad)</li>
        <li>A web browser (Chrome, Firefox, etc.)</li>
        <li>Developer tools (built into most modern browsers)</li>
      </ul>
      
      <p>As you progress, you'll learn about more advanced tools and frameworks, but these basics are all you need to begin your journey.</p>
    `,
  },
  "power-of-consistent-writing": {
    title: "The Power of Consistent Writing",
    date: "March 28, 2025",
    content: `
      <p>Writing consistently is one of the most valuable habits you can develop. It improves your thinking, communication, and can even advance your career.</p>
      
      <h2>Clarifies Your Thinking</h2>
      
      <p>Writing forces you to organize your thoughts. When you write regularly, you'll notice that your thinking becomes clearer and more structured. Ideas that seemed vague in your head take concrete form on the page.</p>
      
      <h2>Improves Communication</h2>
      
      <p>The more you write, the better you become at expressing yourself. This skill transfers to all forms of communication, including speaking and presenting.</p>
      
      <h2>Creates Opportunities</h2>
      
      <p>Consistent writing, especially when shared publicly, can open doors. It demonstrates your expertise, connects you with like-minded people, and can lead to unexpected opportunities in your career.</p>
      
      <h2>How to Start</h2>
      
      <p>Begin with a small, achievable goal, like writing for 15 minutes each day. Don't worry about quality at first—focus on building the habit. Over time, both your consistency and quality will improve.</p>
    `,
  },
  "favorite-books-2024": {
    title: "My Favorite Books of 2024 (So Far)",
    date: "March 15, 2025",
    content: `
      <p>I've read some excellent books this year. Here are my top recommendations so far.</p>
      
      <h2>Fiction</h2>
      
      <p><strong>The Last Horizon</strong> by Jane Smith</p>
      <p>A beautifully written science fiction novel that explores themes of identity and belonging in a post-AI world. Smith's prose is elegant, and her characters feel incredibly real.</p>
      
      <p><strong>Echoes of Tomorrow</strong> by Michael Johnson</p>
      <p>This thriller kept me on the edge of my seat from the first page to the last. Johnson masterfully weaves multiple timelines into a coherent and satisfying story.</p>
      
      <h2>Non-Fiction</h2>
      
      <p><strong>The Hidden Patterns</strong> by Sarah Williams</p>
      <p>Williams reveals the unexpected connections between seemingly unrelated fields. This book changed how I think about problem-solving and creativity.</p>
      
      <p><strong>Digital Minimalism Revisited</strong> by Thomas Chen</p>
      <p>A practical guide to maintaining focus and well-being in an increasingly distracting digital landscape. Chen offers actionable advice without being preachy.</p>
      
      <h2>What I'm Reading Next</h2>
      
      <p>I'm looking forward to reading "The Quantum Garden" by Robert Wilson and "Effective Learning" by Lisa Park in the coming months.</p>
    `,
  },
}

export default function Post({ params }: { params: { slug: string } }) {
  const post = posts[params.slug as keyof typeof posts]

  if (!post) {
    return <div className="max-w-2xl mx-auto px-4 py-12">Post not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to all posts
      </Link>

      <article>
        <header className="mb-8">
          <time className="text-sm text-gray-500">{post.date}</time>
          <h1 className="text-3xl font-bold mt-2">{post.title}</h1>
        </header>

        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  )
}
