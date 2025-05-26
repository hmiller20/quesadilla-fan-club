'use client'

import dynamicImport from 'next/dynamic'
import { useEffect } from 'react'
import { useAuth } from '@/lib/context/auth-context'

const FullscreenSky = dynamicImport(() => import('@/layouts/FullscreenSky'), { ssr: false });

// Disable static generation for this page
export const dynamic = 'force-dynamic'

export default function SkyPage() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="bg-white/90 text-gray-800 p-8 rounded-lg shadow-lg text-2xl font-semibold">
        Page coming soon...
      </div>
    </div>
  )
}