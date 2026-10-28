import mongoose, { Schema, Document } from 'mongoose';
import { WorkMode } from '../../../shared/types';

export interface IJob extends Document {
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  workMode: WorkMode;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  salaryRange?: string;
  employmentType: 'Full-time' | 'Contract' | 'Part-time' | 'Internship';
  description: string;
  requirements: string[];
  skills: string[];
  source: 'verified' | 'imported' | 'demo';
  applicationUrl: string;
  postedDate: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, index: true },
    company: { type: String, required: true, index: true },
    companyLogo: { type: String },
    location: { type: String, required: true },
    workMode: { type: String, enum: ['remote', 'hybrid', 'onsite', 'any'], default: 'remote' },
    experienceLevel: { type: String, enum: ['Entry', 'Mid', 'Senior', 'Lead'], default: 'Mid' },
    salaryRange: { type: String },
    employmentType: { type: String, default: 'Full-time' },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    skills: { type: [String], default: [], index: true },
    source: { type: String, enum: ['verified', 'imported', 'demo'], default: 'verified' },
    applicationUrl: { type: String, default: '#' },
    postedDate: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: true }
);

JobSchema.index({ title: 'text', description: 'text', company: 'text' });

export const Job = mongoose.model<IJob>('Job', JobSchema);
