import mongoose, { Schema, Document } from 'mongoose';
import { ApplicationStatus } from '../../../shared/types';

export interface IJobApplication extends Document {
  userId: mongoose.Types.ObjectId;
  jobId?: mongoose.Types.ObjectId;
  jobTitle: string;
  company: string;
  location?: string;
  status: ApplicationStatus;
  appliedDate?: string;
  interviewDate?: string;
  offerSalary?: string;
  notes?: string;
  followUpReminder?: string;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    status: {
      type: String,
      enum: ['saved', 'applied', 'assessment', 'interview', 'offer', 'rejected', 'withdrawn'],
      default: 'applied'
    },
    appliedDate: { type: String },
    interviewDate: { type: String },
    offerSalary: { type: String },
    notes: { type: String, default: '' },
    followUpReminder: { type: String },
    source: { type: String, default: 'CareerPilot AI' }
  },
  { timestamps: true }
);

export const JobApplication = mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
