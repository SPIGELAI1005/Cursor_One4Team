import { Router } from 'express';
import { authenticateUser, requireRole } from '../../../middleware/authMiddleware';
import profileRouter from './profile';
import paymentsRouter from './payments';

const router = Router();

// Apply authentication to all member routes (all roles can access member app)
router.use(authenticateUser);
router.use(requireRole(['admin', 'trainer', 'member']));

// Member app info
router.get('/', (req, res) => {
  res.json({
    message: 'Member App API',
    user: req.user,
    endpoints: {
      profile: '/api/member/profile',
      payments: '/api/member/payments',
      classes: '/api/member/classes',
      schedule: '/api/member/schedule',
    },
  });
});

// Mount member sub-routes
router.use('/profile', profileRouter);
router.use('/payments', paymentsRouter);

export default router; 