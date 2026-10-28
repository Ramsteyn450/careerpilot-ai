import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    let token = '';

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: 'Session expired. Please refresh token or log in again.', code: 'TOKEN_EXPIRED' });
      return;
    }
    res.status(401).json({ success: false, message: 'Invalid authentication token.' });
  }
}
