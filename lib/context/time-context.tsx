'use client'

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'

type SkyPhase = 'dawn' | 'day' | 'dusk' | 'night'

interface TimeState {
  hour: number
  minute: number
  dayOfYear: number
  isNight: boolean
  skyPhase: SkyPhase
  // Sun position in degrees (0-360, where 0 is sunrise, 180 is sunset)
  sunAngle: number
  // Sun intensity (0-1)
  sunIntensity: number
}

interface TimeContextType extends TimeState {
  // Add any time manipulation methods here if needed
}

const TimeContext = createContext<TimeContextType | undefined>(undefined)

// Time thresholds for different sky phases
const DAWN_START = 5 // 5 AM
const DAWN_END = 7 // 7 AM
const DUSK_START = 18 // 6 PM
const DUSK_END = 20 // 8 PM

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

function calculateSunAngle(hour: number, minute: number): number {
  // Convert time to decimal hours
  const decimalHour = hour + minute / 60
  
  // Calculate sun angle (0-360 degrees)
  // 0 degrees at 6 AM (sunrise)
  // 180 degrees at 6 PM (sunset)
  let angle = ((decimalHour - 6) / 12) * 180
  
  // Normalize to 0-360
  angle = (angle + 360) % 360
  
  return angle
}

function calculateSunIntensity(hour: number, minute: number): number {
  const decimalHour = hour + minute / 60
  
  // Calculate intensity based on time of day
  // Peak at noon (1.0), minimum at night (0.0)
  let intensity = Math.sin((decimalHour - 6) * (Math.PI / 12))
  
  // Clamp between 0 and 1
  return Math.max(0, Math.min(1, intensity))
}

function getSkyPhase(hour: number): SkyPhase {
  if (hour >= DAWN_START && hour < DAWN_END) return 'dawn'
  if (hour >= DAWN_END && hour < DUSK_START) return 'day'
  if (hour >= DUSK_START && hour < DUSK_END) return 'dusk'
  return 'night'
}

export function TimeProvider({ children }: { children: React.ReactNode }) {
  const [timeState, setTimeState] = useState<TimeState>(() => {
    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()
    
    return {
      hour,
      minute,
      dayOfYear: getDayOfYear(now),
      isNight: hour < DAWN_START || hour >= DUSK_END,
      skyPhase: getSkyPhase(hour),
      sunAngle: calculateSunAngle(hour, minute),
      sunIntensity: calculateSunIntensity(hour, minute),
    }
  })

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hour = now.getHours()
      const minute = now.getMinutes()
      
      setTimeState({
        hour,
        minute,
        dayOfYear: getDayOfYear(now),
        isNight: hour < DAWN_START || hour >= DUSK_END,
        skyPhase: getSkyPhase(hour),
        sunAngle: calculateSunAngle(hour, minute),
        sunIntensity: calculateSunIntensity(hour, minute),
      })
    }

    // Update immediately
    updateTime()

    // Update every minute
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  const value = useMemo(() => ({
    ...timeState,
  }), [timeState])

  return (
    <TimeContext.Provider value={value}>
      {children}
    </TimeContext.Provider>
  )
}

export function useTime() {
  const context = useContext(TimeContext)
  if (context === undefined) {
    throw new Error('useTime must be used within a TimeProvider')
  }
  return context
} 