import request from 'supertest';
import { app } from '../../../src/index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mock Clerk authentication
jest.mock('@clerk/backend', () => ({
  verifyToken: jest.fn().mockResolvedValue({
    sub: 'member-123',
    metadata: {
      role: 'member',
    },
  }),
}));

describe('Member Dashboard API', () => {
  const mockToken = 'mock-jwt-token';

  beforeAll(async () => {
    // Clean up database before tests
    await prisma.announcement.deleteMany();
    await prisma.class.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.member.deleteMany();
    await prisma.club.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Create test data
    const club = await prisma.club.create({
      data: {
        id: 'club-1',
        name: 'Test Sports Club',
        address: '123 Test St',
        phone: '123-456-7890',
        email: 'test@club.com',
      },
    });

    const member = await prisma.member.create({
      data: {
        id: 'member-1',
        name: 'John Doe',
        email: 'john@example.com',
        userId: 'member-123',
        clubId: club.id,
        status: 'ACTIVE',
        birthdate: new Date('1990-01-01'),
      },
    });

    await prisma.announcement.create({
      data: {
        id: 'announcement-1',
        title: 'Test Announcement',
        content: 'This is a test announcement',
        type: 'info',
        clubId: club.id,
        isActive: true,
      },
    });

    await prisma.class.create({
      data: {
        id: 'class-1',
        name: 'Morning Yoga',
        description: 'Relaxing morning yoga class',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // Tomorrow + 1 hour
        location: 'Studio A',
        maxParticipants: 20,
        clubId: club.id,
        trainerId: 'trainer-1',
        isActive: true,
        category: 'fitness',
      },
    });
  });

  afterEach(async () => {
    // Clean up after each test
    await prisma.announcement.deleteMany();
    await prisma.class.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.member.deleteMany();
    await prisma.club.deleteMany();
  });

  describe('GET /api/member/dashboard', () => {
    it('should return 401 without authentication', async () => {
      await request(app).get('/api/member/dashboard').expect(401);
    });

    it('should return 403 for non-member role', async () => {
      jest.mocked(require('@clerk/backend').verifyToken).mockResolvedValueOnce({
        sub: 'admin-123',
        metadata: {
          role: 'admin',
        },
      });
      await request(app)
        .get('/api/member/dashboard')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(403);
    });

    it('should return dashboard data for authenticated member', async () => {
      const response = await request(app)
        .get('/api/member/dashboard')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('announcements');
      expect(response.body).toHaveProperty('upcomingEvents');
      expect(response.body).toHaveProperty('upcomingBookings');
      expect(response.body).toHaveProperty('quickStats');
      expect(response.body).toHaveProperty('member');

      expect(response.body.announcements).toHaveLength(1);
      expect(response.body.announcements[0].title).toBe('Test Announcement');
      expect(response.body.upcomingEvents).toHaveLength(1);
      expect(response.body.upcomingEvents[0].title).toBe('Morning Yoga');
      expect(response.body.member.name).toBe('John Doe');
      expect(response.body.quickStats.activeMembership).toBe('ACTIVE');
    });

    it('should return empty arrays when no data exists', async () => {
      // Clear all data
      await prisma.announcement.deleteMany();
      await prisma.class.deleteMany();

      const response = await request(app)
        .get('/api/member/dashboard')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);

      expect(response.body.announcements).toHaveLength(0);
      expect(response.body.upcomingEvents).toHaveLength(0);
      expect(response.body.upcomingBookings).toHaveLength(0);
    });

    it('should return 404 for non-existent member', async () => {
      jest.mocked(require('@clerk/backend').verifyToken).mockResolvedValueOnce({
        sub: 'non-existent-member',
        metadata: {
          role: 'member',
        },
      });

      await request(app)
        .get('/api/member/dashboard')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(404);
    });

    it('should include correct quick stats', async () => {
      const response = await request(app)
        .get('/api/member/dashboard')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);

      expect(response.body.quickStats).toHaveProperty('activeMembership');
      expect(response.body.quickStats).toHaveProperty('classesThisWeek');
      expect(response.body.quickStats).toHaveProperty('unreadMessages');
      expect(response.body.quickStats).toHaveProperty('pendingPayments');
      expect(response.body.quickStats).toHaveProperty('totalPendingAmount');

      expect(response.body.quickStats.activeMembership).toBe('ACTIVE');
      expect(response.body.quickStats.classesThisWeek).toBe(1);
      expect(response.body.quickStats.unreadMessages).toBe(0);
      expect(response.body.quickStats.pendingPayments).toBe(0);
    });

    it('should include member information', async () => {
      const response = await request(app)
        .get('/api/member/dashboard')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);

      expect(response.body.member).toHaveProperty('id');
      expect(response.body.member).toHaveProperty('name');
      expect(response.body.member).toHaveProperty('email');
      expect(response.body.member).toHaveProperty('status');
      expect(response.body.member).toHaveProperty('club');

      expect(response.body.member.name).toBe('John Doe');
      expect(response.body.member.email).toBe('john@example.com');
      expect(response.body.member.status).toBe('ACTIVE');
      expect(response.body.member.club).toBe('Test Sports Club');
    });

    it('should only return active announcements', async () => {
      // Create an inactive announcement
      await prisma.announcement.create({
        data: {
          id: 'announcement-2',
          title: 'Inactive Announcement',
          content: 'This announcement is inactive',
          type: 'warning',
          clubId: 'club-1',
          isActive: false,
        },
      });

      const response = await request(app)
        .get('/api/member/dashboard')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);

      expect(response.body.announcements).toHaveLength(1);
      expect(response.body.announcements[0].title).toBe('Test Announcement');
    });

    it('should only return active classes', async () => {
      // Create an inactive class
      await prisma.class.create({
        data: {
          id: 'class-2',
          name: 'Inactive Class',
          description: 'This class is inactive',
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
          location: 'Studio B',
          maxParticipants: 15,
          clubId: 'club-1',
          trainerId: 'trainer-1',
          isActive: false,
          category: 'fitness',
        },
      });

      const response = await request(app)
        .get('/api/member/dashboard')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);

      expect(response.body.upcomingEvents).toHaveLength(1);
      expect(response.body.upcomingEvents[0].title).toBe('Morning Yoga');
    });

    it('should handle database errors gracefully', async () => {
      // Mock database error by disconnecting
      await prisma.$disconnect();

      await request(app)
        .get('/api/member/dashboard')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(500);

      // Reconnect for cleanup
      await prisma.$connect();
    });
  });
}); 