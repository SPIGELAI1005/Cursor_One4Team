import { UserRole, AuthenticatedUser, ROLE_CONFIGS } from '../types/auth';
export declare function getUserRoleFromClerk(userId: string): Promise<UserRole>;
export declare function setUserRoleInClerk(userId: string, role: UserRole): Promise<void>;
export declare function createAuthenticatedUser(userId: string): Promise<AuthenticatedUser>;
export declare function hasPermission(role: UserRole, permission: keyof typeof ROLE_CONFIGS.admin.permissions): boolean;
export declare function canAccessResource(userRole: UserRole, requiredPermission: keyof typeof ROLE_CONFIGS.admin.permissions): boolean;
export declare function getRolePermissions(role: UserRole): import("../types/auth").RolePermissions;
export declare function getRoleDescription(role: UserRole): string;
//# sourceMappingURL=getUserRole.d.ts.map