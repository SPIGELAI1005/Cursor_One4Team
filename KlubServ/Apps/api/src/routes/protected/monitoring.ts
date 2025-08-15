import { Router } from 'express';
import { authenticateUser, requireAuth } from '../../middleware/authMiddleware';
import { MonitoringService } from '../../services/monitoring';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);
router.use(requireAuth);

// GET /api/monitoring/health - Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV,
    };

    res.json({
      success: true,
      data: health,
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed',
    });
  }
});

// GET /api/monitoring/tenant-analytics - Get tenant-specific analytics
const tenantAnalyticsSchema = z.object({
  period: z.enum(['day', 'week', 'month']).default('day'),
});

router.get('/tenant-analytics', async (req, res) => {
  try {
    const clubId = req.clubId;
    if (!clubId) {
      return res.status(400).json({
        success: false,
        error: 'Club ID not found in request',
      });
    }

    const validationResult = tenantAnalyticsSchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: validationResult.error.errors,
      });
    }

    const { period } = validationResult.data;
    const monitoring = MonitoringService.getInstance();
    const analytics = await monitoring.getTenantAnalytics(clubId, period);

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Error fetching tenant analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tenant analytics',
    });
  }
});

// GET /api/monitoring/system-analytics - Get system-wide analytics (admin only)
router.get('/system-analytics', async (req, res) => {
  try {
    // Check if user has admin role
    const user = req.user;
    if (!user || !user.roles?.includes('admin')) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.',
      });
    }

    const validationResult = tenantAnalyticsSchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: validationResult.error.errors,
      });
    }

    const { period } = validationResult.data;
    const monitoring = MonitoringService.getInstance();
    const analytics = await monitoring.getSystemAnalytics(period);

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Error fetching system analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system analytics',
    });
  }
});

// POST /api/monitoring/log-event - Log custom events
const logEventSchema = z.object({
  eventType: z.string().min(1),
  action: z.string().min(1),
  resource: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  severity: z.enum(['info', 'warn', 'error', 'critical']).default('info'),
});

router.post('/log-event', async (req, res) => {
  try {
    const clubId = req.clubId;
    const userId = req.user?.id;

    const validationResult = logEventSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body',
        details: validationResult.error.errors,
      });
    }

    const { eventType, action, resource, metadata, severity } = validationResult.data;
    const monitoring = MonitoringService.getInstance();

    await monitoring.logEvent({
      eventType,
      tenantId: clubId,
      userId,
      action,
      resource,
      metadata,
      severity,
      timestamp: new Date(),
    });

    res.json({
      success: true,
      message: 'Event logged successfully',
    });
  } catch (error) {
    console.error('Error logging event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to log event',
    });
  }
});

// POST /api/monitoring/track-usage - Track tenant usage metrics
const trackUsageSchema = z.object({
  activeUsers: z.number().min(0),
  apiRequests: z.number().min(0),
  storageUsed: z.number().min(0),
  subscriptionTier: z.string().min(1),
});

router.post('/track-usage', async (req, res) => {
  try {
    const clubId = req.clubId;
    if (!clubId) {
      return res.status(400).json({
        success: false,
        error: 'Club ID not found in request',
      });
    }

    const validationResult = trackUsageSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body',
        details: validationResult.error.errors,
      });
    }

    const monitoring = MonitoringService.getInstance();
    await monitoring.trackTenantUsage({
      tenantId: clubId,
      ...validationResult.data,
      timestamp: new Date(),
    });

    res.json({
      success: true,
      message: 'Usage metrics tracked successfully',
    });
  } catch (error) {
    console.error('Error tracking usage:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track usage metrics',
    });
  }
});

// GET /api/monitoring/audit-logs - Get audit logs for tenant
const auditLogsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  severity: z.enum(['info', 'warn', 'error', 'critical']).optional(),
  eventType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

router.get('/audit-logs', async (req, res) => {
  try {
    const clubId = req.clubId;
    if (!clubId) {
      return res.status(400).json({
        success: false,
        error: 'Club ID not found in request',
      });
    }

    const validationResult = auditLogsSchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: validationResult.error.errors,
      });
    }

    const { page, limit, severity, eventType, startDate, endDate } = validationResult.data;
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = { tenantId: clubId };
    if (severity) where.severity = severity;
    if (eventType) where.eventType = eventType;
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch audit logs',
    });
  }
});

// GET /api/monitoring/performance-metrics - Get performance metrics for tenant
const performanceMetricsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  endpoint: z.string().optional(),
  method: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

router.get('/performance-metrics', async (req, res) => {
  try {
    const clubId = req.clubId;
    if (!clubId) {
      return res.status(400).json({
        success: false,
        error: 'Club ID not found in request',
      });
    }

    const validationResult = performanceMetricsSchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: validationResult.error.errors,
      });
    }

    const { page, limit, endpoint, method, startDate, endDate } = validationResult.data;
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = { tenantId: clubId };
    if (endpoint) where.endpoint = endpoint;
    if (method) where.method = method;
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    const [metrics, total] = await Promise.all([
      prisma.performanceMetrics.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.performanceMetrics.count({ where }),
    ]);

    // Calculate averages
    const averages = await prisma.performanceMetrics.aggregate({
      where,
      _avg: {
        responseTime: true,
      },
      _count: {
        id: true,
      },
    });

    res.json({
      success: true,
      data: {
        metrics,
        averages: {
          responseTime: averages._avg.responseTime || 0,
          totalRequests: averages._count.id,
        },
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch performance metrics',
    });
  }
});

export default router; 