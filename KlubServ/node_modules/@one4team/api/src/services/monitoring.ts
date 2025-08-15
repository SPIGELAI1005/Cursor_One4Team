import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export interface MonitoringEvent {
  eventType: string;
  tenantId?: string;
  userId?: string;
  action: string;
  resource?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  severity: 'info' | 'warn' | 'error' | 'critical';
}

export interface PerformanceMetrics {
  tenantId?: string;
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
}

export interface TenantUsageMetrics {
  tenantId: string;
  activeUsers: number;
  apiRequests: number;
  storageUsed: number;
  subscriptionTier: string;
  timestamp: Date;
}

/**
 * Monitoring Service - Comprehensive monitoring for multi-tenant SaaS
 */
export class MonitoringService {
  private static instance: MonitoringService;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  /**
   * Initialize monitoring service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Set up global error handlers
    process.on('uncaughtException', (error) => {
      this.logEvent({
        eventType: 'system',
        action: 'uncaught_exception',
        metadata: { error: error.message, stack: error.stack },
        timestamp: new Date(),
        severity: 'critical',
      });
    });

    process.on('unhandledRejection', (reason, promise) => {
      this.logEvent({
        eventType: 'system',
        action: 'unhandled_rejection',
        metadata: { reason, promise },
        timestamp: new Date(),
        severity: 'critical',
      });
    });

    this.isInitialized = true;
    console.log('🔍 Monitoring service initialized');
  }

  /**
   * Log application events with tenant context
   */
  async logEvent(event: MonitoringEvent): Promise<void> {
    try {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${event.severity.toUpperCase()}] ${event.eventType}: ${event.action}`, {
          tenantId: event.tenantId,
          userId: event.userId,
          metadata: event.metadata,
          timestamp: event.timestamp,
        });
      }

      // Store in database for production
      if (process.env.NODE_ENV === 'production') {
        await prisma.auditLog.create({
          data: {
            eventType: event.eventType,
            tenantId: event.tenantId,
            userId: event.userId,
            action: event.action,
            resource: event.resource,
            metadata: event.metadata,
            severity: event.severity,
            timestamp: event.timestamp,
          },
        });
      }

      // Send to external monitoring service (e.g., Sentry, DataDog)
      await this.sendToExternalService(event);
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  }

  /**
   * Track API performance metrics
   */
  async trackPerformance(metrics: PerformanceMetrics): Promise<void> {
    try {
      // Store performance metrics
      await prisma.performanceMetrics.create({
        data: {
          tenantId: metrics.tenantId,
          endpoint: metrics.endpoint,
          method: metrics.method,
          responseTime: metrics.responseTime,
          statusCode: metrics.statusCode,
          timestamp: metrics.timestamp,
          userAgent: metrics.userAgent,
          ipAddress: metrics.ipAddress,
        },
      });

      // Alert on slow responses
      if (metrics.responseTime > 5000) { // 5 seconds
        await this.logEvent({
          eventType: 'performance',
          tenantId: metrics.tenantId,
          action: 'slow_response',
          resource: `${metrics.method} ${metrics.endpoint}`,
          metadata: {
            responseTime: metrics.responseTime,
            statusCode: metrics.statusCode,
          },
          timestamp: new Date(),
          severity: 'warn',
        });
      }
    } catch (error) {
      console.error('Failed to track performance:', error);
    }
  }

  /**
   * Track tenant usage metrics
   */
  async trackTenantUsage(metrics: TenantUsageMetrics): Promise<void> {
    try {
      await prisma.tenantUsageMetrics.create({
        data: {
          tenantId: metrics.tenantId,
          activeUsers: metrics.activeUsers,
          apiRequests: metrics.apiRequests,
          storageUsed: metrics.storageUsed,
          subscriptionTier: metrics.subscriptionTier,
          timestamp: metrics.timestamp,
        },
      });

      // Check for usage limits
      await this.checkUsageLimits(metrics);
    } catch (error) {
      console.error('Failed to track tenant usage:', error);
    }
  }

  /**
   * Check tenant usage against subscription limits
   */
  private async checkUsageLimits(metrics: TenantUsageMetrics): Promise<void> {
    try {
      const tenant = await prisma.club.findUnique({
        where: { id: metrics.tenantId },
        select: {
          subscriptionStatus: true,
          stripeSubscriptionId: true,
        },
      });

      if (!tenant) return;

      // Get subscription details from Stripe
      // This would integrate with your Stripe service
      const subscription = await this.getSubscriptionDetails(tenant.stripeSubscriptionId);

      if (subscription) {
        const maxSeats = subscription.maxSeats || 10;
        const maxRequests = subscription.maxRequests || 10000;

        // Check seat limit
        if (metrics.activeUsers > maxSeats) {
          await this.logEvent({
            eventType: 'billing',
            tenantId: metrics.tenantId,
            action: 'seat_limit_exceeded',
            metadata: {
              activeUsers: metrics.activeUsers,
              maxSeats,
              subscriptionTier: metrics.subscriptionTier,
            },
            timestamp: new Date(),
            severity: 'warn',
          });
        }

        // Check API request limit
        if (metrics.apiRequests > maxRequests) {
          await this.logEvent({
            eventType: 'billing',
            tenantId: metrics.tenantId,
            action: 'api_limit_exceeded',
            metadata: {
              apiRequests: metrics.apiRequests,
              maxRequests,
              subscriptionTier: metrics.subscriptionTier,
            },
            timestamp: new Date(),
            severity: 'warn',
          });
        }
      }
    } catch (error) {
      console.error('Failed to check usage limits:', error);
    }
  }

  /**
   * Get subscription details from Stripe
   */
  private async getSubscriptionDetails(subscriptionId?: string): Promise<any> {
    if (!subscriptionId) return null;

    try {
      // This would integrate with your Stripe service
      // For now, return a mock response
      return {
        maxSeats: 10,
        maxRequests: 10000,
      };
    } catch (error) {
      console.error('Failed to get subscription details:', error);
      return null;
    }
  }

  /**
   * Send events to external monitoring service
   */
  private async sendToExternalService(event: MonitoringEvent): Promise<void> {
    try {
      // Send to Sentry for error tracking
      if (event.severity === 'error' || event.severity === 'critical') {
        await this.sendToSentry(event);
      }

      // Send to DataDog for metrics
      await this.sendToDataDog(event);

      // Send to Slack for critical alerts
      if (event.severity === 'critical') {
        await this.sendToSlack(event);
      }
    } catch (error) {
      console.error('Failed to send to external service:', error);
    }
  }

  /**
   * Send error events to Sentry
   */
  private async sendToSentry(event: MonitoringEvent): Promise<void> {
    // This would integrate with Sentry SDK
    // For now, just log to console
    console.log('Sending to Sentry:', event);
  }

  /**
   * Send metrics to DataDog
   */
  private async sendToDataDog(event: MonitoringEvent): Promise<void> {
    // This would integrate with DataDog API
    // For now, just log to console
    console.log('Sending to DataDog:', event);
  }

  /**
   * Send critical alerts to Slack
   */
  private async sendToSlack(event: MonitoringEvent): Promise<void> {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) return;

    try {
      const message = {
        text: `🚨 Critical Alert: ${event.eventType}`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Critical Alert*\n• Event: ${event.eventType}\n• Action: ${event.action}\n• Tenant: ${event.tenantId || 'N/A'}\n• Time: ${event.timestamp.toISOString()}`,
            },
          },
        ],
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error('Failed to send Slack alert:', error);
    }
  }

  /**
   * Get tenant analytics
   */
  async getTenantAnalytics(tenantId: string, period: 'day' | 'week' | 'month' = 'day'): Promise<any> {
    try {
      const startDate = this.getStartDate(period);

      const [usageMetrics, performanceMetrics, auditLogs] = await Promise.all([
        // Get usage metrics
        prisma.tenantUsageMetrics.findMany({
          where: {
            tenantId,
            timestamp: { gte: startDate },
          },
          orderBy: { timestamp: 'desc' },
        }),

        // Get performance metrics
        prisma.performanceMetrics.findMany({
          where: {
            tenantId,
            timestamp: { gte: startDate },
          },
          orderBy: { timestamp: 'desc' },
        }),

        // Get audit logs
        prisma.auditLog.findMany({
          where: {
            tenantId,
            timestamp: { gte: startDate },
          },
          orderBy: { timestamp: 'desc' },
        }),
      ]);

      return {
        usageMetrics,
        performanceMetrics,
        auditLogs,
        period,
        tenantId,
      };
    } catch (error) {
      console.error('Failed to get tenant analytics:', error);
      throw error;
    }
  }

  /**
   * Get system-wide analytics
   */
  async getSystemAnalytics(period: 'day' | 'week' | 'month' = 'day'): Promise<any> {
    try {
      const startDate = this.getStartDate(period);

      const [totalTenants, activeTenants, totalRequests, averageResponseTime] = await Promise.all([
        // Total tenants
        prisma.club.count(),

        // Active tenants (with activity in the period)
        prisma.tenantUsageMetrics.count({
          where: {
            timestamp: { gte: startDate },
          },
          distinct: ['tenantId'],
        }),

        // Total API requests
        prisma.performanceMetrics.count({
          where: {
            timestamp: { gte: startDate },
          },
        }),

        // Average response time
        prisma.performanceMetrics.aggregate({
          where: {
            timestamp: { gte: startDate },
          },
          _avg: {
            responseTime: true,
          },
        }),
      ]);

      return {
        totalTenants,
        activeTenants,
        totalRequests,
        averageResponseTime: averageResponseTime._avg.responseTime || 0,
        period,
      };
    } catch (error) {
      console.error('Failed to get system analytics:', error);
      throw error;
    }
  }

  /**
   * Get start date for analytics period
   */
  private getStartDate(period: 'day' | 'week' | 'month'): Date {
    const now = new Date();
    switch (period) {
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
  }

  /**
   * Middleware for request monitoring
   */
  static requestMonitoringMiddleware() {
    return async (req: Request, res: Response, next: any) => {
      const startTime = Date.now();
      const monitoring = MonitoringService.getInstance();

      // Add response monitoring
      const originalSend = res.send;
      res.send = function (body) {
        const responseTime = Date.now() - startTime;
        
        monitoring.trackPerformance({
          tenantId: (req as any).clubId,
          endpoint: req.path,
          method: req.method,
          responseTime,
          statusCode: res.statusCode,
          timestamp: new Date(),
          userAgent: req.get('User-Agent'),
          ipAddress: req.ip,
        });

        return originalSend.call(this, body);
      };

      next();
    };
  }
} 