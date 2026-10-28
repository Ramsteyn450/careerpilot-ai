import { Router } from 'express';
import { ApplicationController } from '../controllers/applicationController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', ApplicationController.getApplications);
router.post('/', ApplicationController.createApplication);
router.patch('/:id', ApplicationController.updateApplication);
router.delete('/:id', ApplicationController.deleteApplication);

export default router;
