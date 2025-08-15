"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const getUserRole_1 = require("../../../utils/getUserRole");
const router = (0, express_1.Router)();
const updateMemberRoleSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1),
    role: zod_1.z.enum(['admin', 'trainer', 'member']),
});
const createMemberSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    role: zod_1.z.enum(['admin', 'trainer', 'member']).default('member'),
    clubId: zod_1.z.string().optional(),
});
router.get('/', async (req, res) => {
    try {
        res.json({
            message: 'All members retrieved successfully',
            members: [
                {
                    id: '1',
                    email: 'admin@example.com',
                    firstName: 'Admin',
                    lastName: 'User',
                    role: 'admin',
                    createdAt: new Date().toISOString(),
                },
            ],
            total: 1,
        });
    }
    catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({
            error: 'Failed to fetch members',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.post('/', async (req, res) => {
    try {
        const validatedData = createMemberSchema.parse(req.body);
        res.status(201).json({
            message: 'Member created successfully',
            member: {
                id: 'new-member-id',
                ...validatedData,
                createdAt: new Date().toISOString(),
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
        console.error('Error creating member:', error);
        res.status(500).json({
            error: 'Failed to create member',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.put('/:userId/role', async (req, res) => {
    try {
        const { userId } = req.params;
        const validatedData = updateMemberRoleSchema.parse({
            userId,
            role: req.body.role,
        });
        await (0, getUserRole_1.setUserRoleInClerk)(validatedData.userId, validatedData.role);
        res.json({
            message: 'Member role updated successfully',
            userId: validatedData.userId,
            newRole: validatedData.role,
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
        console.error('Error updating member role:', error);
        res.status(500).json({
            error: 'Failed to update member role',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        res.json({
            message: 'Member deleted successfully',
            userId,
        });
    }
    catch (error) {
        console.error('Error deleting member:', error);
        res.status(500).json({
            error: 'Failed to delete member',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=members.js.map