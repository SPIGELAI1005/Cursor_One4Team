import { Router } from 'express';
import { authenticateUser, requireRole } from '../../../middleware/authMiddleware';
import membersRouter from './members';
import settingsRouter from './settings';

const router = Router();

// Apply authentication and admin role requirement to all admin routes
router.use(authenticateUser);
router.use(requireRole(['admin']));

// Admin dashboard info
router.get('/', (req, res) => {
  res.json({
    message: 'Admin Dashboard API',
    user: req.user,
    endpoints: {
      members: '/api/admin/members',
      settings: '/api/admin/settings',
      users: '/api/admin/users',
      reports: '/api/admin/reports',
    },
  });
});

// Mount admin sub-routes
router.use('/members', membersRouter);
router.use('/settings', settingsRouter);

export default router; 