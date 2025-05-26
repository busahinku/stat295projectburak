'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/ui/sidebar'
import { getCurrentUser, signOut, User } from '@/lib/auth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/')
        return
      }
      setUser(currentUser)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleSignOut = () => {
    signOut()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // For doctors, founders, assistants, and pharmacists, don't show sidebar - they have their own navigation tabs
  if (user.role === 'doctor' || user.role === 'founder' || user.role === 'assistant' || user.role === 'pharmacist') {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="w-full">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    )
  }

  // For other roles, show sidebar
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        userRole={user.role} 
        userName={`${user.firstName} ${user.lastName}`}
        onSignOut={handleSignOut}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
} 