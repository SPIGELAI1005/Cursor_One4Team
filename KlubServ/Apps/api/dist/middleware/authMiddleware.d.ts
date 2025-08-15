import { Request, Response, NextFunction } from 'express';
import { AuthenticatedUser } from '../types/auth';
declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}
export declare function authenticateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function requireAuth(req: Request, res: Response, next: NextFunction): void;
export declare function requireRole(allowedRoles: string[]): (req: Request, res: Response, next: NextFunction) => void;
export declare function requirePermission(permission: string): (req: Request, res: Response, next: NextFunction) => void;
export declare function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function checkRole(allowedRoles: string[]): (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authMiddleware.d.ts.map