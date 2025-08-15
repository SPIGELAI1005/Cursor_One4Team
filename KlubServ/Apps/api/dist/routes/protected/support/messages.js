"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const getMessagesQuerySchema = zod_1.z.object({
    status: zod_1.z.enum(['open', 'closed']).optional(),
    search: zod_1.z.string().optional(),
    page: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1)).optional(),
    limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1).max(100)).optional(),
});
const sendReplySchema = zod_1.z.object({
    conversationId: zod_1.z.string().min(1),
    message: zod_1.z.string().min(1).max(1000),
    templateId: zod_1.z.string().optional(),
});
const getConversationSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
});
router.get('/', async (req, res) => {
    try {
        const query = getMessagesQuerySchema.parse(req.query);
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
                        userEmail: 'support@klubserv.com',
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
                        userEmail: 'support@klubserv.com',
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
        let filteredConversations = mockConversations;
        if (query.status) {
            filteredConversations = filteredConversations.filter(conv => conv.status === query.status);
        }
        if (query.search) {
            const searchTerm = query.search.toLowerCase();
            filteredConversations = filteredConversations.filter(conv => conv.userName.toLowerCase().includes(searchTerm) ||
                conv.userEmail.toLowerCase().includes(searchTerm) ||
                conv.lastMessage.toLowerCase().includes(searchTerm));
        }
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
router.get('/:id', async (req, res) => {
    try {
        const { id } = getConversationSchema.parse(req.params);
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
                    userEmail: 'support@klubserv.com',
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
router.post('/reply', async (req, res) => {
    try {
        const { conversationId, message, templateId } = sendReplySchema.parse(req.body);
        const newMessage = {
            id: Date.now().toString(),
            userId: 'support',
            userName: 'Support Team',
            userEmail: 'support@klubserv.com',
            content: message,
            timestamp: new Date().toISOString(),
            isFromUser: false,
            templateId: templateId || null,
        };
        res.json({
            success: true,
            data: {
                message: newMessage,
                conversationId,
            },
            message: 'Reply sent successfully',
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
router.get('/templates', async (req, res) => {
    try {
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
    }
    catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=messages.js.map