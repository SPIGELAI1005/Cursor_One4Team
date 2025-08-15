import Stripe from 'stripe';
import { prisma } from '../lib/prisma';

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  metadata: {
    clubId: string;
    clubName: string;
  };
}

export interface StripeSubscription {
  id: string;
  customerId: string;
  status: string;
  currentPeriodEnd: Date;
  items: Array<{
    priceId: string;
    quantity: number;
  }>;
}

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  maxSeats: number;
}

/**
 * Stripe Service - Handles all Stripe-related operations for multi-tenant SaaS
 */
export class StripeService {
  /**
   * Create a new Stripe customer for a club
   */
  static async createCustomer(clubData: {
    id: string;
    name: string;
    email: string;
    adminName: string;
  }): Promise<StripeCustomer> {
    try {
      const customer = await stripe.customers.create({
        email: clubData.email,
        name: clubData.name,
        metadata: {
          clubId: clubData.id,
          clubName: clubData.name,
          adminName: clubData.adminName,
        },
        description: `Club: ${clubData.name}`,
      });

      // Update club with Stripe customer ID
      await prisma.club.update({
        where: { id: clubData.id },
        data: {
          stripeCustomerId: customer.id,
          updatedAt: new Date(),
        },
      });

      return {
        id: customer.id,
        email: customer.email!,
        name: customer.name!,
        metadata: {
          clubId: clubData.id,
          clubName: clubData.name,
        },
      };
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Failed to create Stripe customer');
    }
  }

  /**
   * Create a subscription for a club
   */
  static async createSubscription(customerId: string, planId: string, seats: number): Promise<StripeSubscription> {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: planId,
            quantity: seats,
          },
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          type: 'club_subscription',
        },
      });

      return {
        id: subscription.id,
        customerId: subscription.customer as string,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        items: subscription.items.data.map(item => ({
          priceId: item.price.id,
          quantity: item.quantity || 0,
        })),
      };
    } catch (error) {
      console.error('Error creating Stripe subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Update subscription seats
   */
  static async updateSubscriptionSeats(subscriptionId: string, seats: number): Promise<StripeSubscription> {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      if (!subscription.items.data.length) {
        throw new Error('No subscription items found');
      }

      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            quantity: seats,
          },
        ],
      });

      return {
        id: updatedSubscription.id,
        customerId: updatedSubscription.customer as string,
        status: updatedSubscription.status,
        currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000),
        items: updatedSubscription.items.data.map(item => ({
          priceId: item.price.id,
          quantity: item.quantity || 0,
        })),
      };
    } catch (error) {
      console.error('Error updating subscription seats:', error);
      throw new Error('Failed to update subscription');
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await stripe.subscriptions.cancel(subscriptionId);
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Get subscription details
   */
  static async getSubscription(subscriptionId: string): Promise<StripeSubscription | null> {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      return {
        id: subscription.id,
        customerId: subscription.customer as string,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        items: subscription.items.data.map(item => ({
          priceId: item.price.id,
          quantity: item.quantity || 0,
        })),
      };
    } catch (error) {
      console.error('Error retrieving subscription:', error);
      return null;
    }
  }

  /**
   * Get customer details
   */
  static async getCustomer(customerId: string): Promise<StripeCustomer | null> {
    try {
      const customer = await stripe.customers.retrieve(customerId);
      
      if (customer.deleted) {
        return null;
      }

      return {
        id: customer.id,
        email: customer.email!,
        name: customer.name!,
        metadata: {
          clubId: customer.metadata.clubId,
          clubName: customer.metadata.clubName,
        },
      };
    } catch (error) {
      console.error('Error retrieving customer:', error);
      return null;
    }
  }

  /**
   * Create billing portal session
   */
  static async createBillingPortalSession(customerId: string, returnUrl: string): Promise<string> {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return session.url;
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      throw new Error('Failed to create billing portal session');
    }
  }

  /**
   * Create checkout session for subscription
   */
  static async createCheckoutSession(customerId: string, planId: string, seats: number, successUrl: string, cancelUrl: string): Promise<string> {
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: planId,
            quantity: seats,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          type: 'club_subscription',
        },
      });

      return session.url!;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  /**
   * Get available billing plans
   */
  static async getBillingPlans(): Promise<BillingPlan[]> {
    try {
      const prices = await stripe.prices.list({
        active: true,
        expand: ['data.product'],
      });

      return prices.data
        .filter(price => price.type === 'recurring')
        .map(price => {
          const product = price.product as Stripe.Product;
          return {
            id: price.id,
            name: product.name,
            price: price.unit_amount! / 100, // Convert from cents
            currency: price.currency,
            interval: price.recurring!.interval as 'month' | 'year',
            features: product.features?.map(f => f.name) || [],
            maxSeats: parseInt(product.metadata.maxSeats || '10'),
          };
        });
    } catch (error) {
      console.error('Error retrieving billing plans:', error);
      throw new Error('Failed to retrieve billing plans');
    }
  }

  /**
   * Handle webhook events
   */
  static async handleWebhook(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionEvent(event.data.object as Stripe.Subscription);
          break;
        
        case 'customer.subscription.deleted':
          await this.handleSubscriptionCancellation(event.data.object as Stripe.Subscription);
          break;
        
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;
        
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
          break;
        
        default:
          console.log(`Unhandled webhook event: ${event.type}`);
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }

  /**
   * Handle subscription events
   */
  private static async handleSubscriptionEvent(subscription: Stripe.Subscription): Promise<void> {
    const clubId = subscription.metadata.clubId;
    if (!clubId) return;

    await prisma.club.update({
      where: { id: clubId },
      data: {
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Handle subscription cancellation
   */
  private static async handleSubscriptionCancellation(subscription: Stripe.Subscription): Promise<void> {
    const clubId = subscription.metadata.clubId;
    if (!clubId) return;

    await prisma.club.update({
      where: { id: clubId },
      data: {
        subscriptionStatus: 'canceled',
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Handle successful payment
   */
  private static async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    const clubId = invoice.metadata.clubId;
    if (!clubId) return;

    // Update club billing status
    await prisma.club.update({
      where: { id: clubId },
      data: {
        lastBillingDate: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Handle failed payment
   */
  private static async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    const clubId = invoice.metadata.clubId;
    if (!clubId) return;

    // Update club billing status
    await prisma.club.update({
      where: { id: clubId },
      data: {
        subscriptionStatus: 'past_due',
        updatedAt: new Date(),
      },
    });
  }
} 