"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const mockEvents = [
    {
        id: '1',
        title: 'Board Meeting',
        description: 'Monthly board meeting to discuss club operations and upcoming events.',
        startTime: '2024-01-20T18:00:00Z',
        endTime: '2024-01-20T20:00:00Z',
        location: 'Club Office - Conference Room',
        type: 'meeting',
        visibility: 'internal',
        attendees: ['Dr. Hans Müller', 'Maria Schmidt', 'Thomas Weber'],
        organizer: 'Club President',
        status: 'confirmed'
    },
    {
        id: '2',
        title: 'Community Event Planning',
        description: 'Planning session for the upcoming community sports day.',
        startTime: '2024-01-25T16:00:00Z',
        endTime: '2024-01-25T18:00:00Z',
        location: 'Main Hall',
        type: 'planning',
        visibility: 'internal',
        attendees: ['Anna Fischer', 'Event Committee'],
        organizer: 'Event Coordinator',
        status: 'confirmed'
    },
    {
        id: '3',
        title: 'Annual Club Assembly',
        description: 'Annual general assembly for all club members and officials.',
        startTime: '2024-02-15T19:00:00Z',
        endTime: '2024-02-15T22:00:00Z',
        location: 'Sports Hall',
        type: 'assembly',
        visibility: 'internal',
        attendees: ['All Officials', 'Board Members'],
        organizer: 'Club Secretary',
        status: 'confirmed'
    },
    {
        id: '4',
        title: 'Financial Review Meeting',
        description: 'Quarterly financial review and budget planning session.',
        startTime: '2024-01-30T14:00:00Z',
        endTime: '2024-01-30T16:00:00Z',
        location: 'Club Office - Meeting Room',
        type: 'meeting',
        visibility: 'internal',
        attendees: ['Thomas Weber', 'Dr. Hans Müller'],
        organizer: 'Treasurer',
        status: 'confirmed'
    },
    {
        id: '5',
        title: 'Safety Committee Meeting',
        description: 'Monthly safety committee meeting to review protocols and incidents.',
        startTime: '2024-02-05T15:00:00Z',
        endTime: '2024-02-05T17:00:00Z',
        location: 'Club Office - Conference Room',
        type: 'meeting',
        visibility: 'internal',
        attendees: ['Safety Officer', 'Head Trainer', 'Club President'],
        organizer: 'Safety Officer',
        status: 'confirmed'
    }
];
const getEventsSchema = zod_1.z.object({
    visibility: zod_1.z.enum(['internal', 'public', 'all']).optional().default('internal'),
    type: zod_1.z.enum(['meeting', 'planning', 'assembly', 'all']).optional(),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
    limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1).max(50)).optional().default(10),
    offset: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(0)).optional().default(0)
});
router.get('/', async (req, res) => {
    try {
        const validatedQuery = getEventsSchema.parse(req.query);
        let filteredEvents = mockEvents.filter(event => {
            if (validatedQuery.visibility && validatedQuery.visibility !== 'all') {
                if (event.visibility !== validatedQuery.visibility) {
                    return false;
                }
            }
            if (validatedQuery.type && validatedQuery.type !== 'all') {
                if (event.type !== validatedQuery.type) {
                    return false;
                }
            }
            if (validatedQuery.startDate) {
                const eventStart = new Date(event.startTime);
                const filterStart = new Date(validatedQuery.startDate);
                if (eventStart < filterStart) {
                    return false;
                }
            }
            if (validatedQuery.endDate) {
                const eventEnd = new Date(event.endTime);
                const filterEnd = new Date(validatedQuery.endDate);
                if (eventEnd > filterEnd) {
                    return false;
                }
            }
            return true;
        });
        const total = filteredEvents.length;
        const events = filteredEvents
            .slice(validatedQuery.offset, validatedQuery.offset + validatedQuery.limit)
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
        res.json({
            success: true,
            data: {
                events,
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
        console.error('Error fetching events:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const event = mockEvents.find(e => e.id === id);
        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }
        res.json({
            success: true,
            data: event
        });
    }
    catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=events.js.map