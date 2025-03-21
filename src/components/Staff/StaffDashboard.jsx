'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  UserGroupIcon, 
  KeyIcon, 
  ShieldCheckIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function StaffDashboard({ children }) {
  const pathname = usePathname();
  
  const navItems = [
    {
      name: 'Staff Members',
      href: '/auth/dashboard/staff',
      icon: UserGroupIcon,
      exact: true
    },
    {
      name: 'Roles',
      href: '/auth/dashboard/staff/roles',
      icon: ShieldCheckIcon
    },
    {
      name: 'Permissions',
      href: '/auth/dashboard/staff/permissions',
      icon: KeyIcon
    },
    {
      name: 'Settings',
      href: '/auth/dashboard/staff/settings',
      icon: Cog6ToothIcon
    }
  ];
  
  const isActive = (path, exact = false) => {
    if (exact) return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Side Navigation */}
      <div className="w-full md:w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Staff Management</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                isActive(item.href, item.exact)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        {children}
      </div>
    </div>
  );
}