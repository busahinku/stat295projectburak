'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Calendar, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Stethoscope,
  Pill,
  Building,
  DollarSign,
  UserCheck,
  ClipboardList,
  Home,
  Star
} from 'lucide-react'
import { cn } from '@/lib/utils'

type UserRole = 'founder' | 'doctor' | 'patient' | 'pharmacist' | 'assistant'

interface SidebarProps {
  userRole: UserRole
  userName: string
  onSignOut: () => void
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: UserRole[]
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['founder', 'doctor', 'patient', 'pharmacist', 'assistant']
  },
  {
    title: 'Appointments',
    href: '/dashboard/appointments',
    icon: Calendar,
    roles: ['patient', 'assistant']
  },
  {
    title: 'Patients',
    href: '/dashboard/patients',
    icon: Users,
    roles: ['assistant', 'founder']
  },
  {
    title: 'Medical Records',
    href: '/dashboard/medical-records',
    icon: FileText,
    roles: ['patient']
  },
  {
    title: 'Prescriptions',
    href: '/dashboard/prescriptions',
    icon: Pill,
    roles: ['patient', 'pharmacist']
  },
  {
    title: 'Departments',
    href: '/dashboard/departments',
    icon: Building,
    roles: ['founder', 'assistant']
  },
  {
    title: 'Inventory',
    href: '/dashboard/inventory',
    icon: ClipboardList,
    roles: ['pharmacist', 'founder']
  },
  {
    title: 'Billing',
    href: '/dashboard/billing',
    icon: DollarSign,
    roles: ['patient', 'founder']
  },
  {
    title: 'Reviews',
    href: '/dashboard/reviews',
    icon: Star,
    roles: ['patient']
  },
  {
    title: 'Staff Management',
    href: '/dashboard/staff',
    icon: UserCheck,
    roles: ['founder']
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
    roles: ['founder']
  }
]

// Doctor-specific navigation items
const doctorNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard/doctor',
    icon: Home,
    roles: ['doctor']
  },
  {
    title: 'Reviews',
    href: '/dashboard/reviews',
    icon: Star,
    roles: ['doctor']
  }
]

export function Sidebar({ userRole, userName, onSignOut }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  // Use doctor-specific navigation for doctors, regular navigation for others
  const currentNavItems = userRole === 'doctor' ? doctorNavItems : navItems
  const filteredNavItems = currentNavItems.filter(item => item.roles.includes(userRole))

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <img 
                src="/images/logos/logo-icon.png" 
                alt="SirLewis Hospital" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-gray-900">SirLewis</span>
            </div>
          )}
          {isCollapsed && (
            <img 
              src="/images/logos/logo-icon.png" 
              alt="SirLewis Hospital" 
              className="h-8 w-8"
            />
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                isActive 
                  ? "bg-blue-50 text-blue-700 border border-blue-200" 
                  : "text-gray-700 hover:bg-gray-50",
                isCollapsed && "justify-center"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-blue-700")} />
              {!isCollapsed && (
                <span className="font-medium">{item.title}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Settings and Logout */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50",
            isCollapsed && "justify-center"
          )}
        >
          <Settings className="h-5 w-5" />
          {!isCollapsed && <span className="font-medium">Settings</span>}
        </Link>
        
        <button
          onClick={onSignOut}
          className={cn(
            "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-red-600 hover:bg-red-50",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </div>
  )
} 