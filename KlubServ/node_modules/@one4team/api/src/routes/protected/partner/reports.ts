import { Router } from 'express';
import { requireRole } from '../../../middleware/authMiddleware';
import { UserRole } from '../../../types/auth';

const router = Router();

// GET /api/sponsorship/reports - Get available reports for partner
router.get('/reports', requireRole(['partner']), async (req, res) => {
  try {
    const partnerId = req.user?.id;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Mock reports data - in real implementation, this would query the database
    const reports = [
      {
        id: 'performance-summary',
        name: 'Performance Summary',
        description: 'Monthly overview of all sponsorship assets performance',
        format: 'PDF',
        lastGenerated: '2024-01-20',
        fileSize: '2.1 MB',
        downloadUrl: `/api/sponsorship/reports/performance-summary/download`
      },
      {
        id: 'engagement-analytics',
        name: 'Engagement Analytics',
        description: 'Detailed click-through rates and user interaction data',
        format: 'CSV',
        lastGenerated: '2024-01-20',
        fileSize: '1.8 MB',
        downloadUrl: `/api/sponsorship/reports/engagement-analytics/download`
      },
      {
        id: 'monthly-report',
        name: 'Monthly Report',
        description: 'Comprehensive monthly sponsorship performance report',
        format: 'PDF',
        lastGenerated: '2024-01-01',
        fileSize: '3.5 MB',
        downloadUrl: `/api/sponsorship/reports/monthly-report/download`
      },
      {
        id: 'asset-performance',
        name: 'Asset Performance',
        description: 'Individual asset performance breakdown',
        format: 'Excel',
        lastGenerated: '2024-01-15',
        fileSize: '1.2 MB',
        downloadUrl: `/api/sponsorship/reports/asset-performance/download`
      }
    ];

    res.json({
      success: true,
      data: reports,
      partnerId
    });

  } catch (error) {
    console.error('Error fetching partner reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/sponsorship/reports/generate - Generate new report
router.post('/generate', requireRole(['partner']), async (req, res) => {
  try {
    const partnerId = req.user?.id;
    const { reportType } = req.body;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!reportType) {
      return res.status(400).json({ error: 'Report type is required' });
    }

    // Mock report generation - in real implementation, this would generate the report
    const generatedReport = {
      id: `${reportType}-${Date.now()}`,
      name: reportType.charAt(0).toUpperCase() + reportType.slice(1).replace('-', ' '),
      format: reportType.includes('analytics') ? 'CSV' : 'PDF',
      generatedAt: new Date().toISOString(),
      fileSize: '2.1 MB',
      downloadUrl: `/api/sponsorship/reports/${reportType}/download`
    };

    res.json({
      success: true,
      data: generatedReport,
      message: 'Report generated successfully'
    });

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/sponsorship/reports/:id/download - Download specific report
router.get('/:id/download', requireRole(['partner']), async (req, res) => {
  try {
    const partnerId = req.user?.id;
    const reportId = req.params.id;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Mock download - in real implementation, this would serve the actual file
    // and verify the report belongs to the partner

    res.json({
      success: true,
      message: 'Report download initiated',
      reportId,
      downloadUrl: `/api/sponsorship/reports/${reportId}/file`
    });

  } catch (error) {
    console.error('Error downloading report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 