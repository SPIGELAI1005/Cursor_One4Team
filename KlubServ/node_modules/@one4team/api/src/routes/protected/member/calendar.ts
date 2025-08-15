import { Router } from 'express';
import { authenticateUser, requireRole } from '@/middleware/authMiddleware';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const router = Router();

// Apply authentication to all calendar routes
router.use(authenticateUser);
router.use(requireRole(['admin', 'trainer', 'member']));

// Validation schemas
const enrollInClassSchema = z.object({
  classId: z.string(),
});

const unenrollFromClassSchema = z.object({
  classId: z.string(),
});

// Get calendar events for a date range
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { start, end, type = 'all' } = req.query;
    
    const member = await prisma.member.findFirst({
      where: { userId },
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const startDate = start ? new Date(start as string) : new Date();
    const endDate = end ? new Date(end as string) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    const events: any[] = [];

    // Get classes
    if (type === 'all' || type === 'classes') {
      const classes = await prisma.class.findMany({
        where: {
          clubId: member.clubId,
          startTime: {
            gte: startDate,
            lte: endDate,
          },
          isActive: true,
        },
        include: {
          trainer: {
            select: {
              id: true,
              name: true,
            },
          },
          enrollments: {
            where: {
              memberId: member.id,
            },
          },
        },
        orderBy: {
          startTime: 'asc',
        },
      });

      events.push(...classes.map(cls => ({
        id: cls.id,
        title: cls.name,
        start: cls.startTime,
        end: cls.endTime,
        type: 'class',
        location: cls.location,
        trainer: cls.trainer,
        maxParticipants: cls.maxParticipants,
        currentParticipants: cls.enrollments.length,
        isEnrolled: cls.enrollments.length > 0,
        description: cls.description,
        category: cls.category,
      })));
    }

    // Get member's bookings
    if (type === 'all' || type === 'bookings') {
      const bookings = await prisma.booking.findMany({
        where: {
          memberId: member.id,
          startTime: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          resource: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
        orderBy: {
          startTime: 'asc',
        },
      });

      events.push(...bookings.map(booking => ({
        id: booking.id,
        title: `Booking: ${booking.resource.name}`,
        start: booking.startTime,
        end: booking.endTime,
        type: 'booking',
        location: booking.resource.name,
        resource: booking.resource,
        status: booking.status,
        description: booking.notes,
      })));
    }

    // Get club events
    if (type === 'all' || type === 'events') {
      const clubEvents = await prisma.event.findMany({
        where: {
          clubId: member.clubId,
          startTime: {
            gte: startDate,
            lte: endDate,
          },
          isActive: true,
        },
        orderBy: {
          startTime: 'asc',
        },
      });

      events.push(...clubEvents.map(event => ({
        id: event.id,
        title: event.name,
        start: event.startTime,
        end: event.endTime,
        type: 'event',
        location: event.location,
        description: event.description,
        category: event.category,
      })));
    }

    res.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
});

// Get available classes for enrollment
router.get('/classes', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { page = 1, limit = 20, category } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const member = await prisma.member.findFirst({
      where: { userId },
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const whereClause: any = {
      clubId: member.clubId,
      startTime: {
        gte: new Date(),
      },
      isActive: true,
    };

    if (category) {
      whereClause.category = category;
    }

    const classes = await prisma.class.findMany({
      where: whereClause,
      include: {
        trainer: {
          select: {
            id: true,
            name: true,
          },
        },
        enrollments: {
          include: {
            member: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      skip,
      take: Number(limit),
    });

    const total = await prisma.class.count({
      where: whereClause,
    });

    // Add enrollment status for current member
    const classesWithEnrollmentStatus = classes.map(cls => ({
      ...cls,
      isEnrolled: cls.enrollments.some(enrollment => enrollment.memberId === member.id),
      currentParticipants: cls.enrollments.length,
      availableSpots: cls.maxParticipants - cls.enrollments.length,
    }));

    res.json({
      classes: classesWithEnrollmentStatus,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Enroll in a class
router.post('/enroll', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const validation = enrollInClassSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid input', details: validation.error });
    }

    const { classId } = validation.data;

    const member = await prisma.member.findFirst({
      where: { userId },
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Check if class exists and is active
    const classData = await prisma.class.findFirst({
      where: {
        id: classId,
        clubId: member.clubId,
        isActive: true,
        startTime: {
          gte: new Date(),
        },
      },
      include: {
        enrollments: true,
      },
    });

    if (!classData) {
      return res.status(404).json({ error: 'Class not found or not available' });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.classEnrollment.findFirst({
      where: {
        classId,
        memberId: member.id,
      },
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this class' });
    }

    // Check if class is full
    if (classData.enrollments.length >= classData.maxParticipants) {
      return res.status(400).json({ error: 'Class is full' });
    }

    const enrollment = await prisma.classEnrollment.create({
      data: {
        classId,
        memberId: member.id,
        enrolledAt: new Date(),
      },
      include: {
        class: {
          include: {
            trainer: {
              select: {
                name: true,
              },
            },
          },
        },
        member: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error('Error enrolling in class:', error);
    res.status(500).json({ error: 'Failed to enroll in class' });
  }
});

// Unenroll from a class
router.post('/unenroll', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const validation = unenrollFromClassSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid input', details: validation.error });
    }

    const { classId } = validation.data;

    const member = await prisma.member.findFirst({
      where: { userId },
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const enrollment = await prisma.classEnrollment.findFirst({
      where: {
        classId,
        memberId: member.id,
      },
    });

    if (!enrollment) {
      return res.status(404).json({ error: 'Not enrolled in this class' });
    }

    await prisma.classEnrollment.delete({
      where: {
        id: enrollment.id,
      },
    });

    res.json({ message: 'Successfully unenrolled from class' });
  } catch (error) {
    console.error('Error unenrolling from class:', error);
    res.status(500).json({ error: 'Failed to unenroll from class' });
  }
});

// Get member's enrolled classes
router.get('/enrolled', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const member = await prisma.member.findFirst({
      where: { userId },
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const enrollments = await prisma.classEnrollment.findMany({
      where: {
        memberId: member.id,
        class: {
          startTime: {
            gte: new Date(),
          },
        },
      },
      include: {
        class: {
          include: {
            trainer: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        class: {
          startTime: 'asc',
        },
      },
    });

    res.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrolled classes:', error);
    res.status(500).json({ error: 'Failed to fetch enrolled classes' });
  }
});

export default router; 