import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', ProfileController.getProfile);
router.patch('/', ProfileController.updateProfile);
router.get('/export', ProfileController.exportData);
router.delete('/account', ProfileController.deleteAccount);

export default router;
