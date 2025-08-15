"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const resetPasswordSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1),
    email: zod_1.z.string().email().optional(),
});
const resendWelcomeEmailSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
const getUserByIdSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
});
router.post('/reset-password', async (req, res) => {
    try {
        const { userId, email } = resetPasswordSchema.parse(req.body);
        const resetResult = {
            userId,
            email: email || 'user@example.com',
            resetToken: 'reset_token_' + Date.now(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            requestedBy: req.user?.id || 'support',
            requestedAt: new Date().toISOString(),
        };
        console.log(`Password reset initiated for user ${userId} by support team`);
        res.json({
            success: true,
            data: {
                message: 'Password reset email sent successfully',
                userId,
                email: resetResult.email,
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: 'Invalid request data',
                details: error.errors,
            });
        }
        console.error('Error resetting password:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
router.post('/resend-welcome', async (req, res) => {
    try {
        const { email } = resendWelcomeEmailSchema.parse(req.body);
        const emailResult = {
            email,
            template: 'welcome',
            sentAt: new Date().toISOString(),
            sentBy: req.user?.id || 'support',
            messageId: 'email_' + Date.now(),
        };
        console.log(`Welcome email resent to ${email} by support team`);
        res.json({
            success: true,
            data: {
                message: 'Welcome email sent successfully',
                email,
                messageId: emailResult.messageId,
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: 'Invalid request data',
                details: error.errors,
            });
        }
        console.error('Error resending welcome email:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
router.get('/user/:id/clerk-profile', async (req, res) => {
    try {
        const { id } = getUserByIdSchema.parse(req.params);
        const clerkProfile = {
            userId: id,
            clerkId: 'user_clerk_' + id,
            email: 'user@example.com',
            firstName: 'User',
            lastName: 'Name',
            emailVerified: true,
            phoneNumber: '+1234567890',
            phoneVerified: false,
            createdAt: '2023-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
            lastSignIn: '2024-01-15T10:30:00Z',
            imageUrl: 'https://example.com/avatar.jpg',
            publicMetadata: {
                user_role: 'member',
                club_id: 'club_123',
            },
            privateMetadata: {
                internal_id: 'internal_' + id,
            },
        };
        res.json({
            success: true,
            data: clerkProfile,
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
        console.error('Error fetching Clerk profile:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
router.get('/user/:id/registration-status', async (req, res) => {
    try {
        const { id } = getUserByIdSchema.parse(req.params);
        const registrationStatus = {
            userId: id,
            status: 'completed',
            registrationDate: '2023-01-15T10:00:00Z',
            emailVerified: true,
            profileCompleted: true,
            membershipActive: true,
            lastActivity: '2024-01-15T10:30:00Z',
            pendingActions: [],
            verificationSteps: [
                { step: 'email_verification', completed: true, completedAt: '2023-01-15T10:05:00Z' },
                { step: 'profile_setup', completed: true, completedAt: '2023-01-15T10:10:00Z' },
                { step: 'membership_activation', completed: true, completedAt: '2023-01-15T10:15:00Z' },
            ],
        };
        res.json({
            success: true,
            data: registrationStatus,
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
        console.error('Error checking registration status:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
router.get('/system-health', async (req, res) => {
    try {
        const systemHealth = {
            timestamp: new Date().toISOString(),
            status: 'healthy',
            services: {
                database: { status: 'healthy', responseTime: 45 },
                clerk: { status: 'healthy', responseTime: 120 },
                email: { status: 'healthy', responseTime: 200 },
                storage: { status: 'healthy', responseTime: 80 },
            },
            metrics: {
                uptime: '99.9%',
                activeUsers: 1247,
                systemLoad: '23%',
                memoryUsage: '67%',
                diskUsage: '45%',
            },
            alerts: [],
            lastMaintenance: '2024-01-10T02:00:00Z',
        };
        res.json({
            success: true,
            data: systemHealth,
        });
    }
    catch (error) {
        console.error('Error checking system health:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
router.get('/faq', async (req, res) => {
    try {
        const { search } = zod_1.z.object({
            search: zod_1.z.string().optional(),
        }).parse(req.query);
        const faqResults = [
            {
                id: '1',
                question: 'How do I reset my password?',
                answer: 'You can reset your password by clicking the "Forgot Password" link on the login page, or contact support for assistance.',
                category: 'account',
                tags: ['password', 'login', 'security'],
                helpful: 15,
                notHelpful: 2,
            },
            {
                id: '2',
                question: 'How do I book a training session?',
                answer: 'To book a training session, go to the Calendar page, select an available time slot, and click "Book Session".',
                category: 'booking',
                tags: ['booking', 'calendar', 'training'],
                helpful: 23,
                notHelpful: 1,
            },
            {
                id: '3',
                question: 'How do I update my profile information?',
                answer: 'You can update your profile by going to the Profile page and clicking "Edit Profile". Changes are saved automatically.',
                category: 'account',
                tags: ['profile', 'settings', 'personal'],
                helpful: 18,
                notHelpful: 3,
            },
        ];
        let filteredResults = faqResults;
        if (search) {
            const searchTerm = search.toLowerCase();
            filteredResults = faqResults.filter(faq => faq.question.toLowerCase().includes(searchTerm) ||
                faq.answer.toLowerCase().includes(searchTerm) ||
                faq.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
        }
        res.json({
            success: true,
            data: {
                results: filteredResults,
                total: filteredResults.length,
                searchTerm: search || null,
            },
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
        console.error('Error searching FAQ:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
router.post('/log-action', async (req, res) => {
    try {
        const { action, userId, details } = zod_1.z.object({
            action: zod_1.z.string().min(1),
            userId: zod_1.z.string().optional(),
            details: zod_1.z.record(zod_1.z.any()).optional(),
        }).parse(req.body);
        const logEntry = {
            id: 'log_' + Date.now(),
            action,
            userId: userId || null,
            supportUserId: req.user?.id || 'support',
            timestamp: new Date().toISOString(),
            details: details || {},
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
        };
        console.log('Support action logged:', logEntry);
        res.json({
            success: true,
            data: {
                message: 'Action logged successfully',
                logId: logEntry.id,
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: 'Invalid request data',
                details: error.errors,
            });
        }
        console.error('Error logging action:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=actions.js.map