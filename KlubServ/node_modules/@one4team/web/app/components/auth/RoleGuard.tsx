'use client';

import { useUser } from '@clerk/nextjs';
import { ReactNode } from 'react';

export type UserRole = 'admin' | 'trainer' | 'member' | 'support' | 'player' | 'official' | 'finance' | 'partner' | 'press-news';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
  requireAll?: boolean; // If true, user must have ALL roles; if false, user must have ANY role
}

export function RoleGuard({ children, allowedRoles, fallback, requireAll = false }: RoleGuardProps) {
  const { user } = useUser();
  
  if (!user) {
    return fallback || null;
  }

  // Helper function to get user roles from Clerk metadata
  const getUserRoles = (user: any): UserRole[] => {
    const roles = user.publicMetadata?.roles || user.publicMetadata?.user_role;
    
    if (!roles) return ['member'];
    
    // Handle array of roles
    if (Array.isArray(roles)) {
      return roles.filter((role: any) => 
        ['admin', 'trainer', 'member', 'support', 'player', 'official', 'finance', 'partner', 'press-news'].includes(role)
      ) as UserRole[];
    }
    
    // Handle single role (backward compatibility)
    if (typeof roles === 'string' && 
        ['admin', 'trainer', 'member', 'support', 'player', 'official', 'finance', 'partner', 'press-news'].includes(roles)) {
      return [roles as UserRole];
    }
    
    return ['member'];
  };

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

  const userRoles = getUserRoles(user);
  
  if (!hasRequiredRoles(userRoles, allowedRoles, requireAll)) {
    return fallback || null;
  }

  return <>{children}</>;
}

interface PermissionGuardProps {
  children: ReactNode;
  permission: string;
  fallback?: ReactNode;
}

const ROLE_PERMISSIONS = {
  admin: {
    canManageUsers: true,
    canManageFinances: true,
    canManageClasses: true,
    canViewReports: true,
    canManageSettings: true,
    canAccessDashboard: true,
    canAccessMemberApp: true,
    canManageRoles: true,
    canViewAllData: true,
  },
  trainer: {
    canManageUsers: false,
    canManageFinances: false,
    canManageClasses: true,
    canViewReports: true,
    canManageSettings: false,
    canAccessDashboard: true,
    canAccessMemberApp: true,
    canManageRoles: false,
    canViewAllData: false,
  },
  member: {
    canManageUsers: false,
    canManageFinances: false,
    canManageClasses: false,
    canViewReports: false,
    canManageSettings: false,
    canAccessDashboard: false,
    canAccessMemberApp: true,
    canManageRoles: false,
    canViewAllData: false,
  },
  support: {
    canManageUsers: false,
    canManageFinances: false,
    canManageClasses: false,
    canViewReports: true,
    canManageSettings: false,
    canAccessDashboard: true,
    canAccessMemberApp: true,
    canManageRoles: false,
    canViewAllData: false,
  },
  player: {
    canManageUsers: false,
    canManageFinances: false,
    canManageClasses: false,
    canViewReports: false,
    canManageSettings: false,
    canAccessDashboard: false,
    canAccessMemberApp: true,
    canManageRoles: false,
    canViewAllData: false,
  },
  official: {
    canManageUsers: false,
    canManageFinances: false,
    canManageClasses: false,
    canViewReports: true,
    canManageSettings: false,
    canAccessDashboard: true,
    canAccessMemberApp: false,
    canManageRoles: false,
    canViewAllData: false,
  },
  finance: {
    canManageUsers: false,
    canManageFinances: true,
    canManageClasses: false,
    canViewReports: true,
    canManageSettings: false,
    canAccessDashboard: true,
    canAccessMemberApp: false,
    canManageRoles: false,
    canViewAllData: false,
  },
  partner: {
    canManageUsers: false,
    canManageFinances: false,
    canManageClasses: false,
    canViewReports: true,
    canManageSettings: false,
    canAccessDashboard: true,
    canAccessMemberApp: false,
    canManageRoles: false,
    canViewAllData: false,
  },
  'press-news': {
    canManageUsers: false,
    canManageFinances: false,
    canManageClasses: false,
    canViewReports: true,
    canManageSettings: false,
    canAccessDashboard: true,
    canAccessMemberApp: false,
    canManageRoles: false,
    canViewAllData: false,
  },
} as const;

export function PermissionGuard({ children, permission, fallback }: PermissionGuardProps) {
  const { user } = useUser();
  
  if (!user) {
    return fallback || null;
  }

  // Helper function to get user roles from Clerk metadata
  const getUserRoles = (user: any): UserRole[] => {
    const roles = user.publicMetadata?.roles || user.publicMetadata?.user_role;
    
    if (!roles) return ['member'];
    
    // Handle array of roles
    if (Array.isArray(roles)) {
      return roles.filter((role: any) => 
        ['admin', 'trainer', 'member', 'support', 'player', 'official', 'finance', 'partner', 'press-news'].includes(role)
      ) as UserRole[];
    }
    
    // Handle single role (backward compatibility)
    if (typeof roles === 'string' && 
        ['admin', 'trainer', 'member', 'support', 'player', 'official', 'finance', 'partner', 'press-news'].includes(roles)) {
      return [roles as UserRole];
    }
    
    return ['member'];
  };

  // Helper function to get the highest priority role for permissions
  const getHighestPriorityRole = (userRoles: UserRole[]): UserRole => {
    if (!userRoles || userRoles.length === 0) return 'member';
    
    // Priority order: admin > trainer > support > finance > partner > press-news > official > player > member
    if (userRoles.includes('admin')) return 'admin';
    if (userRoles.includes('trainer')) return 'trainer';
    if (userRoles.includes('support')) return 'support';
    if (userRoles.includes('finance')) return 'finance';
    if (userRoles.includes('partner')) return 'partner';
    if (userRoles.includes('press-news')) return 'press-news';
    if (userRoles.includes('official')) return 'official';
    if (userRoles.includes('player')) return 'player';
    return 'member';
  };

  const userRoles = getUserRoles(user);
  const userRole = getHighestPriorityRole(userRoles);
  const permissions = ROLE_PERMISSIONS[userRole];
  
  if (!permissions || !permissions[permission as keyof typeof permissions]) {
    return fallback || null;
  }

  return <>{children}</>;
}

// Helper function to get user roles (exported for use in other components)
export function getUserRoles(user: any): UserRole[] {
  const roles = user?.publicMetadata?.roles || user?.publicMetadata?.user_role;
  
  if (!roles) return ['member'];
  
  // Handle array of roles
  if (Array.isArray(roles)) {
    return roles.filter((role: any) => 
      ['admin', 'trainer', 'member', 'support', 'player', 'official', 'finance', 'partner', 'press-news'].includes(role)
    ) as UserRole[];
  }
  
  // Handle single role (backward compatibility)
  if (typeof roles === 'string' && 
      ['admin', 'trainer', 'member', 'support', 'player', 'official', 'finance', 'partner', 'press-news'].includes(roles)) {
    return [roles as UserRole];
  }
  
  return ['member'];
}

// Helper function to check if user has any of the specified roles
export function hasAnyRole(user: any, roles: UserRole[]): boolean {
  const userRoles = getUserRoles(user);
  return roles.some(role => userRoles.includes(role));
}

// Helper function to check if user has all of the specified roles
export function hasAllRoles(user: any, roles: UserRole[]): boolean {
  const userRoles = getUserRoles(user);
  return roles.every(role => userRoles.includes(role));
} 