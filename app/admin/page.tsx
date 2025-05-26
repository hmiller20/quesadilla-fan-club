'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/context/auth-context'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'

interface Subscriber {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
  isConfirmed: boolean
}

export default function AdminDashboard() {
  const { user, signOut } = useAuth()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      window.location.href = '/admin/signin'
    }
  }, [user])

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await fetch('/api/subscribers')
        if (!response.ok) throw new Error('Failed to fetch subscribers')
        const data = await response.json()
        setSubscribers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load subscribers')
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchSubscribers()
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <p className="text-gray-600">Welcome, {user.email}</p>
          <p className="mt-4">You are now signed in to the admin dashboard.</p>
        </div>

        {/* Subscribers Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Subscribers</h2>
          
          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-500">Loading subscribers...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-red-500">{error}</p>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">No subscribers yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {subscriber.firstName} {subscriber.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{subscriber.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          subscriber.isConfirmed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {subscriber.isConfirmed ? 'Confirmed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(subscriber.createdAt), { addSuffix: true })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 