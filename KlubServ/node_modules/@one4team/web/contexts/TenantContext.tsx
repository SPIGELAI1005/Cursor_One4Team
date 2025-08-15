'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
// import { useAuth } from '@clerk/nextjs';

interface TenantContextType {
  clubId: string | null;
  clubName: string | null;
  isLoading: boolean;
  error: string | null;
  setClubId: (clubId: string) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: React.ReactNode;
  initialClubId?: string | null;
}

/**
 * TenantProvider - Provides club context throughout the application
 * 
 * This context handles:
 * 1. Reading club_id from cookies (SSR) or query parameters
 * 2. Extracting club_id from JWT token via Clerk
 * 3. Providing club context to all child components
 * 4. Managing tenant-aware state
 */
export function TenantProvider({ children, initialClubId }: TenantProviderProps) {
  const [clubId, setClubIdState] = useState<string | null>(initialClubId || null);
  const [clubName, setClubName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  // const { user, isLoaded } = useAuth();
  
  // Mock auth data for development
  const user = null;
  const isLoaded = true;

  // Extract club_id from various sources
  useEffect(() => {
    if (!isLoaded) return;

    const extractClubId = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let extractedClubId: string | null = null;

        // 1. Try to get club_id from query parameters first
        const queryClubId = searchParams.get('club');
        if (queryClubId) {
          extractedClubId = queryClubId;
        }

        // 2. Try to get club_id from user's JWT token metadata
        if (!extractedClubId && user) {
          const tokenClubId = user.publicMetadata?.club_id as string;
          if (tokenClubId) {
            extractedClubId = tokenClubId;
          }
        }

        // 3. Try to get club_id from cookies (for SSR compatibility)
        if (!extractedClubId && typeof window !== 'undefined') {
          const cookies = document.cookie.split(';');
          const clubCookie = cookies.find(cookie => 
            cookie.trim().startsWith('club=')
          );
          if (clubCookie) {
            extractedClubId = clubCookie.split('=')[1];
          }
        }

        // 4. Use initial club_id if provided
        if (!extractedClubId && initialClubId) {
          extractedClubId = initialClubId;
        }

        // Set the club ID
        if (extractedClubId) {
          setClubIdState(extractedClubId);
          
          // Try to get club name from user metadata
          if (user?.publicMetadata?.club) {
            const clubInfo = user.publicMetadata.club as any;
            setClubName(clubInfo.name || 'Sports Club');
          } else {
            setClubName('Sports Club');
          }

          // Set cookie for future requests
          if (typeof window !== 'undefined') {
            document.cookie = `club=${extractedClubId}; path=/; max-age=86400; SameSite=Lax`;
          }
        } else {
          console.warn('No club_id found in any source');
          setClubName('Sports Club');
        }

      } catch (err) {
        console.error('Error extracting club_id:', err);
        setError('Failed to determine club context');
      } finally {
        setIsLoading(false);
      }
    };

    extractClubId();
  }, [isLoaded, user, searchParams, initialClubId]);

  // Update club name when user changes
  useEffect(() => {
    if (user?.publicMetadata?.club) {
      const clubInfo = user.publicMetadata.club as any;
      setClubName(clubInfo.name || 'Sports Club');
    }
  }, [user]);

  const setClubId = (newClubId: string) => {
    setClubIdState(newClubId);
    
    // Update cookie
    if (typeof window !== 'undefined') {
      document.cookie = `club=${newClubId}; path=/; max-age=86400; SameSite=Lax`;
    }
  };

  const value: TenantContextType = {
    clubId,
    clubName,
    isLoading,
    error,
    setClubId,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

/**
 * Hook to use tenant context
 * Provides access to club_id, club name, and related utilities
 */
export function useTenant() {
  const context = useContext(TenantContext);
  
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  
  return context;
}

/**
 * Hook to get club_id with fallback
 * Returns club_id or throws error if not available
 */
export function useClubId(): string {
  const { clubId, isLoading, error } = useTenant();
  
  if (isLoading) {
    throw new Error('Tenant context is still loading');
  }
  
  if (error) {
    throw new Error(`Tenant context error: ${error}`);
  }
  
  if (!clubId) {
    throw new Error('Club ID is not available');
  }
  
  return clubId;
}

/**
 * Hook to get optional club_id
 * Returns club_id or null if not available (no error thrown)
 */
export function useOptionalClubId(): string | null {
  const { clubId } = useTenant();
  return clubId;
} 