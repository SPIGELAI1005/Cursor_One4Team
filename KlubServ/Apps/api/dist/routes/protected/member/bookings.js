"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.use(authMiddleware_1.authenticateUser);
router.use((0, authMiddleware_1.requireRole)(['admin', 'trainer', 'member']));
const createBookingSchema = zod_1.z.object({
    resourceId: zod_1.z.string(),
    startTime: zod_1.z.string().datetime(),
    endTime: zod_1.z.string().datetime(),
    notes: zod_1.z.string().optional(),
});
const updateBookingSchema = zod_1.z.object({
    startTime: zod_1.z.string().datetime().optional(),
    endTime: zod_1.z.string().datetime().optional(),
    notes: zod_1.z.string().optional(),
});
router.get('/resources', async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { type, date } = req.query;
        const member = await prisma.member.findFirst({
            where: { userId },
        });
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }
        let whereClause = {
            clubId: member.clubId,
            isActive: true,
        };
        if (type) {
            whereClause.type = type;
        }
        const resources = await prisma.resource.findMany({
            where: whereClause,
            include: {
                bookings: date ? {
                    where: {
                        startTime: {
                            gte: new Date(date),
                            lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
                        },
                    },
                } : false,
            },
            orderBy: {
                name: 'asc',
            },
        });
        const resourcesWithAvailability = resources.map(resource => ({
            ...resource,
            isAvailable: date ? resource.bookings.length === 0 : true,
            bookedSlots: date ? resource.bookings.map(booking => ({
                startTime: booking.startTime,
                endTime: booking.endTime,
            })) : [],
        }));
        res.json(resourcesWithAvailability);
    }
    catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
});
router.get('/', async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { status, start, end } = req.query;
        const member = await prisma.member.findFirst({
            where: { userId },
        });
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }
        let whereClause = {
            memberId: member.id,
        };
        if (status) {
            whereClause.status = status;
        }
        if (start && end) {
            whereClause.startTime = {
                gte: new Date(start),
                lte: new Date(end),
            };
        }
        const bookings = await prisma.booking.findMany({
            where: whereClause,
            include: {
                resource: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        description: true,
                    },
                },
            },
            orderBy: {
                startTime: 'asc',
            },
        });
        res.json(bookings);
    }
    catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const userId = req.user?.id;
        const bookingId = req.params.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const member = await prisma.member.findFirst({
            where: { userId },
        });
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }
        const booking = await prisma.booking.findFirst({
            where: {
                id: bookingId,
                memberId: member.id,
            },
            include: {
                resource: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        description: true,
                    },
                },
            },
        });
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json(booking);
    }
    catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});
router.post('/', async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const validation = createBookingSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'Invalid input', details: validation.error });
        }
        const { resourceId, startTime, endTime, notes } = validation.data;
        const member = await prisma.member.findFirst({
            where: { userId },
        });
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }
        const resource = await prisma.resource.findFirst({
            where: {
                id: resourceId,
                clubId: member.clubId,
                isActive: true,
            },
        });
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }
        const conflictingBooking = await prisma.booking.findFirst({
            where: {
                resourceId,
                status: {
                    in: ['confirmed', 'pending'],
                },
                OR: [
                    {
                        startTime: {
                            lt: new Date(endTime),
                            gte: new Date(startTime),
                        },
                    },
                    {
                        endTime: {
                            gt: new Date(startTime),
                            lte: new Date(endTime),
                        },
                    },
                ],
            },
        });
        if (conflictingBooking) {
            return res.status(400).json({ error: 'Resource is not available for the selected time slot' });
        }
        const booking = await prisma.booking.create({
            data: {
                memberId: member.id,
                resourceId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                notes,
                status: 'pending',
                createdAt: new Date(),
            },
            include: {
                resource: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        description: true,
                    },
                },
            },
        });
        res.status(201).json(booking);
    }
    catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const userId = req.user?.id;
        const bookingId = req.params.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const validation = updateBookingSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'Invalid input', details: validation.error });
        }
        const member = await prisma.member.findFirst({
            where: { userId },
        });
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }
        const booking = await prisma.booking.findFirst({
            where: {
                id: bookingId,
                memberId: member.id,
            },
        });
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        if (booking.startTime < new Date() || booking.status === 'cancelled') {
            return res.status(400).json({ error: 'Booking cannot be modified' });
        }
        if (validation.data.startTime || validation.data.endTime) {
            const newStartTime = validation.data.startTime ? new Date(validation.data.startTime) : booking.startTime;
            const newEndTime = validation.data.endTime ? new Date(validation.data.endTime) : booking.endTime;
            const conflictingBooking = await prisma.booking.findFirst({
                where: {
                    resourceId: booking.resourceId,
                    id: {
                        not: bookingId,
                    },
                    status: {
                        in: ['confirmed', 'pending'],
                    },
                    OR: [
                        {
                            startTime: {
                                lt: newEndTime,
                                gte: newStartTime,
                            },
                        },
                        {
                            endTime: {
                                gt: newStartTime,
                                lte: newEndTime,
                            },
                        },
                    ],
                },
            });
            if (conflictingBooking) {
                return res.status(400).json({ error: 'Resource is not available for the selected time slot' });
            }
        }
        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                ...validation.data,
                startTime: validation.data.startTime ? new Date(validation.data.startTime) : undefined,
                endTime: validation.data.endTime ? new Date(validation.data.endTime) : undefined,
                updatedAt: new Date(),
            },
            include: {
                resource: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        description: true,
                    },
                },
            },
        });
        res.json(updatedBooking);
    }
    catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ error: 'Failed to update booking' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user?.id;
        const bookingId = req.params.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const member = await prisma.member.findFirst({
            where: { userId },
        });
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }
        const booking = await prisma.booking.findFirst({
            where: {
                id: bookingId,
                memberId: member.id,
            },
        });
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        if (booking.startTime < new Date()) {
            return res.status(400).json({ error: 'Cannot cancel past bookings' });
        }
        if (booking.status === 'cancelled') {
            return res.status(400).json({ error: 'Booking is already cancelled' });
        }
        await prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: 'cancelled',
                updatedAt: new Date(),
            },
        });
        res.json({ message: 'Booking cancelled successfully' });
    }
    catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
});
router.get('/resources/:resourceId/availability', async (req, res) => {
    try {
        const userId = req.user?.id;
        const resourceId = req.params.resourceId;
        const { date } = req.query;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        if (!date) {
            return res.status(400).json({ error: 'Date parameter is required' });
        }
        const member = await prisma.member.findFirst({
            where: { userId },
        });
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }
        const resource = await prisma.resource.findFirst({
            where: {
                id: resourceId,
                clubId: member.clubId,
                isActive: true,
            },
        });
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }
        const targetDate = new Date(date);
        const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
        const existingBookings = await prisma.booking.findMany({
            where: {
                resourceId,
                startTime: {
                    gte: startOfDay,
                    lt: endOfDay,
                },
                status: {
                    in: ['confirmed', 'pending'],
                },
            },
            orderBy: {
                startTime: 'asc',
            },
        });
        const availableSlots = [];
        const slotDuration = 60;
        const startHour = 6;
        const endHour = 22;
        for (let hour = startHour; hour < endHour; hour++) {
            const slotStart = new Date(startOfDay.getTime() + hour * 60 * 60 * 1000);
            const slotEnd = new Date(slotStart.getTime() + slotDuration * 60 * 1000);
            const isAvailable = !existingBookings.some(booking => {
                return ((booking.startTime < slotEnd && booking.endTime > slotStart));
            });
            if (isAvailable) {
                availableSlots.push({
                    startTime: slotStart,
                    endTime: slotEnd,
                    available: true,
                });
            }
        }
        res.json({
            resource,
            date: targetDate,
            availableSlots,
            existingBookings: existingBookings.map(booking => ({
                startTime: booking.startTime,
                endTime: booking.endTime,
                status: booking.status,
            })),
        });
    }
    catch (error) {
        console.error('Error fetching resource availability:', error);
        res.status(500).json({ error: 'Failed to fetch resource availability' });
    }
});
exports.default = router;
//# sourceMappingURL=bookings.js.map