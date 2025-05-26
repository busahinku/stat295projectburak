'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, User } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { PatientService, Appointment, Prescription, MedicalRecord, Bill } from '@/lib/patient'
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Activity,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  FileText,
  Pill,
  Star,
  CreditCard
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface DashboardStats {
  totalAppointments: number
  todayAppointments: number
  totalPatients: number
  totalRevenue: number
  pendingBills: number
  completedAppointments: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    todayAppointments: 0,
    totalPatients: 0,
    totalRevenue: 0,
    pendingBills: 0,
    completedAppointments: 0
  })
  const [recentAppointments, setRecentAppointments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Patient-specific data - mirrors Java Patient class fields
  const [patientAppointments, setPatientAppointments] = useState<Appointment[]>([])
  const [patientPrescriptions, setPatientPrescriptions] = useState<Prescription[]>([])
  const [patientMedicalRecord, setPatientMedicalRecord] = useState<MedicalRecord | null>(null)
  const [patientBills, setPatientBills] = useState<Bill[]>([])
  const [patientBalance, setPatientBalance] = useState<number>(0)

  useEffect(() => {
    const loadDashboardData = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) return

      setUser(currentUser)
      
      // Redirect doctors to their specific dashboard - mirrors Java showDoctorMenu()
      if (currentUser.role === 'doctor') {
        router.push('/dashboard/doctor')
        return
      }
      
      // Redirect founders to their specific dashboard - mirrors Java showFounderMenu()
      if (currentUser.role === 'founder') {
        router.push('/dashboard/founder')
        return
      }
      
      // Redirect assistants to their specific dashboard - mirrors Java showAssistantMenu()
      if (currentUser.role === 'assistant') {
        router.push('/dashboard/assistant')
        return
      }
      
      // Redirect pharmacists to their specific dashboard - mirrors Java showPharmacistMenu()
      if (currentUser.role === 'pharmacist') {
        router.push('/dashboard/pharmacist')
        return
      }
      
      // Load Patient-specific data using Java Patient class methods
      if (currentUser.role === 'patient') {
        await loadPatientData(currentUser.id)
      } else {
        await loadStats(currentUser)
        await loadRecentAppointments(currentUser)
      }
      
      setIsLoading(false)
    }

    loadDashboardData()
  }, [router])

  // Load Patient data - mirrors Java Patient class methods
  const loadPatientData = async (patientId: string) => {
    try {
      // Mirror patient.getAppointments() from Java
      const appointments = await PatientService.getAppointments(patientId)
      setPatientAppointments(appointments)

      // Mirror patient.getPrescriptions() from Java
      const prescriptions = await PatientService.getPrescriptions(patientId)
      setPatientPrescriptions(prescriptions)

      // Mirror patient.getMedicalRecord() from Java
      const medicalRecord = await PatientService.getMedicalRecord(patientId)
      setPatientMedicalRecord(medicalRecord)

      // Mirror patient.getBills() from Java
      const bills = await PatientService.getBills(patientId)
      setPatientBills(bills)

      // Mirror patient.getBalance() from Java
      const balance = await PatientService.getBalance(patientId)
      setPatientBalance(balance)

      // Set recent appointments for the dashboard
      const recentAppointmentsData = appointments.slice(0, 5).map(apt => ({
        id: apt.id,
        patient_id: apt.patientId,
        doctor_id: apt.doctorId,
        appointment_date: apt.appointmentDate,
        appointment_time: apt.appointmentTime,
        status: apt.status,
        cost: apt.cost,
        notes: apt.notes,
        doctor: apt.doctor ? {
          first_name: apt.doctor.firstName,
          last_name: apt.doctor.lastName
        } : null
      }))
      setRecentAppointments(recentAppointmentsData)

      // Set patient-specific stats
      const today = new Date().toISOString().split('T')[0]
      const todayAppointments = appointments.filter(apt => apt.appointmentDate === today)
      const unpaidBills = bills.filter(bill => !bill.isPaid)
      const totalDue = unpaidBills.reduce((sum, bill) => sum + bill.amount, 0)

      setStats({
        totalAppointments: appointments.length,
        todayAppointments: todayAppointments.length,
        totalPatients: 0, // Not applicable for patients
        totalRevenue: 0, // Not applicable for patients
        pendingBills: unpaidBills.length,
        completedAppointments: appointments.filter(apt => apt.status === 'completed').length
      })

    } catch (error) {
      console.error('Error loading patient data:', error)
    }
  }

  const loadStats = async (user: User) => {
    try {
      const today = new Date().toISOString().split('T')[0]

      // Get appointments data
      let appointmentsQuery = supabase.from('appointments').select('*')
      if (user.role === 'doctor') {
        appointmentsQuery = appointmentsQuery.eq('doctor_id', user.id)
      } else if (user.role === 'patient') {
        appointmentsQuery = appointmentsQuery.eq('patient_id', user.id)
      }

      const { data: appointments } = await appointmentsQuery

      // Get patients data (for doctors and founders)
      let patientsCount = 0
      if (user.role === 'doctor' || user.role === 'founder') {
        const { count } = await supabase
          .from('patients')
          .select('*', { count: 'exact', head: true })
        patientsCount = count || 0
      }

      // Get bills data
      let billsQuery = supabase.from('bills').select('*')
      if (user.role === 'patient') {
        billsQuery = billsQuery.eq('patient_id', user.id)
      }

      const { data: bills } = await billsQuery

      const totalRevenue = bills?.reduce((sum, bill) => sum + (bill.is_paid ? bill.amount : 0), 0) || 0
      const pendingBills = bills?.filter(bill => !bill.is_paid).length || 0

      setStats({
        totalAppointments: appointments?.length || 0,
        todayAppointments: appointments?.filter(apt => apt.appointment_date === today).length || 0,
        totalPatients: patientsCount,
        totalRevenue,
        pendingBills,
        completedAppointments: appointments?.filter(apt => apt.status === 'completed').length || 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const loadRecentAppointments = async (user: User) => {
    try {
      // First get appointments
      let appointmentsQuery = supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true })
        .limit(5)

      if (user.role === 'doctor') {
        appointmentsQuery = appointmentsQuery.eq('doctor_id', user.id)
      } else if (user.role === 'patient') {
        appointmentsQuery = appointmentsQuery.eq('patient_id', user.id)
      }

      const { data: appointments } = await appointmentsQuery

      if (!appointments || appointments.length === 0) {
        setRecentAppointments([])
        return
      }

      // Get patient and doctor details separately
      const patientIds = [...new Set(appointments.map(apt => apt.patient_id))]
      const doctorIds = [...new Set(appointments.map(apt => apt.doctor_id))]

      const { data: patients } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', patientIds)

      const { data: doctors } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', doctorIds)

      // Combine the data
      const enrichedAppointments = appointments.map(apt => ({
        ...apt,
        patient: patients?.find(p => p.id === apt.patient_id),
        doctor: doctors?.find(d => d.id === apt.doctor_id)
      }))

      setRecentAppointments(enrichedAppointments)
    } catch (error) {
      console.error('Error loading recent appointments:', error)
      setRecentAppointments([])
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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
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

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {user.firstName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome to your {user.role} dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {user.role !== 'patient' && (
          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={Calendar}
            color="bg-blue-500"
          />
        )}
        
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={Clock}
          color="bg-green-500"
        />

        {(user.role === 'doctor' || user.role === 'founder') && (
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={Users}
            color="bg-purple-500"
          />
        )}

        {user.role === 'patient' ? (
          <StatCard
            title="Pending Bills"
            value={stats.pendingBills}
            icon={AlertCircle}
            color="bg-red-500"
          />
        ) : (
          <StatCard
            title="Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={DollarSign}
            color="bg-yellow-500"
          />
        )}

        <StatCard
          title="Completed"
          value={stats.completedAppointments}
          icon={CheckCircle}
          color="bg-emerald-500"
        />
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Appointments ({recentAppointments.length})</h2>
        </div>
        <div className="p-6">
          {recentAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No appointments found</p>
          ) : (
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.role === 'patient' 
                          ? `Dr. ${appointment.doctor?.first_name} ${appointment.doctor?.last_name}`
                          : `${appointment.patient?.first_name} ${appointment.patient?.last_name}`
                        }
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(appointment.appointment_date)} at {appointment.appointment_time}
                      </p>
                      {appointment.notes && (
                        <p className="text-xs text-gray-400 mt-1">{appointment.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(appointment.cost)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Patient-specific sections - mirrors Java Patient menu */}
      {user.role === 'patient' && (
        <>
          {/* Patient Profile - mirrors showProfile() from Java */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Patient Profile</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Personal Information</h3>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Name:</span> {user.firstName} {user.lastName}</p>
                    <p><span className="font-medium">Age:</span> {user.age}</p>
                    <p><span className="font-medium">Gender:</span> {user.gender}</p>
                    <p><span className="font-medium">Phone:</span> {user.phoneNumber}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Insurance Information</h3>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Insurance:</span> {user.hasInsurance ? 'Yes' : 'No'}</p>
                    {user.hasInsurance && user.insuranceProvider && (
                      <p><span className="font-medium">Provider:</span> {user.insuranceProvider}</p>
                    )}
                    <p><span className="font-medium">Balance:</span> ${patientBalance.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Prescriptions - mirrors viewPrescriptions() from Java */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Prescriptions</h2>
            </div>
            <div className="p-6">
              {patientPrescriptions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No prescriptions found</p>
              ) : (
                <div className="space-y-4">
                  {patientPrescriptions.slice(0, 3).map((prescription) => (
                    <div key={prescription.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Pill className="h-8 w-8 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{prescription.medication}</p>
                          <p className="text-sm text-gray-500">Dosage: {prescription.dosageType}</p>
                          <p className="text-xs text-gray-400">Dr. {prescription.doctor?.firstName} {prescription.doctor?.lastName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{formatDate(prescription.issueDate)}</p>
                        <p className="text-xs text-gray-400">{prescription.usage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Medical Record Summary - mirrors viewMedicalRecords() from Java */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Medical Record Summary</h2>
            </div>
            <div className="p-6">
              {!patientMedicalRecord ? (
                <p className="text-gray-500 text-center py-8">No medical records found</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Vital Information</h3>
                    <div className="mt-2 space-y-2">
                      {patientMedicalRecord.bloodType && (
                        <p><span className="font-medium">Blood Type:</span> {patientMedicalRecord.bloodType}</p>
                      )}
                      {patientMedicalRecord.height && (
                        <p><span className="font-medium">Height:</span> {patientMedicalRecord.height} cm</p>
                      )}
                      {patientMedicalRecord.weight && (
                        <p><span className="font-medium">Weight:</span> {patientMedicalRecord.weight} kg</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Medical History</h3>
                    <div className="mt-2 space-y-2">
                      {patientMedicalRecord.allergies && (
                        <p><span className="font-medium">Allergies:</span> {patientMedicalRecord.allergies}</p>
                      )}
                      {patientMedicalRecord.diagnoses && (
                        <p><span className="font-medium">Diagnoses:</span> {patientMedicalRecord.diagnoses}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Billing Summary - mirrors showBilling() from Java */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Billing Summary</h2>
            </div>
            <div className="p-6">
              {patientBills.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No bills found</p>
              ) : (
                <div className="space-y-4">
                  {patientBills.filter(bill => !bill.isPaid).slice(0, 3).map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <CreditCard className="h-8 w-8 text-red-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{bill.description}</p>
                          <p className="text-sm text-gray-500">Due: {formatDate(bill.dueDate)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-red-600">${bill.amount.toFixed(2)}</p>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          Unpaid
                        </span>
                      </div>
                    </div>
                  ))}
                  {patientBills.filter(bill => !bill.isPaid).length === 0 && (
                    <p className="text-green-600 text-center py-4">All bills are paid! ✓</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Role-specific quick actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.role === 'patient' && (
              <>
                <button 
                  onClick={() => router.push('/dashboard/appointments')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Book Appointment</p>
                </button>
                <button 
                  onClick={() => router.push('/dashboard/medical-records')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">View Medical Records</p>
                </button>
                <button 
                  onClick={() => router.push('/dashboard/reviews')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Write Review</p>
                </button>
              </>
            )}
            
            {user.role === 'doctor' && (
              <>
                <button 
                  onClick={() => router.push('/dashboard/patients')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">View Patients</p>
                </button>
                <button 
                  onClick={() => router.push('/dashboard/medical-records')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Update Records</p>
                </button>
                <button 
                  onClick={() => router.push('/dashboard/appointments')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Manage Schedule</p>
                </button>
              </>
            )}

            {user.role === 'founder' && (
              <>
                <button 
                  onClick={() => router.push('/dashboard/reports')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">View Reports</p>
                </button>
                <button 
                  onClick={() => router.push('/dashboard/staff')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Manage Staff</p>
                </button>
                <button 
                  onClick={() => router.push('/dashboard/billing')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <DollarSign className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Financial Overview</p>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 