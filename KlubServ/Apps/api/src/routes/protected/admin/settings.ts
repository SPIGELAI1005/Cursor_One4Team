import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

// Validation schemas
const updateSettingsSchema = z.object({
  clubName: z.string().min(1).optional(),
  maxMembers: z.number().positive().optional(),
  allowPublicRegistration: z.boolean().optional(),
  defaultRole: z.enum(['admin', 'trainer', 'member']).optional(),
});

/**
 * GET /api/admin/settings
 * Get system settings (admin only)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // TODO: Implement database query to get settings
    res.json({
      message: 'System settings retrieved successfully',
      settings: {
        clubName: 'One4Team Demo Club',
        maxMembers: 1000,
        allowPublicRegistration: true,
        defaultRole: 'member',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      error: 'Failed to fetch settings',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PUT /api/admin/settings
 * Update system settings (admin only)
 */
router.put('/', async (req: Request, res: Response) => {
  try {
    const validatedData = updateSettingsSchema.parse(req.body);
    
    // TODO: Implement settings update logic
    // 1. Validate settings
    // 2. Update database
    // 3. Apply changes if needed
    
    res.json({
      message: 'Settings updated successfully',
      settings: {
        ...validatedData,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }
    
    console.error('Error updating settings:', error);
    res.status(500).json({
      error: 'Failed to update settings',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/admin/settings/roles
 * Get role configuration (admin only)
 */
router.get('/roles', async (req: Request, res: Response) => {
  try {
    // Import role configs
    const { ROLE_CONFIGS } = require('../../../types/auth');
    
    res.json({
      message: 'Role configuration retrieved successfully',
      roles: ROLE_CONFIGS,
    });
  } catch (error) {
    console.error('Error fetching role configuration:', error);
    res.status(500).json({
      error: 'Failed to fetch role configuration',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router; 