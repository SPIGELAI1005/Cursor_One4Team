import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const router = Router();

// GET /api/finance/reports - Get available reports
router.get('/', async (req, res) => {
  try {
    const { type = 'finance' } = req.query;

    if (type !== 'finance') {
      return res.status(400).json({
        success: false,
        error: 'Invalid report type',
      });
    }

    // Get summary statistics
    const [
      totalRevenue,
      totalInvoices,
      pendingInvoices,
      activePlans,
      monthlyGrowth
    ] = await Promise.all([
      // Total revenue (last 12 months)
      prisma.payment.aggregate({
        where: {
          status: 'completed',
          createdAt: {
            gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000), // 12 months ago
          },
        },
        _sum: { amount: true },
      }),
      
      // Total invoices
      prisma.invoice.count(),
      
      // Pending invoices
      prisma.invoice.count({
        where: { status: 'pending' },
      }),
      
      // Active contribution plans
      prisma.contributionPlan.count({
        where: { status: 'active' },
      }),
      
      // Monthly growth calculation
      prisma.$queryRaw`
        SELECT 
          ROUND(
            ((SUM(CASE WHEN "createdAt" >= DATE_TRUNC('month', NOW()) THEN amount ELSE 0 END) - 
              SUM(CASE WHEN "createdAt" >= DATE_TRUNC('month', NOW() - INTERVAL '1 month') 
                       AND "createdAt" < DATE_TRUNC('month', NOW()) THEN amount ELSE 0 END)) / 
             NULLIF(SUM(CASE WHEN "createdAt" >= DATE_TRUNC('month', NOW() - INTERVAL '1 month') 
                            AND "createdAt" < DATE_TRUNC('month', NOW()) THEN amount ELSE 0 END), 0)) * 100, 2
          ) as growth_percentage
        FROM "Payment"
        WHERE status = 'completed'
      `,
    ]);

    const reports = [
      {
        id: 'monthly-summary',
        title: 'Monthly Financial Summary',
        description: 'Comprehensive monthly financial overview',
        type: 'pdf',
        available: true,
        lastGenerated: new Date().toISOString(),
      },
      {
        id: 'revenue-analysis',
        title: 'Revenue Analysis Report',
        description: 'Detailed revenue breakdown and trends',
        type: 'csv',
        available: true,
        lastGenerated: new Date().toISOString(),
      },
      {
        id: 'invoice-status',
        title: 'Invoice Status Report',
        description: 'Current invoice status and aging analysis',
        type: 'excel',
        available: true,
        lastGenerated: new Date().toISOString(),
      },
      {
        id: 'payment-methods',
        title: 'Payment Methods Analysis',
        description: 'Payment method distribution and trends',
        type: 'pdf',
        available: true,
        lastGenerated: new Date().toISOString(),
      },
      {
        id: 'contribution-plans',
        title: 'Contribution Plans Report',
        description: 'Active plans and member distribution',
        type: 'csv',
        available: true,
        lastGenerated: new Date().toISOString(),
      },
    ];

    res.json({
      success: true,
      data: {
        reports,
        summary: {
          totalRevenue: totalRevenue._sum.amount || 0,
          totalInvoices,
          pendingInvoices,
          activePlans,
          monthlyGrowth: Array.isArray(monthlyGrowth) && monthlyGrowth[0] 
            ? (monthlyGrowth[0] as any).growth_percentage || 0 
            : 0,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reports',
    });
  }
});

// GET /api/finance/reports/:id - Generate specific report
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'pdf', startDate, endDate } = req.query;

    // Validate date range
    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to last 30 days
    const end = endDate ? new Date(endDate as string) : new Date();

    let reportData: any = {};

    switch (id) {
      case 'monthly-summary':
        reportData = await generateMonthlySummary(start, end);
        break;
      case 'revenue-analysis':
        reportData = await generateRevenueAnalysis(start, end);
        break;
      case 'invoice-status':
        reportData = await generateInvoiceStatus(start, end);
        break;
      case 'payment-methods':
        reportData = await generatePaymentMethodsAnalysis(start, end);
        break;
      case 'contribution-plans':
        reportData = await generateContributionPlansReport();
        break;
      default:
        return res.status(404).json({
          success: false,
          error: 'Report not found',
        });
    }

    // In a real implementation, you would generate the actual file
    // For now, we'll return the data structure
    res.json({
      success: true,
      data: {
        reportId: id,
        format,
        generatedAt: new Date().toISOString(),
        downloadUrl: `/api/finance/reports/${id}/download?format=${format}`,
        data: reportData,
      },
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate report',
    });
  }
});

// Helper functions for report generation
async function generateMonthlySummary(startDate: Date, endDate: Date) {
  const [payments, invoices, plans] = await Promise.all([
    prisma.payment.findMany({
      where: {
        status: 'completed',
        createdAt: { gte: startDate, lte: endDate },
      },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.invoice.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.contributionPlan.findMany({
      where: { status: 'active' },
    }),
  ]);

  return {
    period: { start: startDate, end: endDate },
    totalRevenue: payments.reduce((sum, p) => sum + Number(p.amount), 0),
    totalTransactions: payments.length,
    totalInvoices: invoices.length,
    activePlans: plans.length,
    payments,
    invoices,
    plans,
  };
}

async function generateRevenueAnalysis(startDate: Date, endDate: Date) {
  const revenueData = await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('day', "createdAt") as date,
      SUM(amount) as daily_revenue,
      COUNT(*) as transaction_count,
      method
    FROM "Payment"
    WHERE status = 'completed'
      AND "createdAt" >= ${startDate}
      AND "createdAt" <= ${endDate}
    GROUP BY DATE_TRUNC('day', "createdAt"), method
    ORDER BY date DESC
  `;

  return {
    period: { start: startDate, end: endDate },
    revenueData,
  };
}

async function generateInvoiceStatus(startDate: Date, endDate: Date) {
  const invoices = await prisma.invoice.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
    },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { dueDate: 'asc' },
  });

  const statusCounts = await prisma.invoice.groupBy({
    by: ['status'],
    where: {
      createdAt: { gte: startDate, lte: endDate },
    },
    _count: true,
    _sum: { amount: true },
  });

  return {
    period: { start: startDate, end: endDate },
    invoices,
    statusCounts,
  };
}

async function generatePaymentMethodsAnalysis(startDate: Date, endDate: Date) {
  const methodAnalysis = await prisma.payment.groupBy({
    by: ['method'],
    where: {
      status: 'completed',
      createdAt: { gte: startDate, lte: endDate },
    },
    _sum: { amount: true },
    _count: true,
  });

  return {
    period: { start: startDate, end: endDate },
    methodAnalysis,
  };
}

async function generateContributionPlansReport() {
  const plans = await prisma.contributionPlan.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return {
    plans,
    totalPlans: plans.length,
    activePlans: plans.filter(p => p.status === 'active').length,
  };
}

export default router; 