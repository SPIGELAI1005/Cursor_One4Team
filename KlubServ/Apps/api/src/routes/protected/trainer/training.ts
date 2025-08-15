import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const router = Router();

// Validation schemas
const createTrainingPlanSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  focus: z.string().min(1, 'Focus area is required'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes'),
  drills: z.string().min(1, 'Drills content is required'),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS']),
  isTemplate: z.boolean().default(false),
});

const createTrainingSessionSchema = z.object({
  planId: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  location: z.string().optional(),
  maxPlayers: z.number().optional(),
});

// Get all training plans for the trainer
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
  } catch (error) {
    console.error('Error fetching training plans:', error);
    res.status(500).json({ error: 'Failed to fetch training plans' });
  }
});

// Create a new training plan
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating training plan:', error);
    res.status(500).json({ error: 'Failed to create training plan' });
  }
});

// Update a training plan
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
        trainerId, // Ensure trainer owns the plan
      },
      data: validatedData,
    });

    res.json(plan);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating training plan:', error);
    res.status(500).json({ error: 'Failed to update training plan' });
  }
});

// Delete a training plan
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
        trainerId, // Ensure trainer owns the plan
      },
    });

    res.json({ message: 'Training plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting training plan:', error);
    res.status(500).json({ error: 'Failed to delete training plan' });
  }
});

// Get all training sessions for the trainer
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
  } catch (error) {
    console.error('Error fetching training sessions:', error);
    res.status(500).json({ error: 'Failed to fetch training sessions' });
  }
});

// Create a new training session
router.post('/sessions', async (req, res) => {
  try {
    const trainerId = req.user?.trainerId;
    if (!trainerId) {
      return res.status(400).json({ error: 'Trainer ID not found' });
    }

    const validatedData = createTrainingSessionSchema.parse(req.body);

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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating training session:', error);
    res.status(500).json({ error: 'Failed to create training session' });
  }
});

// Update a training session
router.put('/sessions/:id', async (req, res) => {
  try {
    const trainerId = req.user?.trainerId;
    const sessionId = req.params.id;

    if (!trainerId) {
      return res.status(400).json({ error: 'Trainer ID not found' });
    }

    const validatedData = createTrainingSessionSchema.parse(req.body);

    // Check for time conflicts (excluding current session)
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
        trainerId, // Ensure trainer owns the session
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating training session:', error);
    res.status(500).json({ error: 'Failed to update training session' });
  }
});

// Delete a training session
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
        trainerId, // Ensure trainer owns the session
      },
    });

    res.json({ message: 'Training session deleted successfully' });
  } catch (error) {
    console.error('Error deleting training session:', error);
    res.status(500).json({ error: 'Failed to delete training session' });
  }
});

export default router; 