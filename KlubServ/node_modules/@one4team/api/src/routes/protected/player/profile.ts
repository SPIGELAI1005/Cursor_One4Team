import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// Mock player data - replace with actual database queries
const mockPlayerData = {
  id: 'player_123',
  firstName: 'Max',
  lastName: 'Müller',
  email: 'max.mueller@example.com',
  phone: '+49 123 456789',
  birthDate: '2010-05-15',
  profileImage: '/api/players/123/avatar',
  team: {
    id: 'team_456',
    name: 'U14 Boys',
    ageGroup: 'U14',
    sport: 'football',
    season: '2024/25'
  },
  coach: {
    id: 'coach_789',
    name: 'Thomas Weber',
    email: 'thomas.weber@club.com',
    phone: '+49 987 654321'
  },
  emergencyContact: {
    name: 'Anna Müller',
    relationship: 'Mother',
    phone: '+49 111 222333',
    email: 'anna.mueller@example.com'
  },
  membership: {
    status: 'active',
    startDate: '2023-09-01',
    endDate: '2024-08-31',
    membershipType: 'full'
  },
  address: {
    street: 'Musterstraße 123',
    city: 'München',
    postalCode: '80331',
    country: 'Germany'
  }
};

// GET /api/player/profile - Get current player's profile
router.get('/', (req, res) => {
  try {
    // In real implementation, fetch from database using req.user.id
    const playerId = req.user?.id;
    
    if (!playerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Mock: verify player can only access their own profile
    if (playerId !== 'player_123') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      data: mockPlayerData
    });
  } catch (error) {
    console.error('Error fetching player profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/player/profile - Update player profile (limited fields)
router.put('/', (req, res) => {
  try {
    const updateSchema = z.object({
      phone: z.string().optional(),
      emergencyContact: z.object({
        name: z.string(),
        relationship: z.string(),
        phone: z.string(),
        email: z.string().email()
      }).optional(),
      address: z.object({
        street: z.string(),
        city: z.string(),
        postalCode: z.string(),
        country: z.string()
      }).optional()
    });

    const validatedData = updateSchema.parse(req.body);
    const playerId = req.user?.id;

    if (!playerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Mock: update profile (in real implementation, update database)
    const updatedProfile = { ...mockPlayerData, ...validatedData };

    res.json({
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error updating player profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 