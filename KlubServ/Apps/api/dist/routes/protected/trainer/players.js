"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const createPlayerSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    birthDate: zod_1.z.string().datetime().optional(),
    position: zod_1.z.string().optional(),
    jerseyNumber: zod_1.z.number().positive().optional(),
});
const updatePlayerSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).optional(),
    lastName: zod_1.z.string().min(1).optional(),
    position: zod_1.z.string().optional(),
    jerseyNumber: zod_1.z.number().positive().optional(),
    status: zod_1.z.enum(['active', 'injured', 'suspended']).optional(),
});
router.get('/', async (req, res) => {
    try {
        res.json({
            message: 'Players retrieved successfully',
            players: [
                {
                    id: '1',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    position: 'Forward',
                    jerseyNumber: 10,
                    status: 'active',
                    createdAt: new Date().toISOString(),
                },
            ],
            total: 1,
        });
    }
    catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({
            error: 'Failed to fetch players',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.get('/:playerId', async (req, res) => {
    try {
        const { playerId } = req.params;
        res.json({
            message: 'Player details retrieved successfully',
            player: {
                id: playerId,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                position: 'Forward',
                jerseyNumber: 10,
                status: 'active',
                stats: {
                    goals: 15,
                    assists: 8,
                    matches: 25,
                },
                createdAt: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        console.error('Error fetching player:', error);
        res.status(500).json({
            error: 'Failed to fetch player',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.post('/', async (req, res) => {
    try {
        const validatedData = createPlayerSchema.parse(req.body);
        res.status(201).json({
            message: 'Player created successfully',
            player: {
                id: 'new-player-id',
                ...validatedData,
                status: 'active',
                createdAt: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                error: 'Validation error',
                details: error.errors,
            });
            return;
        }
        console.error('Error creating player:', error);
        res.status(500).json({
            error: 'Failed to create player',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.put('/:playerId', async (req, res) => {
    try {
        const { playerId } = req.params;
        const validatedData = updatePlayerSchema.parse(req.body);
        res.json({
            message: 'Player updated successfully',
            playerId,
            updates: validatedData,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                error: 'Validation error',
                details: error.errors,
            });
            return;
        }
        console.error('Error updating player:', error);
        res.status(500).json({
            error: 'Failed to update player',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.get('/:playerId/stats', async (req, res) => {
    try {
        const { playerId } = req.params;
        res.json({
            message: 'Player statistics retrieved successfully',
            playerId,
            stats: {
                goals: 15,
                assists: 8,
                matches: 25,
                yellowCards: 2,
                redCards: 0,
                minutesPlayed: 2250,
            },
        });
    }
    catch (error) {
        console.error('Error fetching player stats:', error);
        res.status(500).json({
            error: 'Failed to fetch player statistics',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=players.js.map