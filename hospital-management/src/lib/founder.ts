import { supabase } from './supabase'
import { User } from './auth'

// Founder interface matching Java Founder class
export interface Founder extends User {
  salary: number
}

// Department interface matching Java Department class
export interface Department {
  id: string
  name: string
  location: string
  headDoctorId?: string
  createdAt: string
  headDoctor?: {
    id: string
    firstName: string
    lastName: string
    specialty: string
  }
  doctorCount?: number
}

// Worker interface for all hospital staff
export interface Worker {
  id: string
  firstName: string
  lastName: string
  age: number
  gender: string
  phoneNumber: string
  email: string
  role: 'doctor' | 'patient' | 'pharmacist' | 'assistant' | 'founder'
  createdAt: string
  // Role-specific data
  specialty?: string
  department?: string
  salary?: number
  isPrivate?: boolean
  privateFee?: number
  hasInsurance?: boolean
  insuranceProvider?: string
  balance?: number
  pharmacyLocation?: string
  experienceYears?: number
}

// Financial Transaction interface matching Java FinancialTransaction class
export interface FinancialTransaction {
  id: string
  amount: number
  transactionType: string
  description: string
  referenceId?: string
  createdAt: string
}

// Hospital Report interface matching Java HospitalReport class
export interface HospitalReport {
  id: string
  reportType: string
  reportData: {
    departmentCount: number
    doctorCount: number
    patientCount: number
    totalRevenue: number
    totalExpenses: number
    netIncome: number
    appointmentCount: number
    completedAppointments: number
    pendingBills: number
  }
  generatedBy: string
  createdAt: string
}

// Room interface matching Java Room class
export interface FounderRoom {
  id: string
  roomNumber: string
  roomType: string
  capacity: number
  hourlyRate: number
  equipment: string
  isAvailable: boolean
  createdAt: string
  currentPatient?: {
    firstName: string
    lastName: string
  }
}

// Activity Log interface for tracking all database changes
export interface ActivityLog {
  id: string
  userId: string
  userRole: string
  userName: string
  action: string
  tableName: string
  recordId?: string
  description: string
  timestamp: string
  details?: any
}

// Founder Service Class - mirrors Java Founder class methods
export class FounderService {
  
  // Get all departments - mirrors founder.getDepartments() from Java
  static async getDepartments(): Promise<Department[]> {
    try {
      const { data: departments, error } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (!departments || departments.length === 0) {
        return []
      }

      // Get head doctor details and doctor counts
      const headDoctorIds = departments.map(dept => dept.head_doctor_id).filter(id => id)
      const { data: headDoctors } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', headDoctorIds)

      const { data: doctorDetails } = await supabase
        .from('doctors')
        .select('id, specialty')
        .in('id', headDoctorIds)

      // Get doctor counts for each department
      const departmentIds = departments.map(dept => dept.id)
      const { data: doctorCounts } = await supabase
        .from('doctors')
        .select('department_id')
        .in('department_id', departmentIds)

      return departments.map(dept => {
        const headDoctor = headDoctors?.find(d => d.id === dept.head_doctor_id)
        const headDoctorDetail = doctorDetails?.find(d => d.id === dept.head_doctor_id)
        const doctorCount = doctorCounts?.filter(d => d.department_id === dept.id).length || 0

        return {
          id: dept.id,
          name: dept.name,
          location: dept.location,
          headDoctorId: dept.head_doctor_id,
          createdAt: dept.created_at,
          headDoctor: headDoctor ? {
            id: headDoctor.id,
            firstName: headDoctor.first_name || '',
            lastName: headDoctor.last_name || '',
            specialty: headDoctorDetail?.specialty || ''
          } : undefined,
          doctorCount
        }
      })
    } catch (error) {
      console.error('Error fetching departments:', error)
      return []
    }
  }

  // Create department - mirrors founder.createDepartment() from Java
  static async createDepartment(name: string, headDoctorId: string, location: string, founderId: string): Promise<boolean> {
    try {
      const { data: department, error } = await supabase
        .from('departments')
        .insert({
          name,
          location,
          head_doctor_id: headDoctorId
        })
        .select()
        .single()

      if (error) throw error

      // Log the activity
      await this.logActivity(founderId, 'founder', 'CREATE', 'departments', department.id, 
        `Created department: ${name}`, { name, location, headDoctorId })

      // Add financial transaction for department setup cost
      await this.addFinancialTransaction(-50000, 'Expense', `Department Setup - ${name}`, department.id)

      return true
    } catch (error) {
      console.error('Error creating department:', error)
      return false
    }
  }

  // Get all workers - mirrors founder.getDoctors() and viewAllWorkers() from Java
  static async getAllWorkers(): Promise<Worker[]> {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .neq('role', 'patient') // Exclude patients from workers list
        .order('created_at', { ascending: false })

      if (error) throw error

      if (!users || users.length === 0) {
        return []
      }

      // Get role-specific data
      const doctorIds = users.filter(u => u.role === 'doctor').map(u => u.id)
      const pharmacistIds = users.filter(u => u.role === 'pharmacist').map(u => u.id)
      const assistantIds = users.filter(u => u.role === 'assistant').map(u => u.id)
      const founderIds = users.filter(u => u.role === 'founder').map(u => u.id)

      const [doctorDetails, pharmacistDetails, assistantDetails, founderDetails] = await Promise.all([
        doctorIds.length > 0 ? supabase.from('doctors').select('*').in('id', doctorIds) : { data: [] },
        pharmacistIds.length > 0 ? supabase.from('pharmacists').select('*').in('id', pharmacistIds) : { data: [] },
        assistantIds.length > 0 ? supabase.from('assistants').select('*').in('id', assistantIds) : { data: [] },
        founderIds.length > 0 ? supabase.from('founders').select('*').in('id', founderIds) : { data: [] }
      ])

      return users.map(user => {
        const worker: Worker = {
          id: user.id,
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          age: user.age || 0,
          gender: user.gender || '',
          phoneNumber: user.phone_number || '',
          email: user.email || '',
          role: user.role,
          createdAt: user.created_at
        }

        // Add role-specific data
        if (user.role === 'doctor') {
          const doctorDetail = doctorDetails.data?.find(d => d.id === user.id)
          if (doctorDetail) {
            worker.specialty = doctorDetail.specialty
            worker.department = doctorDetail.department_id
            worker.salary = doctorDetail.salary
            worker.isPrivate = doctorDetail.is_private
            worker.privateFee = doctorDetail.private_fee
          }
        } else if (user.role === 'pharmacist') {
          const pharmacistDetail = pharmacistDetails.data?.find(p => p.id === user.id)
          if (pharmacistDetail) {
            worker.salary = pharmacistDetail.salary
            worker.pharmacyLocation = pharmacistDetail.pharmacy_location
          }
        } else if (user.role === 'assistant') {
          const assistantDetail = assistantDetails.data?.find(a => a.id === user.id)
          if (assistantDetail) {
            worker.salary = assistantDetail.salary
            worker.experienceYears = assistantDetail.experience_years
          }
        } else if (user.role === 'founder') {
          const founderDetail = founderDetails.data?.find(f => f.id === user.id)
          if (founderDetail) {
            worker.salary = founderDetail.salary
          }
        }

        return worker
      })
    } catch (error) {
      console.error('Error fetching workers:', error)
      return []
    }
  }

  // Create doctor - mirrors createDoctor() from Java main.java
  static async createDoctor(doctorData: {
    firstName: string
    lastName: string
    age: number
    gender: string
    phoneNumber: string
    email: string
    specialty: string
    departmentId?: string
    isPrivate: boolean
    salary?: number
    privateFee?: number
  }, founderId: string): Promise<boolean> {
    try {
      // First create user
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          first_name: doctorData.firstName,
          last_name: doctorData.lastName,
          age: doctorData.age,
          gender: doctorData.gender,
          phone_number: doctorData.phoneNumber,
          email: doctorData.email,
          role: 'doctor'
        })
        .select()
        .single()

      if (userError) throw userError

      // Then create doctor details
      const { error: doctorError } = await supabase
        .from('doctors')
        .insert({
          id: user.id,
          specialty: doctorData.specialty,
          department_id: doctorData.departmentId,
          is_private: doctorData.isPrivate,
          salary: doctorData.salary || 0,
          private_fee: doctorData.privateFee || 250.0
        })

      if (doctorError) {
        // Cleanup user if doctor creation fails
        await supabase.from('users').delete().eq('id', user.id)
        throw doctorError
      }

      // Log the activity
      await this.logActivity(founderId, 'founder', 'CREATE', 'users', user.id, 
        `Created doctor: ${doctorData.firstName} ${doctorData.lastName}`, doctorData)

      // Add expense for doctor salary if not private
      if (!doctorData.isPrivate && doctorData.salary) {
        await this.addFinancialTransaction(-doctorData.salary, 'Expense', 
          `Doctor Salary - ${doctorData.firstName} ${doctorData.lastName}`, user.id)
      }

      return true
    } catch (error) {
      console.error('Error creating doctor:', error)
      return false
    }
  }

  // Create assistant - mirrors createAssistant() from Java main.java
  static async createAssistant(assistantData: {
    firstName: string
    lastName: string
    age: number
    gender: string
    phoneNumber: string
    email: string
    departmentId?: string
    experienceYears: number
    salary: number
  }, founderId: string): Promise<boolean> {
    try {
      // First create user
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          first_name: assistantData.firstName,
          last_name: assistantData.lastName,
          age: assistantData.age,
          gender: assistantData.gender,
          phone_number: assistantData.phoneNumber,
          email: assistantData.email,
          role: 'assistant'
        })
        .select()
        .single()

      if (userError) throw userError

      // Then create assistant details
      const { error: assistantError } = await supabase
        .from('assistants')
        .insert({
          id: user.id,
          department_id: assistantData.departmentId,
          experience_years: assistantData.experienceYears,
          salary: assistantData.salary
        })

      if (assistantError) {
        // Cleanup user if assistant creation fails
        await supabase.from('users').delete().eq('id', user.id)
        throw assistantError
      }

      // Log the activity
      await this.logActivity(founderId, 'founder', 'CREATE', 'users', user.id, 
        `Created assistant: ${assistantData.firstName} ${assistantData.lastName}`, assistantData)

      // Add expense for assistant salary
      await this.addFinancialTransaction(-assistantData.salary, 'Expense', 
        `Assistant Salary - ${assistantData.firstName} ${assistantData.lastName}`, user.id)

      return true
    } catch (error) {
      console.error('Error creating assistant:', error)
      return false
    }
  }

  // Fire doctor - mirrors founder.fireDoctor() from Java
  static async fireDoctor(doctorId: string, founderId: string): Promise<boolean> {
    try {
      // Get doctor info first for logging
      const { data: doctor } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('id', doctorId)
        .single()

      // Remove from doctors table (this will cascade to users due to foreign key)
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', doctorId)

      if (error) throw error

      // Log the activity
      await this.logActivity(founderId, 'founder', 'DELETE', 'users', doctorId, 
        `Fired doctor: ${doctor?.first_name} ${doctor?.last_name}`, { doctorId })

      return true
    } catch (error) {
      console.error('Error firing doctor:', error)
      return false
    }
  }

  // Fire pharmacist - mirrors founder.firePharmacist() from Java
  static async firePharmacist(pharmacistId: string, founderId: string): Promise<boolean> {
    try {
      // Get pharmacist info first for logging
      const { data: pharmacist } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('id', pharmacistId)
        .single()

      // Remove from pharmacists table (this will cascade to users due to foreign key)
      const { error } = await supabase
        .from('pharmacists')
        .delete()
        .eq('id', pharmacistId)

      if (error) throw error

      // Log the activity
      await this.logActivity(founderId, 'founder', 'DELETE', 'users', pharmacistId, 
        `Fired pharmacist: ${pharmacist?.first_name} ${pharmacist?.last_name}`, { pharmacistId })

      return true
    } catch (error) {
      console.error('Error firing pharmacist:', error)
      return false
    }
  }

  // Fire assistant - mirrors founder.fireAssistant() from Java
  static async fireAssistant(assistantId: string, founderId: string): Promise<boolean> {
    try {
      // Get assistant info first for logging
      const { data: assistant } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('id', assistantId)
        .single()

      // Remove from assistants table (this will cascade to users due to foreign key)
      const { error } = await supabase
        .from('assistants')
        .delete()
        .eq('id', assistantId)

      if (error) throw error

      // Log the activity
      await this.logActivity(founderId, 'founder', 'DELETE', 'users', assistantId, 
        `Fired assistant: ${assistant?.first_name} ${assistant?.last_name}`, { assistantId })

      return true
    } catch (error) {
      console.error('Error firing assistant:', error)
      return false
    }
  }

  // General fire worker function - handles all worker types
  static async fireWorker(workerId: string, workerRole: string, founderId: string): Promise<boolean> {
    switch (workerRole) {
      case 'doctor':
        return await this.fireDoctor(workerId, founderId)
      case 'pharmacist':
        return await this.firePharmacist(workerId, founderId)
      case 'assistant':
        return await this.fireAssistant(workerId, founderId)
      default:
        console.error('Invalid worker role for firing:', workerRole)
        return false
    }
  }

  // Create room - mirrors createRoom() from Java main.java
  static async createRoom(roomData: {
    roomNumber: string
    roomType: string
    capacity: number
    hourlyRate: number
    equipment: string
  }, founderId: string): Promise<boolean> {
    try {
      const { data: room, error } = await supabase
        .from('rooms')
        .insert({
          room_number: roomData.roomNumber,
          room_type: roomData.roomType,
          capacity: roomData.capacity,
          hourly_rate: roomData.hourlyRate,
          equipment: roomData.equipment,
          is_available: true
        })
        .select()
        .single()

      if (error) throw error

      // Log the activity
      await this.logActivity(founderId, 'founder', 'CREATE', 'rooms', room.id, 
        `Created room: ${roomData.roomNumber}`, roomData)

      return true
    } catch (error) {
      console.error('Error creating room:', error)
      return false
    }
  }

  // Get all rooms - mirrors founder.getRooms() from Java
  static async getAllRooms(): Promise<FounderRoom[]> {
    try {
      const { data: rooms, error } = await supabase
        .from('rooms')
        .select('*')
        .order('room_number', { ascending: true })

      if (error) throw error

      return rooms?.map(room => ({
        id: room.id,
        roomNumber: room.room_number,
        roomType: room.room_type,
        capacity: room.capacity,
        hourlyRate: room.hourly_rate,
        equipment: room.equipment,
        isAvailable: room.is_available,
        createdAt: room.created_at
      })) || []
    } catch (error) {
      console.error('Error fetching rooms:', error)
      return []
    }
  }

  // Generate monthly report - mirrors founder.generateMonthlyReport() from Java
  static async generateMonthlyReport(founderId: string): Promise<HospitalReport | null> {
    try {
      // Get counts
      const [departmentCount, doctorCount, patientCount, appointmentCount] = await Promise.all([
        supabase.from('departments').select('*', { count: 'exact', head: true }),
        supabase.from('doctors').select('*', { count: 'exact', head: true }),
        supabase.from('patients').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true })
      ])

      // Get financial data
      const { data: appointments } = await supabase
        .from('appointments')
        .select('cost, is_paid, status')

      const { data: bills } = await supabase
        .from('bills')
        .select('amount, is_paid')

      const { data: doctors } = await supabase
        .from('doctors')
        .select('salary')

      const { data: pharmacists } = await supabase
        .from('pharmacists')
        .select('salary')

      const { data: assistants } = await supabase
        .from('assistants')
        .select('salary')

      // Calculate financials
      const totalRevenue = (appointments?.reduce((sum, apt) => sum + (apt.is_paid ? apt.cost : 0), 0) || 0) +
                          (bills?.reduce((sum, bill) => sum + (bill.is_paid ? bill.amount : 0), 0) || 0)

      const totalExpenses = (doctors?.reduce((sum, doc) => sum + (doc.salary || 0), 0) || 0) +
                           (pharmacists?.reduce((sum, pharm) => sum + (pharm.salary || 0), 0) || 0) +
                           (assistants?.reduce((sum, asst) => sum + (asst.salary || 0), 0) || 0)

      const completedAppointments = appointments?.filter(apt => apt.status === 'completed').length || 0
      const pendingBills = bills?.filter(bill => !bill.is_paid).length || 0

      const reportData = {
        departmentCount: departmentCount.count || 0,
        doctorCount: doctorCount.count || 0,
        patientCount: patientCount.count || 0,
        totalRevenue,
        totalExpenses,
        netIncome: totalRevenue - totalExpenses,
        appointmentCount: appointmentCount.count || 0,
        completedAppointments,
        pendingBills
      }

      // Save report
      const { data: report, error } = await supabase
        .from('hospital_reports')
        .insert({
          report_type: 'Monthly Report',
          report_data: reportData,
          generated_by: founderId
        })
        .select()
        .single()

      if (error) throw error

      // Log the activity
      await this.logActivity(founderId, 'founder', 'CREATE', 'hospital_reports', report.id, 
        'Generated monthly report', reportData)

      return {
        id: report.id,
        reportType: report.report_type,
        reportData,
        generatedBy: report.generated_by,
        createdAt: report.created_at
      }
    } catch (error) {
      console.error('Error generating monthly report:', error)
      return null
    }
  }

  // Get financial transactions - mirrors founder.getTransactions() from Java
  static async getFinancialTransactions(): Promise<FinancialTransaction[]> {
    try {
      const { data: transactions, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      return transactions?.map(trans => ({
        id: trans.id,
        amount: trans.amount,
        transactionType: trans.transaction_type,
        description: trans.description,
        referenceId: trans.reference_id,
        createdAt: trans.created_at
      })) || []
    } catch (error) {
      console.error('Error fetching financial transactions:', error)
      return []
    }
  }

  // Add financial transaction - mirrors founder.addRevenue() and addExpense() from Java
  static async addFinancialTransaction(amount: number, type: string, description: string, referenceId?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .insert({
          amount,
          transaction_type: type,
          description,
          reference_id: referenceId
        })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error adding financial transaction:', error)
      return false
    }
  }

  // Get recent activity logs - for real-time database monitoring
  static async getRecentActivity(limit: number = 50): Promise<ActivityLog[]> {
    try {
      // This would be a custom view or function in a real implementation
      // For now, we'll simulate by checking recent changes across tables
      const activities: ActivityLog[] = []

      // Get recent user registrations
      const { data: recentUsers } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      recentUsers?.forEach(user => {
        activities.push({
          id: `user_${user.id}`,
          userId: user.id,
          userRole: user.role,
          userName: `${user.first_name} ${user.last_name}`,
          action: 'REGISTER',
          tableName: 'users',
          recordId: user.id,
          description: `New ${user.role} registered: ${user.first_name} ${user.last_name}`,
          timestamp: user.created_at
        })
      })

      // Get recent appointments
      const { data: recentAppointments } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patients(user:users(first_name, last_name)),
          doctor:doctors(user:users(first_name, last_name))
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      recentAppointments?.forEach(apt => {
        activities.push({
          id: `apt_${apt.id}`,
          userId: apt.patient_id,
          userRole: 'patient',
          userName: `${apt.patient?.user?.first_name} ${apt.patient?.user?.last_name}`,
          action: 'CREATE',
          tableName: 'appointments',
          recordId: apt.id,
          description: `Appointment booked with Dr. ${apt.doctor?.user?.first_name} ${apt.doctor?.user?.last_name}`,
          timestamp: apt.created_at,
          details: { date: apt.appointment_date, time: apt.appointment_time }
        })
      })

      // Get recent medical record updates
      const { data: recentMedicalRecords } = await supabase
        .from('medical_records')
        .select(`
          *,
          patient:patients(user:users(first_name, last_name)),
          doctor:doctors(user:users(first_name, last_name))
        `)
        .order('updated_at', { ascending: false })
        .limit(10)

      recentMedicalRecords?.forEach(record => {
        activities.push({
          id: `med_${record.id}`,
          userId: record.doctor_id,
          userRole: 'doctor',
          userName: `Dr. ${record.doctor?.user?.first_name} ${record.doctor?.user?.last_name}`,
          action: 'UPDATE',
          tableName: 'medical_records',
          recordId: record.id,
          description: `Updated medical record for ${record.patient?.user?.first_name} ${record.patient?.user?.last_name}`,
          timestamp: record.updated_at
        })
      })

      // Sort by timestamp and return limited results
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit)

    } catch (error) {
      console.error('Error fetching recent activity:', error)
      return []
    }
  }

  // Log activity - helper method for tracking database changes
  private static async logActivity(
    userId: string, 
    userRole: string, 
    action: string, 
    tableName: string, 
    recordId: string, 
    description: string, 
    details?: any
  ): Promise<void> {
    try {
      // Get user name
      const { data: user } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('id', userId)
        .single()

      // In a real implementation, this would go to an activity_logs table
      // For now, we'll just log to console and could store in a separate logging service
      console.log('Activity Log:', {
        userId,
        userRole,
        userName: user ? `${user.first_name} ${user.last_name}` : 'Unknown',
        action,
        tableName,
        recordId,
        description,
        details,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error logging activity:', error)
    }
  }

  // Get dashboard statistics - mirrors Java founder financial summary
  static async getDashboardStats(): Promise<{
    totalRevenue: number
    totalExpenses: number
    netIncome: number
    departmentCount: number
    doctorCount: number
    patientCount: number
    appointmentCount: number
    roomCount: number
    availableRooms: number
    pendingBills: number
    pendingBillsAmount: number
    doctorEarnings: number
    recentPayments: number
    todayRevenue: number
  }> {
    try {
      // Get counts
      const [departments, doctors, patients, appointments, rooms] = await Promise.all([
        supabase.from('departments').select('*', { count: 'exact', head: true }),
        supabase.from('doctors').select('*', { count: 'exact', head: true }),
        supabase.from('patients').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }),
        supabase.from('rooms').select('is_available')
      ])

      // Get comprehensive financial data
      const [appointmentRevenue, billRevenue, salaryExpenses, doctorEarnings, pendingBills, todayTransactions] = await Promise.all([
        supabase.from('appointments').select('cost, is_paid'),
        supabase.from('bills').select('amount, is_paid'),
        supabase.from('doctors').select('salary'),
        supabase.from('doctors').select('total_earnings'),
        supabase.from('bills').select('amount, is_paid').eq('is_paid', false),
        supabase.from('financial_transactions')
          .select('amount, transaction_type')
          .gte('created_at', new Date().toISOString().split('T')[0])
      ])

      // Calculate revenue
      const appointmentPaidRevenue = appointmentRevenue.data?.reduce((sum, apt) => sum + (apt.is_paid ? apt.cost : 0), 0) || 0
      const billPaidRevenue = billRevenue.data?.reduce((sum, bill) => sum + (bill.is_paid ? bill.amount : 0), 0) || 0
      const totalRevenue = appointmentPaidRevenue + billPaidRevenue

      // Calculate expenses (doctor salaries + other expenses)
      const doctorSalaries = salaryExpenses.data?.reduce((sum, doc) => sum + (doc.salary || 0), 0) || 0
      
      // Get other expenses from financial transactions
      const expenseTransactions = todayTransactions.data?.filter(t => t.transaction_type === 'Expense') || []
      const otherExpenses = expenseTransactions.reduce((sum, exp) => sum + exp.amount, 0)
      const totalExpenses = doctorSalaries + otherExpenses

      // Calculate pending bills
      const pendingBillsCount = pendingBills.data?.length || 0
      const pendingBillsAmount = pendingBills.data?.reduce((sum, bill) => sum + bill.amount, 0) || 0

      // Calculate total doctor earnings
      const totalDoctorEarnings = doctorEarnings.data?.reduce((sum, doc) => sum + (doc.total_earnings || 0), 0) || 0

      // Calculate today's revenue
      const todayRevenue = todayTransactions.data?.filter(t => t.transaction_type === 'Revenue')
        ?.reduce((sum, rev) => sum + rev.amount, 0) || 0

      // Count recent payments (today)
      const recentPayments = todayTransactions.data?.filter(t => t.transaction_type === 'Revenue')?.length || 0

      const availableRooms = rooms.data?.filter(room => room.is_available).length || 0

      return {
        totalRevenue,
        totalExpenses,
        netIncome: totalRevenue - totalExpenses,
        departmentCount: departments.count || 0,
        doctorCount: doctors.count || 0,
        patientCount: patients.count || 0,
        appointmentCount: appointments.count || 0,
        roomCount: rooms.data?.length || 0,
        availableRooms,
        pendingBills: pendingBillsCount,
        pendingBillsAmount,
        doctorEarnings: totalDoctorEarnings,
        recentPayments,
        todayRevenue
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return {
        totalRevenue: 0,
        totalExpenses: 0,
        netIncome: 0,
        departmentCount: 0,
        doctorCount: 0,
        patientCount: 0,
        appointmentCount: 0,
        roomCount: 0,
        availableRooms: 0,
        pendingBills: 0,
        pendingBillsAmount: 0,
        doctorEarnings: 0,
        recentPayments: 0,
        todayRevenue: 0
      }
    }
  }
} 