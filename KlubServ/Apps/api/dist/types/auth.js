"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_CONFIGS = void 0;
exports.ROLE_CONFIGS = {
    admin: {
        role: 'admin',
        permissions: {
            canManageUsers: true,
            canManageFinances: true,
            canManageClasses: true,
            canViewReports: true,
            canManageSettings: true,
            canAccessDashboard: true,
            canAccessMemberApp: true,
        },
        description: 'Full system access with user management and financial control',
    },
    trainer: {
        role: 'trainer',
        permissions: {
            canManageUsers: false,
            canManageFinances: false,
            canManageClasses: true,
            canViewReports: true,
            canManageSettings: false,
            canAccessDashboard: true,
            canAccessMemberApp: true,
        },
        description: 'Can manage classes and view reports, limited admin access',
    },
    member: {
        role: 'member',
        permissions: {
            canManageUsers: false,
            canManageFinances: false,
            canManageClasses: false,
            canViewReports: false,
            canManageSettings: false,
            canAccessDashboard: false,
            canAccessMemberApp: true,
        },
        description: 'Basic member access to personal profile and payments',
    },
};
//# sourceMappingURL=auth.js.map