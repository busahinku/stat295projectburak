'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser, User } from '@/lib/auth'
import { PatientService, Prescription } from '@/lib/patient'
import { 
  Pill, 
  Calendar, 
  User as UserIcon, 
  FileText,
  Clock,
  Stethoscope
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function PrescriptionsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) return

      setUser(currentUser)

      if (currentUser.role === 'patient') {
        // Mirror patient.getPrescriptions() from Java
        await loadPrescriptions(currentUser.id)
      }

      setIsLoading(false)
    }

    loadData()
  }, [])

  // Load prescriptions - mirrors patient.getPrescriptions() from Java
  const loadPrescriptions = async (patientId: string) => {
    try {
      const prescriptions = await PatientService.getPrescriptions(patientId)
      setPrescriptions(prescriptions)
    } catch (error) {
      console.error('Error loading prescriptions:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Prescriptions</h1>
        <p className="text-gray-600 mt-1">
          View your medication history and current prescriptions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500">
              <Pill className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
              <p className="text-2xl font-semibold text-gray-900">{prescriptions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">
                {prescriptions.filter(p => {
                  const issueDate = new Date(p.issueDate)
                  const now = new Date()
                  return issueDate.getMonth() === now.getMonth() && issueDate.getFullYear() === now.getFullYear()
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-500">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Doctors</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(prescriptions.map(p => p.doctorId)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Prescriptions List - mirrors viewPrescriptions() from Java */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Prescription History</h2>
        </div>
        
        <div className="p-6">
          {prescriptions.length === 0 ? (
            <div className="text-center py-12">
              <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No prescriptions found</p>
              <p className="text-gray-400 text-sm mt-2">
                Your prescriptions will appear here when doctors prescribe medications
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Pill className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {prescription.medication}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Dosage Type</p>
                            <p className="text-sm text-gray-900">{prescription.dosageType}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Usage Instructions</p>
                            <p className="text-sm text-gray-900">{prescription.usage}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <UserIcon className="h-4 w-4" />
                            <span>Dr. {prescription.doctor?.firstName} {prescription.doctor?.lastName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(prescription.issueDate)}</span>
                          </div>
                        </div>

                        {prescription.notes && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-blue-900 mb-1">Doctor's Notes:</p>
                            <p className="text-sm text-blue-800">{prescription.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Medication Guidelines */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <FileText className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="text-lg font-medium text-blue-900 mb-2">Important Medication Guidelines</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Always take medications as prescribed by your doctor</li>
              <li>• Do not stop taking medications without consulting your doctor</li>
              <li>• Keep track of any side effects and report them to your healthcare provider</li>
              <li>• Store medications in a cool, dry place away from children</li>
              <li>• Check expiration dates regularly and dispose of expired medications safely</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 