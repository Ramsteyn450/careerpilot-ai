import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/overview', AnalyticsController.getOverview);

export default router;
