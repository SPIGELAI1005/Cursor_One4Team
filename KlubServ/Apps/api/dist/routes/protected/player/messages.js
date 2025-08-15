"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const mockMessages = [
    {
        id: 'msg_1',
        senderId: 'coach_789',
        senderName: 'Thomas Weber',
        senderType: 'coach',
        recipientId: 'player_123',
        recipientName: 'Max Müller',
        subject: 'Training Schedule Update',
        content: 'Hi Max, we have a change in tomorrow\'s training schedule. Please arrive 30 minutes earlier for warm-up.',
        timestamp: '2024-01-14T10:30:00Z',
        isRead: true,
        priority: 'normal',
        category: 'schedule'
    },
    {
        id: 'msg_2',
        senderId: 'player_123',
        senderName: 'Max Müller',
        senderType: 'player',
        recipientId: 'coach_789',
        recipientName: 'Thomas Weber',
        subject: 'Question about training',
        content: 'Coach, I have a question about the new passing drill we practiced today. Can you explain it again?',
        timestamp: '2024-01-13T16:45:00Z',
        isRead: true,
        priority: 'normal',
        category: 'training'
    },
    {
        id: 'msg_3',
        senderId: 'coach_789',
        senderName: 'Thomas Weber',
        senderType: 'coach',
        recipientId: 'player_123',
        recipientName: 'Max Müller',
        subject: 'Great performance today!',
        content: 'Excellent work in today\'s session, Max! Your ball control has improved significantly. Keep it up!',
        timestamp: '2024-01-12T18:20:00Z',
        isRead: false,
        priority: 'high',
        category: 'feedback'
    },
    {
        id: 'msg_4',
        senderId: 'team_system',
        senderName: 'Team System',
        senderType: 'system',
        recipientId: 'player_123',
        recipientName: 'Max Müller',
        subject: 'Match Reminder',
        content: 'Reminder: You have a match this Saturday at 14:00 against FC Bayern Youth. Please arrive by 13:00.',
        timestamp: '2024-01-11T09:00:00Z',
        isRead: true,
        priority: 'high',
        category: 'match'
    }
];
const mockConversations = [
    {
        id: 'conv_1',
        participants: [
            { id: 'coach_789', name: 'Thomas Weber', type: 'coach' },
            { id: 'player_123', name: 'Max Müller', type: 'player' }
        ],
        lastMessage: {
            id: 'msg_1',
            content: 'Hi Max, we have a change in tomorrow\'s training schedule...',
            timestamp: '2024-01-14T10:30:00Z',
            sender: 'Thomas Weber'
        },
        unreadCount: 0,
        isActive: true
    },
    {
        id: 'conv_2',
        participants: [
            { id: 'team_system', name: 'Team System', type: 'system' },
            { id: 'player_123', name: 'Max Müller', type: 'player' }
        ],
        lastMessage: {
            id: 'msg_4',
            content: 'Reminder: You have a match this Saturday at 14:00...',
            timestamp: '2024-01-11T09:00:00Z',
            sender: 'Team System'
        },
        unreadCount: 0,
        isActive: false
    }
];
router.get('/', (req, res) => {
    try {
        const playerId = req.user?.id;
        if (!playerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (playerId !== 'player_123') {
            return res.status(403).json({ error: 'Access denied' });
        }
        const sortedMessages = mockMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        res.json({
            success: true,
            data: sortedMessages
        });
    }
    catch (error) {
        console.error('Error fetching player messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/conversations', (req, res) => {
    try {
        const playerId = req.user?.id;
        if (!playerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (playerId !== 'player_123') {
            return res.status(403).json({ error: 'Access denied' });
        }
        res.json({
            success: true,
            data: mockConversations
        });
    }
    catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const playerId = req.user?.id;
        if (!playerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (playerId !== 'player_123') {
            return res.status(403).json({ error: 'Access denied' });
        }
        const message = mockMessages.find(m => m.id === id);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.json({
            success: true,
            data: message
        });
    }
    catch (error) {
        console.error('Error fetching message details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/', (req, res) => {
    try {
        const messageSchema = zod_1.z.object({
            recipientId: zod_1.z.string(),
            subject: zod_1.z.string().min(1).max(100),
            content: zod_1.z.string().min(1).max(1000),
            priority: zod_1.z.enum(['low', 'normal', 'high']).optional().default('normal'),
            category: zod_1.z.enum(['training', 'schedule', 'feedback', 'match', 'general']).optional().default('general')
        });
        const validatedData = messageSchema.parse(req.body);
        const playerId = req.user?.id;
        if (!playerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (playerId !== 'player_123') {
            return res.status(403).json({ error: 'Access denied' });
        }
        const newMessage = {
            id: `msg_${Date.now()}`,
            senderId: playerId,
            senderName: 'Max Müller',
            senderType: 'player',
            recipientId: validatedData.recipientId,
            recipientName: 'Thomas Weber',
            subject: validatedData.subject,
            content: validatedData.content,
            timestamp: new Date().toISOString(),
            isRead: false,
            priority: validatedData.priority,
            category: validatedData.category
        };
        res.json({
            success: true,
            data: newMessage,
            message: 'Message sent successfully'
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.put('/:id/read', (req, res) => {
    try {
        const { id } = req.params;
        const playerId = req.user?.id;
        if (!playerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (playerId !== 'player_123') {
            return res.status(403).json({ error: 'Access denied' });
        }
        const message = mockMessages.find(m => m.id === id);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        message.isRead = true;
        res.json({
            success: true,
            data: message,
            message: 'Message marked as read'
        });
    }
    catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=messages.js.map