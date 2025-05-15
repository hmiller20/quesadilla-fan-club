'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/context/auth-context'
import { Button } from '@/components/ui/button'

export default function AdminDashboard() {
  const { user, signOut } = useAuth()

  useEffect(() => {
    if (!user) {
      window.location.href = '/admin/signin'
    }
  }, [user])

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/admin/signin'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!user) {
    return null // or a loading state
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600">Welcome, {user.email}</p>
          <p className="mt-4">You are now signed in to the admin dashboard.</p>
        </div>
      </div>
    </div>
  )
} 