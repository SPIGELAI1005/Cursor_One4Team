import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { setUserRolesInClerk, setUserRoleInClerk, addUserRoleInClerk, removeUserRoleInClerk } from '../../../utils/getUserRole';

const router = Router();

// Validation schemas
const updateMemberRolesSchema = z.object({
  roles: z.array(z.enum(['admin', 'trainer', 'member', 'support', 'player', 'official', 'finance', 'partner', 'press-news'])).min(1),
});

const updateMemberRoleSchema = z.object({
  role: z.enum(['admin', 'trainer', 'member', 'support', 'player', 'official', 'finance', 'partner', 'press-news']),
});

const addMemberRoleSchema = z.object({
  role: z.enum(['admin', 'trainer', 'member', 'support', 'player', 'official', 'finance', 'partner', 'press-news']),
});

const removeMemberRoleSchema = z.object({
  role: z.enum(['admin', 'trainer', 'member', 'support', 'player', 'official', 'finance', 'partner', 'press-news']),
});

const createMemberSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  roles: z.array(z.enum(['admin', 'trainer', 'member', 'support', 'player', 'official', 'finance', 'partner', 'press-news'])).default(['member']),
  clubId: z.string().optional(),
});

/**
 * GET /api/admin/members
 * Get all members (admin only)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // TODO: Implement database query to get all members
    res.json({
      message: 'All members retrieved successfully',
      users: [
        {
          id: '1',
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          roles: ['admin'],
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          email: 'trainer@example.com',
          firstName: 'John',
          lastName: 'Trainer',
          roles: ['trainer'],
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          email: 'member@example.com',
          firstName: 'Jane',
          lastName: 'Member',
          roles: ['member'],
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          email: 'multi@example.com',
          firstName: 'Multi',
          lastName: 'Role',
          roles: ['trainer', 'player'],
          createdAt: new Date().toISOString(),
        },
      ],
      total: 4,
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({
      error: 'Failed to fetch members',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/admin/members
 * Create a new member (admin only)
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = createMemberSchema.parse(req.body);
    
    // TODO: Implement member creation logic
    // 1. Create user in Clerk
    // 2. Set roles in Clerk metadata
    // 3. Create member record in database
    
    res.status(201).json({
      message: 'Member created successfully',
      user: {
        id: 'new-member-id',
        ...validatedData,
        createdAt: new Date().toISOString(),
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
    
    console.error('Error creating member:', error);
    res.status(500).json({
      error: 'Failed to create member',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PUT /api/admin/members/:userId/roles
 * Update member roles (admin only) - NEW: Supports multiple roles
 */
router.put('/:userId/roles', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const validatedData = updateMemberRolesSchema.parse(req.body);
    
    // Update roles in Clerk
    await setUserRolesInClerk(validatedData.roles);
    
    // TODO: Update roles in database if needed
    
    res.json({
      message: 'Member roles updated successfully',
      userId,
      newRoles: validatedData.roles,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }
    
    console.error('Error updating member roles:', error);
    res.status(500).json({
      error: 'Failed to update member roles',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PUT /api/admin/members/:userId/role
 * Update member role (admin only) - LEGACY: Single role for backward compatibility
 */
router.put('/:userId/role', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const validatedData = updateMemberRoleSchema.parse(req.body);
    
    // Update role in Clerk (converts to single role array)
    await setUserRoleInClerk(validatedData.role);
    
    // TODO: Update role in database if needed
    
    res.json({
      message: 'Member role updated successfully',
      userId,
      newRole: validatedData.role,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }
    
    console.error('Error updating member role:', error);
    res.status(500).json({
      error: 'Failed to update member role',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/admin/members/:userId/roles
 * Add a role to member (admin only) - NEW: Add single role to existing roles
 */
router.post('/:userId/roles', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const validatedData = addMemberRoleSchema.parse(req.body);
    
    // Add role to user's existing roles
    await addUserRoleInClerk(userId, validatedData.role);
    
    res.json({
      message: 'Role added to member successfully',
      userId,
      addedRole: validatedData.role,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }
    
    console.error('Error adding role to member:', error);
    res.status(500).json({
      error: 'Failed to add role to member',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * DELETE /api/admin/members/:userId/roles/:role
 * Remove a role from member (admin only) - NEW: Remove single role from existing roles
 */
router.delete('/:userId/roles/:role', async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.params;
    
    // Validate role parameter
    const validRoles = ['admin', 'trainer', 'member', 'support', 'player', 'official', 'finance', 'partner', 'press-news'];
    if (!validRoles.includes(role)) {
      res.status(400).json({
        error: 'Invalid role',
        message: `Role must be one of: ${validRoles.join(', ')}`,
      });
      return;
    }
    
    // Remove role from user's existing roles
    await removeUserRoleInClerk(userId, role as any);
    
    res.json({
      message: 'Role removed from member successfully',
      userId,
      removedRole: role,
    });
  } catch (error) {
    console.error('Error removing role from member:', error);
    res.status(500).json({
      error: 'Failed to remove role from member',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * DELETE /api/admin/members/:userId
 * Delete a member (admin only)
 */
router.delete('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // TODO: Implement member deletion logic
    // 1. Delete from Clerk
    // 2. Delete from database
    
    res.json({
      message: 'Member deleted successfully',
      userId,
    });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({
      error: 'Failed to delete member',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router; 