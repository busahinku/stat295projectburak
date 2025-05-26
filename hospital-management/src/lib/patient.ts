import { supabase } from './supabase'
import { User } from './auth'

// Patient interface matching Java Patient class
export interface Patient extends User {
  hasInsurance: boolean
  insuranceProvider?: string
  balance: number
}

// Appointment interface matching Java Appointment class
export interface Appointment {
  id: string
  appointmentId: string
  patientId: string
  doctorId: string
  appointmentDate: string
  appointmentTime: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  cost: number
  isPaid: boolean
  notes?: string
  patient?: {
    id: string
    firstName: string
    lastName: string
  }
  doctor?: {
    id: string
    firstName: string
    lastName: string
    specialty: string
    department: string
  }
}

// Prescription interface matching Java Prescription class
export interface Prescription {
  id: string
  medication: string
  dosageType: string
  usage: string
  patientId: string
  doctorId: string
  issueDate: string
  notes?: string
  doctor?: {
    id: string
    firstName: string
    lastName: string
  }
}

// Medical Record interface matching Java MedicalRecord class
export interface MedicalRecord {
  id: string
  patientId: string
  bloodType?: string
  height?: number
  weight?: number
  diagnoses?: string
  procedures?: string
  medications?: string
  allergies?: string
  immunizations?: string
  labResults?: string
  notes?: string
}

// Bill interface matching Java Bill class
export interface Bill {
  id: string
  patientId: string
  appointmentId?: string
  amount: number
  isPaid: boolean
  description: string
  dueDate: string
  paidDate?: string
}

// Review interface matching Java Review class
export interface Review {
  id: string
  patientId: string
  doctorId: string
  rating: number
  comment: string
  reviewDate: string
  patient?: {
    firstName: string
    lastName: string
  }
}

// Patient Service Class - mirrors Java Patient class methods
export class PatientService {
  
  // Get patient appointments - mirrors patient.getAppointments() from Java
  static async getAppointments(patientId: string): Promise<Appointment[]> {
    try {
      // First get appointments
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('appointment_date', { ascending: true })

      if (error) throw error

      if (!appointments || appointments.length === 0) {
        return []
      }

      // Get doctor details separately
      const doctorIds = [...new Set(appointments.map(apt => apt.doctor_id))]
      const { data: doctors } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', doctorIds)

      const { data: doctorDetails } = await supabase
        .from('doctors')
        .select('id, specialty, department_id')
        .in('id', doctorIds)

          return appointments.map(apt => {
      const doctor = doctors?.find(d => d.id === apt.doctor_id)
      const doctorDetail = doctorDetails?.find(d => d.id === apt.doctor_id)
      
      // Check if appointment is in the past and auto-update status
      const appointmentDateTime = new Date(`${apt.appointment_date}T${apt.appointment_time}`)
      const now = new Date()
      let status = apt.status
      
      // If appointment is in the past and still scheduled, mark as completed
      if (appointmentDateTime < now && status === 'scheduled') {
        status = 'completed'
      }
      
      return {
        id: apt.id,
        appointmentId: apt.id,
        patientId: apt.patient_id,
        doctorId: apt.doctor_id,
        appointmentDate: apt.appointment_date,
        appointmentTime: apt.appointment_time,
        status: status,
        cost: apt.cost || 0,
        isPaid: apt.is_paid || false,
        notes: apt.notes,
        doctor: doctor ? {
          id: doctor.id,
          firstName: doctor.first_name || '',
          lastName: doctor.last_name || '',
          specialty: doctorDetail?.specialty || '',
          department: doctorDetail?.department_id || ''
        } : undefined
      }
    })
    } catch (error) {
      console.error('Error fetching patient appointments:', error instanceof Error ? error.message : String(error))
      return []
    }
  }

  // Get patient prescriptions - mirrors patient.getPrescriptions() from Java
  static async getPrescriptions(patientId: string): Promise<Prescription[]> {
    try {
      // First get prescriptions
      const { data: prescriptions, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error in getPrescriptions:', error)
        throw error
      }

      if (!prescriptions || prescriptions.length === 0) {
        return []
      }

      // Get doctor details separately
      const doctorIds = [...new Set(prescriptions.map(presc => presc.doctor_id))]
      const { data: doctors } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', doctorIds)

      return prescriptions.map(presc => {
        const doctor = doctors?.find(d => d.id === presc.doctor_id)
        
        return {
          id: presc.id,
          medication: presc.medication_name,
          dosageType: presc.dosage,
          usage: presc.frequency,
          patientId: presc.patient_id,
          doctorId: presc.doctor_id,
          issueDate: presc.created_at,
          notes: presc.instructions,
          doctor: doctor ? {
            id: doctor.id,
            firstName: doctor.first_name || '',
            lastName: doctor.last_name || ''
          } : undefined
        }
      })
    } catch (error) {
      console.error('Error fetching patient prescriptions:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return []
    }
  }

  // Get patient medical record - mirrors patient.getMedicalRecord() from Java
  static async getMedicalRecord(patientId: string): Promise<MedicalRecord | null> {
    try {
      const { data: records, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', patientId)
        .order('updated_at', { ascending: false })
        .limit(1)

      if (error) throw error

      if (!records || records.length === 0) return null
      
      const record = records[0] // Get the most recent record

      return {
        id: record.id,
        patientId: record.patient_id,
        bloodType: record.blood_type,
        height: record.height,
        weight: record.weight,
        diagnoses: record.diagnosis, // Fixed: database uses 'diagnosis' not 'diagnoses'
        procedures: record.treatment, // Fixed: database uses 'treatment' not 'procedures'
        medications: Array.isArray(record.medications) ? record.medications.join(', ') : record.medications,
        allergies: Array.isArray(record.allergies) ? record.allergies.join(', ') : record.allergies,
        immunizations: '', // Not in current schema
        labResults: '', // Not in current schema
        notes: record.notes
      }
    } catch (error) {
      console.error('Error fetching medical record:', error instanceof Error ? error.message : String(error))
      return null
    }
  }

  // Get patient bills - mirrors patient.getBills() from Java
  static async getBills(patientId: string): Promise<Bill[]> {
    try {
      const { data: bills, error } = await supabase
        .from('bills')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Supabase error in getBills:', error)
        throw error
      }

      return bills?.map(bill => ({
        id: bill.id,
        patientId: bill.patient_id,
        appointmentId: bill.appointment_id,
        amount: bill.amount,
        isPaid: bill.is_paid,
        description: bill.description,
        dueDate: bill.created_at, // Use created_at as due date since due_date doesn't exist
        paidDate: bill.payment_date
      })) || []
    } catch (error) {
      console.error('Error fetching patient bills:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return []
    }
  }

  // Add appointment - mirrors patient.addAppointment() from Java
  static async addAppointment(patientId: string, doctorId: string, appointmentDate: string, appointmentTime: string): Promise<Appointment | null> {
    try {
      const { data: appointment, error } = await supabase
        .from('appointments')
        .insert({
          patient_id: patientId,
          doctor_id: doctorId,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          duration_minutes: 30, // Default duration
          status: 'scheduled',
          cost: 250.0, // Default cost like Java
          is_paid: false
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: appointment.id,
        appointmentId: appointment.id, // Use the database ID as appointmentId
        patientId: appointment.patient_id,
        doctorId: appointment.doctor_id,
        appointmentDate: appointment.appointment_date,
        appointmentTime: appointment.appointment_time,
        status: appointment.status,
        cost: appointment.cost,
        isPaid: appointment.is_paid,
        notes: appointment.notes
      }
    } catch (error) {
      console.error('Error creating appointment:', error instanceof Error ? error.message : String(error))
      return null
    }
  }

  // Get available doctors - mirrors the doctor listing from Java main.java
  static async getAvailableDoctors(): Promise<any[]> {
    try {
      // First get all users with role 'doctor'
      const { data: doctorUsers, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'doctor')

      if (userError) {
        console.error('Error fetching doctor users:', userError.message || userError)
        return []
      }

      if (!doctorUsers || doctorUsers.length === 0) {
        console.log('No doctor users found')
        return []
      }

      // Then get doctor details for each user
      const doctorIds = doctorUsers.map(user => user.id)
      const { data: doctorDetails, error: doctorError } = await supabase
        .from('doctors')
        .select('*')
        .in('id', doctorIds)

      if (doctorError) {
        console.error('Error fetching doctor details:', doctorError.message || doctorError)
        // If doctors table fails, return basic info from users table
        return doctorUsers.map(user => ({
          id: user.id,
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          fullName: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          specialty: 'General Medicine',
          department: 'General',
          officeNumber: 'TBD',
          isPrivate: false,
          privateFee: 250.0
        }))
      }

      // Combine user and doctor data
      return doctorUsers.map(user => {
        const doctorDetail = doctorDetails?.find(d => d.id === user.id)
        return {
          id: user.id,
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          fullName: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          specialty: doctorDetail?.specialty || 'General Medicine',
          department: doctorDetail?.department || 'General',
          officeNumber: doctorDetail?.office_number || 'TBD',
          isPrivate: doctorDetail?.is_private || false,
          privateFee: doctorDetail?.private_fee || 250.0
        }
      })
    } catch (error) {
      console.error('Error fetching doctors:', error instanceof Error ? error.message : String(error))
      return []
    }
  }

  // Write review - mirrors writeReview() from Java main.java
  static async writeReview(patientId: string, doctorId: string, rating: number, comment: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          patient_id: patientId,
          doctor_id: doctorId,
          rating,
          comment,
          created_at: new Date().toISOString()
        })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error writing review:', error instanceof Error ? error.message : String(error))
      return false
    }
  }

  // Get all reviews - mirrors seeReviews() from Java main.java
  static async getAllReviews(): Promise<Review[]> {
    try {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select(`
          *,
          patient:patients(
            user:users(first_name, last_name)
          ),
          doctor:doctors(
            user:users(first_name, last_name),
            specialty
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      return reviews?.map(review => ({
        id: review.id,
        patientId: review.patient_id,
        doctorId: review.doctor_id,
        rating: review.rating,
        comment: review.comment,
        reviewDate: review.created_at,
        patient: review.patient ? {
          firstName: review.patient.user?.first_name || '',
          lastName: review.patient.user?.last_name || ''
        } : undefined
      })) || []
    } catch (error) {
      console.error('Error fetching reviews:', error instanceof Error ? error.message : String(error))
      return []
    }
  }

  // Get patient balance - mirrors patient.getBalance() from Java
  static async getBalance(patientId: string): Promise<number> {
    try {
      const { data: patient, error } = await supabase
        .from('patients')
        .select('balance')
        .eq('id', patientId)
        .single()

      if (error) throw error
      return patient?.balance || 0.0
    } catch (error) {
      console.error('Error fetching patient balance:', error instanceof Error ? error.message : String(error))
      return 0.0
    }
  }

  // Update patient balance - mirrors patient.setBalance() from Java
  static async updateBalance(patientId: string, newBalance: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ balance: newBalance })
        .eq('id', patientId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating patient balance:', error instanceof Error ? error.message : String(error))
      return false
    }
  }

  // Cancel appointment - mirrors patient.cancelAppointment() from Java
  static async cancelAppointment(appointmentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error cancelling appointment:', error instanceof Error ? error.message : String(error))
      return false
    }
  }

  // Pay bill - mirrors makePayment() from Java Bill class
  static async payBill(billId: string): Promise<boolean> {
    try {
      // First get the bill details including appointment info
      const { data: bill, error: billError } = await supabase
        .from('bills')
        .select(`
          *,
          appointment:appointments(
            doctor_id,
            cost,
            patient_id
          )
        `)
        .eq('id', billId)
        .single()

      if (billError) throw billError

      // Update bill to paid
      const { error: updateError } = await supabase
        .from('bills')
        .update({ 
          is_paid: true,
          payment_date: new Date().toISOString()
        })
        .eq('id', billId)

      if (updateError) throw updateError

      // If the bill is related to an appointment, mark the appointment as paid
      if (bill.appointment_id) {
        const { error: appointmentError } = await supabase
          .from('appointments')
          .update({ is_paid: true })
          .eq('id', bill.appointment_id)

        if (appointmentError) {
          console.error('Error updating appointment payment status:', appointmentError)
        }
      }

      // Add financial transaction for tracking (mirrors founder financial system)
      const { error: transactionError } = await supabase
        .from('financial_transactions')
        .insert({
          amount: bill.amount,
          transaction_type: 'Revenue',
          description: `Payment received - ${bill.description}`,
          reference_id: billId
        })

      if (transactionError) {
        console.error('Error creating financial transaction:', transactionError)
      }

      // Update doctor earnings if this is an appointment-related payment
      if (bill.appointment && bill.appointment.doctor_id) {
        // Get current doctor earnings
        const { data: doctor, error: doctorError } = await supabase
          .from('doctors')
          .select('total_earnings')
          .eq('id', bill.appointment.doctor_id)
          .single()

        if (!doctorError && doctor) {
          const newEarnings = (doctor.total_earnings || 0) + bill.amount

          // Update doctor's total earnings
          const { error: earningsError } = await supabase
            .from('doctors')
            .update({ total_earnings: newEarnings })
            .eq('id', bill.appointment.doctor_id)

          if (earningsError) {
            console.error('Error updating doctor earnings:', earningsError)
          }
        }
      }

      return true
    } catch (error) {
      console.error('Error paying bill:', error instanceof Error ? error.message : String(error))
      return false
    }
  }

  // Pay appointment - mirrors markAppointmentPaid() from Java Main.java
  static async payAppointment(appointmentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ is_paid: true })
        .eq('id', appointmentId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error paying appointment:', error instanceof Error ? error.message : String(error))
      return false
    }
  }
} 