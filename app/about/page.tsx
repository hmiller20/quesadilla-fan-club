import React from "react"

export default function About() {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">About Me</h1>
        <div className="prose">
          <p className="mb-4">
            Hey, so, you made it here. Welcome.
          </p>
          <p className="mb-4">
          One of my favorite questions to get is also a hard one to answer in the moment. Once in a while someone will ask what I like most about psychology. When I truly feel like I love psychology, I just want to take everything in my head and try to put it in the head of the person I’m talking to. The truth is that I don’t just love psychology—I live psychology. We all do. Every social interaction we have, every day, is psychology. Every feeling we have, every laugh we share, every pang of regret and every daydream—all psychology. Everything that’s interesting about the world is psychological in some way. And when we put our heads together to try to figure it all out, it feels like working on a big collective jigsaw puzzle. Conversations about the mind produce this rich feeling of connection and creativity that I don’t experience anywhere else. More than any one research finding, that’s what I love about psychology.
          </p>
          <h2 className="text-xl font-semibold mt-8 mb-4">Contact</h2>
          <p>
            You can reach me at{" "}
            <a href="mailto:millerh113@gmail.com" className="text-blue-600 hover:underline">
              millerh113@gmail.com
            </a>
          </p>
        </div>
      </div>
    )
  }
  