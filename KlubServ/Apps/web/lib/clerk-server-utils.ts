import { clerkClient } from '@clerk/nextjs/server';
import { UserRole } from './clerk-utils';

const CLERK_ROLE_METADATA_KEY = process.env.CLERK_ROLE_METADATA_KEY || 'user_role';

/**
 * Set user role in Clerk metadata (server-side)
 */
export async function setUserRoleInClerk(userId: string, role: UserRole): Promise<void> {
  try {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        [CLERK_ROLE_METADATA_KEY]: role,
      },
    });
  } catch (error) {
    console.error('Error setting user role in Clerk:', error);
    throw new Error('Failed to update user role');
  }
}

/**
 * Get user role from Clerk metadata (server-side)
 */
export async function getUserRoleFromClerk(userId: string): Promise<UserRole> {
  try {
    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata[CLERK_ROLE_METADATA_KEY] as UserRole;
    
    // Validate role is one of the allowed values
    if (role && ['admin', 'trainer', 'member'].includes(role)) {
      return role;
    }
    
    // Return default role if no valid role found
    return 'member';
  } catch (error) {
    console.error('Error fetching user role from Clerk:', error);
    return 'member';
  }
}

/**
 * Get all users with their roles (server-side)
 */
export async function getAllUsersWithRoles() {
  try {
    const users = await clerkClient.users.getUserList();
    
    return users.data.map((user: any) => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.publicMetadata[CLERK_ROLE_METADATA_KEY] as UserRole || 'member',
      createdAt: user.createdAt,
    }));
  } catch (error) {
    console.error('Error fetching users with roles:', error);
    throw new Error('Failed to fetch users');
  }
}

/**
 * Update user's club information in Clerk metadata (server-side)
 */
export async function setUserClubInClerk(userId: string, clubInfo: { name: string; location?: string }): Promise<void> {
  try {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        club: clubInfo,
      },
    });
  } catch (error) {
    console.error('Error setting user club in Clerk:', error);
    throw new Error('Failed to update user club information');
  }
} 