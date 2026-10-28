import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', requireAuth, AuthController.logout);
router.get('/me', requireAuth, AuthController.getMe);

export default router;
