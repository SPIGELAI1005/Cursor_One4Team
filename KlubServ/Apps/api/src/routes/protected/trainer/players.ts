import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const router = Router();

// Validation schemas
const createPlayerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  birthDate: z.string().datetime().optional(),
  position: z.string().optional(),
  jerseyNumber: z.number().positive().optional(),
});

const updatePlayerSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  position: z.string().optional(),
  jerseyNumber: z.number().positive().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'INJURED', 'SUSPENDED']).optional(),
});

const createEvaluationSchema = z.object({
  playerId: z.string().min(1, 'Player ID is required'),
  score: z.number().min(1).max(5, 'Score must be between 1 and 5'),
  comment: z.string().optional(),
  category: z.enum(['OVERALL', 'TECHNICAL', 'TACTICAL', 'PHYSICAL', 'MENTAL', 'ATTITUDE']).default('OVERALL'),
});

/**
 * GET /api/trainer/players
 * Get all players (trainers and admins)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // TODO: Implement database query to get players
    res.json({
      message: 'Players retrieved successfully',
      players: [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          position: 'Forward',
          jerseyNumber: 10,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
      ],
      total: 1,
    });
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({
      error: 'Failed to fetch players',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/trainer/players/:playerId
 * Get specific player details
 */
router.get('/:playerId', async (req: Request, res: Response) => {
  try {
    const { playerId } = req.params;
    
    // TODO: Implement database query to get specific player
    res.json({
      message: 'Player details retrieved successfully',
      player: {
        id: playerId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        position: 'Forward',
        jerseyNumber: 10,
        status: 'active',
        stats: {
          goals: 15,
          assists: 8,
          matches: 25,
        },
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).json({
      error: 'Failed to fetch player',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/trainer/players
 * Create a new player (trainers and admins)
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = createPlayerSchema.parse(req.body);
    
    // TODO: Implement player creation logic
    // 1. Create player record in database
    // 2. Send invitation email if needed
    
    res.status(201).json({
      message: 'Player created successfully',
      player: {
        id: 'new-player-id',
        ...validatedData,
        status: 'active',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }
    
    console.error('Error creating player:', error);
    res.status(500).json({
      error: 'Failed to create player',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PUT /api/trainer/players/:playerId
 * Update player details
 */
router.put('/:playerId', async (req: Request, res: Response) => {
  try {
    const { playerId } = req.params;
    const validatedData = updatePlayerSchema.parse(req.body);
    
    // TODO: Implement player update logic
    
    res.json({
      message: 'Player updated successfully',
      playerId,
      updates: validatedData,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }
    
    console.error('Error updating player:', error);
    res.status(500).json({
      error: 'Failed to update player',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/trainer/players/:playerId/stats
 * Get player statistics
 */
router.get('/:playerId/stats', async (req: Request, res: Response) => {
  try {
    const { playerId } = req.params;
    
    // TODO: Implement player stats query
    
    res.json({
      message: 'Player statistics retrieved successfully',
      playerId,
      stats: {
        goals: 15,
        assists: 8,
        matches: 25,
        yellowCards: 2,
        redCards: 0,
        minutesPlayed: 2250,
      },
    });
  } catch (error) {
    console.error('Error fetching player stats:', error);
    res.status(500).json({
      error: 'Failed to fetch player statistics',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/trainer/players/:playerId/evaluations
 * Create a new evaluation for a player
 */
router.post('/:playerId/evaluations', async (req: Request, res: Response) => {
  try {
    const trainerId = req.user?.trainerId;
    const { playerId } = req.params;
    
    if (!trainerId) {
      return res.status(400).json({ error: 'Trainer ID not found' });
    }

    const validatedData = createEvaluationSchema.parse({
      ...req.body,
      playerId,
    });

    // Verify that the player exists and belongs to the trainer's club
    const player = await prisma.player.findFirst({
      where: {
        id: playerId,
        member: {
          club: {
            trainers: {
              some: {
                id: trainerId,
              },
            },
          },
        },
      },
    });

    if (!player) {
      return res.status(400).json({ error: 'Player not found or not accessible' });
    }

    const evaluation = await prisma.evaluation.create({
      data: {
        ...validatedData,
        trainerId,
      },
    });

    res.status(201).json(evaluation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating evaluation:', error);
    res.status(500).json({ error: 'Failed to create evaluation' });
  }
});

/**
 * GET /api/trainer/players/:playerId/evaluations
 * Get all evaluations for a player
 */
router.get('/:playerId/evaluations', async (req: Request, res: Response) => {
  try {
    const trainerId = req.user?.trainerId;
    const { playerId } = req.params;
    
    if (!trainerId) {
      return res.status(400).json({ error: 'Trainer ID not found' });
    }

    const evaluations = await prisma.evaluation.findMany({
      where: {
        playerId,
        trainerId,
      },
      orderBy: { date: 'desc' },
    });

    res.json(evaluations);
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    res.status(500).json({ error: 'Failed to fetch evaluations' });
  }
});

export default router; 