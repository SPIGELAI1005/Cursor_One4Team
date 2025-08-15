import { clerkClient } from '@clerk/backend';
import { UserRole, AuthenticatedUser, ROLE_CONFIGS } from '../types/auth';

const CLERK_ROLE_METADATA_KEY = process.env.CLERK_ROLE_METADATA_KEY || 'roles';
const CLERK_SINGLE_ROLE_METADATA_KEY = process.env.CLERK_SINGLE_ROLE_METADATA_KEY || 'user_role';
const DEFAULT_ROLE: UserRole = (process.env.CLERK_DEFAULT_ROLE as UserRole) || 'member';

/**
 * Extract user roles from Clerk user metadata
 * Updated to support both single role and multiple roles
 */
export async function getUserRolesFromClerk(userId: string): Promise<UserRole[]> {
  try {
    const user = await clerkClient.users.getUser(userId);
    
    // Check for roles array first (new multi-role system)
    const rolesArray = user.publicMetadata[CLERK_ROLE_METADATA_KEY] as UserRole[];
    if (rolesArray && Array.isArray(rolesArray)) {
      return rolesArray.filter(role => Object.keys(ROLE_CONFIGS).includes(role));
    }
    
    // Fallback to single role (backward compatibility)
    const singleRole = user.publicMetadata[CLERK_SINGLE_ROLE_METADATA_KEY] as UserRole;
    if (singleRole && Object.keys(ROLE_CONFIGS).includes(singleRole)) {
      return [singleRole];
    }
    
    // Return default role if no valid role found
    return [DEFAULT_ROLE];
  } catch (error) {
    console.error('Error fetching user roles from Clerk:', error);
    return [DEFAULT_ROLE];
  }
}

/**
 * Extract single user role from Clerk user metadata (backward compatibility)
 */
export async function getUserRoleFromClerk(userId: string): Promise<UserRole> {
  const roles = await getUserRolesFromClerk(userId);
  return roles[0] || DEFAULT_ROLE;
}

/**
 * Set user roles in Clerk metadata
 * Updated to support multiple roles
 */
export async function setUserRolesInClerk(userId: string, roles: UserRole[]): Promise<void> {
  try {
    // Validate roles
    const validRoles = roles.filter(role => Object.keys(ROLE_CONFIGS).includes(role));
    
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        [CLERK_ROLE_METADATA_KEY]: validRoles,
        // Keep single role for backward compatibility
        [CLERK_SINGLE_ROLE_METADATA_KEY]: validRoles[0] || DEFAULT_ROLE,
      },
    });
  } catch (error) {
    console.error('Error setting user roles in Clerk:', error);
    throw new Error('Failed to update user roles');
  }
}

/**
 * Set single user role in Clerk metadata (backward compatibility)
 */
export async function setUserRoleInClerk(userId: string, role: UserRole): Promise<void> {
  await setUserRolesInClerk(userId, [role]);
}

/**
 * Add a role to user's existing roles
 */
export async function addUserRoleInClerk(userId: string, role: UserRole): Promise<void> {
  try {
    const currentRoles = await getUserRolesFromClerk(userId);
    const newRoles = [...new Set([...currentRoles, role])];
    await setUserRolesInClerk(userId, newRoles);
  } catch (error) {
    console.error('Error adding user role in Clerk:', error);
    throw new Error('Failed to add user role');
  }
}

/**
 * Remove a role from user's existing roles
 */
export async function removeUserRoleInClerk(userId: string, role: UserRole): Promise<void> {
  try {
    const currentRoles = await getUserRolesFromClerk(userId);
    const newRoles = currentRoles.filter(r => r !== role);
    
    // Ensure user has at least one role
    if (newRoles.length === 0) {
      newRoles.push(DEFAULT_ROLE);
    }
    
    await setUserRolesInClerk(userId, newRoles);
  } catch (error) {
    console.error('Error removing user role in Clerk:', error);
    throw new Error('Failed to remove user role');
  }
}

/**
 * Create authenticated user object from Clerk user data
 * Updated to support multiple roles
 */
export async function createAuthenticatedUser(userId: string): Promise<AuthenticatedUser> {
  try {
    const user = await clerkClient.users.getUser(userId);
    const roles = await getUserRolesFromClerk(userId);
    
    return {
      userId: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      roles,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      clubId: user.publicMetadata.clubId as string || undefined,
    };
  } catch (error) {
    console.error('Error creating authenticated user:', error);
    throw new Error('Failed to create authenticated user');
  }
}

/**
 * Validate if a user has a specific permission
 * Updated to work with multiple roles
 */
export function hasPermission(userRoles: UserRole[], permission: keyof typeof ROLE_CONFIGS.admin.permissions): boolean {
  // Check if any of the user's roles have the required permission
  return userRoles.some(role => ROLE_CONFIGS[role].permissions[permission]);
}

/**
 * Validate if a role has a specific permission (backward compatibility)
 */
export function hasRolePermission(role: UserRole, permission: keyof typeof ROLE_CONFIGS.admin.permissions): boolean {
  return ROLE_CONFIGS[role].permissions[permission];
}

/**
 * Check if user can access a specific resource
 */
export function canAccessResource(userRoles: UserRole[], requiredPermission: keyof typeof ROLE_CONFIGS.admin.permissions): boolean {
  return hasPermission(userRoles, requiredPermission);
}

/**
 * Get all permissions for a user's roles
 */
export function getUserPermissions(userRoles: UserRole[]) {
  const permissions: Record<string, boolean> = {};
  
  // Initialize all permissions to false
  const allPermissions = Object.keys(ROLE_CONFIGS.admin.permissions) as Array<keyof typeof ROLE_CONFIGS.admin.permissions>;
  allPermissions.forEach(permission => {
    permissions[permission] = false;
  });
  
  // Set permissions to true if any role has them
  userRoles.forEach(role => {
    const rolePermissions = ROLE_CONFIGS[role].permissions;
    allPermissions.forEach(permission => {
      if (rolePermissions[permission]) {
        permissions[permission] = true;
      }
    });
  });
  
  return permissions;
}

/**
 * Get role description
 */
export function getRoleDescription(role: UserRole): string {
  return ROLE_CONFIGS[role].description;
}

/**
 * Get all available roles
 */
export function getAllRoles(): UserRole[] {
  return Object.keys(ROLE_CONFIGS) as UserRole[];
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'trainer':
      return 'Trainer';
    case 'official':
      return 'Club Official';
    case 'finance':
      return 'Finance Manager';
    case 'partner':
      return 'Partner';
    case 'support':
      return 'Support';
    case 'player':
      return 'Player';
    case 'press-news':
      return 'Press & News';
    case 'member':
      return 'Member';
    default:
      return 'User';
  }
} 