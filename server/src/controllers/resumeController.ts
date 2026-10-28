import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { ResumeService } from '../services/resumeService';
import { AIProviderService } from '../services/ai/aiProviderService';

export class ResumeController {
  public static async uploadResume(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'Please upload a PDF or DOCX resume file.' });
        return;
      }

      const userId = req.user!.id;
      const result = await ResumeService.processUpload(userId, req.file);

      res.status(201).json({
        success: true,
        message: 'Resume parsed and screened successfully.',
        data: result
      });
    } catch (err: any) {
      next(err);
    }
  }

  public static async createBlank(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { title } = req.body;
      const resume = await ResumeService.createBlankResume(userId, title);

      res.status(201).json({
        success: true,
        message: 'New resume drafted.',
        data: resume
      });
    } catch (err: any) {
      next(err);
    }
  }

  public static async getResumes(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const resumes = await ResumeService.getUserResumes(userId);
      res.status(200).json({ success: true, data: resumes });
    } catch (err: any) {
      next(err);
    }
  }

  public static async getResume(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const resume = await ResumeService.getResumeById(userId, req.params.id);
      res.status(200).json({ success: true, data: resume });
    } catch (err: any) {
      next(err);
    }
  }

  public static async updateContent(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { content, templateId } = req.body;
      const resume = await ResumeService.updateContent(userId, req.params.id, content, templateId);
      res.status(200).json({ success: true, message: 'Resume content updated.', data: resume });
    } catch (err: any) {
      next(err);
    }
  }

  public static async applyApprovedChanges(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { approvedSuggestions, versionName } = req.body;

      if (!approvedSuggestions || !Array.isArray(approvedSuggestions)) {
        res.status(400).json({ success: false, message: 'approvedSuggestions array is required.' });
        return;
      }

      const result = await ResumeService.applyApprovedChanges(userId, req.params.id, approvedSuggestions, versionName);

      res.status(200).json({
        success: true,
        message: 'Approved AI changes applied and saved as a new version.',
        data: result
      });
    } catch (err: any) {
      next(err);
    }
  }

  public static async restoreVersion(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { versionId } = req.params;
      const resume = await ResumeService.restoreVersion(userId, req.params.id, versionId);

      res.status(200).json({
        success: true,
        message: 'Resume restored to selected version.',
        data: resume
      });
    } catch (err: any) {
      next(err);
    }
  }

  public static async reAnalyze(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const analysis = await ResumeService.reAnalyze(userId, req.params.id);
      res.status(200).json({ success: true, data: analysis });
    } catch (err: any) {
      next(err);
    }
  }

  public static async improveSection(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { section, currentText, targetRole } = req.body;
      const result = await AIProviderService.rewriteSection(section, currentText, targetRole);
      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      next(err);
    }
  }

  public static async deleteResume(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      await ResumeService.deleteResume(userId, req.params.id);
      res.status(200).json({ success: true, message: 'Resume deleted successfully.' });
    } catch (err: any) {
      next(err);
    }
  }
}
