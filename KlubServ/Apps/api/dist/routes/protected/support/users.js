"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const getUserQuerySchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    role: zod_1.z.enum(['member', 'trainer', 'admin']).optional(),
    status: zod_1.z.enum(['active', 'inactive', 'pending']).optional(),
    page: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1)).optional(),
    limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1).max(100)).optional(),
});
const getUserByIdSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
});
router.get('/', async (req, res) => {
    try {
        const query = getUserQuerySchema.parse(req.query);
        const mockUsers = [
            {
                id: '1',
                name: 'Anna Müller',
                email: 'anna.mueller@example.com',
                role: 'member',
                team: 'U16 Girls',
                status: 'active',
                lastLogin: '2024-01-15T10:30:00Z',
                avatar: '/Anna Müller.jpg'
            },
            {
                id: '2',
                name: 'Thomas Weber',
                email: 'thomas.weber@example.com',
                role: 'trainer',
                team: 'U16 Girls',
                status: 'active',
                lastLogin: '2024-01-15T09:15:00Z'
            },
            {
                id: '3',
                name: 'Maria Schmidt',
                email: 'maria.schmidt@example.com',
                role: 'member',
                team: 'U14 Boys',
                status: 'inactive',
                lastLogin: '2024-01-10T14:20:00Z'
            },
            {
                id: '4',
                name: 'Hans Bauer',
                email: 'hans.bauer@example.com',
                role: 'member',
                team: 'Senior Team',
                status: 'pending',
                lastLogin: '2024-01-12T16:45:00Z'
            },
            {
                id: '5',
                name: 'Lisa Wagner',
                email: 'lisa.wagner@example.com',
                role: 'trainer',
                team: 'U14 Boys',
                status: 'active',
                lastLogin: '2024-01-15T08:00:00Z'
            }
        ];
        let filteredUsers = mockUsers;
        if (query.search) {
            const searchTerm = query.search.toLowerCase();
            filteredUsers = filteredUsers.filter(user => user.name.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm) ||
                user.team?.toLowerCase().includes(searchTerm));
        }
        if (query.role) {
            filteredUsers = filteredUsers.filter(user => user.role === query.role);
        }
        if (query.status) {
            filteredUsers = filteredUsers.filter(user => user.status === query.status);
        }
        const page = query.page || 1;
        const limit = query.limit || 20;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
        res.json({
            success: true,
            data: {
                users: paginatedUsers,
                pagination: {
                    page,
                    limit,
                    total: filteredUsers.length,
                    totalPages: Math.ceil(filteredUsers.length / limit),
                    hasNext: endIndex < filteredUsers.length,
                    hasPrev: page > 1,
                }
            }
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: 'Invalid query parameters',
                details: error.errors,
            });
        }
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = getUserByIdSchema.parse(req.params);
        const mockUser = {
            id: '1',
            name: 'Anna Müller',
            email: 'anna.mueller@example.com',
            phone: '+49 123 456 789',
            role: 'member',
            team: 'U16 Girls',
            status: 'active',
            joinDate: '2023-01-15',
            lastLogin: '2024-01-15T10:30:00Z',
            avatar: '/Anna Müller.jpg',
            address: 'München, Germany',
            birthDate: '1990-05-15',
            emergencyContact: {
                name: 'Emergency Contact',
                phone: '+49 987 654 321',
                relationship: 'Parent'
            },
            membershipDetails: {
                type: 'Premium',
                startDate: '2023-01-15',
                endDate: '2024-01-15',
                autoRenew: true
            },
            permissions: ['view_profile', 'edit_profile', 'make_bookings']
        };
        if (mockUser.id !== id) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }
        res.json({
            success: true,
            data: mockUser,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID',
                details: error.errors,
            });
        }
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
router.get('/:id/activity', async (req, res) => {
    try {
        const { id } = getUserByIdSchema.parse(req.params);
        const mockActivity = [
            {
                id: '1',
                type: 'login',
                description: 'User logged in',
                timestamp: '2024-01-15T10:30:00Z',
                details: { ip: '192.168.1.1', userAgent: 'Mozilla/5.0...' }
            },
            {
                id: '2',
                type: 'booking',
                description: 'Booked training session',
                timestamp: '2024-01-14T15:20:00Z',
                details: { sessionId: 'session-123', trainer: 'Thomas Weber' }
            },
            {
                id: '3',
                type: 'payment',
                description: 'Made payment',
                timestamp: '2024-01-13T09:15:00Z',
                details: { amount: 89.99, currency: 'EUR', method: 'card' }
            }
        ];
        res.json({
            success: true,
            data: {
                userId: id,
                activity: mockActivity,
            }
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID',
                details: error.errors,
            });
        }
        console.error('Error fetching user activity:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map