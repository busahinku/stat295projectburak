import { supabase } from './supabase'

// Custom User interface matching Java object structure
export interface User {
  id: string
  firstName: string
  lastName: string
  age: number
  gender: 'M' | 'F'
  phoneNumber: string
  username: string
  password: string
  role: 'founder' | 'doctor' | 'patient' | 'pharmacist' | 'assistant'
  // Role-specific fields
  hasInsurance?: boolean
  insuranceProvider?: string
  balance?: number
  department?: string
  specialty?: string
  officeNumber?: string
  isPrivate?: boolean
  salary?: number
  privatePracticeLocation?: string
  privateFee?: number
  experience?: number
  location?: string
  workSchedule?: string
  supervisor?: string
  duty?: string
}

// Generate IDs - using crypto.randomUUID() for database compatibility
// Note: For Java integration, you might want to store the Java-style IDs separately
export function generatePatientId(): string {
  // Generate a proper UUID for database compatibility
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function generateDoctorId(): string {
  // Generate a proper UUID for database compatibility
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function generateAssistantId(): string {
  // Generate a proper UUID for database compatibility
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Helper functions to generate Java-style IDs (for display or Java integration)
export function generateJavaPatientId(): string {
  const counter = Math.floor(Math.random() * 9999) + 1
  return "P" + String(counter).padStart(4, '0')
}

export function generateJavaDoctorId(): string {
  const counter = Math.floor(Math.random() * 999) + 1
  return "D" + String(counter).padStart(3, '0')
}

export async function signIn(username: string, password: string): Promise<User | null> {
  try {
    // Since the database uses email field, we'll treat username as email for now
    // First, get user from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', username)
      .single()

    if (userError || !userData) {
      console.error('User not found:', userError)
      return null
    }

    // For demo purposes, we'll skip password validation since we don't have it in users table
    // In production, you'd add a password field to users table and hash passwords

    // Get role-specific data
    let roleData: any = {}
    
    switch (userData.role) {
      case 'patient':
        const { data: patientData } = await supabase
          .from('patients')
          .select('*')
          .eq('id', userData.id)
          .single()
        roleData = patientData || {}
        break
        
      case 'doctor':
        const { data: doctorData } = await supabase
          .from('doctors')
          .select('*')
          .eq('id', userData.id)
          .single()
        roleData = doctorData || {}
        break
        
      case 'pharmacist':
        const { data: pharmacistData } = await supabase
          .from('pharmacists')
          .select('*')
          .eq('id', userData.id)
          .single()
        roleData = pharmacistData || {}
        break
        
      case 'assistant':
        const { data: assistantData } = await supabase
          .from('assistants')
          .select('*')
          .eq('id', userData.id)
          .single()
        roleData = assistantData || {}
        break
        
      case 'founder':
        const { data: founderData } = await supabase
          .from('founders')
          .select('*')
          .eq('id', userData.id)
          .single()
        roleData = founderData || {}
        break
    }

    // Map database fields to User interface
    const user: User = {
      id: userData.id,
      firstName: userData.first_name,
      lastName: userData.last_name,
      age: userData.age,
      gender: userData.gender,
      phoneNumber: userData.phone_number,
      username: userData.email, // Using email as username
      password: password, // Store the provided password
      role: userData.role,
      // Role-specific fields from roleData
      hasInsurance: roleData.has_insurance,
      insuranceProvider: roleData.insurance_provider,
      balance: roleData.balance,
      department: roleData.department_id, // Note: this might need department name lookup
      specialty: roleData.specialty,
      officeNumber: roleData.office_number,
      isPrivate: roleData.is_private,
      salary: roleData.salary,
      privatePracticeLocation: roleData.private_practice_location,
      privateFee: roleData.private_fee,
      experience: roleData.experience_years,
      location: roleData.pharmacy_location,
      workSchedule: roleData.working_hours,
      supervisor: roleData.doctor_id, // Note: this might need doctor name lookup
      duty: roleData.specialization
    }



    // Store user in localStorage
    localStorage.setItem('user', JSON.stringify(user))
    return user

  } catch (error) {
    console.error('Sign in error:', error)
    return null
  }
}

export async function signUp(userData: {
  firstName: string
  lastName: string
  age: number
  gender: 'M' | 'F'
  phoneNumber: string
  username: string
  password: string
  role: 'patient' | 'doctor'
  // Patient-specific fields (matching Patient constructor)
  hasInsurance?: boolean
  insuranceProvider?: string
  // Doctor-specific fields (matching Doctor constructor)
  department?: string
  specialty?: string
  officeNumber?: string
  isPrivate?: boolean
  salary?: number
}): Promise<User | null> {
  try {
    let id: string
    
    if (userData.role === 'patient') {
      id = generatePatientId()
    } else if (userData.role === 'doctor') {
      id = generateDoctorId()
    } else {
      throw new Error('Invalid role')
    }

    // First, insert into users table
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        id,
        email: userData.username, // Using username as email
        first_name: userData.firstName,
        last_name: userData.lastName,
        age: userData.age,
        gender: userData.gender,
        phone_number: userData.phoneNumber,
        role: userData.role
      })
      .select()
      .single()

    if (userError) {
      console.error('User creation error:', userError)
      console.error('User creation error details:', JSON.stringify(userError, null, 2))
      return null
    }

    // Then insert role-specific data
    if (userData.role === 'patient') {
      const { error: patientError } = await supabase
        .from('patients')
        .insert({
          id,
          has_insurance: userData.hasInsurance || false,
          insurance_provider: userData.insuranceProvider || null,
          balance: 0.0
        })

      if (patientError) {
        console.error('Patient creation error:', patientError)
        console.error('Patient creation error details:', JSON.stringify(patientError, null, 2))
        // Clean up user record
        await supabase.from('users').delete().eq('id', id)
        return null
      }
    } else if (userData.role === 'doctor') {
      const { error: doctorError } = await supabase
        .from('doctors')
        .insert({
          id,
          specialty: userData.specialty || 'General Medicine',
          office_number: userData.officeNumber || 'TBD',
          experience_years: 0,
          is_private: userData.isPrivate || false,
          salary: userData.isPrivate ? null : (userData.salary || 0.0),
          private_fee: userData.isPrivate ? 250.0 : null,
          private_practice_location: userData.isPrivate ? 'Private Clinic' : null
        })

      if (doctorError) {
        console.error('Doctor creation error:', doctorError)
        console.error('Doctor creation error details:', JSON.stringify(doctorError, null, 2))
        // Clean up user record
        await supabase.from('users').delete().eq('id', id)
        return null
      }
    }

    // Create User object matching our interface
    const user: User = {
      id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      age: userData.age,
      gender: userData.gender,
      phoneNumber: userData.phoneNumber,
      username: userData.username,
      password: userData.password,
      role: userData.role,
      hasInsurance: userData.hasInsurance,
      insuranceProvider: userData.insuranceProvider,
      balance: userData.role === 'patient' ? 0.0 : undefined,
      specialty: userData.specialty,
      officeNumber: userData.officeNumber,
      isPrivate: userData.isPrivate,
      salary: userData.salary,
      privatePracticeLocation: userData.isPrivate ? 'Private Clinic' : undefined,
      privateFee: userData.isPrivate ? 250.0 : undefined,
      experience: 0
    }

    // Store user in localStorage
    localStorage.setItem('user', JSON.stringify(user))
    return user

  } catch (error) {
    console.error('Sign up error:', error)
    return null
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  
  try {
    const user = JSON.parse(userStr)
    
    // Validate that the user has the required fields
    if (!user.firstName || !user.lastName) {
      // Clear invalid data
      localStorage.removeItem('user')
      return null
    }
    
    return user
  } catch (error) {
    localStorage.removeItem('user')
    return null
  }
}

export function signOut(): void {
  localStorage.removeItem('user')
}

export function getUserRole(): string | null {
  const user = getCurrentUser()
  return user ? user.role : null
}

export function isAuthorized(allowedRoles: string[]): boolean {
  const userRole = getUserRole()
  return userRole ? allowedRoles.includes(userRole) : false
} 