"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../../../lib/prisma");
const validation_1 = require("../../../middleware/validation");
const router = (0, express_1.Router)();
const createPaymentSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, 'User ID is required'),
    amount: zod_1.z.number().positive('Amount must be positive'),
    method: zod_1.z.enum(['stripe', 'paypal', 'bank_transfer', 'cash']),
    status: zod_1.z.enum(['completed', 'pending', 'failed', 'refunded']).default('pending'),
    description: zod_1.z.string().optional(),
    transactionId: zod_1.z.string().optional(),
});
router.get('/', async (req, res) => {
    try {
        const { status, method, startDate, endDate, page = '1', limit = '20' } = req.query;
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;
        const skip = (pageNum - 1) * limitNum;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (method) {
            where.method = method;
        }
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = new Date(startDate);
            }
            if (endDate) {
                where.createdAt.lte = new Date(endDate);
            }
        }
        const [payments, total] = await Promise.all([
            prisma_1.prisma.payment.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limitNum,
            }),
            prisma_1.prisma.payment.count({ where }),
        ]);
        res.json({
            success: true,
            data: payments,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch payments',
        });
    }
});
router.get('/revenue', async (req, res) => {
    try {
        const { period = 'monthly' } = req.query;
        let groupBy;
        let dateFormat;
        switch (period) {
            case 'weekly':
                groupBy = 'week';
                dateFormat = 'YYYY-WW';
                break;
            case 'monthly':
                groupBy = 'month';
                dateFormat = 'YYYY-MM';
                break;
            case 'yearly':
                groupBy = 'year';
                dateFormat = 'YYYY';
                break;
            default:
                groupBy = 'month';
                dateFormat = 'YYYY-MM';
        }
        const revenueData = await prisma_1.prisma.$queryRaw `
      SELECT 
        DATE_TRUNC(${groupBy}, "createdAt") as period,
        SUM(amount) as total_revenue,
        COUNT(*) as transaction_count
      FROM "Payment"
      WHERE status = 'completed'
        AND "createdAt" >= NOW() - INTERVAL '12 ${groupBy}s'
      GROUP BY DATE_TRUNC(${groupBy}, "createdAt")
      ORDER BY period DESC
    `;
        const methodDistribution = await prisma_1.prisma.payment.groupBy({
            by: ['method'],
            where: { status: 'completed' },
            _sum: { amount: true },
            _count: true,
        });
        const recentTransactions = await prisma_1.prisma.payment.findMany({
            where: {
                status: 'completed',
                createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
        res.json({
            success: true,
            data: {
                revenueData,
                methodDistribution,
                recentTransactions,
            },
        });
    }
    catch (error) {
        console.error('Error fetching revenue data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch revenue data',
        });
    }
});
router.post('/', (0, validation_1.validateRequest)(createPaymentSchema), async (req, res) => {
    try {
        const payment = await prisma_1.prisma.payment.create({
            data: req.body,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        res.status(201).json({
            success: true,
            data: payment,
        });
    }
    catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create payment',
        });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const payment = await prisma_1.prisma.payment.update({
            where: { id },
            data: { status },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        res.json({
            success: true,
            data: payment,
        });
    }
    catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update payment',
        });
    }
});
exports.default = router;
//# sourceMappingURL=payments.js.map