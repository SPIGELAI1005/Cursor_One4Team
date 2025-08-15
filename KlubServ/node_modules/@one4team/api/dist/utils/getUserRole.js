"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRoleFromClerk = getUserRoleFromClerk;
exports.setUserRoleInClerk = setUserRoleInClerk;
exports.createAuthenticatedUser = createAuthenticatedUser;
exports.hasPermission = hasPermission;
exports.canAccessResource = canAccessResource;
exports.getRolePermissions = getRolePermissions;
exports.getRoleDescription = getRoleDescription;
const backend_1 = require("@clerk/backend");
const auth_1 = require("../types/auth");
const CLERK_ROLE_METADATA_KEY = process.env.CLERK_ROLE_METADATA_KEY || 'user_role';
const DEFAULT_ROLE = process.env.CLERK_DEFAULT_ROLE || 'member';
async function getUserRoleFromClerk(userId) {
    try {
        const user = await backend_1.clerkClient.users.getUser(userId);
        const role = user.publicMetadata[CLERK_ROLE_METADATA_KEY];
        if (role && Object.keys(auth_1.ROLE_CONFIGS).includes(role)) {
            return role;
        }
        return DEFAULT_ROLE;
    }
    catch (error) {
        console.error('Error fetching user role from Clerk:', error);
        return DEFAULT_ROLE;
    }
}
async function setUserRoleInClerk(userId, role) {
    try {
        await backend_1.clerkClient.users.updateUser(userId, {
            publicMetadata: {
                [CLERK_ROLE_METADATA_KEY]: role,
            },
        });
    }
    catch (error) {
        console.error('Error setting user role in Clerk:', error);
        throw new Error('Failed to update user role');
    }
}
async function createAuthenticatedUser(userId) {
    try {
        const user = await backend_1.clerkClient.users.getUser(userId);
        const role = await getUserRoleFromClerk(userId);
        return {
            userId: user.id,
            email: user.emailAddresses[0]?.emailAddress || '',
            role,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
            clubId: user.publicMetadata.clubId || undefined,
        };
    }
    catch (error) {
        console.error('Error creating authenticated user:', error);
        throw new Error('Failed to create authenticated user');
    }
}
function hasPermission(role, permission) {
    return auth_1.ROLE_CONFIGS[role].permissions[permission];
}
function canAccessResource(userRole, requiredPermission) {
    return hasPermission(userRole, requiredPermission);
}
function getRolePermissions(role) {
    return auth_1.ROLE_CONFIGS[role].permissions;
}
function getRoleDescription(role) {
    return auth_1.ROLE_CONFIGS[role].description;
}
//# sourceMappingURL=getUserRole.js.map