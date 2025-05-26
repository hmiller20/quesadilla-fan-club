// this file is used to display a fullscreen sky background

'use client'

import SkyScene from '@/components/Sky/SkyScene'
import { TimeProvider } from '@/lib/context/time-context'

export default function FullscreenSky() {
  return (
    <TimeProvider>
      <div
        className="relative w-screen overflow-hidden max-h-[calc(100vh-4rem)]"
        style={{ height: 'calc(100vh - 4rem)' }}
      >
        {/* <SkyScene mode="full" /> */}
        <div>SkyScene placeholder</div>
      </div>
    </TimeProvider>
  )
}
