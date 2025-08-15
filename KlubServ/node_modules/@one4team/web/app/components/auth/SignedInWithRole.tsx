'use client';

import { SignedIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole, getUserRoles } from './RoleGuard';

interface SignedInWithRoleProps {
  requiredRoles?: UserRole[];
  redirectTo?: string;
  children: React.ReactNode;
  requireAll?: boolean; // If true, user must have ALL roles; if false, user must have ANY role
}

export function SignedInWithRole({ 
  requiredRoles, 
  redirectTo = '/403', 
  children,
  requireAll = false
}: SignedInWithRoleProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Helper function to check if user has required roles
  const hasRequiredRoles = (userRoles: UserRole[], requiredRoles: UserRole[], requireAll: boolean): boolean => {
    if (!userRoles || !requiredRoles) return false;
    
    if (requireAll) {
      // User must have ALL required roles
      return requiredRoles.every(role => userRoles.includes(role));
    } else {
      // User must have ANY of the required roles
      return requiredRoles.some(role => userRoles.includes(role));
    }
  };

  useEffect(() => {
    if (!isLoaded) return;

    // If not signed in, redirect to sign-in to avoid blank screen
    if (!user) {
      router.push('/sign-in');
      return;
    }

    if (requiredRoles && user) {
      const userRoles = getUserRoles(user);
      
      if (!hasRequiredRoles(userRoles, requiredRoles, requireAll)) {
        router.push(redirectTo);
        return;
      }
    }
  }, [user, isLoaded, requiredRoles, redirectTo, router, requireAll]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <SignedIn>
      {requiredRoles && user ? (
        (() => {
          const userRoles = getUserRoles(user);
          
          if (!hasRequiredRoles(userRoles, requiredRoles, requireAll)) {
            return null; // Will redirect to forbidden page
          }
          
          return <>{children}</>;
        })()
      ) : (
        <>{children}</>
      )}
    </SignedIn>
  );
} 