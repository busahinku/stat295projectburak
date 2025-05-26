import { supabase } from './supabase'
import { User } from './auth'

// Assistant interface matching Java Assistant class
export interface Assistant {
  id: string
  firstName: string
  lastName: string
  age: number
  gender: string
  phoneNumber: string
  email: string
  role: string
  supervisorId?: string
  experience: number
  duty: string
  departmentId?: string
  salary: number
  supervisor?: {
    id: string
    firstName: string
    lastName: string
    specialty: string
  } | null
  department?: {
    id: string
    name: string
    location: string
  } | null
}

// Doctor interface for call doctor functionality
export interface Doctor {
  id: string
  firstName: string
  lastName: string
  specialty: string
  departmentId?: string
  isPrivate: boolean
  officeNumber?: string
  department?: {
    name: string
    location: string
  }
}

// Assistant Service Class - mirrors Java Assistant class methods
export class AssistantService {
  
  // Get assistant profile - mirrors assistant.GeneralInfo() from Java
  static async getAssistantProfile(assistantId: string): Promise<Assistant | null> {
    try {
      // Get user data
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', assistantId)
        .single()

      if (userError) throw userError

      // Get assistant-specific data
      const { data: assistant, error: assistantError } = await supabase
        .from('assistants')
        .select('*')
        .eq('id', assistantId)
        .single()

      if (assistantError) throw assistantError

      // Get supervisor (doctor) details if exists
      let supervisor = null
      if (assistant.doctor_id) {
        const { data: supervisorUser } = await supabase
          .from('users')
          .select('id, first_name, last_name')
          .eq('id', assistant.doctor_id)
          .single()

        const { data: supervisorDoctor } = await supabase
          .from('doctors')
          .select('specialty')
          .eq('id', assistant.doctor_id)
          .single()

        if (supervisorUser && supervisorDoctor) {
          supervisor = {
            id: supervisorUser.id,
            firstName: supervisorUser.first_name || '',
            lastName: supervisorUser.last_name || '',
            specialty: supervisorDoctor.specialty || ''
          }
        }
      }

      // Get department details if exists
      let department = null
      if (assistant.department_id) {
        const { data: dept } = await supabase
          .from('departments')
          .select('id, name, location')
          .eq('id', assistant.department_id)
          .single()

        if (dept) {
          department = {
            id: dept.id,
            name: dept.name || '',
            location: dept.location || ''
          }
        }
      }

      return {
        id: user.id,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        age: user.age || 0,
        gender: user.gender || '',
        phoneNumber: user.phone_number || '',
        email: user.email || '',
        role: user.role,
        supervisorId: assistant.doctor_id,
        experience: assistant.experience_years || 0,
        duty: assistant.specialization || 'General Assistant',
        departmentId: assistant.department_id,
        salary: assistant.salary || 0,
        supervisor,
        department
      }
    } catch (error) {
      console.error('Error fetching assistant profile:', error)
      return null
    }
  }

  // Get all doctors for call doctor functionality - mirrors callDoctorByAssistant() from Java
  static async getAllDoctors(): Promise<Doctor[]> {
    try {
      // Get all users with doctor role
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'doctor')
        .order('first_name', { ascending: true })

      if (usersError) throw usersError

      if (!users || users.length === 0) {
        return []
      }

      // Get doctor-specific data
      const doctorIds = users.map(u => u.id)
      const { data: doctors, error: doctorsError } = await supabase
        .from('doctors')
        .select('*')
        .in('id', doctorIds)

      if (doctorsError) throw doctorsError

      // Get department data for doctors
      const departmentIds = doctors?.map(d => d.department_id).filter(id => id) || []
      const { data: departments } = await supabase
        .from('departments')
        .select('id, name, location')
        .in('id', departmentIds)

      return users.map(user => {
        const doctorData = doctors?.find(d => d.id === user.id)
        const department = departments?.find(d => d.id === doctorData?.department_id)

        return {
          id: user.id,
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          specialty: doctorData?.specialty || '',
          departmentId: doctorData?.department_id,
          isPrivate: doctorData?.is_private || false,
          officeNumber: doctorData?.office_number,
          department: department ? {
            name: department.name,
            location: department.location
          } : undefined
        }
      })
    } catch (error) {
      console.error('Error fetching doctors:', error)
      return []
    }
  }

  // Call doctor functionality - mirrors assistant.callDoctor() from Java
  static async callDoctor(assistantId: string, doctorId: string): Promise<boolean> {
    try {
      // Get assistant and doctor names for logging
      const { data: assistant } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('id', assistantId)
        .single()

      const { data: doctor } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('id', doctorId)
        .single()

      if (!assistant || !doctor) {
        throw new Error('Assistant or doctor not found')
      }

      // In a real system, this would trigger a notification or call system
      // For now, we'll log the action and could store it in a communications table
      console.log(`Assistant ${assistant.first_name} ${assistant.last_name} calling Dr. ${doctor.first_name} ${doctor.last_name}`)

      // You could add a communications/notifications table here to track calls
      // await supabase.from('communications').insert({
      //   from_user_id: assistantId,
      //   to_user_id: doctorId,
      //   type: 'call',
      //   message: `Assistant ${assistant.first_name} ${assistant.last_name} is calling you`,
      //   created_at: new Date().toISOString()
      // })

      return true
    } catch (error) {
      console.error('Error calling doctor:', error)
      return false
    }
  }

  // Update schedule functionality - mirrors assistant.updateSchedule() from Java
  static async updateSchedule(doctorId: string, schedule: string, assistantId: string): Promise<boolean> {
    try {
      // In a real system, this would update the doctor's schedule
      // For now, we'll simulate the functionality
      const { data: doctor } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('id', doctorId)
        .single()

      const { data: assistant } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('id', assistantId)
        .single()

      if (!doctor || !assistant) {
        throw new Error('Doctor or assistant not found')
      }

      console.log(`Schedule updated for Dr. ${doctor.first_name} ${doctor.last_name}: ${schedule}`)
      console.log(`Updated by Assistant: ${assistant.first_name} ${assistant.last_name}`)

      return true
    } catch (error) {
      console.error('Error updating schedule:', error)
      return false
    }
  }

  // Get dashboard statistics for assistant
  static async getDashboardStats(assistantId: string): Promise<{
    totalDoctors: number
    departmentName: string
    experienceYears: number
    supervisorName: string
  }> {
    try {
      // Get assistant details
      const assistant = await this.getAssistantProfile(assistantId)
      
      // Get total doctors count
      const { count: totalDoctors } = await supabase
        .from('doctors')
        .select('*', { count: 'exact', head: true })

      return {
        totalDoctors: totalDoctors || 0,
        departmentName: assistant?.department?.name || 'Not assigned',
        experienceYears: assistant?.experience || 0,
        supervisorName: assistant?.supervisor 
          ? `Dr. ${assistant.supervisor.firstName} ${assistant.supervisor.lastName}`
          : 'Not assigned'
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return {
        totalDoctors: 0,
        departmentName: 'Not assigned',
        experienceYears: 0,
        supervisorName: 'Not assigned'
      }
    }
  }
} 