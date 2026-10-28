import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { AnalyticsService } from '../services/analyticsService';

export class AnalyticsController {
  public static async getOverview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const stats = await AnalyticsService.getUserAnalytics(userId);
      res.status(200).json({ success: true, data: stats });
    } catch (err: any) {
      next(err);
    }
  }
}
