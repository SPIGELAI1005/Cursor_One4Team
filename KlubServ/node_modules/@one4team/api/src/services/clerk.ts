import { clerkClient } from '@clerk/backend';

export interface CreateUserData {
  emailAddress: string;
  firstName: string;
  lastName: string;
  password: string;
  publicMetadata?: Record<string, any>;
}

export interface ClerkUser {
  id: string;
  emailAddresses: Array<{
    emailAddress: string;
    id: string;
  }>;
  firstName: string;
  lastName: string;
  publicMetadata: Record<string, any>;
}

/**
 * Clerk Service - Handles user management operations
 */
export class ClerkService {
  /**
   * Create a new user in Clerk
   */
  static async createUser(data: CreateUserData): Promise<ClerkUser> {
    try {
      const user = await clerkClient.users.createUser({
        emailAddress: [data.emailAddress],
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        publicMetadata: data.publicMetadata || {},
      });

      return {
        id: user.id,
        emailAddresses: user.emailAddresses,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        publicMetadata: user.publicMetadata,
      };
    } catch (error) {
      console.error('Error creating Clerk user:', error);
      throw new Error('Failed to create user account');
    }
  }

  /**
   * Get user by ID
   */
  static async getUser(userId: string): Promise<ClerkUser | null> {
    try {
      const user = await clerkClient.users.getUser(userId);
      
      return {
        id: user.id,
        emailAddresses: user.emailAddresses,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        publicMetadata: user.publicMetadata,
      };
    } catch (error) {
      console.error('Error getting Clerk user:', error);
      return null;
    }
  }

  /**
   * Update user metadata
   */
  static async updateUserMetadata(userId: string, metadata: Record<string, any>): Promise<void> {
    try {
      await clerkClient.users.updateUser(userId, {
        publicMetadata: metadata,
      });
    } catch (error) {
      console.error('Error updating user metadata:', error);
      throw new Error('Failed to update user metadata');
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      await clerkClient.users.deleteUser(userId);
    } catch (error) {
      console.error('Error deleting Clerk user:', error);
      throw new Error('Failed to delete user account');
    }
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<ClerkUser | null> {
    try {
      const users = await clerkClient.users.getUserList({
        emailAddress: [email],
      });

      if (users.length === 0) {
        return null;
      }

      const user = users[0];
      return {
        id: user.id,
        emailAddresses: user.emailAddresses,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        publicMetadata: user.publicMetadata,
      };
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }
} 