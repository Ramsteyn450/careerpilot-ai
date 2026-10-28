import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { Resume } from '../models/Resume';
import { JobApplication } from '../models/JobApplication';
import { AuthService } from '../services/authService';

export class ProfileController {
  public static async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await User.findById(req.user!.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }
      res.status(200).json({ success: true, data: AuthService.toSafeUser(user) });
    } catch (err: any) {
      next(err);
    }
  }

  public static async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { careerProfile, preferences, name } = req.body;
      const user = await User.findById(req.user!.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      if (name) user.name = name.trim();
      if (careerProfile) {
        user.careerProfile = { ...user.careerProfile, ...careerProfile };
      }
      if (preferences) {
        user.preferences = { ...user.preferences, ...preferences };
      }

      await user.save();
      res.status(200).json({ success: true, data: AuthService.toSafeUser(user) });
    } catch (err: any) {
      next(err);
    }
  }

  public static async exportData(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const [user, resumes, applications] = await Promise.all([
        User.findById(userId),
        Resume.find({ userId }),
        JobApplication.find({ userId })
      ]);

      const exportPayload = {
        user: user ? AuthService.toSafeUser(user) : null,
        resumes,
        applications,
        exportedAt: new Date().toISOString()
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="careerpilot-data-${userId}.json"`);
      res.status(200).send(JSON.stringify(exportPayload, null, 2));
    } catch (err: any) {
      next(err);
    }
  }

  public static async deleteAccount(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      await Promise.all([
        User.findByIdAndDelete(userId),
        Resume.deleteMany({ userId }),
        JobApplication.deleteMany({ userId })
      ]);
      res.clearCookie('refreshToken');
      res.status(200).json({ success: true, message: 'Your account and all associated data have been permanently removed.' });
    } catch (err: any) {
      next(err);
    }
  }
}
