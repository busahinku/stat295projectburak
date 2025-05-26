import { createClient } from '@supabase/supabase-js'

// Hardcoded credentials to bypass env issues
// const supabaseUrl = 'https://ydowlrugvkgdyjoslojn.supabase.co'
// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlkb3dscnVndmtnZHlqb3Nsb2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTI1NzUsImV4cCI6MjA2Mzc2ODU3NX0.Nm1CnvAA77ATmiOWYgK2NfwVlvSG5flKrBG9t1fQoes'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Basic check to ensure variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing from environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          age: number
          gender: 'M' | 'F'
          phone_number: string
          role: 'founder' | 'doctor' | 'patient' | 'pharmacist' | 'assistant'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          age: number
          gender: 'M' | 'F'
          phone_number: string
          role: 'founder' | 'doctor' | 'patient' | 'pharmacist' | 'assistant'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          age?: number
          gender?: 'M' | 'F'
          phone_number?: string
          role?: 'founder' | 'doctor' | 'patient' | 'pharmacist' | 'assistant'
          created_at?: string
          updated_at?: string
        }
      }
      departments: {
        Row: {
          id: string
          name: string
          location: string
          head_doctor_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          head_doctor_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          head_doctor_id?: string | null
          created_at?: string
        }
      }
      doctors: {
        Row: {
          id: string
          department_id: string | null
          specialty: string
          office_number: string | null
          experience_years: number
          is_private: boolean
          salary: number | null
          private_fee: number
          private_practice_location: string | null
          schedule_start_time: string
          schedule_end_time: string
        }
        Insert: {
          id: string
          department_id?: string | null
          specialty: string
          office_number?: string | null
          experience_years?: number
          is_private?: boolean
          salary?: number | null
          private_fee?: number
          private_practice_location?: string | null
          schedule_start_time?: string
          schedule_end_time?: string
        }
        Update: {
          id?: string
          department_id?: string | null
          specialty?: string
          office_number?: string | null
          experience_years?: number
          is_private?: boolean
          salary?: number | null
          private_fee?: number
          private_practice_location?: string | null
          schedule_start_time?: string
          schedule_end_time?: string
        }
      }
      patients: {
        Row: {
          id: string
          has_insurance: boolean
          insurance_provider: string | null
          balance: number
        }
        Insert: {
          id: string
          has_insurance?: boolean
          insurance_provider?: string | null
          balance?: number
        }
        Update: {
          id?: string
          has_insurance?: boolean
          insurance_provider?: string | null
          balance?: number
        }
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          appointment_date: string
          appointment_time: string
          duration_minutes: number
          status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          cost: number
          is_paid: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          appointment_date: string
          appointment_time: string
          duration_minutes?: number
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          cost?: number
          is_paid?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          appointment_date?: string
          appointment_time?: string
          duration_minutes?: number
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          cost?: number
          is_paid?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      medical_records: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          diagnosis: string | null
          symptoms: string | null
          treatment: string | null
          medications: string[] | null
          allergies: string[] | null
          blood_type: string | null
          height: number | null
          weight: number | null
          blood_pressure: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          diagnosis?: string | null
          symptoms?: string | null
          treatment?: string | null
          medications?: string[] | null
          allergies?: string[] | null
          blood_type?: string | null
          height?: number | null
          weight?: number | null
          blood_pressure?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          diagnosis?: string | null
          symptoms?: string | null
          treatment?: string | null
          medications?: string[] | null
          allergies?: string[] | null
          blood_type?: string | null
          height?: number | null
          weight?: number | null
          blood_pressure?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      prescriptions: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          medication_name: string
          dosage: string
          frequency: string
          duration: string
          instructions: string | null
          is_filled: boolean
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          medication_name: string
          dosage: string
          frequency: string
          duration: string
          instructions?: string | null
          is_filled?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          medication_name?: string
          dosage?: string
          frequency?: string
          duration?: string
          instructions?: string | null
          is_filled?: boolean
          created_at?: string
        }
      }
      inventory: {
        Row: {
          id: string
          item_name: string
          category: string
          quantity: number
          minimum_stock: number
          unit_price: number
          supplier: string | null
          location: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          item_name: string
          category: string
          quantity: number
          minimum_stock: number
          unit_price: number
          supplier?: string | null
          location: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          item_name?: string
          category?: string
          quantity?: number
          minimum_stock?: number
          unit_price?: number
          supplier?: string | null
          location?: string
          created_at?: string
          updated_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          room_number: string
          room_type: string
          capacity: number
          hourly_rate: number
          equipment: string | null
          is_available: boolean
          created_at: string
        }
        Insert: {
          id?: string
          room_number: string
          room_type: string
          capacity: number
          hourly_rate: number
          equipment?: string | null
          is_available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          room_number?: string
          room_type?: string
          capacity?: number
          hourly_rate?: number
          equipment?: string | null
          is_available?: boolean
          created_at?: string
        }
      }
      bills: {
        Row: {
          id: string
          patient_id: string
          appointment_id: string | null
          amount: number
          description: string | null
          is_paid: boolean
          payment_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          appointment_id?: string | null
          amount: number
          description?: string | null
          is_paid?: boolean
          payment_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          appointment_id?: string | null
          amount?: number
          description?: string | null
          is_paid?: boolean
          payment_date?: string | null
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      pharmacists: {
        Row: {
          id: string
          pharmacy_location: string
          salary: number | null
          working_hours: string | null
        }
        Insert: {
          id: string
          pharmacy_location: string
          salary?: number | null
          working_hours?: string | null
        }
        Update: {
          id?: string
          pharmacy_location?: string
          salary?: number | null
          working_hours?: string | null
        }
      }
      assistants: {
        Row: {
          id: string
          doctor_id: string | null
          department_id: string | null
          experience_years: number
          salary: number | null
          specialization: string | null
        }
        Insert: {
          id: string
          doctor_id?: string | null
          department_id?: string | null
          experience_years?: number
          salary?: number | null
          specialization?: string | null
        }
        Update: {
          id?: string
          doctor_id?: string | null
          department_id?: string | null
          experience_years?: number
          salary?: number | null
          specialization?: string | null
        }
      }
      founders: {
        Row: {
          id: string
          salary: number | null
        }
        Insert: {
          id: string
          salary?: number | null
        }
        Update: {
          id?: string
          salary?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'founder' | 'doctor' | 'patient' | 'pharmacist' | 'assistant'
      appointment_status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
      gender_type: 'M' | 'F'
    }
  }
} 