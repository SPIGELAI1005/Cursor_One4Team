import { Router } from 'express';
import { authenticateUser } from '@/middleware/authMiddleware';
import { setTenantContext, requireTenant } from '@/middleware/tenantMiddleware';
import adminRouter from './protected/admin';
import trainerRouter from './protected/trainer';
import memberRouter from './protected/member';
import supportRouter from './protected/support';
import officialRouter from './protected/official';
import playerRouter from './protected/player';
import financeRouter from './protected/finance';
import partnerRouter from './protected/partner';
import pressNewsRouter from './protected/press-news';
import billingRouter from './protected/billing';
import monitoringRouter from './protected/monitoring';
import testCheckRoleRouter from './test-checkRole';
import registerRouter from './public/register';
import webhooksRouter from './public/webhooks';

const router = Router();

// Apply auth + tenant context to all protected routes
router.use(
  [
    '/admin',
    '/trainer',
    '/member',
    '/support',
    '/official',
    '/player',
    '/finance',
    '/sponsorship',
    '/press-news',
    '/billing',
    '/monitoring',
  ],
  authenticateUser,
  setTenantContext,
  requireTenant,
);

// Mount protected routes
router.use('/admin', adminRouter);
router.use('/trainer', trainerRouter);
router.use('/member', memberRouter);
router.use('/support', supportRouter);
router.use('/official', officialRouter);
router.use('/player', playerRouter);
router.use('/finance', financeRouter);
router.use('/sponsorship', partnerRouter);
router.use('/press-news', pressNewsRouter);
router.use('/billing', billingRouter);
router.use('/monitoring', monitoringRouter);

// Mount test routes for checkRole middleware demonstration
router.use('/test-checkRole', testCheckRoleRouter);

// Mount public routes
router.use('/public/register', registerRouter);
router.use('/public/webhooks', webhooksRouter);

export default router; 