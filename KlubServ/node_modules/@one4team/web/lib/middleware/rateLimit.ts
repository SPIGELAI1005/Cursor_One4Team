import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore: RateLimitStore = {};

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Get client identifier (IP address or user ID)
   */
  private getClientId(req: NextRequest): string {
    // In production, you might want to use a more sophisticated method
    // to identify clients (e.g., user ID if authenticated, IP + User-Agent, etc.)
    return req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  }

  /**
   * Check if request is within rate limit
   */
  private isRateLimited(clientId: string): boolean {
    const now = Date.now();
    const clientData = rateLimitStore[clientId];

    if (!clientData || now > clientData.resetTime) {
      // Reset or initialize client data
      rateLimitStore[clientId] = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };
      return false;
    }

    if (clientData.count >= this.config.maxRequests) {
      return true;
    }

    // Increment request count
    clientData.count++;
    return false;
  }

  /**
   * Get remaining requests for client
   */
  private getRemainingRequests(clientId: string): number {
    const clientData = rateLimitStore[clientId];
    if (!clientData) {
      return this.config.maxRequests;
    }
    return Math.max(0, this.config.maxRequests - clientData.count);
  }

  /**
   * Get reset time for client
   */
  private getResetTime(clientId: string): number {
    const clientData = rateLimitStore[clientId];
    return clientData ? clientData.resetTime : Date.now() + this.config.windowMs;
  }

  /**
   * Rate limiting middleware
   */
  middleware() {
    return (req: NextRequest) => {
      const clientId = this.getClientId(req);

      if (this.isRateLimited(clientId)) {
        const resetTime = this.getResetTime(clientId);
        
        return NextResponse.json(
          {
            error: 'Too many requests',
            message: 'Rate limit exceeded. Please try again later.',
            retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': this.config.maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': resetTime.toString(),
              'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
            },
          }
        );
      }

      const remaining = this.getRemainingRequests(clientId);
      const resetTime = this.getResetTime(clientId);

      // Add rate limit headers to response
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', this.config.maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', resetTime.toString());

      return response;
    };
  }
}

// Pre-configured rate limiters
export const registrationRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 registration attempts per 15 minutes
});

export const emailVerificationRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10, // 10 verification attempts per hour
});

export const passwordResetRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 password reset attempts per hour
}); 