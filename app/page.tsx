import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Welcome to the Quesadilla Fan Club!</h1>
        <p className="text-gray-600">About psychology.</p>
      </header>

      <main>
        <section>
          <h2 className="text-2xl font-semibold mb-8">Recent Posts</h2>
          <div className="space-y-10">
            {/* Posts will be added here */}
          </div>
        </section>

        <section className="mt-16 text-center">
          <Button variant="default" size="lg" className="bg-black hover:bg-black/90">
            Subscribe
          </Button>
        </section>
      </main>
    </div>
  )
}
