import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { validateRequest } from '@/middleware/validation';

const router = Router();

// Validation schemas
const createContributionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.number().positive('Amount must be positive'),
  frequency: z.enum(['monthly', 'annual', 'quarterly']),
  status: z.enum(['active', 'inactive']).default('active'),
  assignedTo: z.array(z.string()).default([]),
  description: z.string().optional(),
});

const updateContributionSchema = createContributionSchema.partial();

// GET /api/finance/contributions - Get all contribution plans
router.get('/', async (req, res) => {
  try {
    const plans = await prisma.contributionPlan.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: plans,
    });
  } catch (error) {
    console.error('Error fetching contribution plans:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contribution plans',
    });
  }
});

// POST /api/finance/contributions - Create new contribution plan
router.post('/', validateRequest(createContributionSchema), async (req, res) => {
  try {
    const plan = await prisma.contributionPlan.create({
      data: {
        ...req.body,
        memberCount: 0, // Will be calculated based on assigned members
      },
    });

    res.status(201).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error('Error creating contribution plan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create contribution plan',
    });
  }
});

// PUT /api/finance/contributions/:id - Update contribution plan
router.put('/:id', validateRequest(updateContributionSchema), async (req, res) => {
  try {
    const { id } = req.params;
    
    const plan = await prisma.contributionPlan.update({
      where: { id },
      data: req.body,
    });

    res.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error('Error updating contribution plan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update contribution plan',
    });
  }
});

// DELETE /api/finance/contributions/:id - Delete contribution plan
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.contributionPlan.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Contribution plan deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting contribution plan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete contribution plan',
    });
  }
});

export default router; 