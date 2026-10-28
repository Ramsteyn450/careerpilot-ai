import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { JobService } from '../services/jobService';
import { ResumeService } from '../services/resumeService';
import { AIProviderService } from '../services/ai/aiProviderService';

export class JobController {
  public static async getJobs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, workMode, experienceLevel, role, limit, skip } = req.query;
      const result = await JobService.getJobs({
        search: search as string,
        workMode: workMode as string,
        experienceLevel: experienceLevel as string,
        role: role as string,
        limit: limit ? parseInt(limit as string, 10) : 50,
        skip: skip ? parseInt(skip as string, 10) : 0
      });

      // Augment with isSaved if authenticated
      const userId = req.user?.id;
      const jobsWithSaved = result.jobs.map((j) => ({
        ...j,
        isSaved: userId ? JobService.isJobSaved(userId, j.id) : false
      }));

      res.status(200).json({
        success: true,
        data: jobsWithSaved,
        total: result.total
      });
    } catch (err: any) {
      next(err);
    }
  }

  public static async getJob(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const job = await JobService.getJobById(req.params.id);
      const userId = req.user?.id;
      res.status(200).json({
        success: true,
        data: {
          ...job,
          isSaved: userId ? JobService.isJobSaved(userId, job.id) : false
        }
      });
    } catch (err: any) {
      next(err);
    }
  }

  public static async toggleSave(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const isSaved = await JobService.toggleSaveJob(userId, req.params.id);
      res.status(200).json({
        success: true,
        message: isSaved ? 'Job saved to your bookmarks.' : 'Job removed from bookmarks.',
        data: { isSaved }
      });
    } catch (err: any) {
      next(err);
    }
  }

  public static async getSavedJobs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const savedJobs = await JobService.getSavedJobs(userId);
      res.status(200).json({ success: true, data: savedJobs });
    } catch (err: any) {
      next(err);
    }
  }

  public static async getRecommendations(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const resumes = await ResumeService.getUserResumes(userId);
      if (resumes.length === 0) {
        res.status(200).json({
          success: true,
          data: [],
          message: 'Upload or build a resume to unlock role recommendations.'
        });
        return;
      }

      const primary = resumes[0];
      const recommendations = await AIProviderService.recommendRoles(primary.structuredData);

      res.status(200).json({
        success: true,
        data: recommendations
      });
    } catch (err: any) {
      next(err);
    }
  }

  public static async matchJobDescription(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { resumeId, jobDescription } = req.body;

      if (!jobDescription || typeof jobDescription !== 'string') {
        res.status(400).json({ success: false, message: 'Please provide a job description to match against.' });
        return;
      }

      let structuredData;
      if (resumeId) {
        const resume = await ResumeService.getResumeById(userId, resumeId);
        structuredData = resume.structuredData;
      } else {
        const resumes = await ResumeService.getUserResumes(userId);
        if (resumes.length === 0) {
          res.status(400).json({ success: false, message: 'No resume found. Upload a resume first.' });
          return;
        }
        structuredData = resumes[0].structuredData;
      }

      const matchResult = await AIProviderService.matchJobDescription(structuredData, jobDescription);

      res.status(200).json({
        success: true,
        data: matchResult
      });
    } catch (err: any) {
      next(err);
    }
  }

  public static async getRoadmap(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = (req.query.role as string) || 'Full-Stack Developer';
      const roadmap = await AIProviderService.generateRoadmap(role);
      res.status(200).json({ success: true, data: roadmap });
    } catch (err: any) {
      next(err);
    }
  }
}
