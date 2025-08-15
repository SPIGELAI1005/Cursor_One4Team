"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const updateSettingsSchema = zod_1.z.object({
    clubName: zod_1.z.string().min(1).optional(),
    maxMembers: zod_1.z.number().positive().optional(),
    allowPublicRegistration: zod_1.z.boolean().optional(),
    defaultRole: zod_1.z.enum(['admin', 'trainer', 'member']).optional(),
});
router.get('/', async (req, res) => {
    try {
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
    }
    catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({
            error: 'Failed to fetch settings',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.put('/', async (req, res) => {
    try {
        const validatedData = updateSettingsSchema.parse(req.body);
        res.json({
            message: 'Settings updated successfully',
            settings: {
                ...validatedData,
                updatedAt: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
router.get('/roles', async (req, res) => {
    try {
        const { ROLE_CONFIGS } = require('../../../types/auth');
        res.json({
            message: 'Role configuration retrieved successfully',
            roles: ROLE_CONFIGS,
        });
    }
    catch (error) {
        console.error('Error fetching role configuration:', error);
        res.status(500).json({
            error: 'Failed to fetch role configuration',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=settings.js.map