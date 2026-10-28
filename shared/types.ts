export type CareerStage = 'Student' | 'Fresher' | 'Intern' | 'Experienced professional' | 'Career switcher';
export type WorkMode = 'remote' | 'hybrid' | 'onsite' | 'any';

export interface UserCareerProfile {
  careerStage: CareerStage;
  targetRoles: string[];
  skills: string[];
  softSkills?: string[];
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  educationLevel?: string;
  preferredLocations?: string[];
  workMode?: WorkMode;
  preferredIndustries?: string[];
  careerGoals?: string;
  bio?: string;
}

export interface UserPreferences {
  aiProcessingConsent: boolean;
  resumeRetentionDays: number;
  emailNotifications: boolean;
  theme: 'dark' | 'light' | 'system';
}

export interface UserSafe {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  careerProfile?: UserCareerProfile;
  preferences?: UserPreferences;
  createdAt: string;
}

// Resume Structured Information
export interface ContactInfo {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

export interface WorkExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string; // or 'Present'
  current?: boolean;
  highlights: string[]; // bullet points
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  gradeGpa?: string;
  honors?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  role?: string;
  toolsUsed: string[];
  highlights: string[];
  link?: string;
}

export interface StructuredResumeData {
  contact: ContactInfo;
  summary: string;
  skills: {
    technical: string[];
    soft: string[];
    tools?: string[];
  };
  experience: WorkExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    year?: string;
  }>;
  achievements: string[];
  languages: string[];
  customSections?: Array<{
    id: string;
    title: string;
    content: string[];
  }>;
}

// Analysis & Scoring
export interface CategoryScore {
  name: string;
  score: number; // 0 - 100
  weight: number;
  description: string;
  status: 'excellent' | 'good' | 'needs-improvement' | 'critical';
}

export interface KeywordMatchItem {
  keyword: string;
  category: 'technical' | 'soft' | 'domain' | 'tool';
  inResume: boolean;
  frequency: number;
  importance: 'high' | 'medium' | 'low';
}

export interface ImprovementSuggestion {
  id: string;
  section: 'summary' | 'experience' | 'projects' | 'skills' | 'education' | 'general';
  targetItemIndex?: number;
  targetField?: string;
  originalText: string;
  suggestedText: string;
  rationale: string;
  impact: 'High' | 'Medium' | 'Low';
  status: 'pending' | 'accepted' | 'rejected' | 'modified';
  modifiedUserText?: string;
}

export interface ResumeAnalysisResult {
  overallScore: number;
  atsCompatibilityScore: number;
  scoringExplanation: string;
  categoryScores: CategoryScore[];
  strengths: Array<{ title: string; detail: string }>;
  weaknesses: Array<{
    title: string;
    issue: string;
    whyItMatters: string;
    howToFix: string;
    exampleImprovement: string;
  }>;
  keywordAnalysis: {
    identifiedKeywords: KeywordMatchItem[];
    missingCrucialKeywords: string[];
    stuffingRisk: boolean;
  };
  formattingFeedback: {
    readabilityScore: number;
    warnings: string[];
    atsFriendly: boolean;
  };
  actionableRecommendations: ImprovementSuggestion[];
}

// Resume entity & versions
export interface ResumeVersion {
  id: string;
  versionNumber: number;
  versionName: string;
  templateId: string;
  structuredContent: StructuredResumeData;
  changeSummary?: string;
  approvedChanges?: Array<{
    suggestionId: string;
    section: string;
    original: string;
    approved: string;
    timestamp: string;
  }>;
  createdAt: string;
}

export interface ResumeDocument {
  id: string;
  userId: string;
  originalFilename: string;
  fileType: 'pdf' | 'docx' | 'created';
  fileSize?: number;
  extractedText: string;
  structuredData: StructuredResumeData;
  latestScore?: number;
  latestAnalysis?: ResumeAnalysisResult;
  activeVersionId?: string;
  versions: ResumeVersion[];
  createdAt: string;
  updatedAt: string;
}

// Jobs & Matching
export interface JobListing {
  id: string;
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
  matchScore?: number;
}

export interface JobRoleRecommendation {
  roleId: string;
  title: string;
  description: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  relevantProjects: string[];
  experienceCompatibility: string;
  educationCompatibility: string;
  roadmapRecommendation: string;
  recommendedCertifications: string[];
  suggestedPortfolioActions: string[];
}

export interface JobMatchComparison {
  overallMatchScore: number;
  skillsCoveragePercent: number;
  matchedSkills: string[];
  missingSkills: string[];
  requirementsBreakdown: Array<{
    requirement: string;
    resumeEvidence: string;
    status: 'Matched' | 'Partial' | 'Missing';
    recommendedAction: string;
  }>;
  suggestedBulletPoints: string[];
  interviewPrepQuestions: string[];
}

// Skill Gap Analysis
export interface SkillProgressItem {
  id: string;
  skill: string;
  category: 'Technical' | 'Soft' | 'Tool' | 'Architecture';
  targetRole: string;
  status: 'not_started' | 'learning' | 'practicing' | 'completed';
  priority: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  suggestedResource: string;
  suggestedProject: string;
  updatedAt: string;
}

export interface LearningRoadmap {
  targetRole: string;
  thirtyDay: {
    focus: string;
    milestones: string[];
    handsOnProject: string;
  };
  sixtyDay: {
    focus: string;
    milestones: string[];
    handsOnProject: string;
  };
  ninetyDay: {
    focus: string;
    milestones: string[];
    handsOnProject: string;
  };
}

// Application Tracking
export type ApplicationStatus = 'saved' | 'applied' | 'assessment' | 'interview' | 'offer' | 'rejected' | 'withdrawn';

export interface JobApplicationItem {
  id: string;
  userId: string;
  jobId?: string;
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
  createdAt: string;
  updatedAt: string;
}

// Templates
export interface ResumeTemplateConfig {
  id: string;
  name: string;
  category: string;
  styleName: string;
  targetRole: string;
  description: string;
  atsFriendlinessNote: string;
  thumbnailColor: string;
  recommendedFor: string[];
  defaultFont: string;
  defaultAccent: string;
}
