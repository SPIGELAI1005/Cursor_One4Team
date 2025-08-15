import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { validateRequest } from '@/middleware/validation';

const router = Router();

// Validation schemas
const createPaymentSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  amount: z.number().positive('Amount must be positive'),
  method: z.enum(['stripe', 'paypal', 'bank_transfer', 'cash']),
  status: z.enum(['completed', 'pending', 'failed', 'refunded']).default('pending'),
  description: z.string().optional(),
  transactionId: z.string().optional(),
});

// GET /api/finance/payments - Get payment transactions with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      method,
      startDate,
      endDate,
      page = '1',
      limit = '20'
    } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (method) {
      where.method = method;
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate as string);
      }
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
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
      prisma.payment.count({ where }),
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
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payments',
    });
  }
});

// GET /api/finance/payments/revenue - Get revenue analytics
router.get('/revenue', async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    
    let groupBy: string;
    let dateFormat: string;
    
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

    // Get revenue data for the last 12 periods
    const revenueData = await prisma.$queryRaw`
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

    // Get payment method distribution
    const methodDistribution = await prisma.payment.groupBy({
      by: ['method'],
      where: { status: 'completed' },
      _sum: { amount: true },
      _count: true,
    });

    // Get recent transactions (last 30 days)
    const recentTransactions = await prisma.payment.findMany({
      where: {
        status: 'completed',
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
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
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch revenue data',
    });
  }
});

// POST /api/finance/payments - Create new payment record
router.post('/', validateRequest(createPaymentSchema), async (req, res) => {
  try {
    const payment = await prisma.payment.create({
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
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment',
    });
  }
});

// PUT /api/finance/payments/:id - Update payment status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const payment = await prisma.payment.update({
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
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update payment',
    });
  }
});

export default router; 