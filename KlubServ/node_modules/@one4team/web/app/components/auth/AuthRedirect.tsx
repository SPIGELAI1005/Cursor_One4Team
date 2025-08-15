'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from './RoleGuard';

interface AuthRedirectProps {
  requiredRoles?: UserRole[];
  redirectTo?: string;
  children: React.ReactNode;
}

export function AuthRedirect({ 
  requiredRoles, 
  redirectTo = '/forbidden', 
  children 
}: AuthRedirectProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push('/sign-in');
      return;
    }

    if (requiredRoles) {
      const userRole = user.publicMetadata.user_role as UserRole || 'member';
      
      if (!requiredRoles.includes(userRole)) {
        router.push(redirectTo);
        return;
      }
    }
  }, [user, isLoaded, requiredRoles, redirectTo, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to sign-in
  }

  if (requiredRoles) {
    const userRole = user.publicMetadata.user_role as UserRole || 'member';
    
    if (!requiredRoles.includes(userRole)) {
      return null; // Will redirect to forbidden page
    }
  }

  return <>{children}</>;
} 