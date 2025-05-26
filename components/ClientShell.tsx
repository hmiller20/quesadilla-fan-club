"use client"
import React, { useState, useEffect } from "react"
import Header from "@/components/header"
import SubscribeModal from "@/components/SubscribeModal"

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const handler = () => setModalOpen(true)
    window.addEventListener('open-join-modal', handler)
    return () => window.removeEventListener('open-join-modal', handler)
  }, [])

  return (
    <>
      <Header onJoinClick={() => setModalOpen(true)} />
      <main className="flex-grow">{children}</main>
      <footer className="border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Quesadilla Fan Club.
        </div>
      </footer>
      <SubscribeModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
} 