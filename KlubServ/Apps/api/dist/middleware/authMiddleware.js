"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = authenticateUser;
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
exports.requirePermission = requirePermission;
exports.optionalAuth = optionalAuth;
exports.checkRole = checkRole;
const backend_1 = require("@clerk/backend");
const getUserRole_1 = require("../utils/getUserRole");
async function authenticateUser(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const error = {
                code: 'MISSING_TOKEN',
                message: 'Authorization header missing or invalid',
            };
            res.status(401).json({ error });
            return;
        }
        const token = authHeader.substring(7);
        const payload = await (0, backend_1.verifyToken)(token, {
            jwtKey: process.env['CLERK_JWT_KEY'],
            authorizedParties: [process.env['CLERK_PUBLISHABLE_KEY']],
        });
        if (!payload.sub) {
            const error = {
                code: 'INVALID_TOKEN',
                message: 'Invalid token payload',
            };
            res.status(401).json({ error });
            return;
        }
        const user = await (0, getUserRole_1.createAuthenticatedUser)(payload.sub);
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        const authError = {
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired token',
            details: process.env['NODE_ENV'] === 'development' ? error : undefined,
        };
        res.status(401).json({ error: authError });
    }
}
function requireAuth(req, res, next) {
    if (!req.user) {
        const error = {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
        };
        res.status(401).json({ error });
        return;
    }
    next();
}
function requireRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            const error = {
                code: 'UNAUTHORIZED',
                message: 'Authentication required',
            };
            res.status(401).json({ error });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            const error = {
                code: 'FORBIDDEN',
                message: `Access denied. Required roles: ${allowedRoles.join(', ')}. Your role: ${req.user.role}`,
            };
            res.status(403).json({ error });
            return;
        }
        next();
    };
}
function requirePermission(permission) {
    return (req, res, next) => {
        if (!req.user) {
            const error = {
                code: 'UNAUTHORIZED',
                message: 'Authentication required',
            };
            res.status(401).json({ error });
            return;
        }
        const { hasPermission } = require('../utils/getUserRole');
        if (!hasPermission(req.user.role, permission)) {
            const error = {
                code: 'FORBIDDEN',
                message: `Access denied. Required permission: ${permission}. Your role: ${req.user.role}`,
            };
            res.status(403).json({ error });
            return;
        }
        next();
    };
}
async function optionalAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            next();
            return;
        }
        const token = authHeader.substring(7);
        const payload = await (0, backend_1.verifyToken)(token, {
            jwtKey: process.env['CLERK_JWT_KEY'],
            authorizedParties: [process.env['CLERK_PUBLISHABLE_KEY']],
        });
        if (payload.sub) {
            const user = await (0, getUserRole_1.createAuthenticatedUser)(payload.sub);
            req.user = user;
        }
        next();
    }
    catch (error) {
        console.warn('Optional authentication failed:', error);
        next();
    }
}
function checkRole(allowedRoles) {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                const error = {
                    code: 'MISSING_TOKEN',
                    message: 'Authorization header missing or invalid',
                };
                res.status(401).json({ error });
                return;
            }
            const token = authHeader.substring(7);
            const payload = await (0, backend_1.verifyToken)(token, {
                jwtKey: process.env['CLERK_JWT_KEY'],
                authorizedParties: [process.env['CLERK_PUBLISHABLE_KEY']],
            });
            if (!payload.sub) {
                const error = {
                    code: 'INVALID_TOKEN',
                    message: 'Invalid token payload',
                };
                res.status(401).json({ error });
                return;
            }
            const user = await (0, getUserRole_1.createAuthenticatedUser)(payload.sub);
            req.user = user;
            if (!allowedRoles.includes(user.role)) {
                const error = {
                    code: 'FORBIDDEN',
                    message: `Access denied. Required roles: ${allowedRoles.join(', ')}. Your role: ${user.role}`,
                };
                res.status(403).json({ error });
                return;
            }
            next();
        }
        catch (error) {
            console.error('checkRole middleware error:', error);
            const authError = {
                code: 'INVALID_TOKEN',
                message: 'Invalid or expired token',
                details: process.env['NODE_ENV'] === 'development' ? error : undefined,
            };
            res.status(401).json({ error: authError });
        }
    };
}
//# sourceMappingURL=authMiddleware.js.map