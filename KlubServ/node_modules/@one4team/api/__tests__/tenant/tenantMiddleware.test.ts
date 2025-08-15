import { Request, Response, NextFunction } from 'express';
import { setTenantContext, requireTenant, optionalTenantContext } from '../../src/middleware/tenantMiddleware';
import { prisma } from '../../src/lib/prisma';

// Mock Prisma
jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    $executeRaw: jest.fn(),
  },
}));

// Mock tenant filter
jest.mock('../../src/lib/tenantFilter', () => ({
  setClubContext: jest.fn(),
}));

describe('Tenant Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      clubId: '550e8400-e29b-41d4-a716-446655440001',
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    
    // Clear mocks
    jest.clearAllMocks();
  });

  describe('setTenantContext', () => {
    it('should set tenant context when clubId is present', async () => {
      await setTenantContext(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(prisma.$executeRaw).toHaveBeenCalledWith(
        expect.stringContaining('SELECT set_current_tenant')
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle missing clubId gracefully', async () => {
      mockRequest.clubId = undefined;

      await setTenantContext(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(prisma.$executeRaw).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      (prisma.$executeRaw as jest.Mock).mockRejectedValue(new Error('Database error'));

      await setTenantContext(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('requireTenant', () => {
    it('should allow request when clubId is present', () => {
      requireTenant(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return error when clubId is missing', () => {
      mockRequest.clubId = undefined;

      requireTenant(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          code: 'MISSING_TENANT',
          message: 'Club ID is required for this operation',
        },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('optionalTenantContext', () => {
    it('should set tenant context when clubId is present', async () => {
      await optionalTenantContext(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(prisma.$executeRaw).toHaveBeenCalledWith(
        expect.stringContaining('SELECT set_current_tenant')
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should continue without setting context when clubId is missing', async () => {
      mockRequest.clubId = undefined;

      await optionalTenantContext(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(prisma.$executeRaw).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      (prisma.$executeRaw as jest.Mock).mockRejectedValue(new Error('Database error'));

      await optionalTenantContext(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });
}); 