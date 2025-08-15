import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

// Validation schemas
const resetPasswordSchema = z.object({
  userId: z.string().min(1),
  email: z.string().email().optional(),
});

const resendWelcomeEmailSchema = z.object({
  email: z.string().email(),
});

const getUserByIdSchema = z.object({
  id: z.string().min(1),
});

// POST /api/support/actions/reset-password - Reset user password
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { userId, email } = resetPasswordSchema.parse(req.body);
    
    // Mock response - replace with actual password reset logic
    const resetResult = {
      userId,
      email: email || 'user@example.com',
      resetToken: 'reset_token_' + Date.now(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      requestedBy: req.user?.id || 'support',
      requestedAt: new Date().toISOString(),
    };

    // In a real app, this would:
    // 1. Validate the user exists
    // 2. Generate a secure reset token
    // 3. Store the token with expiration
    // 4. Send password reset email to user
    // 5. Log the support action
    // 6. Send notification to user

    console.log(`Password reset initiated for user ${userId} by support team`);

    res.json({
      success: true,
      data: {
        message: 'Password reset email sent successfully',
        userId,
        email: resetResult.email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      });
    }

    console.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// POST /api/support/actions/resend-welcome - Resend welcome email
router.post('/resend-welcome', async (req: Request, res: Response) => {
  try {
    const { email } = resendWelcomeEmailSchema.parse(req.body);
    
    // Mock response - replace with actual email resend logic
    const emailResult = {
      email,
      template: 'welcome',
      sentAt: new Date().toISOString(),
      sentBy: req.user?.id || 'support',
      messageId: 'email_' + Date.now(),
    };

    // In a real app, this would:
    // 1. Validate the user exists and has this email
    // 2. Check if user has already received welcome email
    // 3. Send welcome email with activation link
    // 4. Log the support action
    // 5. Update user's email status

    console.log(`Welcome email resent to ${email} by support team`);

    res.json({
      success: true,
      data: {
        message: 'Welcome email sent successfully',
        email,
        messageId: emailResult.messageId,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      });
    }

    console.error('Error resending welcome email:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// GET /api/support/actions/user/:id/clerk-profile - Get Clerk profile info
router.get('/user/:id/clerk-profile', async (req: Request, res: Response) => {
  try {
    const { id } = getUserByIdSchema.parse(req.params);
    
    // Mock Clerk profile data - replace with actual Clerk API call
    const clerkProfile = {
      userId: id,
      clerkId: 'user_clerk_' + id,
      email: 'user@example.com',
      firstName: 'User',
      lastName: 'Name',
      emailVerified: true,
      phoneNumber: '+1234567890',
      phoneVerified: false,
      createdAt: '2023-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      lastSignIn: '2024-01-15T10:30:00Z',
      imageUrl: 'https://example.com/avatar.jpg',
      publicMetadata: {
        user_role: 'member',
        club_id: 'club_123',
      },
      privateMetadata: {
        internal_id: 'internal_' + id,
      },
    };

    res.json({
      success: true,
      data: clerkProfile,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
        details: error.errors,
      });
    }

    console.error('Error fetching Clerk profile:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// GET /api/support/actions/user/:id/registration-status - Check registration status
router.get('/user/:id/registration-status', async (req: Request, res: Response) => {
  try {
    const { id } = getUserByIdSchema.parse(req.params);
    
    // Mock registration status - replace with actual database query
    const registrationStatus = {
      userId: id,
      status: 'completed',
      registrationDate: '2023-01-15T10:00:00Z',
      emailVerified: true,
      profileCompleted: true,
      membershipActive: true,
      lastActivity: '2024-01-15T10:30:00Z',
      pendingActions: [],
      verificationSteps: [
        { step: 'email_verification', completed: true, completedAt: '2023-01-15T10:05:00Z' },
        { step: 'profile_setup', completed: true, completedAt: '2023-01-15T10:10:00Z' },
        { step: 'membership_activation', completed: true, completedAt: '2023-01-15T10:15:00Z' },
      ],
    };

    res.json({
      success: true,
      data: registrationStatus,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
        details: error.errors,
      });
    }

    console.error('Error checking registration status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// GET /api/support/actions/system-health - Check system health
router.get('/system-health', async (req: Request, res: Response) => {
  try {
    // Mock system health check - replace with actual health checks
    const systemHealth = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      services: {
        database: { status: 'healthy', responseTime: 45 },
        clerk: { status: 'healthy', responseTime: 120 },
        email: { status: 'healthy', responseTime: 200 },
        storage: { status: 'healthy', responseTime: 80 },
      },
      metrics: {
        uptime: '99.9%',
        activeUsers: 1247,
        systemLoad: '23%',
        memoryUsage: '67%',
        diskUsage: '45%',
      },
      alerts: [],
      lastMaintenance: '2024-01-10T02:00:00Z',
    };

    res.json({
      success: true,
      data: systemHealth,
    });
  } catch (error) {
    console.error('Error checking system health:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// GET /api/support/actions/faq - Search FAQ
router.get('/faq', async (req: Request, res: Response) => {
  try {
    const { search } = z.object({
      search: z.string().optional(),
    }).parse(req.query);
    
    // Mock FAQ data - replace with actual FAQ search
    const faqResults = [
      {
        id: '1',
        question: 'How do I reset my password?',
        answer: 'You can reset your password by clicking the "Forgot Password" link on the login page, or contact support for assistance.',
        category: 'account',
        tags: ['password', 'login', 'security'],
        helpful: 15,
        notHelpful: 2,
      },
      {
        id: '2',
        question: 'How do I book a training session?',
        answer: 'To book a training session, go to the Calendar page, select an available time slot, and click "Book Session".',
        category: 'booking',
        tags: ['booking', 'calendar', 'training'],
        helpful: 23,
        notHelpful: 1,
      },
      {
        id: '3',
        question: 'How do I update my profile information?',
        answer: 'You can update your profile by going to the Profile page and clicking "Edit Profile". Changes are saved automatically.',
        category: 'account',
        tags: ['profile', 'settings', 'personal'],
        helpful: 18,
        notHelpful: 3,
      },
    ];

    // Filter by search term if provided
    let filteredResults = faqResults;
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredResults = faqResults.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm) ||
        faq.answer.toLowerCase().includes(searchTerm) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    res.json({
      success: true,
      data: {
        results: filteredResults,
        total: filteredResults.length,
        searchTerm: search || null,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.errors,
      });
    }

    console.error('Error searching FAQ:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// POST /api/support/actions/log-action - Log support action
router.post('/log-action', async (req: Request, res: Response) => {
  try {
    const { action, userId, details } = z.object({
      action: z.string().min(1),
      userId: z.string().optional(),
      details: z.record(z.any()).optional(),
    }).parse(req.body);
    
    // Mock action logging - replace with actual logging
    const logEntry = {
      id: 'log_' + Date.now(),
      action,
      userId: userId || null,
      supportUserId: req.user?.id || 'support',
      timestamp: new Date().toISOString(),
      details: details || {},
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    };

    // In a real app, this would:
    // 1. Store the log entry in database
    // 2. Send to logging service
    // 3. Trigger any necessary notifications
    // 4. Update audit trail

    console.log('Support action logged:', logEntry);

    res.json({
      success: true,
      data: {
        message: 'Action logged successfully',
        logId: logEntry.id,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      });
    }

    console.error('Error logging action:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router; 