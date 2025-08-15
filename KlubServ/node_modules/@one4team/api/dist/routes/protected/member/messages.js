"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.use(authMiddleware_1.authenticateUser);
router.use((0, authMiddleware_1.requireRole)(['admin', 'trainer', 'member']));
const createMessageSchema = zod_1.z.object({
    recipientId: zod_1.z.string(),
    subject: zod_1.z.string().min(1).max(200),
    content: zod_1.z.string().min(1).max(2000),
});
const updateMessageSchema = zod_1.z.object({
    isRead: zod_1.z.boolean().optional(),
});
router.get('/', async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const member = await prisma.member.findFirst({
            where: { userId },
        });
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }
        const { page = 1, limit = 20, type = 'all' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        let whereClause = {
            OR: [
                { senderId: member.id },
                { recipientId: member.id },
            ],
        };
        if (type === 'sent') {
            whereClause = { senderId: member.id };
        }
        else if (type === 'received') {
            whereClause = { recipientId: member.id };
        }
        const messages = await prisma.message.findMany({
            where: whereClause,
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                recipient: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take: Number(limit),
        });
        const total = await prisma.message.count({
            where: whereClause,
        });
        res.json({
            messages,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const userId = req.user?.id;
        const messageId = req.params.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const member = await prisma.member.findFirst({
            where: { userId },
        });
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }
        const message = await prisma.message.findFirst({
            where: {
                id: messageId,
                OR: [
                    { senderId: member.id },
                    { recipientId: member.id },
                ],
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                recipient: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        if (message.recipientId === member.id && !message.isRead) {
            await prisma.message.update({
                where: { id: messageId },
                data: { isRead: true },
            });
            message.isRead = true;
        }
        res.json(message);
    }
    catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({ error: 'Failed to fetch message' });
    }
});
router.post('/', async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const validation = createMessageSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'Invalid input', details: validation.error });
        }
        const { recipientId, subject, content } = validation.data;
        const member = await prisma.member.findFirst({
            where: { userId },
        });
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }
        const recipient = await prisma.member.findUnique({
            where: { id: recipientId },
        });
        if (!recipient) {
            return res.status(404).json({ error: 'Recipient not found' });
        }
        const message = await prisma.message.create({
            data: {
                senderId: member.id,
                recipientId,
                subject,
                content,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                recipient: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        res.status(201).json(message);
    }
    catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Failed to create message' });
    }
});
router.patch('/:id', async (req, res) => {
    try {
        const userId = req.user?.id;
        const messageId = req.params.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const validation = updateMessageSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'Invalid input', details: validation.error });
        }
        const member = await prisma.member.findFirst({
            where: { userId },
        });
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }
        const message = await prisma.message.findFirst({
            where: {
                id: messageId,
                recipientId: member.id,
            },
        });
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        const updatedMessage = await prisma.message.update({
            where: { id: messageId },
            data: validation.data,
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                recipient: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        res.json(updatedMessage);
    }
    catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ error: 'Failed to update message' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user?.id;
        const messageId = req.params.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const member = await prisma.member.findFirst({
            where: { userId },
        });
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }
        const message = await prisma.message.findFirst({
            where: {
                id: messageId,
                senderId: member.id,
            },
        });
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        await prisma.message.delete({
            where: { id: messageId },
        });
        res.json({ message: 'Message deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Failed to delete message' });
    }
});
exports.default = router;
//# sourceMappingURL=messages.js.map