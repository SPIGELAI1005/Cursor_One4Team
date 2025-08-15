import request from 'supertest';
import { app } from '../../src/index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mock Clerk authentication
jest.mock('@clerk/backend', () => ({
  verifyToken: jest.fn().mockResolvedValue({
    sub: 'trainer-123',
    metadata: {
      role: 'trainer',
    },
  }),
}));

describe('Trainer Players API', () => {
  beforeAll(async () => {
    // Clean up database before tests
    await prisma.evaluation.deleteMany();
    await prisma.player.deleteMany();
    await prisma.member.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const mockToken = 'mock-jwt-token';

  describe('GET /api/trainer/players', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/trainer/players')
        .expect(401);
    });

    it('should return 403 for non-trainer role', async () => {
      // Mock non-trainer role
      jest.mocked(require('@clerk/backend').verifyToken).mockResolvedValueOnce({
        sub: 'member-123',
        metadata: {
          role: 'member',
        },
      });

      const response = await request(app)
        .get('/api/trainer/players')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(403);
    });

    it('should return players for authenticated trainer', async () => {
      // Create test data
      const member = await prisma.member.create({
        data: {
          id: 'member-1',
          name: 'Alex Johnson',
          email: 'alex@example.com',
          birthdate: new Date('1999-01-01'),
          status: 'ACTIVE',
          clubId: 'club-1',
        },
      });

      const player = await prisma.player.create({
        data: {
          id: 'player-1',
          memberId: member.id,
          position: 'Forward',
          team: 'Senior Team',
          jerseyNumber: 10,
          status: 'ACTIVE',
        },
      });

      const response = await request(app)
        .get('/api/trainer/players')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        id: player.id,
        name: member.name,
        email: member.email,
        position: player.position,
        team: player.team,
        jerseyNumber: player.jerseyNumber,
        status: player.status,
      });
    });
  });

  describe('POST /api/trainer/players/:playerId/evaluations', () => {
    let playerId: string;

    beforeEach(async () => {
      // Create test player
      const member = await prisma.member.create({
        data: {
          id: 'member-2',
          name: 'Sarah Miller',
          email: 'sarah@example.com',
          birthdate: new Date('2000-01-01'),
          status: 'ACTIVE',
          clubId: 'club-1',
        },
      });

      const player = await prisma.player.create({
        data: {
          id: 'player-2',
          memberId: member.id,
          position: 'Midfielder',
          team: 'Senior Team',
          jerseyNumber: 8,
          status: 'ACTIVE',
        },
      });

      playerId = player.id;
    });

    it('should create evaluation for valid data', async () => {
      const evaluationData = {
        overall: 4,
        technical: 5,
        tactical: 4,
        physical: 3,
        mental: 4,
        attitude: 5,
        comment: 'Excellent performance today',
      };

      const response = await request(app)
        .post(`/api/trainer/players/${playerId}/evaluations`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send(evaluationData)
        .expect(201);

      expect(response.body).toMatchObject({
        playerId,
        overall: evaluationData.overall,
        technical: evaluationData.technical,
        comment: evaluationData.comment,
      });

      // Verify evaluation was saved in database
      const savedEvaluation = await prisma.evaluation.findFirst({
        where: { playerId },
      });
      expect(savedEvaluation).toBeTruthy();
      expect(savedEvaluation?.overall).toBe(evaluationData.overall);
    });

    it('should return 400 for invalid evaluation data', async () => {
      const invalidData = {
        overall: 6, // Invalid: should be 1-5
        technical: 5,
        tactical: 4,
        physical: 3,
        mental: 4,
        attitude: 5,
        comment: 'Test comment',
      };

      const response = await request(app)
        .post(`/api/trainer/players/${playerId}/evaluations`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });

    it('should return 404 for non-existent player', async () => {
      const evaluationData = {
        overall: 4,
        technical: 5,
        tactical: 4,
        physical: 3,
        mental: 4,
        attitude: 5,
        comment: 'Test comment',
      };

      const response = await request(app)
        .post('/api/trainer/players/non-existent-player/evaluations')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(evaluationData)
        .expect(404);
    });
  });

  describe('GET /api/trainer/players/:playerId/evaluations', () => {
    let playerId: string;

    beforeEach(async () => {
      // Create test player with evaluations
      const member = await prisma.member.create({
        data: {
          id: 'member-3',
          name: 'Mike Davis',
          email: 'mike@example.com',
          birthdate: new Date('1998-01-01'),
          status: 'ACTIVE',
          clubId: 'club-1',
        },
      });

      const player = await prisma.player.create({
        data: {
          id: 'player-3',
          memberId: member.id,
          position: 'Defender',
          team: 'Senior Team',
          jerseyNumber: 4,
          status: 'ACTIVE',
        },
      });

      playerId = player.id;

      // Create evaluations
      await prisma.evaluation.createMany({
        data: [
          {
            playerId,
            overall: 4,
            technical: 4,
            tactical: 5,
            physical: 4,
            mental: 3,
            attitude: 4,
            comment: 'First evaluation',
            trainerId: 'trainer-123',
          },
          {
            playerId,
            overall: 5,
            technical: 5,
            tactical: 4,
            physical: 5,
            mental: 4,
            attitude: 5,
            comment: 'Second evaluation',
            trainerId: 'trainer-123',
          },
        ],
      });
    });

    it('should return evaluations for player', async () => {
      const response = await request(app)
        .get(`/api/trainer/players/${playerId}/evaluations`)
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({
        playerId,
        overall: 4,
        comment: 'First evaluation',
      });
      expect(response.body[1]).toMatchObject({
        playerId,
        overall: 5,
        comment: 'Second evaluation',
      });
    });

    it('should return 404 for non-existent player', async () => {
      const response = await request(app)
        .get('/api/trainer/players/non-existent-player/evaluations')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(404);
    });
  });
}); 