import { supabase } from './supabase'
import { User } from './auth'

// Doctor interface matching Java Doctor class
export interface Doctor extends User {
  department: string
  specialty: string
  officeNumber: string
  experience?: number
  isPrivate: boolean
  salary: number
  privatePracticeLocation?: string
  privateFee: number
}

// Appointment interface for doctor view
export interface DoctorAppointment {
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
    age: number
    gender: string
    phoneNumber: string
    hasInsurance: boolean
    insuranceProvider?: string
  }
}

// Patient interface for doctor's patient list
export interface DoctorPatient {
  id: string
  firstName: string
  lastName: string
  age: number
  gender: string
  phoneNumber: string
  hasInsurance: boolean
  insuranceProvider?: string
  balance: number
}

// Prescription interface matching Java Prescription class
export interface DoctorPrescription {
  id: string
  medication: string
  dosageType: string
  usage: string
  patientId: string
  doctorId: string
  issueDate: string
  notes?: string
  patient?: {
    firstName: string
    lastName: string
  }
}

// Medical Record interface matching Java MedicalRecord class
export interface DoctorMedicalRecord {
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
  lastUpdated: string
}

// Room interface matching Java Room class
export interface Room {
  id: string
  roomName: string
  roomType: string
  capacity: number
  isAvailable: boolean
  currentPatientId?: string
  hourlyRate: number
  equipment: string
  currentPatient?: {
    firstName: string
    lastName: string
  }
}

// Review interface for doctor's reviews
export interface DoctorReview {
  id: string
  patientId: string
  doctorId: string
  rating: number
  comment: string
  createdAt: string
  patient?: {
    firstName: string
    lastName: string
  }
}

// Doctor Service Class - mirrors Java Doctor class methods
export class DoctorService {
  
  // Get doctor's appointments - mirrors doctor.getAppointments() from Java
  static async getAppointments(doctorId: string): Promise<DoctorAppointment[]> {
    try {
      // First get appointments
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', doctorId)
        .order('appointment_date', { ascending: true })

      if (error) throw error

      if (!appointments || appointments.length === 0) {
        return []
      }

      // Get patient details separately
      const patientIds = [...new Set(appointments.map(apt => apt.patient_id))]
      const { data: patients } = await supabase
        .from('users')
        .select('id, first_name, last_name, age, gender, phone_number')
        .in('id', patientIds)

      const { data: patientDetails } = await supabase
        .from('patients')
        .select('id, has_insurance, insurance_provider')
        .in('id', patientIds)

      return appointments.map(apt => {
        const patient = patients?.find(p => p.id === apt.patient_id)
        const patientDetail = patientDetails?.find(p => p.id === apt.patient_id)
        
        return {
          id: apt.id,
          appointmentId: apt.id,
          patientId: apt.patient_id,
          doctorId: apt.doctor_id,
          appointmentDate: apt.appointment_date,
          appointmentTime: apt.appointment_time,
          status: apt.status,
          cost: apt.cost || 0,
          isPaid: apt.is_paid || false,
          notes: apt.notes,
          patient: patient ? {
            id: patient.id,
            firstName: patient.first_name || '',
            lastName: patient.last_name || '',
            age: patient.age || 0,
            gender: patient.gender || '',
            phoneNumber: patient.phone_number || '',
            hasInsurance: patientDetail?.has_insurance || false,
            insuranceProvider: patientDetail?.insurance_provider
          } : undefined
        }
      })
    } catch (error) {
      console.error('Error fetching doctor appointments:', error instanceof Error ? error.message : String(error))
      return []
    }
  }

  // Get doctor's patients - mirrors doctor.getPatients() from Java
  static async getPatients(doctorId: string): Promise<DoctorPatient[]> {
    try {
      // Get unique patient IDs from appointments
      const { data: appointments } = await supabase
        .from('appointments')
        .select('patient_id')
        .eq('doctor_id', doctorId)

      if (!appointments || appointments.length === 0) {
        return []
      }

      const patientIds = [...new Set(appointments.map(apt => apt.patient_id))]

      // Get patient user data
      const { data: patients, error: userError } = await supabase
        .from('users')
        .select('id, first_name, last_name, age, gender, phone_number')
        .in('id', patientIds)

      if (userError) throw userError

      // Get patient details
      const { data: patientDetails, error: detailError } = await supabase
        .from('patients')
        .select('id, has_insurance, insurance_provider, balance')
        .in('id', patientIds)

      if (detailError) throw detailError

      return patients?.map(patient => {
        const detail = patientDetails?.find(d => d.id === patient.id)
        return {
          id: patient.id,
          firstName: patient.first_name || '',
          lastName: patient.last_name || '',
          age: patient.age || 0,
          gender: patient.gender || '',
          phoneNumber: patient.phone_number || '',
          hasInsurance: detail?.has_insurance || false,
          insuranceProvider: detail?.insurance_provider,
          balance: detail?.balance || 0
        }
      }) || []
    } catch (error) {
      console.error('Error fetching doctor patients:', error instanceof Error ? error.message : String(error))
      return []
    }
  }

  // Write prescription - mirrors writePrescription() from Java main.java
  static async writePrescription(
    doctorId: string,
    patientId: string,
    medication: string,
    dosageType: string,
    usage: string,
    duration: string,
    notes?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('prescriptions')
        .insert({
          doctor_id: doctorId,
          patient_id: patientId,
          medication_name: medication,
          dosage: dosageType,
          frequency: usage,
          duration: duration,
          instructions: notes,
          is_filled: false,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Prescription insert error:', error)
        throw error
      }
      return true
    } catch (error) {
      console.error('Error writing prescription:', error)
      if (error && typeof error === 'object' && 'message' in error) {
        console.error('Error details:', error.message)
      }
      return false
    }
  }

  // Get patient medical record - mirrors updateMedicalRecords() from Java main.java
  static async getPatientMedicalRecord(patientId: string): Promise<DoctorMedicalRecord | null> {
    try {
      const { data: record, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', patientId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (!record) return null

      return {
        id: record.id,
        patientId: record.patient_id,
        bloodType: record.blood_type,
        height: record.height,
        weight: record.weight,
        diagnoses: record.diagnosis, // Note: database uses 'diagnosis' not 'diagnoses'
        procedures: record.treatment, // Note: database uses 'treatment' not 'procedures'
        medications: Array.isArray(record.medications) ? record.medications.join(', ') : record.medications,
        allergies: Array.isArray(record.allergies) ? record.allergies.join(', ') : record.allergies,
        immunizations: '', // Not in current schema
        labResults: '', // Not in current schema
        notes: record.notes,
        lastUpdated: record.updated_at || record.created_at
      }
    } catch (error) {
      console.error('Error fetching medical record:', error instanceof Error ? error.message : String(error))
      return null
    }
  }

  // Update patient medical record - mirrors updatePatientMedicalRecord() from Java main.java
  static async updatePatientMedicalRecord(
    patientId: string,
    updates: Partial<DoctorMedicalRecord>,
    doctorId?: string
  ): Promise<boolean> {
    try {
      // Check if record exists
      const { data: existing, error: checkError } = await supabase
        .from('medical_records')
        .select('id')
        .eq('patient_id', patientId)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing record:', checkError)
        throw checkError
      }

      const updateData = {
        blood_type: updates.bloodType,
        height: updates.height,
        weight: updates.weight,
        diagnosis: updates.diagnoses, // Note: database uses 'diagnosis' not 'diagnoses'
        treatment: updates.procedures, // Note: database uses 'treatment' not 'procedures'
        medications: updates.medications ? updates.medications.split(',').map(m => m.trim()).filter(m => m) : [],
        allergies: updates.allergies ? updates.allergies.split(',').map(a => a.trim()).filter(a => a) : [],
        notes: updates.notes,
        updated_at: new Date().toISOString()
      }

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('medical_records')
          .update(updateData)
          .eq('patient_id', patientId)

        if (error) {
          console.error('Medical record update error:', error)
          throw error
        }
      } else {
        // Create new record
        const { error } = await supabase
          .from('medical_records')
          .insert({
            patient_id: patientId,
            doctor_id: doctorId, // Required field for new records
            ...updateData,
            created_at: new Date().toISOString()
          })

        if (error) {
          console.error('Medical record insert error:', error)
          throw error
        }
      }

      return true
    } catch (error) {
      console.error('Error updating medical record:', error)
      if (error && typeof error === 'object' && 'message' in error) {
        console.error('Error details:', error.message)
      }
      return false
    }
  }

  // Update appointment status - mirrors manageDoctorAppointments() from Java main.java
  static async updateAppointmentStatus(appointmentId: string, status: string): Promise<boolean> {
    try {
      // First get the appointment details
      const { data: appointment, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single()

      if (fetchError) throw fetchError

      // Update appointment status
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status: status.toLowerCase() })
        .eq('id', appointmentId)

      if (updateError) throw updateError

      // If marking as completed, automatically create a bill (mirrors Java business logic)
      if (status.toLowerCase() === 'completed' && appointment) {
        // Check if bill already exists for this appointment
        const { data: existingBill } = await supabase
          .from('bills')
          .select('id')
          .eq('appointment_id', appointmentId)
          .single()

        if (!existingBill) {
          // Create bill for the completed appointment
          const { error: billError } = await supabase
            .from('bills')
            .insert({
              patient_id: appointment.patient_id,
              appointment_id: appointmentId,
              amount: appointment.cost || 250.0,
              description: `Medical consultation - ${new Date(appointment.appointment_date).toLocaleDateString()}`,
              is_paid: false,
              created_at: new Date().toISOString()
            })

          if (billError) {
            console.error('Error creating bill for completed appointment:', billError)
            // Don't fail the status update if bill creation fails
          }
        }
      }

      return true
    } catch (error) {
      console.error('Error updating appointment status:', error instanceof Error ? error.message : String(error))
      return false
    }
  }

  // Get available rooms - mirrors viewAvailableRooms() from Java main.java
  static async getAvailableRooms(): Promise<Room[]> {
    try {
      const { data: rooms, error } = await supabase
        .from('rooms')
        .select('*')
        .order('room_number', { ascending: true })

      if (error) throw error

      return rooms?.map(room => ({
        id: room.id,
        roomName: room.room_number || `Room ${room.id.slice(0, 8)}`,
        roomType: room.room_type,
        capacity: room.capacity,
        isAvailable: room.is_available,
        currentPatientId: undefined, // Will be implemented when room assignment is added to schema
        hourlyRate: room.hourly_rate,
        equipment: room.equipment,
        currentPatient: undefined // Will be implemented when room assignment is added to schema
      })) || []
    } catch (error) {
      console.error('Error fetching rooms:', error instanceof Error ? error.message : String(error))
      return []
    }
  }

  // Assign patient to room - mirrors assignPatientToRoom() from Java main.java
  static async assignPatientToRoom(patientId: string, roomId: string): Promise<boolean> {
    try {
      // For now, just mark the room as unavailable since the schema doesn't have current_patient_id
      // In a full implementation, we would add a room_assignments table
      const { error } = await supabase
        .from('rooms')
        .update({
          is_available: false
        })
        .eq('id', roomId)
        .eq('is_available', true) // Only update if room is available

      if (error) throw error
      
      // TODO: In a full implementation, insert into room_assignments table:
      // INSERT INTO room_assignments (room_id, patient_id, assigned_at, assigned_by) 
      // VALUES (roomId, patientId, NOW(), doctorId)
      
      return true
    } catch (error) {
      console.error('Error assigning patient to room:', error instanceof Error ? error.message : String(error))
      return false
    }
  }

  // Get doctor's prescriptions - for viewing written prescriptions
  static async getPrescriptions(doctorId: string): Promise<DoctorPrescription[]> {
    try {
      const { data: prescriptions, error } = await supabase
        .from('prescriptions')
        .select(`
          *,
          patient:patients(
            user:users(first_name, last_name)
          )
        `)
        .eq('doctor_id', doctorId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return prescriptions?.map(presc => ({
        id: presc.id,
        medication: presc.medication_name,
        dosageType: presc.dosage,
        usage: presc.frequency,
        patientId: presc.patient_id,
        doctorId: presc.doctor_id,
        issueDate: presc.created_at,
        notes: presc.instructions,
        patient: presc.patient ? {
          firstName: presc.patient.user?.first_name || '',
          lastName: presc.patient.user?.last_name || ''
        } : undefined
      })) || []
    } catch (error) {
      console.error('Error fetching prescriptions:', error instanceof Error ? error.message : String(error))
      return []
    }
  }

  // Calculate doctor's earnings (for private doctors) - mirrors viewEarnings() from Java
  static async calculateEarnings(doctorId: string): Promise<{ totalEarnings: number, paidAppointments: number, unpaidAppointments: number }> {
    try {
      // Get stored total earnings from doctors table (updated when bills are paid)
      const { data: doctor, error: doctorError } = await supabase
        .from('doctors')
        .select('total_earnings')
        .eq('id', doctorId)
        .single()

      if (doctorError) throw doctorError

      // Also get appointment stats for additional info
      const { data: appointments, error: appointmentError } = await supabase
        .from('appointments')
        .select('cost, is_paid')
        .eq('doctor_id', doctorId)

      if (appointmentError) throw appointmentError

      const paidAppointments = appointments?.filter(apt => apt.is_paid) || []
      const unpaidAppointments = appointments?.filter(apt => !apt.is_paid) || []
      
      // Use stored total_earnings (which gets updated when bills are paid)
      const totalEarnings = doctor?.total_earnings || 0

      return {
        totalEarnings,
        paidAppointments: paidAppointments.length,
        unpaidAppointments: unpaidAppointments.length
      }
    } catch (error) {
      console.error('Error calculating earnings:', error instanceof Error ? error.message : String(error))
      return { totalEarnings: 0, paidAppointments: 0, unpaidAppointments: 0 }
    }
  }

  // Update consultation fee (for private doctors) - mirrors setConsultationFee() from Java
  static async updateConsultationFee(doctorId: string, newFee: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('doctors')
        .update({ private_fee: newFee })
        .eq('id', doctorId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating consultation fee:', error instanceof Error ? error.message : String(error))
      return false
    }
  }

  // Get doctor's reviews - mirrors viewDoctorReviews() from Java
  static async getReviews(doctorId: string): Promise<DoctorReview[]> {
    try {
      // Get reviews for this doctor
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('doctor_id', doctorId)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (!reviews || reviews.length === 0) {
        return []
      }

      // Get patient details separately
      const patientIds = [...new Set(reviews.map(review => review.patient_id))]
      const { data: patients } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', patientIds)

      return reviews.map(review => {
        const patient = patients?.find(p => p.id === review.patient_id)
        
        return {
          id: review.id,
          patientId: review.patient_id,
          doctorId: review.doctor_id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.created_at,
          patient: patient ? {
            firstName: patient.first_name || '',
            lastName: patient.last_name || ''
          } : undefined
        }
      })
    } catch (error) {
      console.error('Error fetching doctor reviews:', error instanceof Error ? error.message : String(error))
      return []
    }
  }
} 