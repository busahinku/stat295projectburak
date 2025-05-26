'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, User, Lock, Stethoscope } from 'lucide-react'
import { signIn } from '@/lib/auth'

interface LoginModalProps {
  onClose: () => void
  onSwitchToRegister: () => void
}

export default function LoginModal({ onClose, onSwitchToRegister }: LoginModalProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Demo users for quick testing (matching Java objects)
  const demoUsers = [
    { username: 'founder@sirlewis.com', role: 'Founder', name: 'Burak Sahin Kucuk' },
    { username: 'doctor1@sirlewis.com', role: 'Doctor', name: 'Dr. Aysegul Özkaya Eren' },
    { username: 'doctor2@sirlewis.com', role: 'Doctor', name: 'Prof. Dr. Aysen Akkaya' },
    { username: 'patient1@sirlewis.com', role: 'Patient', name: 'Berat Ozkan' },
    { username: 'pharmacist@sirlewis.com', role: 'Pharmacist', name: 'Kevin De Bruyne' },
    { username: 'assistant@sirlewis.com', role: 'Assistant', name: 'Pelin Erkaya' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const user = await signIn(username, password)
      
      if (user) {
        router.push('/dashboard')
        onClose()
      } else {
        setError('Invalid username or password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (demoUsername: string) => {
    setUsername(demoUsername)
    setPassword('password123')
    
    try {
      setLoading(true)
      const user = await signIn(demoUsername, 'password123')
      
      if (user) {
        router.push('/dashboard')
        onClose()
      } else {
        setError('Demo login failed')
      }
    } catch (err) {
      setError('Demo login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="modal-pastel max-w-md w-full">
        <div className="p-6">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/images/logos/logo.png" 
              alt="SirLewis Hospital" 
              className="h-12 w-auto"
            />
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-800 placeholder-gray-500 shadow-sm"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-500 shadow-sm"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-pastel btn-pastel-purple w-full py-3"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Users Section */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or try demo accounts</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600 text-center">
                Quick login with demo users (password: password123)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {demoUsers.map((demo, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDemoLogin(demo.username)}
                    disabled={loading}
                    className="p-3 text-xs bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-0 hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-sm"
                  >
                    <div className="font-medium">{demo.role}</div>
                    <div className="text-gray-500 truncate">{demo.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 