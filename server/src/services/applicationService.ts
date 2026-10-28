import mongoose from 'mongoose';
import { JobApplication, IJobApplication } from '../models/JobApplication';
import { JobApplicationItem, ApplicationStatus } from '../../../shared/types';

export class ApplicationService {
  public static async getApplications(userId: string): Promise<JobApplicationItem[]> {
    const apps = await JobApplication.find({ userId }).sort({ updatedAt: -1 });
    return apps.map((a) => this.toApplicationItem(a));
  }

  public static async createApplication(
    userId: string,
    data: {
      jobTitle: string;
      company: string;
      location?: string;
      jobId?: string;
      status?: ApplicationStatus;
      appliedDate?: string;
      notes?: string;
    }
  ): Promise<JobApplicationItem> {
    const app = new JobApplication({
      userId: new mongoose.Types.ObjectId(userId),
      jobId: data.jobId ? new mongoose.Types.ObjectId(data.jobId) : undefined,
      jobTitle: data.jobTitle,
      company: data.company,
      location: data.location || 'Remote',
      status: data.status || 'applied',
      appliedDate: data.appliedDate || new Date().toISOString().split('T')[0],
      notes: data.notes || ''
    });

    await app.save();
    return this.toApplicationItem(app);
  }

  public static async updateApplication(
    userId: string,
    applicationId: string,
    updates: Partial<{
      status: ApplicationStatus;
      interviewDate: string;
      offerSalary: string;
      notes: string;
      followUpReminder: string;
    }>
  ): Promise<JobApplicationItem> {
    const app = await JobApplication.findOneAndUpdate(
      { _id: applicationId, userId },
      { $set: updates },
      { new: true }
    );

    if (!app) {
      throw new Error('Application not found or unauthorized.');
    }

    return this.toApplicationItem(app);
  }

  public static async deleteApplication(userId: string, applicationId: string): Promise<void> {
    const result = await JobApplication.deleteOne({ _id: applicationId, userId });
    if (result.deletedCount === 0) {
      throw new Error('Application not found or unauthorized.');
    }
  }

  private static toApplicationItem(app: IJobApplication): JobApplicationItem {
    return {
      id: app._id.toString(),
      userId: app.userId.toString(),
      jobId: app.jobId ? app.jobId.toString() : undefined,
      jobTitle: app.jobTitle,
      company: app.company,
      location: app.location,
      status: app.status,
      appliedDate: app.appliedDate,
      interviewDate: app.interviewDate,
      offerSalary: app.offerSalary,
      notes: app.notes,
      followUpReminder: app.followUpReminder,
      source: app.source,
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString()
    };
  }
}
