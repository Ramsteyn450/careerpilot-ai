import mongoose, { Schema, Document } from 'mongoose';

export interface ISkillProgress extends Document {
  userId: mongoose.Types.ObjectId;
  skill: string;
  category: 'Technical' | 'Soft' | 'Tool' | 'Architecture';
  targetRole: string;
  status: 'not_started' | 'learning' | 'practicing' | 'completed';
  priority: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  suggestedResource: string;
  suggestedProject: string;
  updatedAt: Date;
}

const SkillProgressSchema = new Schema<ISkillProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    skill: { type: String, required: true },
    category: { type: String, default: 'Technical' },
    targetRole: { type: String, default: 'General' },
    status: {
      type: String,
      enum: ['not_started', 'learning', 'practicing', 'completed'],
      default: 'not_started'
    },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    difficulty: { type: String, enum: ['Easy', 'Moderate', 'Challenging'], default: 'Moderate' },
    suggestedResource: { type: String, default: '' },
    suggestedProject: { type: String, default: '' }
  },
  { timestamps: true }
);

SkillProgressSchema.index({ userId: 1, skill: 1 }, { unique: true });

export const SkillProgress = mongoose.model<ISkillProgress>('SkillProgress', SkillProgressSchema);
