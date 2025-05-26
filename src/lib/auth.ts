import { supabase } from './supabase'
import { Database } from './supabase'

export type User = Database['public']['Tables']['users']['Row']
export type UserRole = Database['public']['Enums']['user_role']

export interface AuthUser extends User {
  // Extended user data based on role
  doctorData?: Database['public']['Tables']['doctors']['Row']
  patientData?: Database['public']['Tables']['patients']['Row']
  pharmacistData?: Database['public']['Tables']['pharmacists']['Row']
  assistantData?: Database['public']['Tables']['assistants']['Row']
  founderData?: Database['public']['Tables']['founders']['Row']
}

export interface SignUpData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  dateOfBirth?: string
  role: 'patient' | 'doctor'
  // Doctor specific fields
  specialty?: string
  licenseNumber?: string
  experience?: string
  // Patient specific fields
  emergencyContact?: string
  allergies?: string
  bloodType?: string
}

export async function signIn(email: string, password: string): Promise<boolean> {
  try {
    // For demo purposes, we'll use a simple password check
    // In production, you'd use proper password hashing
    if (password !== 'password123') {
      return false
    }

    const { user, error } = await signInWithEmail(email)
    if (error || !user) {
      return false
    }

    setUserSession(user)
    return true
  } catch (error) {
    return false
  }
}

export async function signUp(userData: SignUpData): Promise<boolean> {
  try {
    // Generate a new user ID
    const userId = crypto.randomUUID()

    // Insert into users table
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
        phone: userData.phone || null,
        date_of_birth: userData.dateOfBirth || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (userError) {
      console.error('User creation error:', userError)
      return false
    }

    // Insert role-specific data
    if (userData.role === 'doctor') {
      const { error: doctorError } = await supabase
        .from('doctors')
        .insert({
          id: userId,
          specialty: userData.specialty || '',
          license_number: userData.licenseNumber || '',
          years_of_experience: userData.experience ? parseInt(userData.experience) : 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (doctorError) {
        console.error('Doctor creation error:', doctorError)
        return false
      }
    } else if (userData.role === 'patient') {
      const { error: patientError } = await supabase
        .from('patients')
        .insert({
          id: userId,
          blood_type: userData.bloodType || null,
          allergies: userData.allergies ? [userData.allergies] : [],
          emergency_contact: userData.emergencyContact || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (patientError) {
        console.error('Patient creation error:', patientError)
        return false
      }
    }

    // Sign in the newly created user
    return await signIn(userData.email, userData.password)
  } catch (error) {
    console.error('Sign up error:', error)
    return false
  }
}

export async function signInWithEmail(email: string): Promise<{ user: AuthUser | null; error: string | null }> {
  try {
    // First, get the user from our custom users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError || !userData) {
      return { user: null, error: 'User not found' }
    }

    // Get role-specific data
    let roleData = {}
    switch (userData.role) {
      case 'doctor':
        const { data: doctorData } = await supabase
          .from('doctors')
          .select('*')
          .eq('id', userData.id)
          .single()
        roleData = { doctorData }
        break
      case 'patient':
        const { data: patientData } = await supabase
          .from('patients')
          .select('*')
          .eq('id', userData.id)
          .single()
        roleData = { patientData }
        break
      case 'pharmacist':
        const { data: pharmacistData } = await supabase
          .from('pharmacists')
          .select('*')
          .eq('id', userData.id)
          .single()
        roleData = { pharmacistData }
        break
      case 'assistant':
        const { data: assistantData } = await supabase
          .from('assistants')
          .select('*')
          .eq('id', userData.id)
          .single()
        roleData = { assistantData }
        break
      case 'founder':
        const { data: founderData } = await supabase
          .from('founders')
          .select('*')
          .eq('id', userData.id)
          .single()
        roleData = { founderData }
        break
    }

    const user: AuthUser = { ...userData, ...roleData }
    return { user, error: null }
  } catch (error) {
    return { user: null, error: 'Authentication failed' }
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    // For now, we'll use localStorage to simulate session management
    const userSession = localStorage.getItem('hospital_user_session')
    if (!userSession) return null

    const userData = JSON.parse(userSession)
    return userData
  } catch (error) {
    return null
  }
}

export function signOut(): void {
  localStorage.removeItem('hospital_user_session')
}

export function setUserSession(user: AuthUser): void {
  localStorage.setItem('hospital_user_session', JSON.stringify(user))
}

export function getUserRole(): UserRole | null {
  try {
    const userSession = localStorage.getItem('hospital_user_session')
    if (!userSession) return null

    const userData = JSON.parse(userSession)
    return userData.role
  } catch (error) {
    return null
  }
}

export function isAuthorized(allowedRoles: UserRole[]): boolean {
  const userRole = getUserRole()
  return userRole ? allowedRoles.includes(userRole) : false
} 