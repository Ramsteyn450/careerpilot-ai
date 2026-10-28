import mongoose, { Schema, Document } from 'mongoose';
import { StructuredResumeData, ResumeVersion, ResumeAnalysisResult } from '../../../shared/types';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  originalFilename: string;
  secureStorageKey: string;
  fileType: 'pdf' | 'docx' | 'created';
  fileSize: number;
  extractedText: string;
  structuredData: StructuredResumeData;
  latestScore?: number;
  latestAnalysis?: ResumeAnalysisResult;
  activeVersionId?: string;
  versions: ResumeVersion[];
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    originalFilename: { type: String, required: true },
    secureStorageKey: { type: String, required: true },
    fileType: { type: String, enum: ['pdf', 'docx', 'created'], default: 'pdf' },
    fileSize: { type: Number, default: 0 },
    extractedText: { type: String, default: '' },
    structuredData: { type: Schema.Types.Mixed, required: true },
    latestScore: { type: Number, default: 0 },
    latestAnalysis: { type: Schema.Types.Mixed },
    activeVersionId: { type: String },
    versions: { type: [Schema.Types.Mixed] as any, default: [] }
  },
  { timestamps: true }
);

ResumeSchema.index({ userId: 1, createdAt: -1 });

export const Resume = mongoose.model<IResume>('Resume', ResumeSchema);
