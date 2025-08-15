import { Router } from 'express';
import { authenticateUser, requireRole } from '../../../middleware/authMiddleware';
import profileRouter from './profile';
import trainingsRouter from './trainings';
import evaluationsRouter from './evaluations';
import documentsRouter from './documents';
import messagesRouter from './messages';

const router = Router();

// Apply authentication to all player routes
router.use(authenticateUser);
router.use(requireRole(['player']));

// Player app info
router.get('/', (req, res) => {
  res.json({
    message: 'Player App API',
    user: req.user,
    endpoints: {
      profile: '/api/player/profile',
      trainings: '/api/player/trainings',
      evaluations: '/api/player/evaluations',
      documents: '/api/player/documents',
      messages: '/api/player/messages',
    },
  });
});

// Mount player sub-routes
router.use('/profile', profileRouter);
router.use('/trainings', trainingsRouter);
router.use('/evaluations', evaluationsRouter);
router.use('/documents', documentsRouter);
router.use('/messages', messagesRouter);

export default router; 