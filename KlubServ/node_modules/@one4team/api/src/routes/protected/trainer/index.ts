import { Router } from 'express';
import { authenticateUser, requireRole } from '../../../middleware/authMiddleware';
import playersRouter from './players';
import classesRouter from './classes';

const router = Router();

// Apply authentication and trainer role requirement to all trainer routes
router.use(authenticateUser);
router.use(requireRole(['admin', 'trainer']));

// Trainer dashboard info
router.get('/', (req, res) => {
  res.json({
    message: 'Trainer Dashboard API',
    user: req.user,
    endpoints: {
      players: '/api/trainer/players',
      classes: '/api/trainer/classes',
      reports: '/api/trainer/reports',
    },
  });
});

// Mount trainer sub-routes
router.use('/players', playersRouter);
router.use('/classes', classesRouter);

export default router; 