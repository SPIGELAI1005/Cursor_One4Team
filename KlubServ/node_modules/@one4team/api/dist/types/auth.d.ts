export type UserRole = 'admin' | 'trainer' | 'member';
export interface AuthenticatedUser {
    userId: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    clubId?: string;
}
export interface RolePermissions {
    canManageUsers: boolean;
    canManageFinances: boolean;
    canManageClasses: boolean;
    canViewReports: boolean;
    canManageSettings: boolean;
    canAccessDashboard: boolean;
    canAccessMemberApp: boolean;
}
export interface AuthRequest extends Request {
    user?: AuthenticatedUser;
}
export interface RoleConfig {
    role: UserRole;
    permissions: RolePermissions;
    description: string;
}
export declare const ROLE_CONFIGS: Record<UserRole, RoleConfig>;
export interface AuthError {
    code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'INVALID_TOKEN' | 'MISSING_TOKEN';
    message: string;
    details?: any;
}
//# sourceMappingURL=auth.d.ts.map