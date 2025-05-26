'use client'

import { useEffect } from 'react'
import FullscreenSky from '@/layouts/FullscreenSky'
import { useAuth } from '@/lib/context/auth-context'

export default function SkyPage() {
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    document.body.classList.add('sky-page')
    document.documentElement.classList.add('sky-page')
    return () => {
      document.body.classList.remove('sky-page')
      document.documentElement.classList.remove('sky-page')
    }
  }, [])

  if (loading) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="bg-white/90 text-gray-800 p-8 rounded-lg shadow-lg text-2xl font-semibold">
          Page under construction. Come back later.
        </div>
      </div>
    )
  }

  return <FullscreenSky />
}