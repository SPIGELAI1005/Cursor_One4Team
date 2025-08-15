import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

// Validation schemas
const getFlagsQuerySchema = z.object({
  status: z.enum(['new', 'in_progress', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  category: z.enum(['technical', 'account', 'payment', 'booking', 'general']).optional(),
  search: z.string().optional(),
  page: z.string().transform(Number).pipe(z.number().min(1)).optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
});

const updateIssueStatusSchema = z.object({
  status: z.enum(['new', 'in_progress', 'resolved', 'closed']),
  resolution: z.string().optional(),
});

const getIssueSchema = z.object({
  id: z.string().min(1),
});

// GET /api/support/flags - Get flagged issues
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = getFlagsQuerySchema.parse(req.query);
    
    // Mock data - replace with actual database query
    const mockIssues = [
      {
        id: '1',
        userId: '1',
        userName: 'Anna Müller',
        userEmail: 'anna.mueller@example.com',
        userAvatar: '/Anna Müller.jpg',
        issue: 'Cannot access training schedule',
        description: 'When I try to view my training schedule, I get an "Access Denied" error message. This started happening yesterday.',
        category: 'technical',
        priority: 'high',
        status: 'new',
        timestamp: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        userId: '2',
        userName: 'Thomas Weber',
        userEmail: 'thomas.weber@example.com',
        issue: 'Payment not processed',
        description: 'I made a payment for my membership renewal but it shows as pending. The money was deducted from my account.',
        category: 'payment',
        priority: 'critical',
        status: 'in_progress',
        timestamp: '2024-01-14T15:20:00Z',
        assignedTo: 'Support Team'
      },
      {
        id: '3',
        userId: '3',
        userName: 'Maria Schmidt',
        userEmail: 'maria.schmidt@example.com',
        issue: 'Booking system error',
        description: 'I\'m trying to book a training session but the system keeps showing "No available slots" even though I can see open times.',
        category: 'booking',
        priority: 'medium',
        status: 'resolved',
        timestamp: '2024-01-13T09:15:00Z',
        assignedTo: 'Support Team',
        resolution: 'Fixed booking system cache issue. User can now book sessions.',
        resolvedAt: '2024-01-14T11:30:00Z'
      },
      {
        id: '4',
        userId: '4',
        userName: 'Hans Bauer',
        userEmail: 'hans.bauer@example.com',
        issue: 'Account activation pending',
        description: 'I registered for membership 3 days ago but my account is still showing as pending activation.',
        category: 'account',
        priority: 'high',
        status: 'new',
        timestamp: '2024-01-12T16:45:00Z'
      },
      {
        id: '5',
        userId: '5',
        userName: 'Lisa Wagner',
        userEmail: 'lisa.wagner@example.com',
        issue: 'General inquiry about membership',
        description: 'I have questions about upgrading my membership plan and what benefits are included.',
        category: 'general',
        priority: 'low',
        status: 'closed',
        timestamp: '2024-01-11T14:20:00Z',
        assignedTo: 'Support Team',
        resolution: 'Provided detailed information about membership plans and benefits.',
        resolvedAt: '2024-01-12T10:15:00Z'
      }
    ];

    // Apply filters
    let filteredIssues = mockIssues;

    if (query.status) {
      filteredIssues = filteredIssues.filter(issue => issue.status === query.status);
    }

    if (query.priority) {
      filteredIssues = filteredIssues.filter(issue => issue.priority === query.priority);
    }

    if (query.category) {
      filteredIssues = filteredIssues.filter(issue => issue.category === query.category);
    }

    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      filteredIssues = filteredIssues.filter(issue =>
        issue.issue.toLowerCase().includes(searchTerm) ||
        issue.description.toLowerCase().includes(searchTerm) ||
        issue.userName.toLowerCase().includes(searchTerm) ||
        issue.userEmail.toLowerCase().includes(searchTerm)
      );
    }

    // Apply pagination
    const page = query.page || 1;
    const limit = query.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedIssues = filteredIssues.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        issues: paginatedIssues,
        pagination: {
          page,
          limit,
          total: filteredIssues.length,
          totalPages: Math.ceil(filteredIssues.length / limit),
          hasNext: endIndex < filteredIssues.length,
          hasPrev: page > 1,
        }
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.errors,
      });
    }

    console.error('Error fetching issues:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// GET /api/support/flags/:id - Get issue by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = getIssueSchema.parse(req.params);
    
    // Mock data - replace with actual database query
    const mockIssue = {
      id: '1',
      userId: '1',
      userName: 'Anna Müller',
      userEmail: 'anna.mueller@example.com',
      userAvatar: '/Anna Müller.jpg',
      issue: 'Cannot access training schedule',
      description: 'When I try to view my training schedule, I get an "Access Denied" error message. This started happening yesterday.',
      category: 'technical',
      priority: 'high',
      status: 'new',
      timestamp: '2024-01-15T10:30:00Z',
      assignedTo: null,
      resolution: null,
      resolvedAt: null,
      attachments: [],
      comments: [
        {
          id: '1',
          userId: 'support',
          userName: 'Support Team',
          content: 'Looking into this issue. Can you provide more details about when this started happening?',
          timestamp: '2024-01-15T11:00:00Z'
        }
      ]
    };

    if (mockIssue.id !== id) {
      return res.status(404).json({
        success: false,
        error: 'Issue not found',
      });
    }

    res.json({
      success: true,
      data: mockIssue,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid issue ID',
        details: error.errors,
      });
    }

    console.error('Error fetching issue:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// PATCH /api/support/flags/:id/status - Update issue status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = getIssueSchema.parse(req.params);
    const { status, resolution } = updateIssueStatusSchema.parse(req.body);
    
    // Mock response - replace with actual database operation
    const updatedIssue = {
      id,
      status,
      resolution: resolution || null,
      resolvedAt: status === 'resolved' ? new Date().toISOString() : null,
      updatedBy: req.user?.id || 'support',
      updatedAt: new Date().toISOString(),
    };

    // In a real app, this would:
    // 1. Validate the issue exists
    // 2. Update the issue status
    // 3. Add resolution if provided
    // 4. Set resolvedAt timestamp if status is 'resolved'
    // 5. Log the status change
    // 6. Send notification to the user if status changes

    res.json({
      success: true,
      data: updatedIssue,
      message: `Issue status updated to ${status}`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      });
    }

    console.error('Error updating issue status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// POST /api/support/flags/:id/assign - Assign issue to support team member
router.post('/:id/assign', async (req: Request, res: Response) => {
  try {
    const { id } = getIssueSchema.parse(req.params);
    const { assignedTo } = z.object({
      assignedTo: z.string().min(1),
    }).parse(req.body);
    
    // Mock response - replace with actual database operation
    const assignment = {
      issueId: id,
      assignedTo,
      assignedBy: req.user?.id || 'support',
      assignedAt: new Date().toISOString(),
    };

    // In a real app, this would:
    // 1. Validate the issue exists
    // 2. Validate the assignee exists and has support role
    // 3. Update the issue assignment
    // 4. Log the assignment
    // 5. Send notification to the assignee

    res.json({
      success: true,
      data: assignment,
      message: `Issue assigned to ${assignedTo}`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      });
    }

    console.error('Error assigning issue:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// GET /api/support/flags/stats - Get issue statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    // Mock statistics - replace with actual database aggregation
    const stats = {
      total: 25,
      byStatus: {
        new: 8,
        in_progress: 5,
        resolved: 10,
        closed: 2,
      },
      byPriority: {
        critical: 2,
        high: 8,
        medium: 10,
        low: 5,
      },
      byCategory: {
        technical: 12,
        account: 5,
        payment: 3,
        booking: 3,
        general: 2,
      },
      resolvedToday: 3,
      avgResolutionTime: '2.5 days',
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching issue statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router; 