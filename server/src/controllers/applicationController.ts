import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { ApplicationService } from '../services/applicationService';

export class ApplicationController {
  public static async getApplications(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const apps = await ApplicationService.getApplications(userId);
      res.status(200).json({ success: true, data: apps });
    } catch (err: any) {
      next(err);
    }
  }

  public static async createApplication(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { jobTitle, company, location, jobId, status, appliedDate, notes } = req.body;

      if (!jobTitle || !company) {
        res.status(400).json({ success: false, message: 'Job title and company name are required.' });
        return;
      }

      const app = await ApplicationService.createApplication(userId, {
        jobTitle,
        company,
        location,
        jobId,
        status,
        appliedDate,
        notes
      });

      res.status(201).json({ success: true, message: 'Application recorded.', data: app });
    } catch (err: any) {
      next(err);
    }
  }

  public static async updateApplication(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const updated = await ApplicationService.updateApplication(userId, req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Application updated.', data: updated });
    } catch (err: any) {
      next(err);
    }
  }

  public static async deleteApplication(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      await ApplicationService.deleteApplication(userId, req.params.id);
      res.status(200).json({ success: true, message: 'Application removed.' });
    } catch (err: any) {
      next(err);
    }
  }
}
