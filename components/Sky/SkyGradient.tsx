'use client'

import { useTime } from '@/lib/context/time-context'
import { useMemo } from 'react'

// Color definitions for different times of day - more subtle, natural colors
const COLORS = {
  night: {
    top: '#0A1128', // Deep, rich night blue
    middle: '#1C2541', // Subtle night blue
    bottom: '#3A506B', // Horizon night blue with slight purple tint
  },
  dawn: {
    top: '#E6B89C', // Soft peach
    middle: '#F4D1AE', // Light warm cream
    bottom: '#FDF0D5', // Very light warm yellow
  },
  day: {
    top: '#1877d7', // Soft sky blue
    middle: '#5eb3f3', // Very light blue-green
    bottom: '#eaf6ff', // Pale blue-white
  },
  dusk: {
    top: '#2B2D42', // Deep blue-gray
    middle: '#8D99AE', // Muted blue-gray
    bottom: '#EFD3D7', // Soft pink-gray
  },
} as const

// Transition periods in minutes
const TRANSITION_DURATION = 45 // minutes

// Time thresholds for different sky phases
const PHASE_THRESHOLDS = {
  DAWN_START: 5, // 5 AM
  DAWN_END: 7, // 7 AM
  DUSK_START: 17, // 5 PM
  DUSK_END: 19, // 7 PM
} as const

function interpolateColors(
  startColors: typeof COLORS[keyof typeof COLORS],
  endColors: typeof COLORS[keyof typeof COLORS],
  progress: number
) {
  const interpolate = (start: string, end: string, progress: number) => {
    // Convert hex to RGB
    const startRGB = start.match(/\w\w/g)?.map(c => parseInt(c, 16)) || [0, 0, 0]
    const endRGB = end.match(/\w\w/g)?.map(c => parseInt(c, 16)) || [0, 0, 0]
    
    // Interpolate each channel
    const r = Math.round(startRGB[0] + (endRGB[0] - startRGB[0]) * progress)
    const g = Math.round(startRGB[1] + (endRGB[1] - startRGB[1]) * progress)
    const b = Math.round(startRGB[2] + (endRGB[2] - startRGB[2]) * progress)
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  return {
    top: interpolate(startColors.top, endColors.top, progress),
    middle: interpolate(startColors.middle, endColors.middle, progress),
    bottom: interpolate(startColors.bottom, endColors.bottom, progress),
  }
}

function getTransitionProgress(hour: number, minute: number, phase: keyof typeof COLORS): number {
  const totalMinutes = hour * 60 + minute
  let progress = 0

  switch (phase) {
    case 'dawn':
      progress = (totalMinutes - (PHASE_THRESHOLDS.DAWN_START * 60)) / TRANSITION_DURATION
      break
    case 'day':
      if (hour < PHASE_THRESHOLDS.DAWN_END) {
        // Transitioning from dawn to day
        progress = (totalMinutes - (PHASE_THRESHOLDS.DAWN_START * 60)) / TRANSITION_DURATION
      } else {
        // Transitioning from day to dusk
        progress = (totalMinutes - (PHASE_THRESHOLDS.DUSK_START * 60)) / TRANSITION_DURATION
      }
      break
    case 'dusk':
      progress = (totalMinutes - (PHASE_THRESHOLDS.DUSK_START * 60)) / TRANSITION_DURATION
      break
    case 'night':
      if (hour >= PHASE_THRESHOLDS.DUSK_END) {
        // Evening transition to night
        progress = (totalMinutes - (PHASE_THRESHOLDS.DUSK_END * 60)) / TRANSITION_DURATION
      } else {
        // Morning transition from night
        progress = (totalMinutes - (PHASE_THRESHOLDS.DAWN_START * 60)) / TRANSITION_DURATION
      }
      break
  }

  return Math.max(0, Math.min(1, progress))
}

function getTransitionColors(phase: keyof typeof COLORS, progress: number, hour: number) {
  const nextPhase: Record<keyof typeof COLORS, keyof typeof COLORS> = {
    dawn: 'day',
    day: hour >= PHASE_THRESHOLDS.DUSK_START ? 'dusk' : 'dawn',
    dusk: 'night',
    night: 'dawn',
  }

  return interpolateColors(COLORS[phase], COLORS[nextPhase[phase]], progress)
}

export default function SkyGradient() {
  const { hour, minute, skyPhase } = useTime()
  
  const gradientColors = useMemo(() => {
    const progress = getTransitionProgress(hour, minute, skyPhase)
    return getTransitionColors(skyPhase, progress, hour)
  }, [hour, minute, skyPhase])

  return (
    <div
      className="fixed inset-0 w-full h-full transition-colors duration-2000"
      style={{
        background: `linear-gradient(to bottom, 
          ${gradientColors.top} 0%,
          ${gradientColors.middle} 50%,
          ${gradientColors.bottom} 100%
        )`,
      }}
    />
  )
} 