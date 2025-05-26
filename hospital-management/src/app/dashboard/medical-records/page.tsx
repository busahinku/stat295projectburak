'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser, User } from '@/lib/auth'
import { PatientService, MedicalRecord } from '@/lib/patient'
import { 
  FileText, 
  Heart, 
  Activity, 
  AlertTriangle,
  Pill,
  TestTube,
  User as UserIcon,
  Calendar
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function MedicalRecordsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) return

      setUser(currentUser)

      if (currentUser.role === 'patient') {
        // Mirror patient.getMedicalRecord() from Java
        await loadMedicalRecord(currentUser.id)
      }

      setIsLoading(false)
    }

    loadData()
  }, [])

  // Load medical record - mirrors patient.getMedicalRecord() from Java
  const loadMedicalRecord = async (patientId: string) => {
    try {
      const record = await PatientService.getMedicalRecord(patientId)
      setMedicalRecord(record)
    } catch (error) {
      console.error('Error loading medical record:', error)
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
        <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
        <p className="text-gray-600 mt-1">
          View your complete medical history and health information
        </p>
      </div>

      {/* Patient Info Card */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Patient Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{user.firstName} {user.lastName}</h3>
                <p className="text-sm text-gray-500">Patient ID: {user.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-500">Age: {user.age} • Gender: {user.gender}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium">Phone:</span> {user.phoneNumber}</p>
              <p><span className="font-medium">Insurance:</span> {user.hasInsurance ? 'Yes' : 'No'}</p>
              {user.hasInsurance && user.insuranceProvider && (
                <p><span className="font-medium">Provider:</span> {user.insuranceProvider}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Medical Record - mirrors viewMedicalRecords() from Java */}
      {!medicalRecord ? (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Medical Record</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No medical records found</p>
              <p className="text-gray-400 text-sm mt-2">
                Your medical records will appear here once a doctor creates them
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Vital Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Heart className="h-5 w-5 text-red-500 mr-2" />
                Vital Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {medicalRecord.bloodType && (
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{medicalRecord.bloodType}</div>
                    <div className="text-sm text-gray-600">Blood Type</div>
                  </div>
                )}
                {medicalRecord.height && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{medicalRecord.height} cm</div>
                    <div className="text-sm text-gray-600">Height</div>
                  </div>
                )}
                {medicalRecord.weight && (
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{medicalRecord.weight} kg</div>
                    <div className="text-sm text-gray-600">Weight</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Diagnoses */}
            {medicalRecord.diagnoses && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Activity className="h-5 w-5 text-blue-500 mr-2" />
                    Diagnoses
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">{medicalRecord.diagnoses}</p>
                </div>
              </div>
            )}

            {/* Allergies */}
            {medicalRecord.allergies && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    Allergies
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">{medicalRecord.allergies}</p>
                </div>
              </div>
            )}

            {/* Medications */}
            {medicalRecord.medications && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Pill className="h-5 w-5 text-green-500 mr-2" />
                    Current Medications
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">{medicalRecord.medications}</p>
                </div>
              </div>
            )}

            {/* Procedures */}
            {medicalRecord.procedures && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 text-purple-500 mr-2" />
                    Procedures
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">{medicalRecord.procedures}</p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Immunizations */}
            {medicalRecord.immunizations && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Activity className="h-5 w-5 text-indigo-500 mr-2" />
                    Immunizations
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">{medicalRecord.immunizations}</p>
                </div>
              </div>
            )}

            {/* Lab Results */}
            {medicalRecord.labResults && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <TestTube className="h-5 w-5 text-orange-500 mr-2" />
                    Lab Results
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">{medicalRecord.labResults}</p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {medicalRecord.notes && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 text-gray-500 mr-2" />
                  Additional Notes
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700">{medicalRecord.notes}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
} 