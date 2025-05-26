'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { PharmacistService, Pharmacist, Inventory, PharmacistPrescription } from '@/lib/pharmacist'
import { 
  User, 
  Package, 
  Plus, 
  Minus, 
  Search,
  Pill,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  FileText,
  Clock,
  TrendingDown,
  TrendingUp
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function PharmacistDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [pharmacist, setPharmacist] = useState<Pharmacist | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Data states
  const [dashboardStats, setDashboardStats] = useState<any>({})
  const [inventory, setInventory] = useState<Inventory[]>([])
  const [prescriptions, setPrescriptions] = useState<PharmacistPrescription[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [stockAction, setStockAction] = useState<'add' | 'remove' | null>(null)
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null)
  const [stockAmount, setStockAmount] = useState('')
  const [actionStatus, setActionStatus] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser || currentUser.role !== 'pharmacist') {
        router.push('/dashboard')
        return
      }
      setUser(currentUser)
      await loadPharmacistData(currentUser.id)
      setLoading(false)
    }
    checkAuth()
  }, [router])

  const loadPharmacistData = async (pharmacistId: string) => {
    try {
      const [pharmacistProfile, stats, inventoryData, prescriptionsData] = await Promise.all([
        PharmacistService.getPharmacistProfile(pharmacistId),
        PharmacistService.getDashboardStats(pharmacistId),
        PharmacistService.getInventory(),
        PharmacistService.getPrescriptions(pharmacistId)
      ])

      setPharmacist(pharmacistProfile)
      setDashboardStats(stats)
      setInventory(inventoryData)
      setPrescriptions(prescriptionsData)
    } catch (error) {
      console.error('Error loading pharmacist data:', error)
    }
  }

  const handleStockAction = async () => {
    if (!selectedItem || !stockAmount || !user) return
    
    const amount = parseInt(stockAmount)
    if (isNaN(amount) || amount <= 0) {
      setActionStatus('Please enter a valid amount')
      return
    }

    setActionStatus(`${stockAction === 'add' ? 'Adding' : 'Removing'} stock...`)
    
    let success = false
    if (stockAction === 'add') {
      success = await PharmacistService.addInventoryStock(selectedItem.itemId, amount)
    } else {
      success = await PharmacistService.removeInventoryStock(selectedItem.itemId, amount)
    }
    
    if (success) {
      setActionStatus(`Stock ${stockAction === 'add' ? 'added' : 'removed'} successfully`)
      await loadPharmacistData(user.id) // Refresh data
      setStockAction(null)
      setSelectedItem(null)
      setStockAmount('')
      setTimeout(() => setActionStatus(''), 3000)
    } else {
      setActionStatus('Failed to update stock')
      setTimeout(() => setActionStatus(''), 3000)
    }
  }

  const handleMedicationSearch = async () => {
    if (!searchTerm.trim()) return
    
    const results = await PharmacistService.checkMedicationStock(searchTerm)
    setInventory(results)
  }

  const handleDistributeMedication = async (prescriptionId: string) => {
    if (!user) return
    
    const success = await PharmacistService.distributeMedication(prescriptionId, user.id)
    if (success) {
      setActionStatus('Medication distributed successfully')
      await loadPharmacistData(user.id) // Refresh data
      setTimeout(() => setActionStatus(''), 3000)
    } else {
      setActionStatus('Failed to distribute medication')
      setTimeout(() => setActionStatus(''), 3000)
    }
  }

  const refreshData = async () => {
    if (user) {
      await loadPharmacistData(user.id)
    }
  }

  const resetInventoryView = async () => {
    setSearchTerm('')
    const allInventory = await PharmacistService.getInventory()
    setInventory(allInventory)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const getStockStatusColor = (item: Inventory) => {
    if (item.quantity <= item.minimumQuantity) return 'text-red-600'
    if (item.quantity <= item.minimumQuantity * 2) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getStockStatusIcon = (item: Inventory) => {
    if (item.quantity <= item.minimumQuantity) return <AlertTriangle className="h-4 w-4 text-red-600" />
    if (item.quantity <= item.minimumQuantity * 2) return <TrendingDown className="h-4 w-4 text-yellow-600" />
    return <TrendingUp className="h-4 w-4 text-green-600" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pharmacist Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName} {user?.lastName}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={refreshData}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('user')
                  router.push('/')
                }}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - mirrors Java pharmacist menu */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: User },
              { id: 'profile', name: 'View Profile', icon: User },
              { id: 'inventory', name: 'View Inventory', icon: Package },
              { id: 'stock', name: 'Manage Stock', icon: Plus },
              { id: 'search', name: 'Check Medication', icon: Search },
              { id: 'prescriptions', name: 'View Prescriptions', icon: Pill }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalInventoryItems}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.lowStockItems}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Pill className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalPrescriptions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Prescriptions</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.pendingPrescriptions}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setActiveTab('inventory')}
                    className="p-4 rounded-lg hover:bg-gray-50 transition-colors text-center"
                  >
                    <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">View Inventory</p>
                    <p className="text-xs text-gray-500">Check all items in stock</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('stock')}
                    className="p-4 rounded-lg hover:bg-gray-50 transition-colors text-center"
                  >
                    <Plus className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Manage Stock</p>
                    <p className="text-xs text-gray-500">Add or remove inventory</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('prescriptions')}
                    className="p-4 rounded-lg hover:bg-gray-50 transition-colors text-center"
                  >
                    <Pill className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">View Prescriptions</p>
                    <p className="text-xs text-gray-500">Manage medication distribution</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Status */}
            {actionStatus && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Status</p>
                      <p className="text-sm text-gray-600">{actionStatus}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab - mirrors pharmacist.GeneralInfo() from Java */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Pharmacist Profile</h2>
            
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Basic Details</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Name:</span>
                        <span className="ml-2 text-sm text-gray-900">{pharmacist?.firstName} {pharmacist?.lastName}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Age:</span>
                        <span className="ml-2 text-sm text-gray-900">{pharmacist?.age}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Gender:</span>
                        <span className="ml-2 text-sm text-gray-900">{pharmacist?.gender === 'M' ? 'Male' : 'Female'}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Phone:</span>
                        <span className="ml-2 text-sm text-gray-900">{pharmacist?.phoneNumber}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Email:</span>
                        <span className="ml-2 text-sm text-gray-900">{pharmacist?.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Work Details</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Location:</span>
                        <span className="ml-2 text-sm text-gray-900">{pharmacist?.location}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Work Schedule:</span>
                        <span className="ml-2 text-sm text-gray-900">{pharmacist?.workSchedule}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Salary:</span>
                        <span className="ml-2 text-sm text-gray-900">${pharmacist?.salary?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab - mirrors viewInventory() from Java */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
              <button
                onClick={resetInventoryView}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Show All Items
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Current Inventory</h3>
              </div>
              <div className="p-6">
                {inventory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No inventory items found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {inventory.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                                <div className="text-sm text-gray-500">ID: {item.itemId}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getStockStatusIcon(item)}
                                <span className={`ml-2 text-sm font-medium ${getStockStatusColor(item)}`}>
                                  {item.quantity}
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                  (min: {item.minimumQuantity})
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(item.unitPrice)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.supplier}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                item.quantity <= item.minimumQuantity 
                                  ? 'bg-red-100 text-red-800' 
                                  : item.quantity <= item.minimumQuantity * 2
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {item.quantity <= item.minimumQuantity ? 'Low Stock' : 
                                 item.quantity <= item.minimumQuantity * 2 ? 'Warning' : 'In Stock'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stock Management Tab - mirrors addInventoryStock() and removeInventoryStock() from Java */}
        {activeTab === 'stock' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Stock Management</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Stock */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Plus className="h-5 w-5 text-green-600 mr-2" />
                    Add Stock
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Item</label>
                      <select
                        value={selectedItem?.id || ''}
                        onChange={(e) => {
                          const item = inventory.find(i => i.id === e.target.value)
                          setSelectedItem(item || null)
                          setStockAction('add')
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Choose an item...</option>
                        {inventory.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.itemName} (Current: {item.quantity})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Add</label>
                      <input
                        type="number"
                        value={stockAmount}
                        onChange={(e) => setStockAmount(e.target.value)}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter amount"
                      />
                    </div>
                    <button
                      onClick={handleStockAction}
                      disabled={!selectedItem || !stockAmount || stockAction !== 'add'}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
                    >
                      Add Stock
                    </button>
                  </div>
                </div>
              </div>

              {/* Remove Stock */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Minus className="h-5 w-5 text-red-600 mr-2" />
                    Remove Stock
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Item</label>
                      <select
                        value={selectedItem?.id || ''}
                        onChange={(e) => {
                          const item = inventory.find(i => i.id === e.target.value)
                          setSelectedItem(item || null)
                          setStockAction('remove')
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Choose an item...</option>
                        {inventory.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.itemName} (Current: {item.quantity})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Remove</label>
                      <input
                        type="number"
                        value={stockAmount}
                        onChange={(e) => setStockAmount(e.target.value)}
                        min="1"
                        max={selectedItem?.quantity || 0}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter amount"
                      />
                    </div>
                    <button
                      onClick={handleStockAction}
                      disabled={!selectedItem || !stockAmount || stockAction !== 'remove'}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300"
                    >
                      Remove Stock
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medication Search Tab - mirrors checkMedicationStock() from Java */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Check Medication Stock</h2>
            
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Search Medications</h3>
              </div>
              <div className="p-6">
                <div className="flex space-x-4 mb-6">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter medication name..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleMedicationSearch}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Search className="h-4 w-4 mr-2 inline" />
                    Search
                  </button>
                </div>

                {searchTerm && (
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Search Results for "{searchTerm}":</h4>
                    {inventory.length === 0 ? (
                      <p className="text-gray-500">No medications found matching your search.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {inventory.map((item) => (
                          <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                            <h5 className="font-medium text-gray-900">{item.itemName}</h5>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-600">Stock: <span className={getStockStatusColor(item)}>{item.quantity}</span></p>
                              <p className="text-sm text-gray-600">Price: {formatCurrency(item.unitPrice)}</p>
                              <p className="text-sm text-gray-600">Location: {item.location}</p>
                              <div className="mt-2">
                                {getStockStatusIcon(item)}
                                <span className={`ml-2 text-xs font-medium ${getStockStatusColor(item)}`}>
                                  {item.quantity <= item.minimumQuantity ? 'Low Stock' : 
                                   item.quantity <= item.minimumQuantity * 2 ? 'Warning' : 'In Stock'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Prescriptions Tab - mirrors viewPrescriptionsPharmacist() from Java */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Prescription Management</h2>
            
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">All Prescriptions</h3>
              </div>
              <div className="p-6">
                {prescriptions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No prescriptions found</p>
                ) : (
                  <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                      <div key={prescription.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <Pill className="h-6 w-6 text-blue-600" />
                              <div>
                                <h4 className="text-lg font-medium text-gray-900">{prescription.medication}</h4>
                                <p className="text-sm text-gray-600">
                                  Patient: {prescription.patient?.firstName} {prescription.patient?.lastName}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Doctor: Dr. {prescription.doctor?.firstName} {prescription.doctor?.lastName}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <span className="text-sm font-medium text-gray-700">Dosage:</span>
                                <span className="ml-2 text-sm text-gray-900">{prescription.dosageType}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-700">Usage:</span>
                                <span className="ml-2 text-sm text-gray-900">{prescription.usage}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-700">Issue Date:</span>
                                <span className="ml-2 text-sm text-gray-900">{formatDate(prescription.issueDate)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <button
                              onClick={() => handleDistributeMedication(prescription.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              Distribute
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 