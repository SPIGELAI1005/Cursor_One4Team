import { Router } from 'express';
import { authenticateUser, requireRole } from '@/middleware/authMiddleware';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const router = Router();

// Apply authentication to all document routes
router.use(authenticateUser);
router.use(requireRole(['admin', 'trainer', 'member']));

// Validation schemas
const createDocumentSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Get member's documents
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { category, search, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const member = await prisma.member.findFirst({
      where: { userId },
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const whereClause: any = {
      OR: [
        { memberId: member.id }, // Personal documents
        { 
          clubId: member.clubId,
          isPublic: true,
        }, // Public club documents
      ],
    };

    if (category) {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { tags: { hasSome: [search as string] } },
      ];
    }

    const documents = await prisma.document.findMany({
      where: whereClause,
      include: {
        member: {
          select: {
            id: true,
            name: true,
          },
        },
        club: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: Number(limit),
    });

    const total = await prisma.document.count({
      where: whereClause,
    });

    res.json({
      documents,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Get a specific document
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user?.id;
    const documentId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const member = await prisma.member.findFirst({
      where: { userId },
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        OR: [
          { memberId: member.id },
          { 
            clubId: member.clubId,
            isPublic: true,
          },
        ],
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
          },
        },
        club: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// Create a new document
router.post('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const validation = createDocumentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid input', details: validation.error });
    }

    const { title, description, category, tags } = validation.data;

    const member = await prisma.member.findFirst({
      where: { userId },
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const document = await prisma.document.create({
      data: {
        title,
        description,
        category,
        tags: tags || [],
        memberId: member.id,
        clubId: member.clubId,
        isPublic: false, // Default to private
        createdAt: new Date(),
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
          },
        },
        club: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json(document);
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'Failed to create document' });
  }
});

// Update a document
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user?.id;
    const documentId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const validation = createDocumentSchema.partial().safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid input', details: validation.error });
    }

    const member = await prisma.member.findFirst({
      where: { userId },
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        memberId: member.id, // Only owner can update
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const updatedDocument = await prisma.document.update({
      where: { id: documentId },
      data: {
        ...validation.data,
        updatedAt: new Date(),
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
          },
        },
        club: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(updatedDocument);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
});

// Delete a document
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user?.id;
    const documentId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const member = await prisma.member.findFirst({
      where: { userId },
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        memberId: member.id, // Only owner can delete
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    await prisma.document.delete({
      where: { id: documentId },
    });

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// Get document categories
router.get('/categories', async (req, res) => {
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

    const categories = await prisma.document.groupBy({
      by: ['category'],
      where: {
        OR: [
          { memberId: member.id },
          { 
            clubId: member.clubId,
            isPublic: true,
          },
        ],
        category: {
          not: null,
        },
      },
      _count: {
        category: true,
      },
    });

    res.json(categories.map(cat => ({
      category: cat.category,
      count: cat._count.category,
    })));
  } catch (error) {
    console.error('Error fetching document categories:', error);
    res.status(500).json({ error: 'Failed to fetch document categories' });
  }
});

// Get document statistics
router.get('/stats', async (req, res) => {
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

    const [totalDocuments, personalDocuments, clubDocuments, recentDocuments] = await Promise.all([
      prisma.document.count({
        where: {
          OR: [
            { memberId: member.id },
            { 
              clubId: member.clubId,
              isPublic: true,
            },
          ],
        },
      }),
      prisma.document.count({
        where: {
          memberId: member.id,
        },
      }),
      prisma.document.count({
        where: {
          clubId: member.clubId,
          isPublic: true,
        },
      }),
      prisma.document.count({
        where: {
          OR: [
            { memberId: member.id },
            { 
              clubId: member.clubId,
              isPublic: true,
            },
          ],
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ]);

    res.json({
      totalDocuments,
      personalDocuments,
      clubDocuments,
      recentDocuments,
    });
  } catch (error) {
    console.error('Error fetching document statistics:', error);
    res.status(500).json({ error: 'Failed to fetch document statistics' });
  }
});

export default router; 