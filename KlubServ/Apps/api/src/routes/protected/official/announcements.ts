import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// Mock data for internal announcements
const mockAnnouncements = [
  {
    id: '1',
    title: 'Updated Hygiene Policy',
    content: 'New hygiene guidelines for all club facilities effective immediately. All staff and members must follow the updated protocols.',
    type: 'info',
    audience: 'official',
    createdAt: '2024-01-15T10:00:00Z',
    author: 'Club Administration'
  },
  {
    id: '2',
    title: 'Board Meeting Results',
    content: 'Summary of decisions from the latest board meeting held on January 10th. Key decisions include budget approval and facility upgrades.',
    type: 'info',
    audience: 'official',
    createdAt: '2024-01-12T14:30:00Z',
    author: 'Board Secretary'
  },
  {
    id: '3',
    title: 'Club Assembly Announcement',
    content: 'Annual club assembly scheduled for February 15th at 7:00 PM. All officials are required to attend.',
    type: 'warning',
    audience: 'official',
    createdAt: '2024-01-10T09:15:00Z',
    author: 'Club President'
  },
  {
    id: '4',
    title: 'Financial Report Available',
    content: 'Q4 2023 financial report is now available for review. Please contact the treasurer for detailed information.',
    type: 'info',
    audience: 'official',
    createdAt: '2024-01-08T16:45:00Z',
    author: 'Treasurer'
  },
  {
    id: '5',
    title: 'Safety Protocol Updates',
    content: 'Updated safety protocols for emergency situations. All officials must review and ensure compliance.',
    type: 'warning',
    audience: 'official',
    createdAt: '2024-01-05T11:20:00Z',
    author: 'Safety Officer'
  }
];

// Validation schema for query parameters
const getAnnouncementsSchema = z.object({
  audience: z.enum(['official', 'all']).optional().default('official'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(50)).optional().default(10),
  offset: z.string().transform(Number).pipe(z.number().min(0)).optional().default(0),
  type: z.enum(['info', 'warning', 'success', 'error']).optional()
});

/**
 * GET /api/official/announcements
 * Get internal club announcements for officials
 */
router.get('/', async (req, res) => {
  try {
    // Validate query parameters
    const validatedQuery = getAnnouncementsSchema.parse(req.query);
    
    // Filter announcements based on query parameters
    const filteredAnnouncements = mockAnnouncements.filter(announcement => {
      if (validatedQuery.audience && validatedQuery.audience !== 'all') {
        if (announcement.audience !== validatedQuery.audience) {
          return false;
        }
      }
      
      if (validatedQuery.type && announcement.type !== validatedQuery.type) {
        return false;
      }
      
      return true;
    });

    // Apply pagination
    const total = filteredAnnouncements.length;
    const announcements = filteredAnnouncements
      .slice(validatedQuery.offset, validatedQuery.offset + validatedQuery.limit)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      data: {
        announcements,
        pagination: {
          total,
          limit: validatedQuery.limit,
          offset: validatedQuery.offset,
          hasMore: validatedQuery.offset + validatedQuery.limit < total
        }
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.errors
      });
    }
    
    console.error('Error fetching announcements:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/official/announcements/:id
 * Get a specific announcement by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const announcement = mockAnnouncements.find(a => a.id === id);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: 'Announcement not found'
      });
    }
    
    res.json({
      success: true,
      data: announcement
    });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router; 