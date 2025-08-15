"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const bookSlotSchema = zod_1.z.object({
    startTime: zod_1.z.string().datetime(),
    endTime: zod_1.z.string().datetime(),
    location: zod_1.z.string().optional(),
    maxPlayers: zod_1.z.number().optional(),
    sessionType: zod_1.z.enum(['TRAINING', 'MEETING', 'EVALUATION', 'OTHER']),
    description: zod_1.z.string().optional(),
});
router.get('/', async (req, res) => {
    try {
        const trainerId = req.user?.trainerId;
        const { startDate, endDate } = req.query;
        if (!trainerId) {
            return res.status(400).json({ error: 'Trainer ID not found' });
        }
        const whereClause = { trainerId };
        if (startDate && endDate) {
            whereClause.startTime = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }
        const sessions = await prisma.trainingSession.findMany({
            where: whereClause,
            include: {
                plan: true,
            },
            orderBy: { startTime: 'asc' },
        });
        const availableSlots = generateAvailableSlots(startDate ? new Date(startDate) : new Date(), endDate ? new Date(endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), sessions);
        res.json({
            sessions,
            availableSlots,
        });
    }
    catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ error: 'Failed to fetch schedule' });
    }
});
router.post('/book', async (req, res) => {
    try {
        const trainerId = req.user?.trainerId;
        if (!trainerId) {
            return res.status(400).json({ error: 'Trainer ID not found' });
        }
        const validatedData = bookSlotSchema.parse(req.body);
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
                name: `${validatedData.sessionType} Session`,
                description: validatedData.description,
                startTime: new Date(validatedData.startTime),
                endTime: new Date(validatedData.endTime),
                location: validatedData.location,
                maxPlayers: validatedData.maxPlayers,
                trainerId,
            },
        });
        res.status(201).json(session);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Error booking slot:', error);
        res.status(500).json({ error: 'Failed to book slot' });
    }
});
router.get('/available/:date', async (req, res) => {
    try {
        const trainerId = req.user?.trainerId;
        const date = req.params.date;
        if (!trainerId) {
            return res.status(400).json({ error: 'Trainer ID not found' });
        }
        const targetDate = new Date(date);
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
        const sessions = await prisma.trainingSession.findMany({
            where: {
                trainerId,
                startTime: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            orderBy: { startTime: 'asc' },
        });
        const availableSlots = generateAvailableSlotsForDay(targetDate, sessions);
        res.json(availableSlots);
    }
    catch (error) {
        console.error('Error fetching available slots:', error);
        res.status(500).json({ error: 'Failed to fetch available slots' });
    }
});
router.patch('/sessions/:id/status', async (req, res) => {
    try {
        const trainerId = req.user?.trainerId;
        const sessionId = req.params.id;
        const { status } = req.body;
        if (!trainerId) {
            return res.status(400).json({ error: 'Trainer ID not found' });
        }
        if (!['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const session = await prisma.trainingSession.update({
            where: {
                id: sessionId,
                trainerId,
            },
            data: { status },
        });
        res.json(session);
    }
    catch (error) {
        console.error('Error updating session status:', error);
        res.status(500).json({ error: 'Failed to update session status' });
    }
});
function generateAvailableSlots(startDate, endDate, existingSessions) {
    const slots = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            for (let hour = 9; hour < 18; hour++) {
                const slotStart = new Date(currentDate);
                slotStart.setHours(hour, 0, 0, 0);
                const slotEnd = new Date(currentDate);
                slotEnd.setHours(hour + 1, 0, 0, 0);
                const hasConflict = existingSessions.some(session => {
                    const sessionStart = new Date(session.startTime);
                    const sessionEnd = new Date(session.endTime);
                    return ((slotStart >= sessionStart && slotStart < sessionEnd) ||
                        (slotEnd > sessionStart && slotEnd <= sessionEnd) ||
                        (slotStart <= sessionStart && slotEnd >= sessionEnd));
                });
                if (!hasConflict) {
                    slots.push({
                        startTime: slotStart.toISOString(),
                        endTime: slotEnd.toISOString(),
                        available: true,
                    });
                }
            }
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return slots;
}
function generateAvailableSlotsForDay(date, existingSessions) {
    const slots = [];
    const startOfDay = new Date(date);
    startOfDay.setHours(9, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(18, 0, 0, 0);
    for (let hour = 9; hour < 18; hour++) {
        const slotStart = new Date(date);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(date);
        slotEnd.setHours(hour + 1, 0, 0, 0);
        const hasConflict = existingSessions.some(session => {
            const sessionStart = new Date(session.startTime);
            const sessionEnd = new Date(session.endTime);
            return ((slotStart >= sessionStart && slotStart < sessionEnd) ||
                (slotEnd > sessionStart && slotEnd <= sessionEnd) ||
                (slotStart <= sessionStart && slotEnd >= sessionEnd));
        });
        slots.push({
            startTime: slotStart.toISOString(),
            endTime: slotEnd.toISOString(),
            available: !hasConflict,
        });
    }
    return slots;
}
exports.default = router;
//# sourceMappingURL=schedule.js.map