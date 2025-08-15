'use client';

import { useCallback } from 'react';
import { authenticatedFetch } from '../clerk-utils';
import { useTenant } from '../../contexts/TenantContext';

/**
 * Custom hook for tenant-aware API requests
 * Automatically includes club_id in all API requests
 */
export function useTenantFetch() {
  const { clubId } = useTenant();

  const fetchWithTenant = useCallback(
    async (url: string, options: RequestInit = {}) => {
      return authenticatedFetch(url, options, clubId || undefined);
    },
    [clubId]
  );

  const get = useCallback(
    async (url: string, options: RequestInit = {}) => {
      return fetchWithTenant(url, {
        ...options,
        method: 'GET',
      });
    },
    [fetchWithTenant]
  );

  const post = useCallback(
    async (url: string, data?: any, options: RequestInit = {}) => {
      return fetchWithTenant(url, {
        ...options,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [fetchWithTenant]
  );

  const put = useCallback(
    async (url: string, data?: any, options: RequestInit = {}) => {
      return fetchWithTenant(url, {
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [fetchWithTenant]
  );

  const patch = useCallback(
    async (url: string, data?: any, options: RequestInit = {}) => {
      return fetchWithTenant(url, {
        ...options,
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [fetchWithTenant]
  );

  const del = useCallback(
    async (url: string, options: RequestInit = {}) => {
      return fetchWithTenant(url, {
        ...options,
        method: 'DELETE',
      });
    },
    [fetchWithTenant]
  );

  return {
    fetch: fetchWithTenant,
    get,
    post,
    put,
    patch,
    delete: del,
    clubId,
  };
} 