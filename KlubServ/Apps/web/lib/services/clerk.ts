import { clerkClient } from "@clerk/nextjs/server";

export interface CreateUserParams {
  emailAddress: string;
  firstName: string;
  lastName: string;
  password: string;
  publicMetadata?: Record<string, any>;
  privateMetadata?: Record<string, any>;
}

export interface UpdateUserParams {
  userId: string;
  publicMetadata?: Record<string, any>;
  privateMetadata?: Record<string, any>;
}

export class ClerkService {
  /**
   * Create a new user account in Clerk
   */
  static async createUser(params: CreateUserParams) {
    try {
      const user = await clerkClient.users.createUser({
        emailAddress: [params.emailAddress],
        firstName: params.firstName,
        lastName: params.lastName,
        password: params.password,
        publicMetadata: params.publicMetadata || {},
        privateMetadata: params.privateMetadata || {},
      });

      return { success: true, user };
    } catch (error) {
      console.error('Clerk user creation error:', error);
      return { success: false, error };
    }
  }

  /**
   * Update user metadata
   */
  static async updateUser(params: UpdateUserParams) {
    try {
      const user = await clerkClient.users.updateUser(params.userId, {
        publicMetadata: params.publicMetadata,
        privateMetadata: params.privateMetadata,
      });

      return { success: true, user };
    } catch (error) {
      console.error('Clerk user update error:', error);
      return { success: false, error };
    }
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string) {
    try {
      const users = await clerkClient.users.getUserList({
        emailAddress: [email],
      });

      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Clerk get user error:', error);
      return null;
    }
  }

  /**
   * Send email verification
   */
  static async sendEmailVerification(userId: string) {
    try {
      await clerkClient.users.createEmailVerification({
        userId,
      });

      return { success: true };
    } catch (error) {
      console.error('Clerk email verification error:', error);
      return { success: false, error };
    }
  }

  /**
   * Create organization (club) in Clerk
   */
  static async createOrganization(name: string, slug: string, createdBy: string) {
    try {
      const organization = await clerkClient.organizations.createOrganization({
        name,
        slug,
        createdBy,
      });

      return { success: true, organization };
    } catch (error) {
      console.error('Clerk organization creation error:', error);
      return { success: false, error };
    }
  }

  /**
   * Add user to organization with role
   */
  static async addUserToOrganization(
    organizationId: string,
    userId: string,
    role: string
  ) {
    try {
      await clerkClient.organizations.createOrganizationMembership({
        organizationId,
        userId,
        role,
      });

      return { success: true };
    } catch (error) {
      console.error('Clerk add user to organization error:', error);
      return { success: false, error };
    }
  }
} 