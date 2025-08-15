import { Router } from 'express';
import { authenticateUser, requireRole } from '../../../middleware/authMiddleware';
import usersRouter from './users';
import messagesRouter from './messages';
import flagsRouter from './flags';
import actionsRouter from './actions';

const router = Router();

// Apply authentication and support role requirement to all support routes
router.use(authenticateUser);
router.use(requireRole(['support']));

// Support dashboard info
router.get('/', (req, res) => {
  res.json({
    message: 'Support Dashboard API',
    user: req.user,
    endpoints: {
      users: '/api/support/users',
      messages: '/api/support/messages',
      flags: '/api/support/flags',
      actions: '/api/support/actions',
    },
  });
});

// Mount support sub-routes
router.use('/users', usersRouter);
router.use('/messages', messagesRouter);
router.use('/flags', flagsRouter);
router.use('/actions', actionsRouter);

export default router; 