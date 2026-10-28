import React, { createContext, useContext, useState } from 'react';
import {
  ResumeDocument,
  ResumeAnalysisResult,
  StructuredResumeData,
  ImprovementSuggestion,
  ResumeVersion
} from '../../../shared/types';
import { ResumeParser } from '../services/resumeParser';
import { LocalResumeAnalyzer, LocalAnalysisResult } from '../services/localResumeAnalyzer';

interface ResumeContextType {
  activeResume: ResumeDocument | null;
  activeAnalysis: ResumeAnalysisResult | null;
  localAnalysis: LocalAnalysisResult | null;
  originalData: StructuredResumeData | null;
  targetRole: string | null;
  setTargetRole: (role: string | null) => void;
  loading: boolean;
  uploading: boolean;
  uploadStage: string;
  uploadError: string | null;
  clearUploadError: () => void;
  uploadResume: (file: File) => Promise<void>;
  cancelUpload: () => void;
  createBlankResume: (title?: string) => Promise<ResumeDocument>;
  updateActiveContent: (data: StructuredResumeData, templateId?: string) => Promise<void>;
  applyApprovedSuggestions: (
    suggestions: ImprovementSuggestion[],
    versionName?: string
  ) => Promise<ResumeVersion | null>;
  restoreOriginal: () => void;
  restoreVersion: (versionId: string) => Promise<void>;
  deleteResume: (id?: string) => Promise<void>;
  clearResume: () => void;
  reAnalyzeActive: () => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// Initial fallback mock profile for instant exploration
const DEFAULT_EXPLORE_RESUME: StructuredResumeData = {
  contact: {
    fullName: 'Alex Morgan',
    email: 'alex.morgan@careerpilot.ai',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    linkedinUrl: 'https://linkedin.com/in/alexmorgan',
    githubUrl: 'https://github.com/alexmorgan'
  },
  summary:
    'Results-driven Software Engineer with 4+ years of hands-on experience designing robust web architectures, scalable backend microservices, and reactive user interfaces in collaborative agile teams.',
  skills: {
    technical: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'Python', 'REST API', 'SQL'],
    soft: ['Agile / Scrum', 'System Design', 'Technical Mentorship', 'Problem Solving'],
    tools: ['Git', 'VS Code', 'GitHub Actions', 'Postman', 'Linux']
  },
  experience: [
    {
      id: 'exp-1',
      role: 'Senior Full-Stack Developer',
      company: 'CloudScale Technologies',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      highlights: [
        'Architected high-throughput microservices in Node.js and TypeScript reducing server response times by 35%.',
        'Led frontend development of reactive dashboards in React, increasing user engagement metrics by 28%.'
      ]
    },
    {
      id: 'exp-2',
      role: 'Full-Stack Developer',
      company: 'DataFlow Systems',
      location: 'Austin, TX',
      startDate: '2020',
      endDate: '2022',
      current: false,
      highlights: [
        'Built REST APIs and database migration scripts for PostgreSQL, handling over 500K daily queries.',
        'Collaborated with design and QA teams to deliver 100% test-covered user management flows.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2016',
      endDate: '2020',
      gradeGpa: '3.85 / 4.0'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Distributed Cloud Storage Platform',
      toolsUsed: ['Go', 'Docker', 'PostgreSQL', 'AWS S3'],
      link: 'github.com/alexmorgan/cloud-storage',
      highlights: [
        'Engineered high-throughput file storage with AES-256 client encryption and automated chunking.',
        'Benchmarked concurrent streaming pipelines achieving 1.2 GB/s data transfer rates.'
      ]
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      year: '2023'
    }
  ],
  achievements: [
    'Published open-source state management utility with 1,200+ GitHub stars.',
    'First Place Winner at National Collegiate Hackathon.'
  ],
  languages: ['English (Native)', 'Spanish (Conversational)']
};

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeResume, setActiveResume] = useState<ResumeDocument | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [localAnalysis, setLocalAnalysis] = useState<LocalAnalysisResult | null>(null);
  const [originalData, setOriginalData] = useState<StructuredResumeData | null>(null);
  const [targetRole, setTargetRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const isCancelledRef = React.useRef(false);

  const clearUploadError = () => {
    setUploadError(null);
  };

  const cancelUpload = () => {
    isCancelledRef.current = true;
    setUploading(false);
    setUploadStage('');
  };

  /**
   * Helper: Converts LocalAnalysisResult to ResumeAnalysisResult for backwards compatibility
   */
  const convertToResumeAnalysis = (analysis: LocalAnalysisResult): ResumeAnalysisResult => {
    const atsScore = analysis.categories.find((c) => c.name.includes('ATS'))?.score || analysis.overallScore;

    return {
      overallScore: analysis.overallScore,
      atsCompatibilityScore: atsScore,
      scoringExplanation: analysis.summaryVerdict,
      categoryScores: analysis.categories.map((c) => ({
        name: c.name,
        score: c.score,
        weight: c.weight,
        description: c.description,
        status: c.status
      })),
      strengths: analysis.strengths.map((s) => ({ title: 'Observed Strength', detail: s })),
      weaknesses: analysis.weaknesses.map((w) => ({
        title: 'Area for Improvement',
        issue: w,
        whyItMatters: 'Strengthening this section improves ATS keyword discovery and recruiter retention.',
        howToFix: 'Incorporate active metrics, role-specific keywords, and structured bullet points.',
        exampleImprovement: ''
      })),
      keywordAnalysis: {
        identifiedKeywords: (analysis.roleRecommendations[0]?.matchingSkills || []).map((k) => ({
          keyword: k,
          category: 'technical',
          inResume: true,
          frequency: 1,
          importance: 'high'
        })),
        missingCrucialKeywords: analysis.roleRecommendations[0]?.missingSkills || [],
        stuffingRisk: false
      },
      formattingFeedback: {
        readabilityScore: analysis.categories.find((c) => c.name === 'Readability')?.score || 80,
        warnings: [],
        atsFriendly: atsScore >= 70
      },
      actionableRecommendations: analysis.recommendations.map((r) => ({
        id: r.id,
        section: r.section === 'formatting' ? 'general' : r.section,
        originalText: r.originalText || r.issue,
        suggestedText: r.suggestedText || r.howToImprove,
        rationale: r.whyItMatters,
        impact: 'High',
        status: 'pending'
      }))
    };
  };

  /**
   * Upload and process resume file directly in client memory
   */
  const uploadResume = async (file: File) => {
    isCancelledRef.current = false;
    setUploading(true);
    setUploadError(null);
    try {
      setUploadStage('1. Validating document format & reading binary...');
      await new Promise((r) => setTimeout(r, 150));
      if (isCancelledRef.current) return;

      setUploadStage('2. Extracting selectable document text...');
      const rawText = await ResumeParser.extractTextFromFile(file);
      if (isCancelledRef.current) return;

      setUploadStage('3. Parsing sections & identifying technical competencies...');
      await new Promise((r) => setTimeout(r, 200));
      if (isCancelledRef.current) return;
      const structured = ResumeParser.parseStructuredResume(rawText, file.name);

      setUploadStage('4. Evaluating ATS compatibility & calculating quality scores...');
      await new Promise((r) => setTimeout(r, 200));
      if (isCancelledRef.current) return;
      const analysis = LocalResumeAnalyzer.analyze(structured, rawText);
      const compatAnalysis = convertToResumeAnalysis(analysis);

      setUploadStage('5. Finalizing role recommendations & career insights...');
      await new Promise((r) => setTimeout(r, 150));
      if (isCancelledRef.current) return;

      const resumeDoc: ResumeDocument = {
        id: `res-${Date.now()}`,
        userId: 'client-user',
        originalFilename: file.name,
        fileType: file.name.split('.').pop()?.toLowerCase() === 'pdf' ? 'pdf' : 'docx',
        fileSize: file.size,
        extractedText: rawText,
        structuredData: structured,
        latestScore: analysis.overallScore,
        latestAnalysis: compatAnalysis,
        versions: [
          {
            id: `v-1`,
            versionNumber: 1,
            versionName: 'Original Upload',
            templateId: 'ats-classic',
            structuredContent: JSON.parse(JSON.stringify(structured)),
            changeSummary: 'Initial document parsed from uploaded file',
            createdAt: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setActiveResume(resumeDoc);
      setOriginalData(JSON.parse(JSON.stringify(structured)));
      setLocalAnalysis(analysis);
      setActiveAnalysis(compatAnalysis);
    } catch (err: any) {
      console.error('Resume processing error:', err);
      const msg = err.message || 'Failed to process resume file. Please ensure it is a valid text-based PDF or DOCX.';
      setUploadError(msg);
      throw err;
    } finally {
      setUploading(false);
      setUploadStage('');
    }
  };

  /**
   * Initialize a fresh exploration resume template
   */
  const createBlankResume = async (title = 'Sample Resume'): Promise<ResumeDocument> => {
    setLoading(true);
    try {
      const structured = JSON.parse(JSON.stringify(DEFAULT_EXPLORE_RESUME));
      const rawText = `${structured.contact.fullName}\n${structured.summary}\n${structured.skills.technical.join(', ')}`;
      const analysis = LocalResumeAnalyzer.analyze(structured, rawText);
      const compatAnalysis = convertToResumeAnalysis(analysis);

      const resumeDoc: ResumeDocument = {
        id: `res-${Date.now()}`,
        userId: 'client-user',
        originalFilename: `${title}.pdf`,
        fileType: 'pdf',
        fileSize: 45000,
        extractedText: rawText,
        structuredData: structured,
        latestScore: analysis.overallScore,
        latestAnalysis: compatAnalysis,
        versions: [
          {
            id: `v-1`,
            versionNumber: 1,
            versionName: 'Initial Template',
            templateId: 'modern-professional',
            structuredContent: JSON.parse(JSON.stringify(structured)),
            changeSummary: 'Interactive explorer resume initialized',
            createdAt: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setActiveResume(resumeDoc);
      setOriginalData(JSON.parse(JSON.stringify(structured)));
      setLocalAnalysis(analysis);
      setActiveAnalysis(compatAnalysis);
      return resumeDoc;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update active structured resume content (triggers live re-scoring)
   */
  const updateActiveContent = async (data: StructuredResumeData, templateId?: string) => {
    if (!activeResume) return;

    const rawText = `${data.contact.fullName}\n${data.summary}\n${(data.skills?.technical || []).join(', ')}`;
    const analysis = LocalResumeAnalyzer.analyze(data, rawText);
    const compatAnalysis = convertToResumeAnalysis(analysis);

    setActiveResume((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        structuredData: data,
        latestScore: analysis.overallScore,
        latestAnalysis: compatAnalysis,
        updatedAt: new Date().toISOString()
      };
    });

    setLocalAnalysis(analysis);
    setActiveAnalysis(compatAnalysis);
  };

  /**
   * Apply user-approved suggestions and snapshot a new version
   */
  const applyApprovedSuggestions = async (
    suggestions: ImprovementSuggestion[],
    versionName = 'AI Improved Version'
  ): Promise<ResumeVersion | null> => {
    if (!activeResume) return null;

    const updatedData: StructuredResumeData = JSON.parse(JSON.stringify(activeResume.structuredData));
    const approvedChanges: any[] = [];

    suggestions.forEach((s) => {
      if (s.section === 'summary') {
        approvedChanges.push({
          suggestionId: s.id,
          section: 'Summary',
          original: updatedData.summary,
          approved: s.suggestedText,
          timestamp: new Date().toISOString()
        });
        updatedData.summary = s.suggestedText;
      }
    });

    const newVersionNumber = (activeResume.versions?.length || 0) + 1;
    const newVersion: ResumeVersion = {
      id: `v-${Date.now()}`,
      versionNumber: newVersionNumber,
      versionName: `${versionName} (v${newVersionNumber})`,
      templateId: activeResume.versions?.[activeResume.versions.length - 1]?.templateId || 'modern-professional',
      structuredContent: JSON.parse(JSON.stringify(updatedData)),
      changeSummary: `Applied ${approvedChanges.length} approved improvements`,
      approvedChanges,
      createdAt: new Date().toISOString()
    };

    const rawText = `${updatedData.contact.fullName}\n${updatedData.summary}\n${(updatedData.skills?.technical || []).join(', ')}`;
    const analysis = LocalResumeAnalyzer.analyze(updatedData, rawText);
    const compatAnalysis = convertToResumeAnalysis(analysis);

    setActiveResume((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        structuredData: updatedData,
        latestScore: analysis.overallScore,
        latestAnalysis: compatAnalysis,
        versions: [...(prev.versions || []), newVersion],
        updatedAt: new Date().toISOString()
      };
    });

    setLocalAnalysis(analysis);
    setActiveAnalysis(compatAnalysis);
    return newVersion;
  };

  /**
   * Restore the initial original draft
   */
  const restoreOriginal = () => {
    if (!originalData) return;
    updateActiveContent(JSON.parse(JSON.stringify(originalData)));
  };

  /**
   * Restore a historical version
   */
  const restoreVersion = async (versionId: string) => {
    if (!activeResume) return;
    const found = activeResume.versions?.find((v) => v.id === versionId);
    if (found && found.structuredContent) {
      updateActiveContent(JSON.parse(JSON.stringify(found.structuredContent)), found.templateId);
    }
  };

  /**
   * Delete or clear the active resume from the current session
   */
  const deleteResume = async (_id?: string) => {
    clearResume();
  };

  const clearResume = () => {
    setActiveResume(null);
    setActiveAnalysis(null);
    setLocalAnalysis(null);
    setOriginalData(null);
    setTargetRole(null);
    setUploadError(null);
  };

  const reAnalyzeActive = async () => {
    if (!activeResume) return;
    setLoading(true);
    try {
      const rawText = activeResume.extractedText || `${activeResume.structuredData.contact.fullName}\n${activeResume.structuredData.summary}`;
      const analysis = LocalResumeAnalyzer.analyze(activeResume.structuredData, rawText);
      const compat = convertToResumeAnalysis(analysis);
      setLocalAnalysis(analysis);
      setActiveAnalysis(compat);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResumeContext.Provider
      value={{
        activeResume,
        activeAnalysis,
        localAnalysis,
        originalData,
        targetRole,
        setTargetRole,
        loading,
        uploading,
        uploadStage,
        uploadError,
        clearUploadError,
        uploadResume,
        cancelUpload,
        createBlankResume,
        updateActiveContent,
        applyApprovedSuggestions,
        restoreOriginal,
        restoreVersion,
        deleteResume,
        clearResume,
        reAnalyzeActive
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
