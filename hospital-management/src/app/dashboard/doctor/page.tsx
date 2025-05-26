'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser, User, signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { DoctorService, DoctorAppointment, DoctorPatient, Room, DoctorReview } from '@/lib/doctor'
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText,
  Stethoscope,
  Building,
  DollarSign,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  User as UserIcon,
  Phone,
  Shield,
  Activity,
  Pill,
  ClipboardList,
  BedDouble,
  Star,
  LogOut
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

// Write Prescription Form Component - mirrors writePrescription() from Java
function WritePrescriptionForm({ 
  patients, 
  selectedPatient, 
  onBack, 
  onSuccess, 
  doctorId 
}: {
  patients: DoctorPatient[]
  selectedPatient: DoctorPatient | null
  onBack: () => void
  onSuccess: () => void
  doctorId: string
}) {
  const [formData, setFormData] = useState({
    patientId: selectedPatient?.id || '',
    medication: '',
    dosageType: '',
    usage: '',
    duration: '30 days',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.patientId || !formData.medication || !formData.dosageType || !formData.usage || !formData.duration) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const success = await DoctorService.writePrescription(
        doctorId,
        formData.patientId,
        formData.medication,
        formData.dosageType,
        formData.usage,
        formData.duration,
        formData.notes
      )

      if (success) {
        alert('Prescription written successfully!')
        onSuccess()
      } else {
        alert('Failed to write prescription. Please try again.')
      }
    } catch (error) {
      console.error('Error writing prescription:', error)
      alert('Error writing prescription. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Write Prescription</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Patients
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patient *
          </label>
          <select
            value={formData.patientId}
            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName} (Age: {patient.age})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medication *
          </label>
          <input
            type="text"
            value={formData.medication}
            onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter medication name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dosage Type *
          </label>
          <input
            type="text"
            value={formData.dosageType}
            onChange={(e) => setFormData({ ...formData, dosageType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 500mg, 10ml, 1 tablet"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Usage Instructions *
          </label>
          <input
            type="text"
            value={formData.usage}
            onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Twice daily, Once before meals"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration *
          </label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 30 days, 2 weeks, 1 month"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Additional instructions or notes"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Writing Prescription...' : 'Write Prescription'}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

// Update Medical Record Form Component - mirrors updatePatientMedicalRecord() from Java
function UpdateMedicalRecordForm({ 
  patients, 
  selectedPatient, 
  onBack, 
  onSuccess,
  doctorId 
}: {
  patients: DoctorPatient[]
  selectedPatient: DoctorPatient | null
  onBack: () => void
  onSuccess: () => void
  doctorId: string
}) {
  const [formData, setFormData] = useState({
    patientId: selectedPatient?.id || '',
    bloodType: '',
    height: '',
    weight: '',
    diagnoses: '',
    procedures: '',
    medications: '',
    allergies: '',
    immunizations: '',
    labResults: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load existing medical record when patient is selected
  useEffect(() => {
    const loadMedicalRecord = async () => {
      if (formData.patientId) {
        setIsLoading(true)
        try {
          const record = await DoctorService.getPatientMedicalRecord(formData.patientId)
          if (record) {
            setFormData(prev => ({
              ...prev,
              bloodType: record.bloodType || '',
              height: record.height?.toString() || '',
              weight: record.weight?.toString() || '',
              diagnoses: record.diagnoses || '',
              procedures: record.procedures || '',
              medications: record.medications || '',
              allergies: record.allergies || '',
              immunizations: record.immunizations || '',
              labResults: record.labResults || '',
              notes: record.notes || ''
            }))
          }
        } catch (error) {
          console.error('Error loading medical record:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadMedicalRecord()
  }, [formData.patientId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.patientId) {
      alert('Please select a patient')
      return
    }

    setIsSubmitting(true)
    try {
      const updates = {
        bloodType: formData.bloodType,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        diagnoses: formData.diagnoses,
        procedures: formData.procedures,
        medications: formData.medications,
        allergies: formData.allergies,
        immunizations: formData.immunizations,
        labResults: formData.labResults,
        notes: formData.notes
      }

      const success = await DoctorService.updatePatientMedicalRecord(formData.patientId, updates, doctorId)

      if (success) {
        alert('Medical record updated successfully!')
        onSuccess()
      } else {
        alert('Failed to update medical record. Please try again.')
      }
    } catch (error) {
      console.error('Error updating medical record:', error)
      alert('Error updating medical record. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Update Patient Medical Record</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Patients
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patient *
          </label>
          <select
            value={formData.patientId}
            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName} (Age: {patient.age})
              </option>
            ))}
          </select>
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading existing medical record...</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Type
            </label>
            <select
              value={formData.bloodType}
              onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select blood type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter height in cm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter weight in kg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Diagnoses
          </label>
          <textarea
            value={formData.diagnoses}
            onChange={(e) => setFormData({ ...formData, diagnoses: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Enter diagnoses"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Procedures
          </label>
          <textarea
            value={formData.procedures}
            onChange={(e) => setFormData({ ...formData, procedures: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Enter procedures performed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Allergies
          </label>
          <textarea
            value={formData.allergies}
            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={2}
            placeholder="Enter known allergies"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Immunizations
          </label>
          <textarea
            value={formData.immunizations}
            onChange={(e) => setFormData({ ...formData, immunizations: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={2}
            placeholder="Enter immunization history"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lab Results
          </label>
          <textarea
            value={formData.labResults}
            onChange={(e) => setFormData({ ...formData, labResults: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Enter lab results"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Enter additional notes"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating Record...' : 'Update Medical Record'}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default function DoctorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([])
  const [patients, setPatients] = useState<DoctorPatient[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [reviews, setReviews] = useState<DoctorReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'patients' | 'prescriptions' | 'rooms' | 'reviews' | 'write-prescription' | 'update-medical-record' | 'assign-room'>('overview')
  const [selectedPatient, setSelectedPatient] = useState<DoctorPatient | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  
  // Stats
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalPatients: 0,
    completedAppointments: 0,
    earnings: { totalEarnings: 0, paidAppointments: 0, unpaidAppointments: 0 }
  })

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser || currentUser.role !== 'doctor') return

      setUser(currentUser)
      await loadDoctorData(currentUser.id)
      setIsLoading(false)
    }

    loadData()
  }, [])

  const loadDoctorData = async (doctorId: string) => {
    try {
      // Load appointments - mirrors doctor.getAppointments() from Java
      const appointmentsData = await DoctorService.getAppointments(doctorId)
      setAppointments(appointmentsData)

      // Load patients - mirrors doctor.getPatients() from Java
      const patientsData = await DoctorService.getPatients(doctorId)
      setPatients(patientsData)

      // Load rooms - mirrors viewAvailableRooms() from Java
      const roomsData = await DoctorService.getAvailableRooms()
      setRooms(roomsData)

      // Load prescriptions - mirrors doctor.getPrescriptions() from Java
      const prescriptionsData = await DoctorService.getPrescriptions(doctorId)
      setPrescriptions(prescriptionsData)

      // Load reviews - mirrors viewDoctorReviews() from Java
      const reviewsData = await DoctorService.getReviews(doctorId)
      setReviews(reviewsData)

      // Calculate earnings - mirrors viewEarnings() from Java
      const earningsData = await DoctorService.calculateEarnings(doctorId)

      // Calculate stats
      const today = new Date().toISOString().split('T')[0]
      const todayAppointments = appointmentsData.filter(apt => apt.appointmentDate === today)
      const completedAppointments = appointmentsData.filter(apt => apt.status === 'completed')

      setStats({
        totalAppointments: appointmentsData.length,
        todayAppointments: todayAppointments.length,
        totalPatients: patientsData.length,
        completedAppointments: completedAppointments.length,
        earnings: earningsData
      })
    } catch (error) {
      console.error('Error loading doctor data:', error)
    }
  }

  // Update appointment status - mirrors manageDoctorAppointments() from Java
  const handleUpdateAppointmentStatus = async (appointmentId: string, status: string) => {
    if (!confirm(`Are you sure you want to mark this appointment as ${status}?`)) return

    try {
      const success = await DoctorService.updateAppointmentStatus(appointmentId, status)
      if (success) {
        // Reload appointments
        if (user) {
          await loadDoctorData(user.id)
        }
        alert(`Appointment marked as ${status} successfully!`)
      } else {
        alert('Failed to update appointment status. Please try again.')
      }
    } catch (error) {
      console.error('Error updating appointment status:', error)
      alert('Error updating appointment status. Please try again.')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-500" />
      case 'no_show': return <AlertCircle className="h-5 w-5 text-gray-500" />
      default: return <Clock className="h-5 w-5 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'no_show': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSignOut = () => {
    signOut()
    router.push('/')
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
      {/* Header - mirrors showProfile() from Java */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dr. {user.firstName} {user.lastName}</h1>
            <p className="text-gray-600 mt-1">
              {user.role === 'doctor' ? 'Doctor Dashboard' : 'Medical Professional'}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Stethoscope className="h-4 w-4" />
                <span>Specialty: Cardiology</span>
              </span>
              <span className="flex items-center space-x-1">
                <Building className="h-4 w-4" />
                <span>Department: Cardiology</span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">${stats.earnings.totalEarnings}</div>
              <div className="text-sm text-gray-500">Total Earnings</div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - mirrors Java dashboard statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</div>
              <div className="text-sm text-gray-500">Total Appointments</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</div>
              <div className="text-sm text-gray-500">Today's Appointments</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.totalPatients}</div>
              <div className="text-sm text-gray-500">Total Patients</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.completedAppointments}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - mirrors Java doctor menu */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'overview', label: 'Overview', icon: Activity },
              { key: 'appointments', label: 'Appointments', icon: Calendar },
              { key: 'patients', label: 'Patients', icon: Users },
              { key: 'prescriptions', label: 'Prescriptions', icon: Pill },
              { key: 'rooms', label: 'Rooms', icon: BedDouble },
              { key: 'reviews', label: 'Reviews', icon: Star }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'overview' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Today's Schedule</h2>
            
            {/* Today's Appointments */}
            <div className="space-y-4">
              {appointments
                .filter(apt => apt.appointmentDate === new Date().toISOString().split('T')[0])
                .map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(appointment.status)}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {appointment.patient?.firstName} {appointment.patient?.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Age: {appointment.patient?.age} • {appointment.patient?.gender} • 
                            {appointment.patient?.hasInsurance ? ` Insured (${appointment.patient.insuranceProvider})` : ' No Insurance'}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-600">{appointment.appointmentTime}</span>
                            <span className="text-sm text-gray-600">${appointment.cost}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        {appointment.status === 'scheduled' && (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleUpdateAppointmentStatus(appointment.id, 'completed')}
                              className="px-3 py-1 text-xs font-medium text-green-600 border border-green-300 rounded-full hover:bg-green-50 transition-colors"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelled')}
                              className="px-3 py-1 text-xs font-medium text-red-600 border border-red-300 rounded-full hover:bg-red-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              
              {appointments.filter(apt => apt.appointmentDate === new Date().toISOString().split('T')[0]).length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No appointments scheduled for today</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">All Appointments</h2>
            
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(appointment.status)}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {appointment.patient?.firstName} {appointment.patient?.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {appointment.patient?.phoneNumber} • 
                          {appointment.patient?.hasInsurance ? ` Insured (${appointment.patient.insuranceProvider})` : ' No Insurance'}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-600">{formatDate(appointment.appointmentDate)}</span>
                          <span className="text-sm text-gray-600">{appointment.appointmentTime}</span>
                          <span className="text-sm text-gray-600">${appointment.cost}</span>
                          <span className={`text-sm ${appointment.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                            {appointment.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                      {appointment.status === 'scheduled' && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleUpdateAppointmentStatus(appointment.id, 'completed')}
                            className="px-3 py-1 text-xs font-medium text-green-600 border border-green-300 rounded-full hover:bg-green-50 transition-colors"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelled')}
                            className="px-3 py-1 text-xs font-medium text-red-600 border border-red-300 rounded-full hover:bg-red-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {appointment.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {appointments.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No appointments found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Patients</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveTab('write-prescription')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Pill className="h-4 w-4" />
                  <span>Write Prescription</span>
                </button>
                <button 
                  onClick={() => setActiveTab('update-medical-record')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Update Medical Record</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients.map((patient) => (
                <div key={patient.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <UserIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Age: {patient.age} • {patient.gender}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{patient.phoneNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Shield className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {patient.hasInsurance ? `Insured (${patient.insuranceProvider})` : 'No Insurance'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <DollarSign className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">Balance: ${patient.balance}</span>
                      </div>
                      <div className="flex space-x-1 mt-3">
                        <button 
                          onClick={() => {
                            setSelectedPatient(patient)
                            setActiveTab('write-prescription')
                          }}
                          className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                        >
                          Prescribe
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedPatient(patient)
                            setActiveTab('update-medical-record')
                          }}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          Update Record
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {patients.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No patients found</p>
                  <p className="text-gray-400 text-sm mt-2">Patients will appear here after they book appointments with you</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Prescriptions Written</h2>
              <button 
                onClick={() => setActiveTab('write-prescription')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Write New Prescription</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Pill className="h-8 w-8 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{prescription.medication}</h3>
                        <p className="text-sm text-gray-500">
                          Patient: {prescription.patient?.firstName} {prescription.patient?.lastName}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-600">Dosage: {prescription.dosageType}</span>
                          <span className="text-sm text-gray-600">Frequency: {prescription.usage}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{formatDate(prescription.issueDate)}</p>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Prescribed
                      </span>
                    </div>
                  </div>
                  
                  {prescription.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600"><strong>Instructions:</strong> {prescription.notes}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {prescriptions.length === 0 && (
                <div className="text-center py-12">
                  <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No prescriptions written yet</p>
                  <p className="text-gray-400 text-sm mt-2">Start by writing prescriptions for your patients</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Hospital Rooms</h2>
              <button 
                onClick={() => setActiveTab('assign-room')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Assign Patient to Room</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div key={room.id} className={`border rounded-lg p-4 ${room.isAvailable ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900">{room.roomName}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      room.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {room.isAvailable ? 'Available' : 'Occupied'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span>{room.roomType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capacity:</span>
                      <span>{room.capacity} patients</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate:</span>
                      <span>${room.hourlyRate}/hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equipment:</span>
                      <span className="text-right">{room.equipment}</span>
                    </div>
                    
                    {!room.isAvailable && room.currentPatient && (
                      <div className="mt-3 p-2 bg-white rounded border">
                        <div className="text-xs text-gray-500">Current Patient:</div>
                        <div className="font-medium">
                          {room.currentPatient.firstName} {room.currentPatient.lastName}
                        </div>
                      </div>
                    )}
                    
                    {room.isAvailable && (
                      <div className="mt-3">
                        <button 
                          onClick={() => {
                            setSelectedRoom(room)
                            setActiveTab('assign-room')
                          }}
                          className="w-full px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          Assign Patient
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {rooms.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <BedDouble className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No rooms found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Patient Reviews</h2>
            
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {review.patient?.firstName} {review.patient?.lastName}
                          </h3>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            ({review.rating}/5)
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {reviews.length === 0 && (
                <div className="text-center py-12">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No reviews yet</p>
                  <p className="text-gray-400 text-sm mt-2">Patient reviews will appear here after they rate your service</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'write-prescription' && (
          <WritePrescriptionForm 
            patients={patients}
            selectedPatient={selectedPatient}
            onBack={() => setActiveTab('patients')}
            onSuccess={() => {
              setActiveTab('patients')
              if (user) loadDoctorData(user.id)
            }}
            doctorId={user?.id || ''}
          />
        )}

        {activeTab === 'update-medical-record' && (
          <UpdateMedicalRecordForm 
            patients={patients}
            selectedPatient={selectedPatient}
            onBack={() => setActiveTab('patients')}
            onSuccess={() => {
              setActiveTab('patients')
              if (user) loadDoctorData(user.id)
            }}
            doctorId={user?.id || ''}
          />
        )}

        {activeTab === 'assign-room' && (
          <AssignRoomForm 
            patients={patients}
            rooms={rooms}
            selectedRoom={selectedRoom}
            onBack={() => setActiveTab('rooms')}
            onSuccess={() => {
              setActiveTab('rooms')
              if (user) loadDoctorData(user.id)
            }}
          />
        )}
      </div>
    </div>
  )
}

// Assign Room Form Component - mirrors assignPatientToRoom() from Java
function AssignRoomForm({ 
  patients, 
  rooms,
  selectedRoom, 
  onBack, 
  onSuccess 
}: {
  patients: DoctorPatient[]
  rooms: Room[]
  selectedRoom: Room | null
  onBack: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    patientId: '',
    roomId: selectedRoom?.id || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.patientId || !formData.roomId) {
      alert('Please select both a patient and a room')
      return
    }

    setIsSubmitting(true)
    try {
      const success = await DoctorService.assignPatientToRoom(formData.patientId, formData.roomId)

      if (success) {
        alert('Patient assigned to room successfully!')
        onSuccess()
      } else {
        alert('Failed to assign patient to room. The room may no longer be available.')
      }
    } catch (error) {
      console.error('Error assigning patient to room:', error)
      alert('Error assigning patient to room. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableRooms = rooms.filter(room => room.isAvailable)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Assign Patient to Room</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Rooms
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Patient *
          </label>
          <select
            value={formData.patientId}
            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Choose a patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName} (Age: {patient.age}, {patient.gender})
              </option>
            ))}
          </select>
          {patients.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">No patients found. Patients will appear here after they book appointments with you.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Room *
          </label>
          <select
            value={formData.roomId}
            onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Choose a room</option>
            {availableRooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.roomName} - {room.roomType} (${room.hourlyRate}/hour)
              </option>
            ))}
          </select>
          {availableRooms.length === 0 && (
            <p className="text-sm text-red-500 mt-1">No available rooms at the moment.</p>
          )}
        </div>

        {/* Room Details Preview */}
        {formData.roomId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Selected Room Details</h3>
            {(() => {
              const room = rooms.find(r => r.id === formData.roomId)
              return room ? (
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Name:</strong> {room.roomName}</p>
                  <p><strong>Type:</strong> {room.roomType}</p>
                  <p><strong>Capacity:</strong> {room.capacity} patients</p>
                  <p><strong>Rate:</strong> ${room.hourlyRate}/hour</p>
                  <p><strong>Equipment:</strong> {room.equipment}</p>
                </div>
              ) : null
            })()}
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting || availableRooms.length === 0 || patients.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Assigning...' : 'Assign Patient to Room'}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
} 