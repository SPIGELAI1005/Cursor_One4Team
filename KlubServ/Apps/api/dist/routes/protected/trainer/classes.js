"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const createClassSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    startTime: zod_1.z.string().datetime(),
    endTime: zod_1.z.string().datetime(),
    maxParticipants: zod_1.z.number().positive().optional(),
    location: zod_1.z.string().optional(),
    type: zod_1.z.enum(['training', 'match', 'fitness', 'tactics']),
});
const updateClassSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    startTime: zod_1.z.string().datetime().optional(),
    endTime: zod_1.z.string().datetime().optional(),
    maxParticipants: zod_1.z.number().positive().optional(),
    location: zod_1.z.string().optional(),
    type: zod_1.z.enum(['training', 'match', 'fitness', 'tactics']).optional(),
    status: zod_1.z.enum(['scheduled', 'in-progress', 'completed', 'cancelled']).optional(),
});
router.get('/', async (req, res) => {
    try {
        res.json({
            message: 'Classes retrieved successfully',
            classes: [
                {
                    id: '1',
                    name: 'Advanced Training',
                    description: 'High-intensity training session',
                    startTime: new Date(Date.now() + 86400000).toISOString(),
                    endTime: new Date(Date.now() + 86400000 + 7200000).toISOString(),
                    maxParticipants: 20,
                    location: 'Main Field',
                    type: 'training',
                    status: 'scheduled',
                    participants: 15,
                    trainerId: req.user?.userId,
                    createdAt: new Date().toISOString(),
                },
            ],
            total: 1,
        });
    }
    catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({
            error: 'Failed to fetch classes',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.post('/', async (req, res) => {
    try {
        const validatedData = createClassSchema.parse(req.body);
        res.status(201).json({
            message: 'Class created successfully',
            class: {
                id: 'new-class-id',
                ...validatedData,
                status: 'scheduled',
                participants: 0,
                trainerId: req.user?.userId,
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
        console.error('Error creating class:', error);
        res.status(500).json({
            error: 'Failed to create class',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.get('/:classId', async (req, res) => {
    try {
        const { classId } = req.params;
        res.json({
            message: 'Class details retrieved successfully',
            class: {
                id: classId,
                name: 'Advanced Training',
                description: 'High-intensity training session',
                startTime: new Date(Date.now() + 86400000).toISOString(),
                endTime: new Date(Date.now() + 86400000 + 7200000).toISOString(),
                maxParticipants: 20,
                location: 'Main Field',
                type: 'training',
                status: 'scheduled',
                participants: [
                    {
                        id: '1',
                        firstName: 'John',
                        lastName: 'Doe',
                        email: 'john.doe@example.com',
                        status: 'confirmed',
                    },
                ],
                trainerId: req.user?.userId,
                createdAt: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        console.error('Error fetching class:', error);
        res.status(500).json({
            error: 'Failed to fetch class',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.put('/:classId', async (req, res) => {
    try {
        const { classId } = req.params;
        const validatedData = updateClassSchema.parse(req.body);
        res.json({
            message: 'Class updated successfully',
            classId,
            updates: validatedData,
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
        console.error('Error updating class:', error);
        res.status(500).json({
            error: 'Failed to update class',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.delete('/:classId', async (req, res) => {
    try {
        const { classId } = req.params;
        res.json({
            message: 'Class cancelled successfully',
            classId,
        });
    }
    catch (error) {
        console.error('Error cancelling class:', error);
        res.status(500).json({
            error: 'Failed to cancel class',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.get('/:classId/participants', async (req, res) => {
    try {
        const { classId } = req.params;
        res.json({
            message: 'Class participants retrieved successfully',
            classId,
            participants: [
                {
                    id: '1',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    status: 'confirmed',
                    registeredAt: new Date().toISOString(),
                },
            ],
            total: 1,
        });
    }
    catch (error) {
        console.error('Error fetching class participants:', error);
        res.status(500).json({
            error: 'Failed to fetch class participants',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=classes.js.map