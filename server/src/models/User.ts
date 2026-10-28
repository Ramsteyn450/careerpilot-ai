import mongoose, { Schema, Document } from 'mongoose';
import { UserCareerProfile, UserPreferences } from '../../../shared/types';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  emailVerified: boolean;
  careerProfile?: UserCareerProfile;
  preferences: UserPreferences;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    careerProfile: {
      careerStage: { type: String, default: 'Fresher' },
      targetRoles: { type: [String], default: [] },
      skills: { type: [String], default: [] },
      softSkills: { type: [String], default: [] },
      experienceLevel: { type: String, default: 'Entry' },
      educationLevel: { type: String, default: '' },
      preferredLocations: { type: [String], default: [] },
      workMode: { type: String, default: 'any' },
      preferredIndustries: { type: [String], default: [] },
      careerGoals: { type: String, default: '' },
      bio: { type: String, default: '' }
    },
    preferences: {
      aiProcessingConsent: { type: Boolean, default: true },
      resumeRetentionDays: { type: Number, default: 365 },
      emailNotifications: { type: Boolean, default: true },
      theme: { type: String, default: 'dark' }
    },
    refreshToken: { type: String, default: '' }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
