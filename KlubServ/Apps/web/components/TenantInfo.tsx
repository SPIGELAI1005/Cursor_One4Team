'use client';

import { useTenant, useClubId } from '../contexts/TenantContext';
import { useTenantFetch } from '../lib/hooks/useTenantFetch';
import { useState, useEffect } from 'react';

interface ClubInfo {
  id: string;
  name: string;
  description?: string;
  memberCount?: number;
}

/**
 * TenantInfo Component - Displays current tenant information
 * Demonstrates how to use the tenant context and tenant-aware API calls
 */
export function TenantInfo() {
  const { clubId, clubName, isLoading, error } = useTenant();
  const { get } = useTenantFetch();
  const [clubInfo, setClubInfo] = useState<ClubInfo | null>(null);
  const [isLoadingClub, setIsLoadingClub] = useState(false);

  // Fetch club information when clubId is available
  useEffect(() => {
    if (clubId) {
      setIsLoadingClub(true);
      get(`/api/clubs/${clubId}`)
        .then(response => response.json())
        .then(data => setClubInfo(data))
        .catch(err => console.error('Error fetching club info:', err))
        .finally(() => setIsLoadingClub(false));
    }
  }, [clubId, get]);

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-medium">Tenant Error</h3>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!clubId) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-yellow-800 font-medium">No Tenant Context</h3>
        <p className="text-yellow-600 text-sm">
          No club context available. This might be a public page or the user hasn't been assigned to a club.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-blue-800 font-medium mb-2">Current Tenant</h3>
      
      <div className="space-y-2">
        <div>
          <span className="text-sm font-medium text-gray-600">Club ID:</span>
          <span className="ml-2 text-sm font-mono bg-gray-100 px-2 py-1 rounded">
            {clubId}
          </span>
        </div>
        
        <div>
          <span className="text-sm font-medium text-gray-600">Club Name:</span>
          <span className="ml-2 text-sm">{clubName || 'Loading...'}</span>
        </div>

        {isLoadingClub && (
          <div className="text-sm text-gray-500">Loading club details...</div>
        )}

        {clubInfo && (
          <div className="mt-3 p-3 bg-white rounded border">
            <h4 className="font-medium text-gray-800 mb-2">Club Details</h4>
            <div className="space-y-1 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2">{clubInfo.name}</span>
              </div>
              {clubInfo.description && (
                <div>
                  <span className="text-gray-600">Description:</span>
                  <span className="ml-2">{clubInfo.description}</span>
                </div>
              )}
              {clubInfo.memberCount !== undefined && (
                <div>
                  <span className="text-gray-600">Members:</span>
                  <span className="ml-2">{clubInfo.memberCount}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * TenantDebug Component - Shows detailed tenant context information
 * Useful for development and debugging
 */
export function TenantDebug() {
  const { clubId, clubName, isLoading, error } = useTenant();

  return (
    <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
      <h3 className="font-medium text-gray-800 mb-3">Tenant Debug Info</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Loading:</span>
          <span className="ml-2">{isLoading ? 'Yes' : 'No'}</span>
        </div>
        
        <div>
          <span className="font-medium">Error:</span>
          <span className="ml-2">{error || 'None'}</span>
        </div>
        
        <div>
          <span className="font-medium">Club ID:</span>
          <span className="ml-2 font-mono">{clubId || 'Not set'}</span>
        </div>
        
        <div>
          <span className="font-medium">Club Name:</span>
          <span className="ml-2">{clubName || 'Not set'}</span>
        </div>
      </div>
    </div>
  );
} 