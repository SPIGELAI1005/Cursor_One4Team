import { Router } from 'express';
import { requireRole } from '../../../middleware/authMiddleware';

const router = Router();

// Apply press-news role protection to all routes
router.use(requireRole(['press-news']));

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Press News API is running',
    user: req.user 
  });
});

// Import sub-routes
// router.use('/news', require('./news'));
// router.use('/media', require('./media'));
// router.use('/analytics', require('./analytics'));
// router.use('/upload', require('./upload'));
// router.use('/contact', require('./contact'));
// router.use('/events', require('./events'));

export default router; 