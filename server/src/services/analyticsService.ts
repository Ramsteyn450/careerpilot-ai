import { Resume } from '../models/Resume';
import { JobApplication } from '../models/JobApplication';

export class AnalyticsService {
  public static async getUserAnalytics(userId: string) {
    const [resumes, applications] = await Promise.all([
      Resume.find({ userId }).sort({ createdAt: -1 }),
      JobApplication.find({ userId })
    ]);

    // Active or primary resume
    const primaryResume = resumes[0];

    // Score history across versions
    const scoreHistory = primaryResume?.versions?.map((v, i) => ({
      version: v.versionName || `v${i + 1}`,
      score: primaryResume.latestScore || 75,
      date: new Date(v.createdAt).toLocaleDateString()
    })) || [];

    // Technical skills count
    const skills = primaryResume?.structuredData?.skills?.technical || [];
    const skillsDistribution = [
      { name: 'Technical Skills', count: skills.length },
      { name: 'Soft Skills', count: primaryResume?.structuredData?.skills?.soft?.length || 0 },
      { name: 'Tools & Cloud', count: primaryResume?.structuredData?.skills?.tools?.length || 0 }
    ];

    // Applications status counts
    const statusCounts: Record<string, number> = {
      saved: 0,
      applied: 0,
      assessment: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
      withdrawn: 0
    };

    applications.forEach((app) => {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status]++;
      }
    });

    return {
      hasResume: !!primaryResume,
      resumeScore: primaryResume?.latestScore || 0,
      atsScore: primaryResume?.latestAnalysis?.atsCompatibilityScore || 0,
      totalResumes: resumes.length,
      versionsCreated: primaryResume?.versions?.length || 0,
      totalApplications: applications.length,
      statusCounts,
      scoreHistory,
      skillsDistribution
    };
  }
}
