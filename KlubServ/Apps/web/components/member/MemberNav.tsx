'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { 
  Home, 
  User, 
  CreditCard, 
  MessageSquare, 
  Calendar, 
  BookOpen, 
  FileText,
  Target
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';

const navigation = [
  { name: 'Home', href: '/app', icon: Home },
  { name: 'Player Dashboard', href: '/app/player', icon: Target, roles: ['player'] },
  { name: 'Profile', href: '/app/profile', icon: User },
  { name: 'Payments', href: '/app/payments', icon: CreditCard },
  { name: 'Messages', href: '/app/messages', icon: MessageSquare },
  { name: 'Calendar', href: '/app/calendar', icon: Calendar },
  { name: 'Bookings', href: '/app/bookings', icon: BookOpen },
  { name: 'Documents', href: '/app/documents', icon: FileText },
];

export function MemberNav() {
  const pathname = usePathname();
  const { user } = useUser();

  const userRoles = user?.publicMetadata?.user_role || 'member';
  const userRolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];

  const filteredNavigation = navigation.filter(item => {
    if (!item.roles) return true;
    return item.roles.some(role => userRolesArray.includes(role));
  });

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-b border-gray-200">
            <Link href="/app" className="flex items-center">
              <Logo variant="full" size="md" />
            </Link>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 flex-shrink-0 h-5 w-5',
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {userRolesArray.includes('player') ? 'Player Area' : 'Member Area'}
                </p>
                <p className="text-xs text-gray-500">Welcome back!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <nav className="flex justify-around py-2">
          {filteredNavigation.slice(0, 4).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center px-2 py-1 text-xs',
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
} 