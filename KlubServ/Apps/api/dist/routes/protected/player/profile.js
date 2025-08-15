"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const mockPlayerData = {
    id: 'player_123',
    firstName: 'Max',
    lastName: 'Müller',
    email: 'max.mueller@example.com',
    phone: '+49 123 456789',
    birthDate: '2010-05-15',
    profileImage: '/api/players/123/avatar',
    team: {
        id: 'team_456',
        name: 'U14 Boys',
        ageGroup: 'U14',
        sport: 'football',
        season: '2024/25'
    },
    coach: {
        id: 'coach_789',
        name: 'Thomas Weber',
        email: 'thomas.weber@club.com',
        phone: '+49 987 654321'
    },
    emergencyContact: {
        name: 'Anna Müller',
        relationship: 'Mother',
        phone: '+49 111 222333',
        email: 'anna.mueller@example.com'
    },
    membership: {
        status: 'active',
        startDate: '2023-09-01',
        endDate: '2024-08-31',
        membershipType: 'full'
    },
    address: {
        street: 'Musterstraße 123',
        city: 'München',
        postalCode: '80331',
        country: 'Germany'
    }
};
router.get('/', (req, res) => {
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
            data: mockPlayerData
        });
    }
    catch (error) {
        console.error('Error fetching player profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.put('/', (req, res) => {
    try {
        const updateSchema = zod_1.z.object({
            phone: zod_1.z.string().optional(),
            emergencyContact: zod_1.z.object({
                name: zod_1.z.string(),
                relationship: zod_1.z.string(),
                phone: zod_1.z.string(),
                email: zod_1.z.string().email()
            }).optional(),
            address: zod_1.z.object({
                street: zod_1.z.string(),
                city: zod_1.z.string(),
                postalCode: zod_1.z.string(),
                country: zod_1.z.string()
            }).optional()
        });
        const validatedData = updateSchema.parse(req.body);
        const playerId = req.user?.id;
        if (!playerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const updatedProfile = { ...mockPlayerData, ...validatedData };
        res.json({
            success: true,
            data: updatedProfile,
            message: 'Profile updated successfully'
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Error updating player profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=profile.js.map