import { Router } from 'express';
import { authenticateUser, requireAuth } from '../../middleware/authMiddleware';
import { TenantProvisioningService } from '../../services/tenantProvisioning';
import { StripeService } from '../../services/stripe';
import { z } from 'zod';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);
router.use(requireAuth);

// GET /api/billing/plans - Get available billing plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await StripeService.getBillingPlans();
    
    res.json({
      success: true,
      data: plans,
    });
  } catch (error) {
    console.error('Error fetching billing plans:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch billing plans',
    });
  }
});

// GET /api/billing/tenant-info - Get current tenant billing information
router.get('/tenant-info', async (req, res) => {
  try {
    const clubId = req.clubId;
    if (!clubId) {
      return res.status(400).json({
        success: false,
        error: 'Club ID not found in request',
      });
    }

    const tenantInfo = await TenantProvisioningService.getTenantInfo(clubId);
    if (!tenantInfo) {
      return res.status(404).json({
        success: false,
        error: 'Tenant not found',
      });
    }

    const billingInfo = await TenantProvisioningService.getTenantBillingInfo(clubId);

    res.json({
      success: true,
      data: {
        tenant: tenantInfo,
        billing: billingInfo,
      },
    });
  } catch (error) {
    console.error('Error fetching tenant info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tenant information',
    });
  }
});

// POST /api/billing/update-subscription - Update subscription seats
const updateSubscriptionSchema = z.object({
  seats: z.number().min(1).max(1000),
});

router.post('/update-subscription', async (req, res) => {
  try {
    const validationResult = updateSubscriptionSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors,
      });
    }

    const { seats } = validationResult.data;
    const clubId = req.clubId;
    
    if (!clubId) {
      return res.status(400).json({
        success: false,
        error: 'Club ID not found in request',
      });
    }

    // Get current plan ID from existing subscription
    const tenantInfo = await TenantProvisioningService.getTenantInfo(clubId);
    if (!tenantInfo || !tenantInfo.subscriptionId) {
      return res.status(404).json({
        success: false,
        error: 'No active subscription found',
      });
    }

    const subscription = await StripeService.getSubscription(tenantInfo.subscriptionId);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found',
      });
    }

    const planId = subscription.items[0]?.priceId;
    if (!planId) {
      return res.status(400).json({
        success: false,
        error: 'No plan found in subscription',
      });
    }

    await TenantProvisioningService.updateTenantSubscription(clubId, planId, seats);

    res.json({
      success: true,
      message: 'Subscription updated successfully',
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update subscription',
    });
  }
});

// POST /api/billing/cancel-subscription - Cancel subscription
router.post('/cancel-subscription', async (req, res) => {
  try {
    const clubId = req.clubId;
    
    if (!clubId) {
      return res.status(400).json({
        success: false,
        error: 'Club ID not found in request',
      });
    }

    await TenantProvisioningService.cancelTenantSubscription(clubId);

    res.json({
      success: true,
      message: 'Subscription canceled successfully',
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel subscription',
    });
  }
});

// POST /api/billing/portal-session - Create billing portal session
router.post('/portal-session', async (req, res) => {
  try {
    const clubId = req.clubId;
    
    if (!clubId) {
      return res.status(400).json({
        success: false,
        error: 'Club ID not found in request',
      });
    }

    const tenantInfo = await TenantProvisioningService.getTenantInfo(clubId);
    if (!tenantInfo || !tenantInfo.stripeCustomerId) {
      return res.status(404).json({
        success: false,
        error: 'No billing customer found',
      });
    }

    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${tenantInfo.subdomain}/dashboard/billing`;
    const portalUrl = await StripeService.createBillingPortalSession(
      tenantInfo.stripeCustomerId,
      returnUrl
    );

    res.json({
      success: true,
      data: {
        portalUrl,
      },
    });
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create billing portal session',
    });
  }
});

// POST /api/billing/checkout-session - Create checkout session for new subscription
const checkoutSessionSchema = z.object({
  planId: z.string().min(1),
  seats: z.number().min(1).max(1000),
});

router.post('/checkout-session', async (req, res) => {
  try {
    const validationResult = checkoutSessionSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors,
      });
    }

    const { planId, seats } = validationResult.data;
    const clubId = req.clubId;
    
    if (!clubId) {
      return res.status(400).json({
        success: false,
        error: 'Club ID not found in request',
      });
    }

    const tenantInfo = await TenantProvisioningService.getTenantInfo(clubId);
    if (!tenantInfo || !tenantInfo.stripeCustomerId) {
      return res.status(404).json({
        success: false,
        error: 'No billing customer found',
      });
    }

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${tenantInfo.subdomain}/dashboard/billing?success=true`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${tenantInfo.subdomain}/dashboard/billing?canceled=true`;

    const checkoutUrl = await StripeService.createCheckoutSession(
      tenantInfo.stripeCustomerId,
      planId,
      seats,
      successUrl,
      cancelUrl
    );

    res.json({
      success: true,
      data: {
        checkoutUrl,
      },
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create checkout session',
    });
  }
});

// GET /api/billing/subdomain-availability - Check if subdomain is available
router.get('/subdomain-availability', async (req, res) => {
  try {
    const { subdomain } = req.query;
    
    if (!subdomain || typeof subdomain !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Subdomain parameter is required',
      });
    }

    const isAvailable = await TenantProvisioningService.isSubdomainAvailable(subdomain);

    res.json({
      success: true,
      data: {
        subdomain,
        available: isAvailable,
      },
    });
  } catch (error) {
    console.error('Error checking subdomain availability:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check subdomain availability',
    });
  }
});

export default router; 