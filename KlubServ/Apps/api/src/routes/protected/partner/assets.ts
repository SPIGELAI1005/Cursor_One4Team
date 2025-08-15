import { Router } from 'express';
import { requireRole } from '../../../middleware/authMiddleware';
import { UserRole } from '../../../types/auth';

const router = Router();

// GET /api/sponsorship/assets - Get partner's sponsorship assets
router.get('/assets', requireRole(['partner']), async (req, res) => {
  try {
    const partnerId = req.user?.id;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Mock assets data - in real implementation, this would query the database
    const assets = [
      {
        id: '1',
        title: 'Company Logo Banner',
        type: 'image',
        status: 'active',
        location: 'Homepage Header',
        uploadDate: '2024-01-15',
        views: 1247,
        clicks: 89,
        fileSize: '2.3 MB',
        fileName: 'company-logo-banner.png'
      },
      {
        id: '2',
        title: 'Product Catalog PDF',
        type: 'pdf',
        status: 'active',
        location: 'Shop Page',
        uploadDate: '2024-01-10',
        views: 856,
        clicks: 45,
        fileSize: '5.1 MB',
        fileName: 'product-catalog-2024.pdf'
      },
      {
        id: '3',
        title: 'Promotional Video',
        type: 'video',
        status: 'expired',
        location: 'Events Page',
        uploadDate: '2023-12-01',
        views: 2341,
        clicks: 156,
        fileSize: '12.8 MB',
        fileName: 'promo-video.mp4'
      },
      {
        id: '4',
        title: 'Sponsorship Brochure',
        type: 'pdf',
        status: 'active',
        location: 'About Page',
        uploadDate: '2024-01-20',
        views: 432,
        clicks: 23,
        fileSize: '3.7 MB',
        fileName: 'sponsorship-brochure.pdf'
      }
    ];

    res.json({
      success: true,
      data: assets,
      partnerId
    });

  } catch (error) {
    console.error('Error fetching partner assets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/sponsorship/upload - Upload new sponsorship asset
router.post('/upload', requireRole(['partner']), async (req, res) => {
  try {
    const partnerId = req.user?.id;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, description, location, fileName, fileSize, fileType } = req.body;

    // Validate required fields
    if (!title || !location || !fileName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Mock file upload - in real implementation, this would handle file upload
    const newAsset = {
      id: Date.now().toString(),
      title,
      description: description || '',
      type: fileType || 'unknown',
      status: 'active',
      location,
      uploadDate: new Date().toISOString().split('T')[0],
      views: 0,
      clicks: 0,
      fileSize: fileSize || 'Unknown',
      fileName
    };

    res.json({
      success: true,
      data: newAsset,
      message: 'Asset uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading asset:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/sponsorship/assets/:id - Delete sponsorship asset
router.delete('/assets/:id', requireRole(['partner']), async (req, res) => {
  try {
    const partnerId = req.user?.id;
    const assetId = req.params.id;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Mock deletion - in real implementation, this would delete from database
    // and verify the asset belongs to the partner

    res.json({
      success: true,
      message: 'Asset deleted successfully',
      assetId
    });

  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 