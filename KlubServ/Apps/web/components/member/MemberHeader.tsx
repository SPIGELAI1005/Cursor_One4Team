'use client';

import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LogoFour from '@/components/LogoFour';
import One4TeamText from '@/components/One4TeamText';

export function MemberHeader() {

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Search and title */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-gray-900">Member Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, Member!</p>
          </div>
          
          {/* Mobile title */}
          <div className="md:hidden flex items-center space-x-2">
            <LogoFour size={24} bgColor="#1757FF" textColor="white" />
            <h1 className="text-lg font-semibold text-gray-900">
              <One4TeamText size="lg" variant="semibold" />
            </h1>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          {/* Search button */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex items-center space-x-2 text-gray-500 hover:text-gray-700"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 text-gray-500 hover:text-gray-700"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* User info - mobile only */}
          <div className="md:hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                M
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 