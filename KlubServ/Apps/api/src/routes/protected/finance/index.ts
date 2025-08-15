import { Router } from 'express';
import { requireRole } from '../../../middleware/authMiddleware';
import contributionsRouter from './contributions';
import invoicesRouter from './invoices';
import paymentsRouter from './payments';
import reportsRouter from './reports';
import integrationRouter from './integration';

const router = Router();

// All finance routes require finance role
router.use(requireRole(['finance']));

// Mount finance sub-routes
router.use('/contributions', contributionsRouter);
router.use('/invoices', invoicesRouter);
router.use('/payments', paymentsRouter);
router.use('/reports', reportsRouter);
router.use('/integration', integrationRouter);

export default router; 