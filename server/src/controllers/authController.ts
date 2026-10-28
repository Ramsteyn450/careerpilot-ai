import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
        return;
      }

      const { user, accessToken, refreshToken } = await AuthService.register(name, email, password);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(201).json({
        success: true,
        data: { user, accessToken, refreshToken }
      });
    } catch (err: any) {
      next(err);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required.' });
        return;
      }

      const { user, accessToken, refreshToken } = await AuthService.login(email, password);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({
        success: true,
        data: { user, accessToken, refreshToken }
      });
    } catch (err: any) {
      next(err);
    }
  }

  public static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!token) {
        res.status(401).json({ success: false, message: 'No refresh token provided.' });
        return;
      }

      const tokens = await AuthService.refreshAccessToken(token);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({
        success: true,
        data: tokens
      });
    } catch (err: any) {
      next(err);
    }
  }

  public static async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user?.id) {
        await AuthService.logout(req.user.id);
      }
      res.clearCookie('refreshToken');
      res.status(200).json({ success: true, message: 'Successfully logged out.' });
    } catch (err: any) {
      next(err);
    }
  }

  public static async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      res.status(200).json({
        success: true,
        data: AuthService.toSafeUser(user)
      });
    } catch (err: any) {
      next(err);
    }
  }
}
