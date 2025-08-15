import { Router } from 'express';
import { authenticateUser, requireRole } from '@/middleware/authMiddleware';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const router = Router();

// Apply authentication to all dashboard routes
router.use(authenticateUser);
router.use(requireRole(['admin', 'trainer', 'member']));

// Get dashboard data (announcements, events, stats)
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get member data
    const member = await prisma.member.findFirst({
      where: { userId },
      include: {
        club: true,
      },
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Get announcements for the member's club
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

    // Get upcoming events/classes
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

    // Get member's upcoming bookings
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

    // Get payment statistics
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

    // Get unread messages count
    const unreadMessages = await prisma.message.count({
      where: {
        recipientId: member.id,
        isRead: false,
      },
    });

    // Calculate quick stats
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
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router; 