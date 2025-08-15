import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';
import { env } from '@/lib/env';
import { createAuthenticatedUser } from '../utils/getUserRole';
import { AuthenticatedUser, AuthError } from '../types/auth';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      clubId?: string;
    }
  }
}

/**
 * Middleware to verify Clerk JWT token and extract user information
 * Updated to use audience validation for better security
 */
export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error: AuthError = {
        code: 'MISSING_TOKEN',
        message: 'Authorization header missing or invalid',
      };
      res.status(401).json({ error });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the JWT token with Clerk using audience validation
    const payload = await verifyToken(token, {
      audience: env.CLERK_JWT_AUDIENCE,
      issuer: env.CLERK_ISSUER_URL,
    });

    if (!payload.sub) {
      const error: AuthError = {
        code: 'INVALID_TOKEN',
        message: 'Invalid token payload',
      };
      res.status(401).json({ error });
      return;
    }

    // Create authenticated user object
    const user = await createAuthenticatedUser(payload.sub);
    req.user = user;
    
    // Extract club_id from JWT payload and set on request
    const clubId = payload.club_id as string;
    if (clubId) {
      req.clubId = clubId;
    }
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    const authError: AuthError = {
      code: 'INVALID_TOKEN',
      message: 'Invalid or expired token',
      details: env.NODE_ENV === 'development' ? error : undefined,
    };
    
    res.status(401).json({ error: authError });
  }
}

/**
 * Middleware to require authentication (returns 401 if not authenticated)
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    const error: AuthError = {
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    };
    res.status(401).json({ error });
    return;
  }
  next();
}

/**
 * Middleware to require specific roles
 * Updated to support multiple roles per user
 */
export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const error: AuthError = {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      };
      res.status(401).json({ error });
      return;
    }

    // Check if user has any of the required roles
    const hasRequiredRole = req.user.roles.some(role => allowedRoles.includes(role));
    
    if (!hasRequiredRole) {
      const error: AuthError = {
        code: 'FORBIDDEN',
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}. Your roles: ${req.user.roles.join(', ')}`,
      };
      res.status(403).json({ error });
      return;
    }

    next();
  };
}

/**
 * Middleware to require ALL specified roles
 * User must have all of the specified roles to access the resource
 */
export function requireAllRoles(requiredRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const error: AuthError = {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      };
      res.status(401).json({ error });
      return;
    }

    // Check if user has ALL of the required roles
    const hasAllRequiredRoles = requiredRoles.every(role => req.user!.roles.includes(role as any));
    
    if (!hasAllRequiredRoles) {
      const error: AuthError = {
        code: 'FORBIDDEN',
        message: `Access denied. Required ALL roles: ${requiredRoles.join(', ')}. Your roles: ${req.user.roles.join(', ')}`,
      };
      res.status(403).json({ error });
      return;
    }

    next();
  };
}

/**
 * Middleware to require specific permission
 * Updated to work with multiple roles
 */
export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const error: AuthError = {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      };
      res.status(401).json({ error });
      return;
    }

    // Import here to avoid circular dependency
    const { hasPermission } = require('../utils/getUserRole');
    
    if (!hasPermission(req.user.roles, permission as any)) {
      const error: AuthError = {
        code: 'FORBIDDEN',
        message: `Access denied. Required permission: ${permission}. Your roles: ${req.user.roles.join(', ')}`,
      };
      res.status(403).json({ error });
      return;
    }

    next();
  };
}

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring(7);
    
    const payload = await verifyToken(token, {
      audience: env.CLERK_JWT_AUDIENCE,
      issuer: env.CLERK_ISSUER_URL,
    });

    if (payload.sub) {
      const user = await createAuthenticatedUser(payload.sub);
      req.user = user;
    }
    
    next();
  } catch (error) {
    // For optional auth, we just continue without setting req.user
    console.warn('Optional authentication failed:', error);
    next();
  }
}

/**
 * checkRole middleware - validates Clerk JWT and checks user roles
 * Updated to support multiple roles per user and use audience validation
 */
export function checkRole(allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const error: AuthError = {
          code: 'MISSING_TOKEN',
          message: 'Authorization header missing or invalid',
        };
        res.status(401).json({ error });
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      // Verify the JWT token with Clerk using audience validation
      const payload = await verifyToken(token, {
        audience: env.CLERK_JWT_AUDIENCE,
        issuer: env.CLERK_ISSUER_URL,
      });

      if (!payload.sub) {
        const error: AuthError = {
          code: 'INVALID_TOKEN',
          message: 'Invalid token payload',
        };
        res.status(401).json({ error });
        return;
      }

      // Create authenticated user object
      const user = await createAuthenticatedUser(payload.sub);
      req.user = user;

      // Check if user has any of the required roles
      const hasRequiredRole = user.roles.some(role => allowedRoles.includes(role));
      
      if (!hasRequiredRole) {
        const error: AuthError = {
          code: 'FORBIDDEN',
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}. Your roles: ${user.roles.join(', ')}`,
        };
        res.status(403).json({ error });
        return;
      }
      
      next();
    } catch (error) {
      console.error('checkRole middleware error:', error);
      
      const authError: AuthError = {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
        details: env.NODE_ENV === 'development' ? error : undefined,
      };
      
      res.status(401).json({ error: authError });
    }
  };
}

/**
 * checkAllRoles middleware - validates Clerk JWT and checks that user has ALL specified roles
 * Updated to use audience validation
 */
export function checkAllRoles(requiredRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const error: AuthError = {
          code: 'MISSING_TOKEN',
          message: 'Authorization header missing or invalid',
        };
        res.status(401).json({ error });
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      // Verify the JWT token with Clerk using audience validation
      const payload = await verifyToken(token, {
        audience: 'one4team', // Use audience validation
        authorizedParties: [process.env['CLERK_PUBLISHABLE_KEY']!],
      });

      if (!payload.sub) {
        const error: AuthError = {
          code: 'INVALID_TOKEN',
          message: 'Invalid token payload',
        };
        res.status(401).json({ error });
        return;
      }

      // Create authenticated user object
      const user = await createAuthenticatedUser(payload.sub);
      req.user = user;

      // Check if user has ALL of the required roles
      const hasAllRequiredRoles = requiredRoles.every(role => user.roles.includes(role as any));
      
      if (!hasAllRequiredRoles) {
        const error: AuthError = {
          code: 'FORBIDDEN',
          message: `Access denied. Required ALL roles: ${requiredRoles.join(', ')}. Your roles: ${user.roles.join(', ')}`,
        };
        res.status(403).json({ error });
        return;
      }
      
      next();
    } catch (error) {
      console.error('checkAllRoles middleware error:', error);
      
      const authError: AuthError = {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
        details: env.NODE_ENV === 'development' ? error : undefined,
      };
      
      res.status(401).json({ error: authError });
    }
  };
} 