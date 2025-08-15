import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

// Validation schemas
const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    relationship: z.string().min(1),
  }).optional(),
});

/**
 * GET /api/member/profile
 * Get current user's profile
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // TODO: Implement database query to get user profile
    res.json({
      message: 'Profile retrieved successfully',
      profile: {
        id: req.user?.userId,
        firstName: req.user?.firstName || 'John',
        lastName: req.user?.lastName || 'Doe',
        email: req.user?.email,
        phone: '+1234567890',
        address: '123 Main St, City, State',
        emergencyContact: {
          name: 'Jane Doe',
          phone: '+1234567891',
          relationship: 'Spouse',
        },
        membershipStatus: 'active',
        joinDate: new Date('2023-01-01').toISOString(),
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      error: 'Failed to fetch profile',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PUT /api/member/profile
 * Update current user's profile
 */
router.put('/', async (req: Request, res: Response) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    
    // TODO: Implement profile update logic
    // 1. Update database
    // 2. Update Clerk user data if needed
    
    res.json({
      message: 'Profile updated successfully',
      updates: validatedData,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }
    
    console.error('Error updating profile:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/member/profile/membership
 * Get membership information
 */
router.get('/membership', async (req: Request, res: Response) => {
  try {
    // TODO: Implement membership query
    
    res.json({
      message: 'Membership information retrieved successfully',
      membership: {
        status: 'active',
        type: 'premium',
        startDate: new Date('2023-01-01').toISOString(),
        endDate: new Date('2024-12-31').toISOString(),
        autoRenew: true,
        monthlyFee: 50.00,
        benefits: [
          'Access to all training sessions',
          'Free equipment rental',
          'Priority booking',
          'Member discounts',
        ],
      },
    });
  } catch (error) {
    console.error('Error fetching membership:', error);
    res.status(500).json({
      error: 'Failed to fetch membership information',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router; 