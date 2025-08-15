"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../../../lib/prisma");
const validation_1 = require("../../../middleware/validation");
const router = (0, express_1.Router)();
const createContributionSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    amount: zod_1.z.number().positive('Amount must be positive'),
    frequency: zod_1.z.enum(['monthly', 'annual', 'quarterly']),
    status: zod_1.z.enum(['active', 'inactive']).default('active'),
    assignedTo: zod_1.z.array(zod_1.z.string()).default([]),
    description: zod_1.z.string().optional(),
});
const updateContributionSchema = createContributionSchema.partial();
router.get('/', async (req, res) => {
    try {
        const plans = await prisma_1.prisma.contributionPlan.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json({
            success: true,
            data: plans,
        });
    }
    catch (error) {
        console.error('Error fetching contribution plans:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch contribution plans',
        });
    }
});
router.post('/', (0, validation_1.validateRequest)(createContributionSchema), async (req, res) => {
    try {
        const plan = await prisma_1.prisma.contributionPlan.create({
            data: {
                ...req.body,
                memberCount: 0,
            },
        });
        res.status(201).json({
            success: true,
            data: plan,
        });
    }
    catch (error) {
        console.error('Error creating contribution plan:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create contribution plan',
        });
    }
});
router.put('/:id', (0, validation_1.validateRequest)(updateContributionSchema), async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await prisma_1.prisma.contributionPlan.update({
            where: { id },
            data: req.body,
        });
        res.json({
            success: true,
            data: plan,
        });
    }
    catch (error) {
        console.error('Error updating contribution plan:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update contribution plan',
        });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.prisma.contributionPlan.delete({
            where: { id },
        });
        res.json({
            success: true,
            message: 'Contribution plan deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting contribution plan:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete contribution plan',
        });
    }
});
exports.default = router;
//# sourceMappingURL=contributions.js.map