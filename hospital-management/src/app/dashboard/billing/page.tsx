'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser, User } from '@/lib/auth'
import { PatientService, Bill } from '@/lib/patient'
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle,
  AlertCircle,
  Clock,
  FileText
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function BillingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [bills, setBills] = useState<Bill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid'>('all')
  const [payingBillId, setPayingBillId] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) return

      setUser(currentUser)

      if (currentUser.role === 'patient') {
        // Mirror patient.getBills() from Java
        await loadBills(currentUser.id)
      }

      setIsLoading(false)
    }

    loadData()
  }, [])

  // Load bills - mirrors patient.getBills() from Java
  const loadBills = async (patientId: string) => {
    try {
      const bills = await PatientService.getBills(patientId)
      setBills(bills)
    } catch (error) {
      console.error('Error loading bills:', error)
    }
  }

  // Handle payment - mirrors makePayment() from Java Bill class
  const handlePayBill = async (billId: string) => {
    if (!confirm('Are you sure you want to pay this bill?')) return

    setPayingBillId(billId)
    try {
      const success = await PatientService.payBill(billId)
      if (success) {
        // Reload bills to show updated status
        if (user) {
          await loadBills(user.id)
        }
        alert('Payment successful!')
      } else {
        alert('Payment failed. Please try again.')
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setPayingBillId(null)
    }
  }

  const filteredBills = bills.filter(bill => {
    if (filter === 'paid') return bill.isPaid
    if (filter === 'unpaid') return !bill.isPaid
    return true
  })

  // Calculate totals - mirrors showBilling() calculation from Java
  const totalDue = bills.filter(bill => !bill.isPaid).reduce((sum, bill) => sum + bill.amount, 0)
  const totalPaid = bills.filter(bill => bill.isPaid).reduce((sum, bill) => sum + bill.amount, 0)
  const unpaidCount = bills.filter(bill => !bill.isPaid).length

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
        <p className="text-gray-600 mt-1">
          Manage your medical bills and payment history
        </p>
      </div>

      {/* Summary Cards - mirrors showBilling() totals from Java */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-500">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Due</p>
              <p className="text-2xl font-semibold text-red-600">${totalDue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Paid</p>
              <p className="text-2xl font-semibold text-green-600">${totalPaid.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-500">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unpaid Bills</p>
              <p className="text-2xl font-semibold text-yellow-600">{unpaidCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bills</p>
              <p className="text-2xl font-semibold text-blue-600">{bills.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Outstanding Balance Alert */}
      {totalDue > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Outstanding Balance</h3>
              <p className="text-sm text-red-700 mt-1">
                You have ${totalDue.toFixed(2)} in unpaid bills. Please review and pay your outstanding balance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'all', label: 'All Bills' },
              { key: 'unpaid', label: 'Unpaid' },
              { key: 'paid', label: 'Paid' }
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
                  {tab.key === 'all' ? bills.length : 
                   tab.key === 'paid' ? bills.filter(b => b.isPaid).length :
                   bills.filter(b => !b.isPaid).length}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Bills List - mirrors showBilling() display from Java */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {filter === 'all' ? 'All Bills' : 
             filter === 'paid' ? 'Paid Bills' : 'Unpaid Bills'}
          </h2>
        </div>
        
        <div className="p-6">
          {filteredBills.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No bills found</p>
              {filter === 'unpaid' && totalDue === 0 && (
                <p className="text-green-600 text-sm mt-2">All bills are paid! ✓</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBills.map((bill) => (
                <div 
                  key={bill.id} 
                  className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${
                    bill.isPaid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          bill.isPaid ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {bill.isPaid ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <CreditCard className="h-6 w-6 text-red-600" />
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {bill.description}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {formatDate(bill.dueDate)}</span>
                          </div>
                          {bill.isPaid && bill.paidDate && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>Paid: {formatDate(bill.paidDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        bill.isPaid ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${bill.amount.toFixed(2)}
                      </p>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        bill.isPaid 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {bill.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </div>

                  {!bill.isPaid && (
                    <div className="mt-4 pt-4 border-t border-red-200">
                      <button 
                        onClick={() => handlePayBill(bill.id)}
                        disabled={payingBillId === bill.id}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {payingBillId === bill.id ? 'Processing...' : 'Pay Now'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <CreditCard className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="text-lg font-medium text-blue-900 mb-2">Payment Information</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Payments can be made online, by phone, or in person at the hospital</li>
              <li>• We accept all major credit cards, debit cards, and bank transfers</li>
              <li>• Payment plans are available for large bills - contact our billing department</li>
              <li>• Insurance claims are processed automatically when applicable</li>
              <li>• For billing questions, call (555) 123-4567 or email billing@sirlewis.com</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 