import { Router } from 'express';
import { requireRole } from '../../../middleware/authMiddleware';
import announcementsRouter from './announcements';
import eventsRouter from './events';
import staffRouter from './staff';
import documentsRouter from './documents';

const router = Router();

// Apply role-based middleware to all official routes
router.use(requireRole(['official']));

// Mount official-specific routes
router.use('/announcements', announcementsRouter);
router.use('/events', eventsRouter);
router.use('/staff', staffRouter);
router.use('/documents', documentsRouter);

export default router; 