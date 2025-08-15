import { Router } from 'express';
import { StripeService } from '../../services/stripe';
import Stripe from 'stripe';

const router = Router();

// POST /api/public/webhooks/stripe - Handle Stripe webhooks
router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !endpointSecret) {
    console.error('Missing Stripe signature or webhook secret');
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    });

    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  try {
    // Handle the webhook event
    await StripeService.handleWebhook(event);
    
    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

export default router; 