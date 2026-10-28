import { Router } from 'express';
import { JobController } from '../controllers/jobController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Publicly searchable or authenticated
router.get('/', JobController.getJobs);
router.get('/:id', JobController.getJob);

// Authenticated features
router.post('/:id/save', requireAuth, JobController.toggleSave);
router.get('/user/saved', requireAuth, JobController.getSavedJobs);
router.get('/user/recommendations', requireAuth, JobController.getRecommendations);
router.post('/match', requireAuth, JobController.matchJobDescription);
router.get('/career/roadmap', requireAuth, JobController.getRoadmap);

export default router;
