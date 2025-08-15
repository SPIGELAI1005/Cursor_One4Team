import { Router } from 'express';
import { requireRole } from '../../../middleware/authMiddleware';
import { UserRole } from '../../../types/auth';

const router = Router();

// POST /api/support/contact - Send contact message from partner
router.post('/contact', requireRole(['partner']), async (req, res) => {
  try {
    const partnerId = req.user?.id;
    const { subject, message, priority } = req.body;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate required fields
    if (!subject || !message || !priority) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate priority
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority level' });
    }

    // Mock contact submission - in real implementation, this would:
    // 1. Save to database
    // 2. Send email notification to admin/support
    // 3. Create support ticket
    const contactMessage = {
      id: Date.now().toString(),
      partnerId,
      subject,
      message,
      priority,
      status: 'open',
      createdAt: new Date().toISOString(),
      type: 'partner'
    };

    res.json({
      success: true,
      data: contactMessage,
      message: 'Message sent successfully. We\'ll get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('Error sending contact message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/support/contact/history - Get partner's contact history
router.get('/contact/history', requireRole(['partner']), async (req, res) => {
  try {
    const partnerId = req.user?.id;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Mock contact history - in real implementation, this would query the database
    const contactHistory = [
      {
        id: '1',
        subject: 'Question about analytics data',
        priority: 'medium',
        status: 'resolved',
        createdAt: '2024-01-15T10:30:00Z',
        resolvedAt: '2024-01-16T14:20:00Z'
      },
      {
        id: '2',
        subject: 'Request for new sponsorship opportunity',
        priority: 'high',
        status: 'open',
        createdAt: '2024-01-20T09:15:00Z'
      }
    ];

    res.json({
      success: true,
      data: contactHistory,
      partnerId
    });

  } catch (error) {
    console.error('Error fetching contact history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 