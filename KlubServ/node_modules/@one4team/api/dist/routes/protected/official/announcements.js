"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
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
const getAnnouncementsSchema = zod_1.z.object({
    audience: zod_1.z.enum(['official', 'all']).optional().default('official'),
    limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1).max(50)).optional().default(10),
    offset: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(0)).optional().default(0),
    type: zod_1.z.enum(['info', 'warning', 'success', 'error']).optional()
});
router.get('/', async (req, res) => {
    try {
        const validatedQuery = getAnnouncementsSchema.parse(req.query);
        let filteredAnnouncements = mockAnnouncements.filter(announcement => {
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
    }
    catch (error) {
        console.error('Error fetching announcement:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=announcements.js.map