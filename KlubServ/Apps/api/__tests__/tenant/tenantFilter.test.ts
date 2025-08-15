import { PrismaClient } from '@prisma/client';
import { createTenantFilter, setClubContext, getClubContext } from '../../src/lib/tenantFilter';

// Mock PrismaClient
const mockPrisma = {
  $use: jest.fn(),
} as unknown as PrismaClient;

describe('Tenant Filter', () => {
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockNext = jest.fn();
    jest.clearAllMocks();
    // Clear global context
    (global as any).__currentClubId = undefined;
  });

  describe('createTenantFilter', () => {
    it('should register middleware with Prisma client', () => {
      createTenantFilter(mockPrisma);
      expect(mockPrisma.$use).toHaveBeenCalled();
    });

    it('should inject clubId into find queries for club-scoped models', () => {
      createTenantFilter(mockPrisma);
      const middleware = mockPrisma.$use.mock.calls[0][0];

      const params = {
        model: 'member',
        action: 'findMany',
        args: {
          where: { status: 'ACTIVE' }
        }
      };

      // Set club context
      setClubContext('550e8400-e29b-41d4-a716-446655440001');

      middleware(params, mockNext);

      expect(params.args.where.clubId).toBe('550e8400-e29b-41d4-a716-446655440001');
      expect(mockNext).toHaveBeenCalledWith(params);
    });

    it('should inject clubId into create operations', () => {
      createTenantFilter(mockPrisma);
      const middleware = mockPrisma.$use.mock.calls[0][0];

      const params = {
        model: 'member',
        action: 'create',
        args: {
          data: {
            name: 'John Doe',
            email: 'john@example.com'
          }
        }
      };

      setClubContext('550e8400-e29b-41d4-a716-446655440001');

      middleware(params, mockNext);

      expect(params.args.data.clubId).toBe('550e8400-e29b-41d4-a716-446655440001');
      expect(mockNext).toHaveBeenCalledWith(params);
    });

    it('should not inject clubId if already present', () => {
      createTenantFilter(mockPrisma);
      const middleware = mockPrisma.$use.mock.calls[0][0];

      const params = {
        model: 'member',
        action: 'findMany',
        args: {
          where: {
            clubId: 'existing-club-id',
            status: 'ACTIVE'
          }
        }
      };

      setClubContext('550e8400-e29b-41d4-a716-446655440001');

      middleware(params, mockNext);

      expect(params.args.where.clubId).toBe('existing-club-id');
      expect(mockNext).toHaveBeenCalledWith(params);
    });

    it('should not inject clubId for non-club-scoped models', () => {
      createTenantFilter(mockPrisma);
      const middleware = mockPrisma.$use.mock.calls[0][0];

      const params = {
        model: 'user',
        action: 'findMany',
        args: {
          where: { status: 'ACTIVE' }
        }
      };

      setClubContext('550e8400-e29b-41d4-a716-446655440001');

      middleware(params, mockNext);

      expect(params.args.where.clubId).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith(params);
    });

    it('should prevent clubId changes in update operations', () => {
      createTenantFilter(mockPrisma);
      const middleware = mockPrisma.$use.mock.calls[0][0];

      const params = {
        model: 'member',
        action: 'update',
        args: {
          where: { id: 'member-1' },
          data: {
            name: 'Updated Name',
            clubId: 'different-club-id'
          }
        }
      };

      setClubContext('550e8400-e29b-41d4-a716-446655440001');

      middleware(params, mockNext);

      expect(params.args.data.clubId).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith(params);
    });

    it('should inject clubId into delete operations', () => {
      createTenantFilter(mockPrisma);
      const middleware = mockPrisma.$use.mock.calls[0][0];

      const params = {
        model: 'member',
        action: 'delete',
        args: {
          where: { id: 'member-1' }
        }
      };

      setClubContext('550e8400-e29b-41d4-a716-446655440001');

      middleware(params, mockNext);

      expect(params.args.where.clubId).toBe('550e8400-e29b-41d4-a716-446655440001');
      expect(mockNext).toHaveBeenCalledWith(params);
    });

    it('should handle operations without club context gracefully', () => {
      createTenantFilter(mockPrisma);
      const middleware = mockPrisma.$use.mock.calls[0][0];

      const params = {
        model: 'member',
        action: 'findMany',
        args: {
          where: { status: 'ACTIVE' }
        }
      };

      // No club context set
      middleware(params, mockNext);

      expect(params.args.where.clubId).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith(params);
    });
  });

  describe('setClubContext and getClubContext', () => {
    it('should set and get club context correctly', () => {
      const clubId = '550e8400-e29b-41d4-a716-446655440001';
      
      setClubContext(clubId);
      expect(getClubContext()).toBe(clubId);
    });

    it('should return undefined when no context is set', () => {
      expect(getClubContext()).toBeUndefined();
    });

    it('should update context when set multiple times', () => {
      setClubContext('club-1');
      setClubContext('club-2');
      
      expect(getClubContext()).toBe('club-2');
    });
  });
}); 