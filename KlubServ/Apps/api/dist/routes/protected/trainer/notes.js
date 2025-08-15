"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const createNoteSchema = zod_1.z.object({
    playerId: zod_1.z.string().min(1, 'Player ID is required'),
    title: zod_1.z.string().min(1, 'Title is required'),
    content: zod_1.z.string().min(1, 'Content is required'),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    isPrivate: zod_1.z.boolean().default(false),
});
const updateNoteSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').optional(),
    content: zod_1.z.string().min(1, 'Content is required').optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    isPrivate: zod_1.z.boolean().optional(),
});
router.get('/', async (req, res) => {
    try {
        const trainerId = req.user?.trainerId;
        const { playerId, search, tags } = req.query;
        if (!trainerId) {
            return res.status(400).json({ error: 'Trainer ID not found' });
        }
        const whereClause = { trainerId };
        if (playerId) {
            whereClause.playerId = playerId;
        }
        if (search) {
            whereClause.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (tags && Array.isArray(tags)) {
            whereClause.tags = { hasSome: tags };
        }
        const notes = await prisma.note.findMany({
            where: whereClause,
            include: {
                player: {
                    include: {
                        member: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(notes);
    }
    catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const trainerId = req.user?.trainerId;
        const noteId = req.params.id;
        if (!trainerId) {
            return res.status(400).json({ error: 'Trainer ID not found' });
        }
        const note = await prisma.note.findFirst({
            where: {
                id: noteId,
                trainerId,
            },
            include: {
                player: {
                    include: {
                        member: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(note);
    }
    catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({ error: 'Failed to fetch note' });
    }
});
router.post('/', async (req, res) => {
    try {
        const trainerId = req.user?.trainerId;
        if (!trainerId) {
            return res.status(400).json({ error: 'Trainer ID not found' });
        }
        const validatedData = createNoteSchema.parse(req.body);
        const player = await prisma.player.findFirst({
            where: {
                id: validatedData.playerId,
                member: {
                    club: {
                        trainers: {
                            some: {
                                id: trainerId,
                            },
                        },
                    },
                },
            },
        });
        if (!player) {
            return res.status(400).json({ error: 'Player not found or not accessible' });
        }
        const note = await prisma.note.create({
            data: {
                ...validatedData,
                trainerId,
            },
            include: {
                player: {
                    include: {
                        member: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        res.status(201).json(note);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'Failed to create note' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const trainerId = req.user?.trainerId;
        const noteId = req.params.id;
        if (!trainerId) {
            return res.status(400).json({ error: 'Trainer ID not found' });
        }
        const validatedData = updateNoteSchema.parse(req.body);
        const note = await prisma.note.update({
            where: {
                id: noteId,
                trainerId,
            },
            data: validatedData,
            include: {
                player: {
                    include: {
                        member: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        res.json(note);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Failed to update note' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const trainerId = req.user?.trainerId;
        const noteId = req.params.id;
        if (!trainerId) {
            return res.status(400).json({ error: 'Trainer ID not found' });
        }
        await prisma.note.delete({
            where: {
                id: noteId,
                trainerId,
            },
        });
        res.json({ message: 'Note deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Failed to delete note' });
    }
});
router.get('/player/:playerId', async (req, res) => {
    try {
        const trainerId = req.user?.trainerId;
        const playerId = req.params.playerId;
        if (!trainerId) {
            return res.status(400).json({ error: 'Trainer ID not found' });
        }
        const player = await prisma.player.findFirst({
            where: {
                id: playerId,
                member: {
                    club: {
                        trainers: {
                            some: {
                                id: trainerId,
                            },
                        },
                    },
                },
            },
        });
        if (!player) {
            return res.status(400).json({ error: 'Player not found or not accessible' });
        }
        const notes = await prisma.note.findMany({
            where: {
                playerId,
                trainerId,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(notes);
    }
    catch (error) {
        console.error('Error fetching player notes:', error);
        res.status(500).json({ error: 'Failed to fetch player notes' });
    }
});
router.get('/stats/overview', async (req, res) => {
    try {
        const trainerId = req.user?.trainerId;
        if (!trainerId) {
            return res.status(400).json({ error: 'Trainer ID not found' });
        }
        const totalNotes = await prisma.note.count({
            where: { trainerId },
        });
        const notesThisMonth = await prisma.note.count({
            where: {
                trainerId,
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
        });
        const privateNotes = await prisma.note.count({
            where: {
                trainerId,
                isPrivate: true,
            },
        });
        const uniquePlayers = await prisma.note.groupBy({
            by: ['playerId'],
            where: { trainerId },
            _count: {
                playerId: true,
            },
        });
        res.json({
            totalNotes,
            notesThisMonth,
            privateNotes,
            uniquePlayers: uniquePlayers.length,
        });
    }
    catch (error) {
        console.error('Error fetching note statistics:', error);
        res.status(500).json({ error: 'Failed to fetch note statistics' });
    }
});
exports.default = router;
//# sourceMappingURL=notes.js.map