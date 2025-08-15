"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const createTrainingPlanSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    description: zod_1.z.string().optional(),
    focus: zod_1.z.string().min(1, 'Focus area is required'),
    duration: zod_1.z.number().min(15, 'Duration must be at least 15 minutes'),
    drills: zod_1.z.string().min(1, 'Drills content is required'),
    difficulty: zod_1.z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS']),
    isTemplate: zod_1.z.boolean().default(false),
});
const createTrainingSessionSchema = zod_1.z.object({
    planId: zod_1.z.string().optional(),
    name: zod_1.z.string().min(1, 'Name is required'),
    description: zod_1.z.string().optional(),
    startTime: zod_1.z.string().datetime(),
    endTime: zod_1.z.string().datetime(),
    location: zod_1.z.string().optional(),
    maxPlayers: zod_1.z.number().optional(),
});
router.get('/plans', async (req, res) => {
    try {
        const trainerId = req.user?.trainerId;
        if (!trainerId) {
            return res.status(400).json({ error: 'Trainer ID not found' });
        }
        const plans = await prisma.trainingPlan.findMany({
            where: { trainerId },
            orderBy: { createdAt: 'desc' },
        });
        res.json(plans);
    }
    catch (error) {
        console.error('Error fetching training plans:', error);
        res.status(500).json({ error: 'Failed to fetch training plans' });
    }
});
router.post('/plans', async (req, res) => {
    try {
        const trainerId = req.user?.trainerId;
        if (!trainerId) {
            return res.status(400).json({ error: 'Trainer ID not found' });
        }
        const validatedData = createTrainingPlanSchema.parse(req.body);
        const plan = await prisma.trainingPlan.create({
            data: {
                ...validatedData,
                trainerId,
            },
        });
        res.status(201).json(plan);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Error creating training plan:', error);
        res.status(500).json({ error: 'Failed to create training plan' });
    }
});
router.put('/plans/:id', async (req, res) => {
    try {
        const trainerId = req.user?.trainerId;
        const planId = req.params.id;
        if (!trainerId) {
            return res.status(400).json({ error: 'Trainer ID not found' });
        }
        const validatedData = createTrainingPlanSchema.parse(req.body);
        const plan = await prisma.trainingPlan.update({
            where: {
                id: planId,
                trainerId,
            },
            data: validatedData,
        });
        res.json(plan);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Error updating training plan:', error);
        res.status(500).json({ error: 'Failed to update training plan' });
    }
});
router.delete('/plans/:id', async (req, res) => {
    try {
        const trainerId = req.user?.trainerId;
        const planId = req.params.id;
        if (!trainerId) {
            return res.status(400).json({ error: 'Trainer ID not found' });
        }
        await prisma.trainingPlan.delete({
            where: {
                id: planId,
                trainerId,
            },
        });
        res.json({ message: 'Training plan deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting training plan:', error);
        res.status(500).json({ error: 'Failed to delete training plan' });
    }
});
router.get('/sessions', async (req, res) => {
    try {
        const trainerId = req.user?.trainerId;
        if (!trainerId) {
            return res.status(400).json({ error: 'Trainer ID not found' });
        }
        const sessions = await prisma.trainingSession.findMany({
            where: { trainerId },
            include: {
                plan: true,
            },
            orderBy: { startTime: 'asc' },
        });
        res.json(sessions);
    }
    catch (error) {
        console.error('Error fetching training sessions:', error);
        res.status(500).json({ error: 'Failed to fetch training sessions' });
    }
});
router.post('/sessions', async (req, res) => {
    try {
        const trainerId = req.user?.trainerId;
        if (!trainerId) {
            return res.status(400).json({ error: 'Trainer ID not found' });
        }
        const validatedData = createTrainingSessionSchema.parse(req.body);
        const conflictingSession = await prisma.trainingSession.findFirst({
            where: {
                trainerId,
                OR: [
                    {
                        startTime: { lte: new Date(validatedData.startTime) },
                        endTime: { gt: new Date(validatedData.startTime) },
                    },
                    {
                        startTime: { lt: new Date(validatedData.endTime) },
                        endTime: { gte: new Date(validatedData.endTime) },
                    },
                ],
            },
        });
        if (conflictingSession) {
            return res.status(400).json({ error: 'Time slot conflicts with existing session' });
        }
        const session = await prisma.trainingSession.create({
            data: {
                ...validatedData,
                startTime: new Date(validatedData.startTime),
                endTime: new Date(validatedData.endTime),
                trainerId,
            },
            include: {
                plan: true,
            },
        });
        res.status(201).json(session);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Error creating training session:', error);
        res.status(500).json({ error: 'Failed to create training session' });
    }
});
router.put('/sessions/:id', async (req, res) => {
    try {
        const trainerId = req.user?.trainerId;
        const sessionId = req.params.id;
        if (!trainerId) {
            return res.status(400).json({ error: 'Trainer ID not found' });
        }
        const validatedData = createTrainingSessionSchema.parse(req.body);
        const conflictingSession = await prisma.trainingSession.findFirst({
            where: {
                trainerId,
                id: { not: sessionId },
                OR: [
                    {
                        startTime: { lte: new Date(validatedData.startTime) },
                        endTime: { gt: new Date(validatedData.startTime) },
                    },
                    {
                        startTime: { lt: new Date(validatedData.endTime) },
                        endTime: { gte: new Date(validatedData.endTime) },
                    },
                ],
            },
        });
        if (conflictingSession) {
            return res.status(400).json({ error: 'Time slot conflicts with existing session' });
        }
        const session = await prisma.trainingSession.update({
            where: {
                id: sessionId,
                trainerId,
            },
            data: {
                ...validatedData,
                startTime: new Date(validatedData.startTime),
                endTime: new Date(validatedData.endTime),
            },
            include: {
                plan: true,
            },
        });
        res.json(session);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Error updating training session:', error);
        res.status(500).json({ error: 'Failed to update training session' });
    }
});
router.delete('/sessions/:id', async (req, res) => {
    try {
        const trainerId = req.user?.trainerId;
        const sessionId = req.params.id;
        if (!trainerId) {
            return res.status(400).json({ error: 'Trainer ID not found' });
        }
        await prisma.trainingSession.delete({
            where: {
                id: sessionId,
                trainerId,
            },
        });
        res.json({ message: 'Training session deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting training session:', error);
        res.status(500).json({ error: 'Failed to delete training session' });
    }
});
exports.default = router;
//# sourceMappingURL=training.js.map