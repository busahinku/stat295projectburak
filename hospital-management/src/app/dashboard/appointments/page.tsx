'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser, User } from '@/lib/auth'
import { PatientService, Appointment } from '@/lib/patient'
import { 
  Calendar, 
  Clock, 
  User as UserIcon, 
  DollarSign,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function AppointmentsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [availableDoctors, setAvailableDoctors] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all')

  // Create appointment form state - mirrors Java createAppointment() method
  const [selectedDoctorId, setSelectedDoctorId] = useState('')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) return

      setUser(currentUser)

      if (currentUser.role === 'patient') {
        // Mirror patient.getAppointments() from Java
        await loadPatientAppointments(currentUser.id)
        // Load available doctors for appointment creation
        await loadAvailableDoctors()
      }

      setIsLoading(false)
    }

    loadData()
  }, [])

  // Load patient appointments - mirrors patient.getAppointments() from Java
  const loadPatientAppointments = async (patientId: string) => {
    try {
      const appointments = await PatientService.getAppointments(patientId)
      setAppointments(appointments)
    } catch (error) {
      console.error('Error loading appointments:', error)
    }
  }

  // Load available doctors - mirrors the doctor listing from Java main.java
  const loadAvailableDoctors = async () => {
    try {
      const doctors = await PatientService.getAvailableDoctors()
      setAvailableDoctors(doctors)
    } catch (error) {
      console.error('Error loading doctors:', error)
    }
  }

  // Create appointment - mirrors createAppointment() from Java main.java
  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedDoctorId || !appointmentDate || !appointmentTime) return

    setIsCreating(true)
    try {
      // Mirror patient.addAppointment() from Java
      const newAppointment = await PatientService.addAppointment(
        user.id,
        selectedDoctorId,
        appointmentDate,
        appointmentTime
      )

      if (newAppointment) {
        // Reload appointments to show the new one
        await loadPatientAppointments(user.id)
        setShowCreateForm(false)
        setSelectedDoctorId('')
        setAppointmentDate('')
        setAppointmentTime('')
        alert('Appointment created successfully!')
      } else {
        alert('Failed to create appointment. Please try again.')
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
      alert('Error creating appointment. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  // Cancel appointment - mirrors patient.cancelAppointment() from Java
  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return

    setCancellingId(appointmentId)
    try {
      const success = await PatientService.cancelAppointment(appointmentId)
      
      if (success) {
        // Reload appointments to show the updated status
        if (user) {
          await loadPatientAppointments(user.id)
        }
        alert('Appointment cancelled successfully!')
      } else {
        alert('Failed to cancel appointment. Please try again.')
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      alert('Error cancelling appointment. Please try again.')
    } finally {
      setCancellingId(null)
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

  const filteredAppointments = appointments.filter(apt => 
    filter === 'all' || apt.status === filter
  )

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-1">
            Manage your medical appointments
          </p>
        </div>
        
        {user.role === 'patient' && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-pastel btn-pastel-purple flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Book Appointment</span>
          </button>
        )}
      </div>

      {/* Create Appointment Modal - mirrors createAppointment() from Java */}
      {showCreateForm && user.role === 'patient' && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="modal-pastel w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <img 
                  src="/images/logos/logo.png" 
                  alt="SirLewis Hospital" 
                  className="h-12 w-auto"
                />
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Book New Appointment</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            
              <form onSubmit={handleCreateAppointment} className="space-y-6">
                {/* Doctor Selection - mirrors doctor listing from Java */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Doctor *
                  </label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full"
                    required
                  >
                    <option value="">Choose a doctor...</option>
                    {availableDoctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.fullName} ({doctor.specialty}) - {doctor.isPrivate ? 'Private' : 'Hospital'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full"
                    required
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Time *
                  </label>
                  <select
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full"
                    required
                  >
                    <option value="">Select time...</option>
                    <option value="09:00">09:00</option>
                    <option value="09:30">09:30</option>
                    <option value="10:00">10:00</option>
                    <option value="10:30">10:30</option>
                    <option value="11:00">11:00</option>
                    <option value="11:30">11:30</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="13:30">13:30</option>
                    <option value="14:00">14:00</option>
                    <option value="14:30">14:30</option>
                    <option value="15:00">15:00</option>
                    <option value="15:30">15:30</option>
                    <option value="16:00">16:00</option>
                    <option value="16:30">16:30</option>
                    <option value="17:00">17:00</option>
                  </select>
                </div>

                {/* Cost Display */}
                {selectedDoctorId && (
                  <div className="card-pastel p-4 bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Consultation Fee</p>
                        <p className="text-xs text-gray-500">Professional medical consultation</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          ${availableDoctors.find(d => d.id === selectedDoctorId)?.privateFee || 250}
                        </p>
                        <p className="text-xs text-gray-500">per session</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="btn-pastel btn-pastel-blue flex-1 py-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="btn-pastel btn-pastel-purple flex-1 py-3"
                  >
                    {isCreating ? 'Creating...' : 'Book Appointment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="card-pastel">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'all', label: 'All Appointments' },
              { key: 'scheduled', label: 'Scheduled' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.key === 'all' ? appointments.length : appointments.filter(apt => apt.status === tab.key).length}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Appointments List - mirrors viewAppointments() from Java */}
      <div className="card-pastel">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {filter === 'all' ? 'All Appointments' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments`}
          </h2>
        </div>
        
        <div className="p-6">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No appointments found</p>
              {user.role === 'patient' && filter === 'all' && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-pastel btn-pastel-pink mt-4 px-6 py-3"
                >
                  Book Your First Appointment
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="card-pastel p-6 bg-gradient-to-r from-white to-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(appointment.status)}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {user.role === 'patient' 
                            ? `Dr. ${appointment.doctor?.firstName} ${appointment.doctor?.lastName}`
                            : `${appointment.patient?.firstName} ${appointment.patient?.lastName}`
                          }
                        </h3>
                        <p className="text-sm text-gray-500">
                          {appointment.doctor?.specialty && `${appointment.doctor.specialty} • `}
                          {appointment.doctor?.department}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{formatDate(appointment.appointmentDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{appointment.appointmentTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-2 mb-2">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        {/* Cancel button for scheduled appointments */}
                        {user.role === 'patient' && appointment.status === 'scheduled' && (
                          <button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            disabled={cancellingId === appointment.id}
                            className="px-3 py-1 text-xs font-medium text-red-600 border border-red-300 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            {cancellingId === appointment.id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                      <div className="flex items-center justify-end space-x-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">${appointment.cost}</span>
                        {appointment.isPaid ? (
                          <span className="text-xs text-green-600 ml-2">Paid</span>
                        ) : (
                          <span className="text-xs text-red-600 ml-2">Unpaid</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {appointment.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 