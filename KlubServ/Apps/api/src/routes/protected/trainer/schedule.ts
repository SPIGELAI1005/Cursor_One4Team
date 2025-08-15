import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const router = Router();

// Validation schemas
const bookSlotSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  location: z.string().optional(),
  maxPlayers: z.number().optional(),
  sessionType: z.enum(['TRAINING', 'MEETING', 'EVALUATION', 'OTHER']),
  description: z.string().optional(),
});

// Get trainer's schedule for a date range
router.get('/', async (req, res) => {
  try {
    const trainerId = req.user?.trainerId;
    const { startDate, endDate } = req.query;

    if (!trainerId) {
      return res.status(400).json({ error: 'Trainer ID not found' });
    }

    const whereClause: any = { trainerId };

    if (startDate && endDate) {
      whereClause.startTime = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const sessions = await prisma.trainingSession.findMany({
      where: whereClause,
      include: {
        plan: true,
      },
      orderBy: { startTime: 'asc' },
    });

    // Get available time slots (mock data for now)
    const availableSlots = generateAvailableSlots(
      startDate ? new Date(startDate as string) : new Date(),
      endDate ? new Date(endDate as string) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sessions
    );

    res.json({
      sessions,
      availableSlots,
    });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

// Book a new time slot
router.post('/book', async (req, res) => {
  try {
    const trainerId = req.user?.trainerId;
    if (!trainerId) {
      return res.status(400).json({ error: 'Trainer ID not found' });
    }

    const validatedData = bookSlotSchema.parse(req.body);

    // Check for time conflicts
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error booking slot:', error);
    res.status(500).json({ error: 'Failed to book slot' });
  }
});

// Get available time slots for a specific date
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
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ error: 'Failed to fetch available slots' });
  }
});

// Update session status
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
        trainerId, // Ensure trainer owns the session
      },
      data: { status },
    });

    res.json(session);
  } catch (error) {
    console.error('Error updating session status:', error);
    res.status(500).json({ error: 'Failed to update session status' });
  }
});

// Helper function to generate available time slots
function generateAvailableSlots(startDate: Date, endDate: Date, existingSessions: any[]) {
  const slots = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Skip weekends (optional)
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      // Generate slots for each day (9 AM to 6 PM)
      for (let hour = 9; hour < 18; hour++) {
        const slotStart = new Date(currentDate);
        slotStart.setHours(hour, 0, 0, 0);
        
        const slotEnd = new Date(currentDate);
        slotEnd.setHours(hour + 1, 0, 0, 0);
        
        // Check if slot conflicts with existing sessions
        const hasConflict = existingSessions.some(session => {
          const sessionStart = new Date(session.startTime);
          const sessionEnd = new Date(session.endTime);
          return (
            (slotStart >= sessionStart && slotStart < sessionEnd) ||
            (slotEnd > sessionStart && slotEnd <= sessionEnd) ||
            (slotStart <= sessionStart && slotEnd >= sessionEnd)
          );
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

// Helper function to generate available slots for a specific day
function generateAvailableSlotsForDay(date: Date, existingSessions: any[]) {
  const slots = [];
  const startOfDay = new Date(date);
  startOfDay.setHours(9, 0, 0, 0); // 9 AM
  
  const endOfDay = new Date(date);
  endOfDay.setHours(18, 0, 0, 0); // 6 PM
  
  for (let hour = 9; hour < 18; hour++) {
    const slotStart = new Date(date);
    slotStart.setHours(hour, 0, 0, 0);
    
    const slotEnd = new Date(date);
    slotEnd.setHours(hour + 1, 0, 0, 0);
    
    // Check if slot conflicts with existing sessions
    const hasConflict = existingSessions.some(session => {
      const sessionStart = new Date(session.startTime);
      const sessionEnd = new Date(session.endTime);
      return (
        (slotStart >= sessionStart && slotStart < sessionEnd) ||
        (slotEnd > sessionStart && slotEnd <= sessionEnd) ||
        (slotStart <= sessionStart && slotEnd >= sessionEnd)
      );
    });
    
    slots.push({
      startTime: slotStart.toISOString(),
      endTime: slotEnd.toISOString(),
      available: !hasConflict,
    });
  }
  
  return slots;
}

export default router; 