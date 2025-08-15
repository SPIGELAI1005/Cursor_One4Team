"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const updateProfileSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).optional(),
    lastName: zod_1.z.string().min(1).optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    emergencyContact: zod_1.z.object({
        name: zod_1.z.string().min(1),
        phone: zod_1.z.string().min(1),
        relationship: zod_1.z.string().min(1),
    }).optional(),
});
router.get('/', async (req, res) => {
    try {
        res.json({
            message: 'Profile retrieved successfully',
            profile: {
                id: req.user?.userId,
                firstName: req.user?.firstName || 'John',
                lastName: req.user?.lastName || 'Doe',
                email: req.user?.email,
                phone: '+1234567890',
                address: '123 Main St, City, State',
                emergencyContact: {
                    name: 'Jane Doe',
                    phone: '+1234567891',
                    relationship: 'Spouse',
                },
                membershipStatus: 'active',
                joinDate: new Date('2023-01-01').toISOString(),
                lastUpdated: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            error: 'Failed to fetch profile',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.put('/', async (req, res) => {
    try {
        const validatedData = updateProfileSchema.parse(req.body);
        res.json({
            message: 'Profile updated successfully',
            updates: validatedData,
            lastUpdated: new Date().toISOString(),
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
        console.error('Error updating profile:', error);
        res.status(500).json({
            error: 'Failed to update profile',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.get('/membership', async (req, res) => {
    try {
        res.json({
            message: 'Membership information retrieved successfully',
            membership: {
                status: 'active',
                type: 'premium',
                startDate: new Date('2023-01-01').toISOString(),
                endDate: new Date('2024-12-31').toISOString(),
                autoRenew: true,
                monthlyFee: 50.00,
                benefits: [
                    'Access to all training sessions',
                    'Free equipment rental',
                    'Priority booking',
                    'Member discounts',
                ],
            },
        });
    }
    catch (error) {
        console.error('Error fetching membership:', error);
        res.status(500).json({
            error: 'Failed to fetch membership information',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=profile.js.map