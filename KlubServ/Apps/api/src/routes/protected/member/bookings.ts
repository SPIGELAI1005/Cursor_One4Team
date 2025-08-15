import { Router } from 'express';
import { authenticateUser, requireRole } from '@/middleware/authMiddleware';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const router = Router();

// Apply authentication to all booking routes
router.use(authenticateUser);
router.use(requireRole(['admin', 'trainer', 'member']));

// Validation schemas
const createBookingSchema = z.object({
  resourceId: z.string(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  notes: z.string().optional(),
});

const updateBookingSchema = z.object({
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  notes: z.string().optional(),
});

// Get available resources
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

    const whereClause: any = {
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
              gte: new Date(date as string),
              lt: new Date(new Date(date as string).getTime() + 24 * 60 * 60 * 1000), // Next 24 hours
            },
          },
        } : false,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Add availability status if date is provided
    const resourcesWithAvailability = resources.map(resource => ({
      ...resource,
      isAvailable: date ? resource.bookings.length === 0 : true,
      bookedSlots: date ? resource.bookings.map(booking => ({
        startTime: booking.startTime,
        endTime: booking.endTime,
      })) : [],
    }));

    res.json(resourcesWithAvailability);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Get member's bookings
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

    const whereClause: any = {
      memberId: member.id,
    };

    if (status) {
      whereClause.status = status;
    }

    if (start && end) {
      whereClause.startTime = {
        gte: new Date(start as string),
        lte: new Date(end as string),
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
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get a specific booking
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
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Create a new booking
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

    // Check if resource exists and is active
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

    // Check for booking conflicts
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
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Update a booking
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

    // Check if booking can be modified (not in the past and not cancelled)
    if (booking.startTime < new Date() || booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking cannot be modified' });
    }

    // Check for conflicts if time is being changed
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
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Cancel a booking
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

    // Check if booking can be cancelled
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
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// Get available time slots for a resource on a specific date
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

    // Check if resource exists and belongs to member's club
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

    const targetDate = new Date(date as string);
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    // Get existing bookings for the resource on the target date
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

    // Generate available time slots (assuming 1-hour slots from 6 AM to 10 PM)
    const availableSlots = [];
    const slotDuration = 60; // minutes
    const startHour = 6; // 6 AM
    const endHour = 22; // 10 PM

    for (let hour = startHour; hour < endHour; hour++) {
      const slotStart = new Date(startOfDay.getTime() + hour * 60 * 60 * 1000);
      const slotEnd = new Date(slotStart.getTime() + slotDuration * 60 * 1000);

      // Check if slot conflicts with existing bookings
      const isAvailable = !existingBookings.some(booking => {
        return (
          (booking.startTime < slotEnd && booking.endTime > slotStart)
        );
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
  } catch (error) {
    console.error('Error fetching resource availability:', error);
    res.status(500).json({ error: 'Failed to fetch resource availability' });
  }
});

export default router; 