import { Router } from 'express';
import { authenticateUser, requireRole } from '@/middleware/authMiddleware';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const router = Router();

// Apply authentication to all message routes
router.use(authenticateUser);
router.use(requireRole(['admin', 'trainer', 'member']));

// Validation schemas
const createMessageSchema = z.object({
  recipientId: z.string(),
  subject: z.string().min(1).max(200),
  content: z.string().min(1).max(2000),
});

const updateMessageSchema = z.object({
  isRead: z.boolean().optional(),
});

// Get all messages for the current member
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

    let whereClause: any = {
      OR: [
        { senderId: member.id },
        { recipientId: member.id },
      ],
    };

    if (type === 'sent') {
      whereClause = { senderId: member.id };
    } else if (type === 'received') {
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
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get a specific message
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

    // Mark as read if recipient is viewing
    if (message.recipientId === member.id && !message.isRead) {
      await prisma.message.update({
        where: { id: messageId },
        data: { isRead: true },
      });
      message.isRead = true;
    }

    res.json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

// Create a new message
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

    // Verify recipient exists
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
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// Update message (mark as read)
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
        recipientId: member.id, // Only recipient can update
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
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Delete a message
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
        senderId: member.id, // Only sender can delete
      },
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await prisma.message.delete({
      where: { id: messageId },
    });

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router; 