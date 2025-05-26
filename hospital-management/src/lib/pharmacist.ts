import { supabase } from './supabase'
import { User } from './auth'

// Pharmacist interface matching Java Pharmacist class
export interface Pharmacist {
  id: string
  firstName: string
  lastName: string
  age: number
  gender: string
  phoneNumber: string
  email: string
  role: string
  location: string
  salary: number
  workSchedule: string
  medications: string[]
}

// Inventory interface matching Java Inventory class
export interface Inventory {
  id: string
  itemId: string
  itemName: string
  category: string
  quantity: number
  minimumQuantity: number
  unitPrice: number
  supplier: string
  lastRestocked: string
  location: string
  notes?: string
}

// Prescription interface for pharmacist view
export interface PharmacistPrescription {
  id: string
  patientId: string
  doctorId: string
  medication: string
  dosageType: string
  usage: string
  issueDate: string
  patient?: {
    firstName: string
    lastName: string
  }
  doctor?: {
    firstName: string
    lastName: string
  }
}

// Pharmacist Service Class - mirrors Java Pharmacist class methods
export class PharmacistService {
  
  // Get pharmacist profile - mirrors pharmacist.GeneralInfo() from Java
  static async getPharmacistProfile(pharmacistId: string): Promise<Pharmacist | null> {
    try {
      // Get user data
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', pharmacistId)
        .single()

      if (userError) throw userError

      // Get pharmacist-specific data
      const { data: pharmacist, error: pharmacistError } = await supabase
        .from('pharmacists')
        .select('*')
        .eq('id', pharmacistId)
        .single()

      if (pharmacistError) throw pharmacistError

      return {
        id: user.id,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        age: user.age || 0,
        gender: user.gender || '',
        phoneNumber: user.phone_number || '',
        email: user.email || '',
        role: user.role,
        location: pharmacist.pharmacy_location || '',
        salary: pharmacist.salary || 0,
        workSchedule: pharmacist.working_hours || '',
        medications: []
      }
    } catch (error) {
      console.error('Error fetching pharmacist profile:', error)
      return null
    }
  }

  // View inventory - mirrors viewInventory() from Java
  static async getInventory(): Promise<Inventory[]> {
    try {
      const { data: inventory, error } = await supabase
        .from('inventory')
        .select('*')
        .order('item_name', { ascending: true })

      if (error) throw error

      return inventory?.map(item => ({
        id: item.id,
        itemId: item.id, // Use id as itemId since there's no separate item_id field
        itemName: item.item_name,
        category: item.category,
        quantity: item.quantity,
        minimumQuantity: item.minimum_stock,
        unitPrice: item.unit_price,
        supplier: item.supplier || '',
        lastRestocked: item.updated_at || item.created_at,
        location: item.location,
        notes: ''
      })) || []
    } catch (error) {
      console.error('Error fetching inventory:', error)
      return []
    }
  }

  // Add inventory stock - mirrors addInventoryStock() from Java
  static async addInventoryStock(itemId: string, amount: number): Promise<boolean> {
    try {
      // Get current item
      const { data: item, error: fetchError } = await supabase
        .from('inventory')
        .select('quantity')
        .eq('id', itemId)
        .single()

      if (fetchError) throw fetchError

      // Update quantity
      const newQuantity = item.quantity + amount
      const { error: updateError } = await supabase
        .from('inventory')
        .update({ 
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)

      if (updateError) throw updateError

      return true
    } catch (error) {
      console.error('Error adding inventory stock:', error)
      return false
    }
  }

  // Remove inventory stock - mirrors removeInventoryStock() from Java
  static async removeInventoryStock(itemId: string, amount: number): Promise<boolean> {
    try {
      // Get current item
      const { data: item, error: fetchError } = await supabase
        .from('inventory')
        .select('quantity')
        .eq('id', itemId)
        .single()

      if (fetchError) throw fetchError

      // Check if sufficient stock
      if (item.quantity < amount) {
        throw new Error('Insufficient stock available')
      }

      // Update quantity
      const newQuantity = item.quantity - amount
      const { error: updateError } = await supabase
        .from('inventory')
        .update({ quantity: newQuantity })
        .eq('id', itemId)

      if (updateError) throw updateError

      return true
    } catch (error) {
      console.error('Error removing inventory stock:', error)
      return false
    }
  }

  // Check medication stock - mirrors checkMedicationStock() from Java
  static async checkMedicationStock(medicationName: string): Promise<Inventory[]> {
    try {
      const { data: items, error } = await supabase
        .from('inventory')
        .select('*')
        .ilike('item_name', `%${medicationName}%`)
        .eq('category', 'Medication')

      if (error) throw error

      return items?.map(item => ({
        id: item.id,
        itemId: item.id,
        itemName: item.item_name,
        category: item.category,
        quantity: item.quantity,
        minimumQuantity: item.minimum_stock,
        unitPrice: item.unit_price,
        supplier: item.supplier || '',
        lastRestocked: item.updated_at || item.created_at,
        location: item.location,
        notes: ''
      })) || []
    } catch (error) {
      console.error('Error checking medication stock:', error)
      return []
    }
  }

  // View prescriptions - mirrors viewPrescriptionsPharmacist() from Java
  static async getPrescriptions(pharmacistId: string): Promise<PharmacistPrescription[]> {
    try {
      // Get all prescriptions
      const { data: prescriptions, error: prescriptionsError } = await supabase
        .from('prescriptions')
        .select('*')
        .order('created_at', { ascending: false })

      if (prescriptionsError) throw prescriptionsError

      if (!prescriptions || prescriptions.length === 0) {
        return []
      }

      // Get patient and doctor details
      const patientIds = [...new Set(prescriptions.map(p => p.patient_id))]
      const doctorIds = [...new Set(prescriptions.map(p => p.doctor_id))]

      const { data: patients } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', patientIds)

      const { data: doctors } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', doctorIds)

      return prescriptions.map(prescription => ({
        id: prescription.id,
        patientId: prescription.patient_id,
        doctorId: prescription.doctor_id,
        medication: prescription.medication_name,
        dosageType: prescription.dosage,
        usage: prescription.frequency,
        issueDate: prescription.created_at,
        patient: patients?.find(p => p.id === prescription.patient_id) ? {
          firstName: patients.find(p => p.id === prescription.patient_id)?.first_name || '',
          lastName: patients.find(p => p.id === prescription.patient_id)?.last_name || ''
        } : undefined,
        doctor: doctors?.find(d => d.id === prescription.doctor_id) ? {
          firstName: doctors.find(d => d.id === prescription.doctor_id)?.first_name || '',
          lastName: doctors.find(d => d.id === prescription.doctor_id)?.last_name || ''
        } : undefined
      }))
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
      return []
    }
  }

  // Distribute medication - mirrors distributeMedication() from Java
  static async distributeMedication(prescriptionId: string, pharmacistId: string): Promise<boolean> {
    try {
      // Get prescription details
      const { data: prescription, error: prescriptionError } = await supabase
        .from('prescriptions')
        .select('medication_name')
        .eq('id', prescriptionId)
        .single()

      if (prescriptionError) throw prescriptionError

      // Check if medication is in stock
      const { data: inventory, error: inventoryError } = await supabase
        .from('inventory')
        .select('quantity, id')
        .eq('item_name', prescription.medication_name)
        .eq('category', 'Medication')
        .single()

      if (inventoryError || !inventory || inventory.quantity <= 0) {
        throw new Error(`Medication ${prescription.medication_name} is out of stock`)
      }

      // Mark prescription as filled
      const { error: updateError } = await supabase
        .from('prescriptions')
        .update({ 
          is_filled: true
        })
        .eq('id', prescriptionId)

      if (updateError) throw updateError

      // Reduce inventory by 1
      await this.removeInventoryStock(inventory.id, 1)

      return true
    } catch (error) {
      console.error('Error distributing medication:', error)
      return false
    }
  }

  // Get dashboard statistics for pharmacist
  static async getDashboardStats(pharmacistId: string): Promise<{
    totalInventoryItems: number
    lowStockItems: number
    totalPrescriptions: number
    pendingPrescriptions: number
  }> {
    try {
      // Get inventory stats
      const { data: inventory } = await supabase
        .from('inventory')
        .select('quantity, minimum_stock')

      const totalInventoryItems = inventory?.length || 0
      const lowStockItems = inventory?.filter(item => item.quantity <= item.minimum_stock).length || 0

      // Get prescription stats
      const { data: prescriptions } = await supabase
        .from('prescriptions')
        .select('is_filled')

      const totalPrescriptions = prescriptions?.length || 0
      const pendingPrescriptions = prescriptions?.filter(p => !p.is_filled).length || 0

      return {
        totalInventoryItems,
        lowStockItems,
        totalPrescriptions,
        pendingPrescriptions
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return {
        totalInventoryItems: 0,
        lowStockItems: 0,
        totalPrescriptions: 0,
        pendingPrescriptions: 0
      }
    }
  }
} 