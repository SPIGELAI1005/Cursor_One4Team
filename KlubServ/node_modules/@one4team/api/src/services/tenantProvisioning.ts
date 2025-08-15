import { prisma } from '../lib/prisma';
import { StripeService } from './stripe';
import { ClerkService } from './clerk';
import { EmailService } from './email';
import { v4 as uuidv4 } from 'uuid';

export interface TenantProvisioningData {
  // Club information
  clubName: string;
  sport: string;
  foundedYear?: string;
  description?: string;
  address?: string;
  city: string;
  postalCode?: string;
  country: string;
  phone?: string;
  email: string;
  website?: string;
  memberCount: string;
  ageGroups: string[];
  facilities?: string[];
  achievements?: string;
  
  // Admin information
  adminName: string;
  adminEmail: string;
  adminPhone?: string;
  password: string;
  
  // Billing information
  planId: string;
  seats: number;
}

export interface ProvisionedTenant {
  clubId: string;
  clubName: string;
  adminId: string;
  adminEmail: string;
  stripeCustomerId: string;
  subscriptionId?: string;
  subdomain: string;
}

/**
 * Tenant Provisioning Service - Handles complete tenant setup flow
 */
export class TenantProvisioningService {
  /**
   * Provision a new tenant (club) with complete setup
   */
  static async provisionTenant(data: TenantProvisioningData): Promise<ProvisionedTenant> {
    try {
      // Generate unique club ID and subdomain
      const clubId = uuidv4();
      const subdomain = this.generateSubdomain(data.clubName);
      
      // Create club and admin in database
      const { club, adminUser } = await this.createClubAndAdmin(clubId, subdomain, data);
      
      // Create Stripe customer
      const stripeCustomer = await StripeService.createCustomer({
        id: club.id,
        name: club.name,
        email: club.email,
        adminName: data.adminName,
      });
      
      // Create Stripe subscription
      const subscription = await StripeService.createSubscription(
        stripeCustomer.id,
        data.planId,
        data.seats
      );
      
      // Update club with subscription information
      await prisma.club.update({
        where: { id: club.id },
        data: {
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
          updatedAt: new Date(),
        },
      });
      
      // Create Clerk user account
      const [firstName, ...lastNameParts] = data.adminName.split(' ');
      const lastName = lastNameParts.join(' ') || '';
      
      const clerkResult = await ClerkService.createUser({
        emailAddress: data.adminEmail,
        firstName,
        lastName,
        password: data.password,
        publicMetadata: {
          roles: ['admin'],
          clubId: club.id,
          clubName: club.name,
          club_id: club.id, // For JWT compatibility
        },
        privateMetadata: {
          userId: adminUser.id,
        },
      });
      
      if (!clerkResult.success) {
        console.error('Clerk user creation failed:', clerkResult.error);
        // In production, you might want to rollback the entire transaction
      }
      
      // Send welcome email with setup instructions
      await EmailService.sendWelcomeEmail({
        to: data.adminEmail,
        name: data.adminName,
        clubName: data.clubName,
        subdomain: subdomain,
        setupUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${subdomain}/dashboard`,
      });
      
      // Send admin invitation email
      await EmailService.sendAdminInvitation({
        to: data.adminEmail,
        name: data.adminName,
        clubName: data.clubName,
        subdomain: subdomain,
        invitationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${subdomain}/admin/setup`,
      });
      
      return {
        clubId: club.id,
        clubName: club.name,
        adminId: adminUser.id,
        adminEmail: data.adminEmail,
        stripeCustomerId: stripeCustomer.id,
        subscriptionId: subscription.id,
        subdomain: subdomain,
      };
      
    } catch (error) {
      console.error('Tenant provisioning failed:', error);
      throw new Error('Failed to provision tenant');
    }
  }
  
  /**
   * Create club and admin user in database
   */
  private static async createClubAndAdmin(clubId: string, subdomain: string, data: TenantProvisioningData) {
    return await prisma.$transaction(async (tx) => {
      // Create the club
      const club = await tx.club.create({
        data: {
          id: clubId,
          name: data.clubName,
          sport: data.sport,
          foundedYear: data.foundedYear ? parseInt(data.foundedYear) : null,
          description: data.description || '',
          address: data.address || '',
          city: data.city,
          postalCode: data.postalCode || '',
          country: data.country,
          phone: data.phone || '',
          email: data.email,
          website: data.website || '',
          memberCount: data.memberCount,
          ageGroups: data.ageGroups,
          facilities: data.facilities || [],
          achievements: data.achievements || '',
          subdomain: subdomain,
          isActive: true,
          subscriptionStatus: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      
      // Create the admin user
      const adminUser = await tx.user.create({
        data: {
          email: data.adminEmail,
          name: data.adminName,
          phone: data.adminPhone || '',
          role: 'admin',
          clubId: club.id,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      
      // Create club admin relationship
      await tx.clubAdmin.create({
        data: {
          clubId: club.id,
          userId: adminUser.id,
          role: 'owner',
          createdAt: new Date(),
        },
      });
      
      return { club, adminUser };
    });
  }
  
  /**
   * Generate a unique subdomain from club name
   */
  private static generateSubdomain(clubName: string): string {
    // Convert club name to lowercase and replace spaces/special chars with hyphens
    const baseSubdomain = clubName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Add random suffix to ensure uniqueness
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    
    return `${baseSubdomain}-${randomSuffix}`;
  }
  
  /**
   * Check if subdomain is available
   */
  static async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    const existingClub = await prisma.club.findFirst({
      where: { subdomain: subdomain },
    });
    
    return !existingClub;
  }
  
  /**
   * Get tenant information by club ID
   */
  static async getTenantInfo(clubId: string): Promise<ProvisionedTenant | null> {
    try {
      const club = await prisma.club.findUnique({
        where: { id: clubId },
        include: {
          admins: {
            include: {
              user: true,
            },
          },
        },
      });
      
      if (!club) return null;
      
      const admin = club.admins.find(a => a.role === 'owner')?.user;
      
      return {
        clubId: club.id,
        clubName: club.name,
        adminId: admin?.id || '',
        adminEmail: admin?.email || '',
        stripeCustomerId: club.stripeCustomerId || '',
        subscriptionId: club.stripeSubscriptionId || undefined,
        subdomain: club.subdomain || '',
      };
    } catch (error) {
      console.error('Error getting tenant info:', error);
      return null;
    }
  }
  
  /**
   * Update tenant subscription
   */
  static async updateTenantSubscription(clubId: string, planId: string, seats: number): Promise<void> {
    try {
      const club = await prisma.club.findUnique({
        where: { id: clubId },
      });
      
      if (!club || !club.stripeCustomerId) {
        throw new Error('Club or Stripe customer not found');
      }
      
      if (club.stripeSubscriptionId) {
        // Update existing subscription
        await StripeService.updateSubscriptionSeats(club.stripeSubscriptionId, seats);
      } else {
        // Create new subscription
        const subscription = await StripeService.createSubscription(
          club.stripeCustomerId,
          planId,
          seats
        );
        
        await prisma.club.update({
          where: { id: clubId },
          data: {
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
            updatedAt: new Date(),
          },
        });
      }
    } catch (error) {
      console.error('Error updating tenant subscription:', error);
      throw new Error('Failed to update subscription');
    }
  }
  
  /**
   * Cancel tenant subscription
   */
  static async cancelTenantSubscription(clubId: string): Promise<void> {
    try {
      const club = await prisma.club.findUnique({
        where: { id: clubId },
      });
      
      if (!club || !club.stripeSubscriptionId) {
        throw new Error('Club or subscription not found');
      }
      
      await StripeService.cancelSubscription(club.stripeSubscriptionId);
      
      await prisma.club.update({
        where: { id: clubId },
        data: {
          subscriptionStatus: 'canceled',
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error canceling tenant subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }
  
  /**
   * Get tenant billing information
   */
  static async getTenantBillingInfo(clubId: string) {
    try {
      const club = await prisma.club.findUnique({
        where: { id: clubId },
      });
      
      if (!club || !club.stripeCustomerId) {
        return null;
      }
      
      const customer = await StripeService.getCustomer(club.stripeCustomerId);
      const subscription = club.stripeSubscriptionId 
        ? await StripeService.getSubscription(club.stripeSubscriptionId)
        : null;
      
      return {
        customer,
        subscription,
        clubBilling: {
          subscriptionStatus: club.subscriptionStatus,
          currentPeriodEnd: club.currentPeriodEnd,
          lastBillingDate: club.lastBillingDate,
        },
      };
    } catch (error) {
      console.error('Error getting tenant billing info:', error);
      return null;
    }
  }
} 