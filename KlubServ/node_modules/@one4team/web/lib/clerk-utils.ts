import { UserResource } from '@clerk/types';
import { ActivityType, getActivityTypeConfig, getDefaultClubConfig } from './club-config';

export type UserRole = 'admin' | 'trainer' | 'member' | 'official' | 'finance' | 'partner' | 'support' | 'player' | 'press-news';

/**
 * Get JWT token with proper template configuration for API requests
 * This ensures consistent token fetching across the application
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    // Import useAuth dynamically to avoid SSR issues
    const { useAuth } = await import('@clerk/nextjs');
    const { getToken } = useAuth();
    
    // Get token with one4team template for proper audience validation
    const token = await getToken({ template: 'one4team' });
    return token;
  } catch (error) {
    console.error('Error fetching auth token:', error);
    return null;
  }
}

/**
 * Create authenticated fetch request with JWT token and club context
 * This utility ensures all API requests include proper authentication and tenant context
 */
export async function authenticatedFetch(
  url: string, 
  options: RequestInit = {},
  clubId?: string
): Promise<Response> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication token not available');
  }
  
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  // Add club_id header if provided
  if (clubId) {
    headers['X-Club-ID'] = clubId;
  }
  
  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Get user roles from Clerk metadata
 * Supports both single role strings and arrays of roles
 * Updated to prioritize roles array over user_role for multi-role support
 */
export function getUserRoles(user: UserResource | null): UserRole[] {
  if (!user) return ['member'];
  
  // Check for roles array first (new multi-role system)
  const rolesArray = user.publicMetadata?.roles;
  if (rolesArray && Array.isArray(rolesArray)) {
    return rolesArray.filter(role => 
      ['admin', 'trainer', 'member', 'official', 'finance', 'partner', 'support', 'player', 'press-news'].includes(role)
    ) as UserRole[];
  }
  
  // Fallback to single role (backward compatibility)
  const userRole = user.publicMetadata?.user_role;
  if (userRole && typeof userRole === 'string' && 
      ['admin', 'trainer', 'member', 'official', 'finance', 'partner', 'support', 'player', 'press-news'].includes(userRole)) {
    return [userRole as UserRole];
  }
  
  return ['member'];
}

/**
 * Get user's club information from Clerk metadata
 */
export function getUserClub(user: UserResource | null): { name: string; location?: string; activityType?: ActivityType; logo?: string } {
  if (!user) return { name: 'Sports Club' };
  
  const clubInfo = user.publicMetadata?.club;
  
  if (clubInfo && typeof clubInfo === 'object') {
    return {
      name: (clubInfo as any).name || 'Sports Club',
      location: (clubInfo as any).location,
      activityType: (clubInfo as any).activityType || 'training',
      logo: (clubInfo as any).logo
    };
  }
  
  // Fallback to default club name
  return { name: 'Sports Club', activityType: 'training' };
}

/**
 * Get user's club configuration including activity type settings
 */
export function getUserClubConfig(user: UserResource | null) {
  const clubInfo = getUserClub(user);
  return getActivityTypeConfig(clubInfo.activityType || 'training');
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: UserResource | null, role: UserRole): boolean {
  const userRoles = getUserRoles(user);
  return userRoles.includes(role);
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: UserResource | null, roles: UserRole[]): boolean {
  const userRoles = getUserRoles(user);
  return userRoles.some(role => roles.includes(role));
}

/**
 * Check if user has all of the specified roles
 */
export function hasAllRoles(user: UserResource | null, roles: UserRole[]): boolean {
  const userRoles = getUserRoles(user);
  return userRoles.every(role => roles.includes(role));
}

/**
 * Get the highest priority role for a user
 * Priority: admin > trainer > support > finance > partner > press-news > official > player > member
 */
export function getHighestPriorityRole(user: UserResource | null): UserRole {
  const userRoles = getUserRoles(user);
  
  if (userRoles.includes('admin')) return 'admin';
  if (userRoles.includes('trainer')) return 'trainer';
  if (userRoles.includes('support')) return 'support';
  if (userRoles.includes('finance')) return 'finance';
  if (userRoles.includes('partner')) return 'partner';
  if (userRoles.includes('press-news')) return 'press-news';
  if (userRoles.includes('official')) return 'official';
  if (userRoles.includes('player')) return 'player';
  return 'member';
}

/**
 * Get the appropriate role for a specific dashboard context
 * This ensures the welcome message shows the correct role for each area
 */
export function getContextualRole(user: UserResource | null, context: 'admin' | 'trainer' | 'member' | 'official' | 'finance' | 'partner' | 'support' | 'player' | 'press-news' | 'dashboard'): UserRole {
  const userRoles = getUserRoles(user);
  
  // For specific contexts, check if user has that role
  if (context === 'admin' && userRoles.includes('admin')) {
    return 'admin';
  }
  
  if (context === 'trainer' && userRoles.includes('trainer')) {
    return 'trainer';
  }
  
  if (context === 'official' && userRoles.includes('official')) {
    return 'official';
  }
  
  if (context === 'finance' && userRoles.includes('finance')) {
    return 'finance';
  }
  
  if (context === 'partner' && userRoles.includes('partner')) {
    return 'partner';
  }
  
  if (context === 'support' && userRoles.includes('support')) {
    return 'support';
  }
  
  if (context === 'player' && userRoles.includes('player')) {
    return 'player';
  }
  
  if (context === 'press-news' && userRoles.includes('press-news')) {
    return 'press-news';
  }
  
  if (context === 'member' && userRoles.includes('member')) {
    return 'member';
  }
  
  // For general dashboard context, return highest priority role
  if (context === 'dashboard') {
    return getHighestPriorityRole(user);
  }
  
  // Fallback to highest priority role
  return getHighestPriorityRole(user);
}

/**
 * Get a user-friendly role display name
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

/**
 * Debug function to log user role information
 */
export function debugUserRoles(user: UserResource | null): void {
  if (!user) {
    console.log('No user found');
    return;
  }
  
  console.log('User:', user.firstName, user.lastName);
  console.log('Raw metadata:', user.publicMetadata);
  console.log('Parsed roles:', getUserRoles(user));
  console.log('User club:', getUserClub(user));
  console.log('Club config:', getUserClubConfig(user));
  console.log('Highest priority role:', getHighestPriorityRole(user));
  console.log('Has admin role:', hasRole(user, 'admin'));
  console.log('Has trainer role:', hasRole(user, 'trainer'));
  console.log('Has support role:', hasRole(user, 'support'));
  console.log('Has finance role:', hasRole(user, 'finance'));
  console.log('Has partner role:', hasRole(user, 'partner'));
  console.log('Has press-news role:', hasRole(user, 'press-news'));
  console.log('Has official role:', hasRole(user, 'official'));
  console.log('Has player role:', hasRole(user, 'player'));
  console.log('Has member role:', hasRole(user, 'member'));
}

/**
 * Set user roles in Clerk metadata
 * This function is used by admin APIs to update user roles
 * Updated to support multiple roles
 */
export async function setUserRolesInClerk(userId: string, roles: UserRole[]): Promise<void> {
  // This would typically call Clerk's API to update user metadata
  // For now, we'll just log the action
  console.log(`Setting roles ${roles.join(', ')} for user ${userId}`);
  
  // In a real implementation, you would call Clerk's API:
  // await clerkClient.users.updateUser(userId, {
  //   publicMetadata: { roles: roles }
  // });
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
  // This would get current roles and add the new one
  console.log(`Adding role ${role} to user ${userId}`);
  
  // In a real implementation:
  // const user = await clerkClient.users.getUser(userId);
  // const currentRoles = getUserRoles(user);
  // const newRoles = [...new Set([...currentRoles, role])];
  // await setUserRolesInClerk(userId, newRoles);
}

/**
 * Remove a role from user's existing roles
 */
export async function removeUserRoleInClerk(userId: string, role: UserRole): Promise<void> {
  // This would get current roles and remove the specified one
  console.log(`Removing role ${role} from user ${userId}`);
  
  // In a real implementation:
  // const user = await clerkClient.users.getUser(userId);
  // const currentRoles = getUserRoles(user);
  // const newRoles = currentRoles.filter(r => r !== role);
  // await setUserRolesInClerk(userId, newRoles);
}

/**
 * Get all users with their roles from Clerk
 * This function is used by admin APIs to list users
 */
export async function getAllUsersWithRoles(): Promise<Array<{
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  roles: UserRole[];
  createdAt: Date;
}>> {
  // This would typically call Clerk's API to get all users
  // For now, we'll return mock data
  console.log('Getting all users with roles');
  
  // In a real implementation, you would call Clerk's API:
  // const users = await clerkClient.users.getUserList();
  // return users.map(user => ({
  //   id: user.id,
  //   firstName: user.firstName,
  //   lastName: user.lastName,
  //   email: user.emailAddresses[0]?.emailAddress || '',
  //   roles: getUserRoles(user),
  //   createdAt: user.createdAt
  // }));
  
  return [];
} 