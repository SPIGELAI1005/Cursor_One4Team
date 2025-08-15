"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.use(authMiddleware_1.authenticateUser);
router.use((0, authMiddleware_1.requireRole)(['admin', 'trainer', 'member']));
router.get('/', async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const member = await prisma.member.findFirst({
            where: { userId },
            include: {
                club: true,
            },
        });
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }
        const announcements = await prisma.announcement.findMany({
            where: {
                clubId: member.clubId,
                isActive: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
        });
        const upcomingEvents = await prisma.class.findMany({
            where: {
                clubId: member.clubId,
                startTime: {
                    gte: new Date(),
                },
                isActive: true,
            },
            include: {
                trainer: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                startTime: 'asc',
            },
            take: 5,
        });
        const upcomingBookings = await prisma.booking.findMany({
            where: {
                memberId: member.id,
                startTime: {
                    gte: new Date(),
                },
            },
            include: {
                resource: true,
            },
            orderBy: {
                startTime: 'asc',
            },
            take: 3,
        });
        const paymentStats = await prisma.payment.aggregate({
            where: {
                memberId: member.id,
                status: 'pending',
            },
            _count: {
                id: true,
            },
            _sum: {
                amount: true,
            },
        });
        const unreadMessages = await prisma.message.count({
            where: {
                recipientId: member.id,
                isRead: false,
            },
        });
        const quickStats = {
            activeMembership: member.status,
            classesThisWeek: upcomingEvents.length,
            unreadMessages,
            pendingPayments: paymentStats._count.id || 0,
            totalPendingAmount: paymentStats._sum.amount || 0,
        };
        res.json({
            announcements,
            upcomingEvents,
            upcomingBookings,
            quickStats,
            member: {
                id: member.id,
                name: member.name,
                email: member.email,
                status: member.status,
                club: member.club.name,
            },
        });
    }
    catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map