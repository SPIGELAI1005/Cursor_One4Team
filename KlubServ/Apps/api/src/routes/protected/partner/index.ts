import { Router } from 'express';
import analyticsRouter from './analytics';
import assetsRouter from './assets';
import reportsRouter from './reports';
import contactRouter from './contact';

const router = Router();

// Mount partner-specific routes
router.use('/', analyticsRouter);
router.use('/', assetsRouter);
router.use('/reports', reportsRouter);
router.use('/support', contactRouter);

export default router; 