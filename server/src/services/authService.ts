import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { JWT_SECRET, JWT_REFRESH_SECRET, JWT_EXPIRES_IN, REFRESH_EXPIRES_IN } from '../config/constants';
import { UserSafe } from '../../../shared/types';

export class AuthService {
  public static async register(name: string, email: string, password: string):Promise<{ user: UserSafe; accessToken: string; refreshToken: string }> {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      emailVerified: true,
      careerProfile: {
        careerStage: 'Fresher',
        targetRoles: ['Full-Stack Developer'],
        skills: ['JavaScript', 'React', 'Node.js', 'SQL'],
        experienceLevel: 'Entry',
        workMode: 'remote'
      },
      preferences: {
        aiProcessingConsent: true,
        resumeRetentionDays: 365,
        emailNotifications: true,
        theme: 'dark'
      }
    });

    const tokens = this.generateTokens(user._id.toString(), user.email);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return {
      user: this.toSafeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  public static async login(email: string, password: string): Promise<{ user: UserSafe; accessToken: string; refreshToken: string }> {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const tokens = this.generateTokens(user._id.toString(), user.email);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return {
      user: this.toSafeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  public static async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    if (!refreshToken) {
      throw new Error('Refresh token is required.');
    }

    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string; email: string };
      const user = await User.findById(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token.');
      }

      // Rotate tokens
      const tokens = this.generateTokens(user._id.toString(), user.email);
      user.refreshToken = tokens.refreshToken;
      await user.save();

      return tokens;
    } catch (err: any) {
      throw new Error('Expired or invalid refresh token.');
    }
  }

  public static async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: '' });
  }

  public static generateTokens(userId: string, email: string): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign({ id: userId, email }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
    return { accessToken, refreshToken };
  }

  public static toSafeUser(user: IUser): UserSafe {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      careerProfile: user.careerProfile,
      preferences: user.preferences,
      createdAt: user.createdAt.toISOString()
    };
  }
}
