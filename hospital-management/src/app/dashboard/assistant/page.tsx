'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { AssistantService, Assistant, Doctor } from '@/lib/assistant'
import { 
  User, 
  Phone, 
  Users, 
  Building2, 
  Clock, 
  Award,
  UserCheck,
  PhoneCall,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react'

export default function AssistantDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [assistant, setAssistant] = useState<Assistant | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Data states
  const [dashboardStats, setDashboardStats] = useState<any>({})
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [callStatus, setCallStatus] = useState<string>('')

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser || currentUser.role !== 'assistant') {
        router.push('/dashboard')
        return
      }
      setUser(currentUser)
      await loadAssistantData(currentUser.id)
      setLoading(false)
    }
    checkAuth()
  }, [router])

  const loadAssistantData = async (assistantId: string) => {
    try {
      const [assistantProfile, stats, allDoctors] = await Promise.all([
        AssistantService.getAssistantProfile(assistantId),
        AssistantService.getDashboardStats(assistantId),
        AssistantService.getAllDoctors()
      ])

      setAssistant(assistantProfile)
      setDashboardStats(stats)
      setDoctors(allDoctors)
    } catch (error) {
      console.error('Error loading assistant data:', error)
    }
  }

  const handleCallDoctor = async (doctorId: string, doctorName: string) => {
    if (!user) return
    
    setCallStatus(`Calling Dr. ${doctorName}...`)
    const success = await AssistantService.callDoctor(user.id, doctorId)
    
    if (success) {
      setCallStatus(`Successfully called Dr. ${doctorName}`)
      setTimeout(() => setCallStatus(''), 3000)
    } else {
      setCallStatus('Failed to call doctor')
      setTimeout(() => setCallStatus(''), 3000)
    }
  }

  const refreshData = async () => {
    if (user) {
      await loadAssistantData(user.id)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assistant Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName} {user?.lastName}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={refreshData}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('user')
                  router.push('/')
                }}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: User },
              { id: 'profile', name: 'View Profile', icon: UserCheck },
              { id: 'doctors', name: 'Call Doctor', icon: PhoneCall }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalDoctors}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Department</p>
                    <p className="text-lg font-bold text-gray-900">{dashboardStats.departmentName}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Experience</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.experienceYears} years</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <UserCheck className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Supervisor</p>
                    <p className="text-sm font-bold text-gray-900">{dashboardStats.supervisorName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="p-4 rounded-lg hover:bg-gray-50 transition-colors text-center"
                  >
                    <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">View Profile</p>
                    <p className="text-xs text-gray-500">See your personal information</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('doctors')}
                    className="p-4 rounded-lg hover:bg-gray-50 transition-colors text-center"
                  >
                    <PhoneCall className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Call Doctor</p>
                    <p className="text-xs text-gray-500">Contact available doctors</p>
                  </button>
                  <div className="p-4 rounded-lg bg-gray-50 text-center">
                    <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-500">Schedule Management</p>
                    <p className="text-xs text-gray-400">Coming soon</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call Status */}
            {callStatus && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Call Status</p>
                      <p className="text-sm text-gray-600">{callStatus}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab - mirrors assistant.GeneralInfo() from Java */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Assistant Profile</h2>
            
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Basic Details</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Name:</span>
                        <span className="ml-2 text-sm text-gray-900">{assistant?.firstName} {assistant?.lastName}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Age:</span>
                        <span className="ml-2 text-sm text-gray-900">{assistant?.age}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Gender:</span>
                        <span className="ml-2 text-sm text-gray-900">{assistant?.gender === 'M' ? 'Male' : 'Female'}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Phone:</span>
                        <span className="ml-2 text-sm text-gray-900">{assistant?.phoneNumber}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Email:</span>
                        <span className="ml-2 text-sm text-gray-900">{assistant?.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Work Details</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Department:</span>
                        <span className="ml-2 text-sm text-gray-900">
                          {assistant?.department?.name || 'Not assigned'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Location:</span>
                        <span className="ml-2 text-sm text-gray-900">
                          {assistant?.department?.location || 'Not assigned'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Duty:</span>
                        <span className="ml-2 text-sm text-gray-900">{assistant?.duty}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Experience:</span>
                        <span className="ml-2 text-sm text-gray-900">{assistant?.experience} years</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Supervisor:</span>
                        <span className="ml-2 text-sm text-gray-900">
                          {assistant?.supervisor 
                            ? `Dr. ${assistant.supervisor.firstName} ${assistant.supervisor.lastName} (${assistant.supervisor.specialty})`
                            : 'Not assigned'
                          }
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Salary:</span>
                        <span className="ml-2 text-sm text-gray-900">${assistant?.salary?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call Doctor Tab - mirrors callDoctorByAssistant() from Java */}
        {activeTab === 'doctors' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Call Doctor</h2>
            
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Available Doctors</h3>
                <p className="text-sm text-gray-600">Click on a doctor to call them</p>
              </div>
              <div className="p-6">
                {doctors.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No doctors available</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {doctors.map((doctor) => (
                      <div key={doctor.id} className="p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              Dr. {doctor.firstName} {doctor.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">{doctor.specialty}</p>
                            {doctor.department && (
                              <p className="text-xs text-gray-500">{doctor.department.name}</p>
                            )}
                            <div className="mt-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                doctor.isPrivate ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {doctor.isPrivate ? 'Private Practice' : 'Hospital'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCallDoctor(doctor.id, `${doctor.firstName} ${doctor.lastName}`)}
                            className="ml-4 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Phone className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 