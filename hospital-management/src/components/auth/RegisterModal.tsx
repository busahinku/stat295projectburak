'use client'

import { useState } from 'react'
import { X, User, Stethoscope } from 'lucide-react'
import { signUp } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface RegisterModalProps {
  onClose: () => void
  onSwitchToLogin: () => void
}

export default function RegisterModal({ onClose, onSwitchToLogin }: RegisterModalProps) {
  const [userType, setUserType] = useState<'patient' | 'doctor'>('patient')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Common fields for all users (matching Person constructor)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'M' | 'F'>('M')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Patient-specific fields (matching Patient constructor)
  const [hasInsurance, setHasInsurance] = useState(false)
  const [insuranceProvider, setInsuranceProvider] = useState('')

  // Doctor-specific fields (matching Doctor constructor)
  const [department, setDepartment] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [officeNumber, setOfficeNumber] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [salary, setSalary] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate required fields (matching Java constructor validation)
      if (!firstName || !lastName || !age || !phoneNumber || !username || !password) {
        throw new Error('All required fields must be filled')
      }

      if (parseInt(age) <= 0) {
        throw new Error('Age must be a positive number')
      }

      // Prepare data matching Java constructors
      const userData = {
        firstName,
        lastName,
        age: parseInt(age),
        gender,
        phoneNumber,
        username,
        password,
        role: userType,
                 // Patient-specific fields (matching Patient constructor)
         ...(userType === 'patient' && {
           hasInsurance,
           insuranceProvider: hasInsurance ? insuranceProvider : undefined
         }),
        // Doctor-specific fields (matching Doctor constructor)
        ...(userType === 'doctor' && {
          department: department || 'General',
          specialty: specialty || 'General Medicine',
          officeNumber: officeNumber || 'TBD',
          isPrivate,
          salary: parseFloat(salary) || 0.0
        })
      }

      const user = await signUp(userData)
      
      if (user) {
        router.push('/dashboard')
        onClose()
      } else {
        setError('Registration failed. Please try again.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="modal-pastel max-w-md w-full max-h-[90vh] overflow-y-auto">
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
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am registering as:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('patient')}
                className={`p-4 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                  userType === 'patient'
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg'
                    : 'bg-white border-2 border-purple-200 text-purple-600 hover:border-purple-400 hover:bg-purple-50'
                }`}
              >
                <span className="font-semibold text-lg">Patient</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('doctor')}
                className={`p-4 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                  userType === 'doctor'
                    ? 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white shadow-lg'
                    : 'bg-white border-2 border-blue-200 text-blue-600 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <span className="font-semibold text-lg">Private Doctor</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common Person fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-800 placeholder-gray-500 shadow-sm"
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-500 shadow-sm"
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="1"
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-800 placeholder-gray-500 shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setGender('M')}
                    className={`py-3 px-2 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                      gender === 'M'
                        ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg'
                        : 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 hover:from-blue-100 hover:to-blue-200'
                    }`}
                  >
                    <span className="font-semibold text-sm">Male</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('F')}
                    className={`py-3 px-2 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                      gender === 'F'
                        ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-lg'
                        : 'bg-gradient-to-r from-pink-50 to-pink-100 text-pink-600 hover:from-pink-100 hover:to-pink-200'
                    }`}
                  >
                    <span className="font-semibold text-sm">Female</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-green-300 text-gray-800 placeholder-gray-500 shadow-sm"
                placeholder="Enter phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-800 placeholder-gray-500 shadow-sm"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-rose-300 text-gray-800 placeholder-gray-500 shadow-sm"
                placeholder="Enter password"
                required
              />
            </div>

            {/* Patient-specific fields */}
            {userType === 'patient' && (
              <>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasInsurance"
                    checked={hasInsurance}
                    onChange={(e) => setHasInsurance(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="hasInsurance" className="text-sm font-medium text-gray-700">
                    I have health insurance
                  </label>
                </div>

                {hasInsurance && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance Provider
                    </label>
                    <input
                      type="text"
                      value={insuranceProvider}
                      onChange={(e) => setInsuranceProvider(e.target.value)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-800 placeholder-gray-500 shadow-sm"
                      placeholder="e.g., Blue Cross, Aetna, etc."
                    />
                  </div>
                )}
              </>
            )}

            {/* Doctor-specific fields */}
            {userType === 'doctor' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800 placeholder-gray-500 shadow-sm"
                    placeholder="e.g., Cardiology, Neurology"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialty
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-emerald-300 text-gray-800 placeholder-gray-500 shadow-sm"
                    placeholder="e.g., Interventional Cardiology"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Office Number
                  </label>
                  <input
                    type="text"
                    value={officeNumber}
                    onChange={(e) => setOfficeNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-amber-300 text-gray-800 placeholder-gray-500 shadow-sm"
                    placeholder="e.g., Room 205"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="isPrivate" className="text-sm font-medium text-gray-700">
                    Private Practice (default fee: $250)
                  </label>
                </div>

                {!isPrivate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Salary
                    </label>
                    <input
                      type="number"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-violet-300 text-gray-800 placeholder-gray-500 shadow-sm"
                      placeholder="0.00"
                    />
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-pastel btn-pastel-purple w-full py-3"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 