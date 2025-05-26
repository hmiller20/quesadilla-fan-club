'use client'
import React, { useState } from "react"

export default function SubscribeModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage(data.message || "Check your email to confirm your subscription!")
        setForm({ firstName: "", lastName: "", email: "" })
      } else {
        setError(data.error || "Something went wrong.")
      }
    } catch {
      setError("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-2 relative">
        <button
          className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded w-10 h-10 flex items-center justify-center text-2xl focus:outline-none focus:ring-2 focus:ring-red-400"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">Get emails about new posts</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Joining..." : "Join"}
          </button>
        </form>
        {message && <p className="mt-4 text-green-700 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      </div>
    </div>
  )
}