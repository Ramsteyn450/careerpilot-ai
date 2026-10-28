import { Router } from 'express';
import { ResumeController } from '../controllers/resumeController';
import { requireAuth } from '../middleware/authMiddleware';
import { uploadResume } from '../middleware/uploadMiddleware';

const router = Router();

router.use(requireAuth);

router.post('/upload', uploadResume.single('resume'), ResumeController.uploadResume);
router.post('/create', ResumeController.createBlank);
router.get('/', ResumeController.getResumes);
router.get('/:id', ResumeController.getResume);
router.patch('/:id/content', ResumeController.updateContent);
router.post('/:id/apply-changes', ResumeController.applyApprovedChanges);
router.post('/:id/versions/:versionId/restore', ResumeController.restoreVersion);
router.post('/:id/analyze', ResumeController.reAnalyze);
router.post('/improve-section', ResumeController.improveSection);
router.delete('/:id', ResumeController.deleteResume);

export default router;
