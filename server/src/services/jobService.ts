import mongoose from 'mongoose';
import { Job, IJob } from '../models/Job';
import { JobListing, WorkMode } from '../../../shared/types';

// In-memory saved jobs tracking per user
const userSavedJobs = new Map<string, Set<string>>();

export class JobService {
  public static async getJobs(query: {
    search?: string;
    workMode?: string;
    experienceLevel?: string;
    role?: string;
    limit?: number;
    skip?: number;
  }): Promise<{ jobs: JobListing[]; total: number }> {
    const filter: any = {};

    if (query.search) {
      const safeEscaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(safeEscaped, 'i');
      filter.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { description: searchRegex },
        { skills: searchRegex }
      ];
    }

    if (query.workMode && query.workMode !== 'any') {
      filter.workMode = query.workMode;
    }

    if (query.experienceLevel && query.experienceLevel !== 'all') {
      filter.experienceLevel = query.experienceLevel;
    }

    const limit = query.limit || 50;
    const skip = query.skip || 0;

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Job.countDocuments(filter)
    ]);

    return {
      jobs: jobs.map((j) => this.toJobListing(j)),
      total
    };
  }

  public static async getJobById(jobId: string): Promise<JobListing> {
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error('Job listing not found.');
    }
    return this.toJobListing(job);
  }

  public static async toggleSaveJob(userId: string, jobId: string): Promise<boolean> {
    if (!userSavedJobs.has(userId)) {
      userSavedJobs.set(userId, new Set());
    }
    const saved = userSavedJobs.get(userId)!;
    if (saved.has(jobId)) {
      saved.delete(jobId);
      return false; // unsaved
    } else {
      saved.add(jobId);
      return true; // saved
    }
  }

  public static async getSavedJobs(userId: string): Promise<JobListing[]> {
    const savedSet = userSavedJobs.get(userId);
    if (!savedSet || savedSet.size === 0) {
      return [];
    }

    const jobIds = Array.from(savedSet);
    const jobs = await Job.find({ _id: { $in: jobIds } });
    return jobs.map((j) => this.toJobListing(j));
  }

  public static isJobSaved(userId: string, jobId: string): boolean {
    return userSavedJobs.get(userId)?.has(jobId) || false;
  }

  public static toJobListing(job: IJob): JobListing {
    return {
      id: job._id.toString(),
      title: job.title,
      company: job.company,
      companyLogo: job.companyLogo,
      location: job.location,
      workMode: job.workMode,
      experienceLevel: job.experienceLevel,
      salaryRange: job.salaryRange,
      employmentType: job.employmentType,
      description: job.description,
      requirements: job.requirements,
      skills: job.skills,
      source: job.source,
      applicationUrl: job.applicationUrl,
      postedDate: job.postedDate
    };
  }
}
