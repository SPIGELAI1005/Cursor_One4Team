'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function NavigationMenu() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage (demo authentication)
    const userData = localStorage.getItem('one4team_user');
    
    if (userData) {
      const userInfo = JSON.parse(userData);
      setUser(userInfo);
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading || !user) {
    return null;
  }

  // Helper function to check if user has role
  const hasRole = (allowedRoles: string[]) => {
    return allowedRoles.includes(user.role);
  };

  return (
    <div className="hidden md:ml-8 md:flex md:space-x-6">
      {hasRole(['admin']) && (
        <Link 
          href="/dashboard/admin" 
          className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
        >
          Admin Dashboard
        </Link>
      )}
      
      {hasRole(['admin']) && (
        <Link 
          href="/dashboard/admin/users" 
          className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
        >
          Users
        </Link>
      )}
      
      {hasRole(['support']) && (
        <Link 
          href="/dashboard/support" 
          className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
        >
          Support Dashboard
        </Link>
      )}
      
      {hasRole(['admin', 'trainer']) && (
        <Link 
          href="/dashboard/players" 
          className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
        >
          Players
        </Link>
      )}
      
      {hasRole(['admin', 'trainer']) && (
        <Link 
          href="/dashboard/trainings" 
          className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
        >
          Trainings
        </Link>
      )}
      
      {hasRole(['trainer']) && (
        <Link 
          href="/dashboard/trainer" 
          className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
        >
          Trainer Area
        </Link>
      )}
      
      {hasRole(['admin']) && (
        <Link 
          href="/dashboard/settings" 
          className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
        >
          Settings
        </Link>
      )}
      
      {hasRole(['finance']) && (
        <Link 
          href="/dashboard/finance" 
          className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
        >
          Finance
        </Link>
      )}
      
      {hasRole(['partner']) && (
        <Link 
          href="/dashboard/partner" 
          className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
        >
          Partner Portal
        </Link>
      )}
      
      {hasRole(['press-news']) && (
        <Link 
          href="/dashboard/press-news" 
          className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
        >
          Press & News
        </Link>
      )}
    </div>
  );
} 