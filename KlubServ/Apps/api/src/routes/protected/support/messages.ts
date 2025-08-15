import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

// Validation schemas
const getMessagesQuerySchema = z.object({
  status: z.enum(['open', 'closed']).optional(),
  search: z.string().optional(),
  page: z.string().transform(Number).pipe(z.number().min(1)).optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
});

const sendReplySchema = z.object({
  conversationId: z.string().min(1),
  message: z.string().min(1).max(1000),
  templateId: z.string().optional(),
});

const getConversationSchema = z.object({
  id: z.string().min(1),
});

// GET /api/support/messages - Get support conversations
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = getMessagesQuerySchema.parse(req.query);
    
    // Mock data - replace with actual database query
    const mockConversations = [
      {
        id: '1',
        userId: '1',
        userName: 'Anna Müller',
        userEmail: 'anna.mueller@example.com',
        userAvatar: '/Anna Müller.jpg',
        status: 'open',
        lastMessage: 'I can\'t seem to access my training schedule. Can you help?',
        lastActivity: '2024-01-15T10:30:00Z',
        messageCount: 3,
        messages: [
          {
            id: '1',
            userId: '1',
            userName: 'Anna Müller',
            userEmail: 'anna.mueller@example.com',
            userAvatar: '/Anna Müller.jpg',
            content: 'I can\'t seem to access my training schedule. Can you help?',
            timestamp: '2024-01-15T10:30:00Z',
            isFromUser: true
          },
          {
            id: '2',
            userId: 'support',
            userName: 'Support Team',
            userEmail: 'support@one4team.com',
            content: 'Hello Anna! I can help you with that. Could you please tell me what happens when you try to access your training schedule?',
            timestamp: '2024-01-15T10:35:00Z',
            isFromUser: false
          },
          {
            id: '3',
            userId: '1',
            userName: 'Anna Müller',
            userEmail: 'anna.mueller@example.com',
            userAvatar: '/Anna Müller.jpg',
            content: 'It shows an error message saying "Access Denied"',
            timestamp: '2024-01-15T10:40:00Z',
            isFromUser: true
          }
        ]
      },
      {
        id: '2',
        userId: '2',
        userName: 'Thomas Weber',
        userEmail: 'thomas.weber@example.com',
        status: 'closed',
        lastMessage: 'Thank you for your help!',
        lastActivity: '2024-01-14T16:20:00Z',
        messageCount: 5,
        messages: [
          {
            id: '4',
            userId: '2',
            userName: 'Thomas Weber',
            userEmail: 'thomas.weber@example.com',
            content: 'I need help resetting my password',
            timestamp: '2024-01-14T15:00:00Z',
            isFromUser: true
          },
          {
            id: '5',
            userId: 'support',
            userName: 'Support Team',
            userEmail: 'support@one4team.com',
            content: 'I\'ve initiated a password reset for your account. You should receive an email with instructions shortly.',
            timestamp: '2024-01-14T15:05:00Z',
            isFromUser: false
          },
          {
            id: '6',
            userId: '2',
            userName: 'Thomas Weber',
            userEmail: 'thomas.weber@example.com',
            content: 'Thank you for your help!',
            timestamp: '2024-01-14T16:20:00Z',
            isFromUser: true
          }
        ]
      },
      {
        id: '3',
        userId: '3',
        userName: 'Maria Schmidt',
        userEmail: 'maria.schmidt@example.com',
        status: 'open',
        lastMessage: 'How do I update my profile information?',
        lastActivity: '2024-01-15T09:15:00Z',
        messageCount: 2,
        messages: [
          {
            id: '7',
            userId: '3',
            userName: 'Maria Schmidt',
            userEmail: 'maria.schmidt@example.com',
            content: 'How do I update my profile information?',
            timestamp: '2024-01-15T09:15:00Z',
            isFromUser: true
          }
        ]
      }
    ];

    // Apply filters
    let filteredConversations = mockConversations;

    if (query.status) {
      filteredConversations = filteredConversations.filter(conv => conv.status === query.status);
    }

    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      filteredConversations = filteredConversations.filter(conv =>
        conv.userName.toLowerCase().includes(searchTerm) ||
        conv.userEmail.toLowerCase().includes(searchTerm) ||
        conv.lastMessage.toLowerCase().includes(searchTerm)
      );
    }

    // Apply pagination
    const page = query.page || 1;
    const limit = query.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedConversations = filteredConversations.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        conversations: paginatedConversations,
        pagination: {
          page,
          limit,
          total: filteredConversations.length,
          totalPages: Math.ceil(filteredConversations.length / limit),
          hasNext: endIndex < filteredConversations.length,
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

    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// GET /api/support/messages/:id - Get conversation by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = getConversationSchema.parse(req.params);
    
    // Mock data - replace with actual database query
    const mockConversation = {
      id: '1',
      userId: '1',
      userName: 'Anna Müller',
      userEmail: 'anna.mueller@example.com',
      userAvatar: '/Anna Müller.jpg',
      status: 'open',
      lastMessage: 'I can\'t seem to access my training schedule. Can you help?',
      lastActivity: '2024-01-15T10:30:00Z',
      messageCount: 3,
      messages: [
        {
          id: '1',
          userId: '1',
          userName: 'Anna Müller',
          userEmail: 'anna.mueller@example.com',
          userAvatar: '/Anna Müller.jpg',
          content: 'I can\'t seem to access my training schedule. Can you help?',
          timestamp: '2024-01-15T10:30:00Z',
          isFromUser: true
        },
        {
          id: '2',
          userId: 'support',
          userName: 'Support Team',
          userEmail: 'support@one4team.com',
          content: 'Hello Anna! I can help you with that. Could you please tell me what happens when you try to access your training schedule?',
          timestamp: '2024-01-15T10:35:00Z',
          isFromUser: false
        },
        {
          id: '3',
          userId: '1',
          userName: 'Anna Müller',
          userEmail: 'anna.mueller@example.com',
          userAvatar: '/Anna Müller.jpg',
          content: 'It shows an error message saying "Access Denied"',
          timestamp: '2024-01-15T10:40:00Z',
          isFromUser: true
        }
      ]
    };

    if (mockConversation.id !== id) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found',
      });
    }

    res.json({
      success: true,
      data: mockConversation,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid conversation ID',
        details: error.errors,
      });
    }

    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// POST /api/support/messages/reply - Send reply to conversation
router.post('/reply', async (req: Request, res: Response) => {
  try {
    const { conversationId, message, templateId } = sendReplySchema.parse(req.body);
    
    // Mock response - replace with actual database operation
    const newMessage = {
      id: Date.now().toString(),
      userId: 'support',
      userName: 'Support Team',
      userEmail: 'support@one4team.com',
      content: message,
      timestamp: new Date().toISOString(),
      isFromUser: false,
      templateId: templateId || null,
    };

    // In a real app, this would:
    // 1. Validate the conversation exists
    // 2. Add the message to the conversation
    // 3. Update the conversation's lastActivity
    // 4. Send notification to the user
    // 5. Log the support action

    res.json({
      success: true,
      data: {
        message: newMessage,
        conversationId,
      },
      message: 'Reply sent successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      });
    }

    console.error('Error sending reply:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// GET /api/support/messages/templates - Get reply templates
router.get('/templates', async (req: Request, res: Response) => {
  try {
    // Mock templates - replace with actual database query
    const templates = [
      {
        id: 'welcome',
        title: 'Welcome Message',
        content: 'Welcome to our club! We\'re excited to have you as a member. If you have any questions, feel free to reach out to our support team.'
      },
      {
        id: 'password_reset',
        title: 'Password Reset',
        content: 'I\'ve initiated a password reset for your account. You should receive an email with instructions shortly. Please check your spam folder if you don\'t see it in your inbox.'
      },
      {
        id: 'account_help',
        title: 'Account Help',
        content: 'I can help you with your account. Could you please provide more details about the specific issue you\'re experiencing?'
      },
      {
        id: 'technical_issue',
        title: 'Technical Issue',
        content: 'I understand you\'re experiencing a technical issue. Our team has been notified and will investigate this matter. We\'ll get back to you as soon as possible.'
      },
      {
        id: 'general_support',
        title: 'General Support',
        content: 'Thank you for contacting support. I\'m here to help you with any questions or concerns you may have about our platform.'
      }
    ];

    res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router; 