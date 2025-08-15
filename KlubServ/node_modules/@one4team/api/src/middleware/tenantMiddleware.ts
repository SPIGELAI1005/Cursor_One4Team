import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { setClubContext } from '../lib/tenantFilter';

/**
 * Middleware to set the current tenant context for database queries
 * This enables Row-Level Security (RLS) policies to work correctly
 */
export async function setTenantContext(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Get club_id from request (set by auth middleware)
    const clubId = req.clubId;
    
    if (clubId) {
      // Set the current tenant context in the database
      // This enables RLS policies to filter data by club_id
      await prisma.$executeRaw`SELECT set_current_tenant(${clubId}::uuid)`;
      
      // Set club context for Prisma middleware
      setClubContext(clubId);
      
      console.log(`🔐 Tenant context set for club: ${clubId}`);
    } else {
      console.warn('⚠️ No club_id found in request, skipping tenant context');
    }
    
    next();
  } catch (error) {
    console.error('❌ Error setting tenant context:', error);
    
    // Don't fail the request, just log the error
    // This allows the application to continue working even if RLS setup is incomplete
    next();
  }
}

/**
 * Middleware to require a valid club_id
 * Use this for routes that require tenant context
 */
export function requireTenant(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.clubId) {
    res.status(400).json({
      error: {
        code: 'MISSING_TENANT',
        message: 'Club ID is required for this operation',
      },
    });
    return;
  }
  
  next();
}

/**
 * Optional tenant context middleware
 * Sets tenant context if available, but doesn't fail if missing
 */
export async function optionalTenantContext(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const clubId = req.clubId;
    
    if (clubId) {
      await prisma.$executeRaw`SELECT set_current_tenant(${clubId}::uuid)`;
      console.log(`🔐 Optional tenant context set for club: ${clubId}`);
    }
    
    next();
  } catch (error) {
    console.warn('⚠️ Optional tenant context failed:', error);
    next();
  }
} 