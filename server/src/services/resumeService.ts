import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { Resume, IResume } from '../models/Resume';
import { DocumentParserService } from './documentParserService';
import { AIProviderService } from './ai/aiProviderService';
import {
  StructuredResumeData,
  ResumeVersion,
  ResumeDocument,
  ImprovementSuggestion,
  ResumeAnalysisResult
} from '../../../shared/types';

export class ResumeService {
  /**
   * Process uploaded resume file (PDF or DOCX)
   */
  public static async processUpload(
    userId: string,
    file: Express.Multer.File
  ): Promise<{ resume: ResumeDocument; analysis: ResumeAnalysisResult }> {
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '') as 'pdf' | 'docx';
    const fileType = ext === 'docx' ? 'docx' : 'pdf';

    // Real text extraction
    const extractedText = await DocumentParserService.extractRawText(file.path, fileType);

    // Intelligently segment into structured JSON
    const structuredData = DocumentParserService.parseStructuredResume(extractedText, file.originalname);

    // Run screening analysis
    const analysis = await AIProviderService.analyzeResume(structuredData, extractedText);

    // Initial Version 1
    const initialVersion: ResumeVersion = {
      id: new mongoose.Types.ObjectId().toString(),
      versionNumber: 1,
      versionName: 'Initial Upload',
      templateId: 'ats-classic',
      structuredContent: structuredData,
      changeSummary: 'Original uploaded resume version.',
      approvedChanges: [],
      createdAt: new Date().toISOString()
    };

    const resume = new Resume({
      userId: new mongoose.Types.ObjectId(userId),
      originalFilename: file.originalname,
      secureStorageKey: file.filename,
      fileType,
      fileSize: file.size,
      extractedText,
      structuredData,
      latestScore: analysis.overallScore,
      latestAnalysis: analysis,
      activeVersionId: initialVersion.id,
      versions: [initialVersion]
    });

    await resume.save();

    return {
      resume: this.toResumeDocument(resume),
      analysis
    };
  }

  /**
   * Create a resume directly from the builder (without file upload)
   */
  public static async createBlankResume(userId: string, title = 'New Resume'): Promise<ResumeDocument> {
    const defaultData: StructuredResumeData = {
      contact: {
        fullName: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        linkedinUrl: 'https://linkedin.com/in/alexmorgan',
        githubUrl: 'https://github.com/alexmorgan'
      },
      summary: 'Passionate and results-driven Software Engineer with proven expertise in building modern web platforms, responsive user experiences, and scalable cloud APIs.',
      skills: {
        technical: ['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS', 'PostgreSQL', 'Git', 'Docker'],
        soft: ['Problem Solving', 'Agile & Scrum', 'Cross-functional Collaboration'],
        tools: ['VS Code', 'GitHub', 'Postman', 'Figma']
      },
      experience: [
        {
          id: 'exp-1',
          role: 'Full-Stack Developer',
          company: 'TechWave Solutions',
          location: 'San Francisco, CA',
          startDate: '2023',
          endDate: 'Present',
          current: true,
          highlights: [
            'Architected and deployed responsive full-stack applications with React, TypeScript, and Node.js.',
            'Optimized REST API endpoints reducing average response times by 32% under high concurrency.',
            'Collaborated with design and QA teams to maintain 95%+ unit test coverage.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2019',
          endDate: '2023',
          gradeGpa: '3.82 / 4.0'
        }
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'CareerPilot AI Analytics Platform',
          toolsUsed: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
          highlights: [
            'Built intelligent resume screening and job discovery interface with responsive dark mode.',
            'Integrated real-time ATS scoring benchmarks and personalized skill gap roadmaps.'
          ]
        }
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS Certified Cloud Practitioner',
          issuer: 'Amazon Web Services',
          year: '2023'
        }
      ],
      achievements: [
        'Dean’s Honors List for 6 consecutive academic terms.',
        'Finalist in Silicon Valley Collegiate Hackathon 2023.'
      ],
      languages: ['English (Fluent)', 'Spanish (Basic)']
    };

    const initialVersion: ResumeVersion = {
      id: new mongoose.Types.ObjectId().toString(),
      versionNumber: 1,
      versionName: 'Draft 1',
      templateId: 'modern-professional',
      structuredContent: defaultData,
      changeSummary: 'Created in Resume Builder.',
      approvedChanges: [],
      createdAt: new Date().toISOString()
    };

    const analysis = await AIProviderService.analyzeResume(defaultData);

    const resume = new Resume({
      userId: new mongoose.Types.ObjectId(userId),
      originalFilename: `${title}.pdf`,
      secureStorageKey: `builder-${Date.now()}`,
      fileType: 'created',
      fileSize: 1024,
      extractedText: JSON.stringify(defaultData),
      structuredData: defaultData,
      latestScore: analysis.overallScore,
      latestAnalysis: analysis,
      activeVersionId: initialVersion.id,
      versions: [initialVersion]
    });

    await resume.save();

    return this.toResumeDocument(resume);
  }

  /**
   * Apply approved changes (Explicit Permission-Based Alteration)
   * Saves as a new immutable version without mutating original!
   */
  public static async applyApprovedChanges(
    userId: string,
    resumeId: string,
    approvedSuggestions: ImprovementSuggestion[],
    versionName = 'AI Enhanced Version'
  ): Promise<{ resume: ResumeDocument; newVersion: ResumeVersion }> {
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      throw new Error('Resume not found or access denied.');
    }

    // Clone current structured data
    const updatedData: StructuredResumeData = JSON.parse(JSON.stringify(resume.structuredData));

    const changeRecords: Array<{
      suggestionId: string;
      section: string;
      original: string;
      approved: string;
      timestamp: string;
    }> = [];

    // Apply each approved suggestion
    for (const sugg of approvedSuggestions) {
      const chosenText = sugg.modifiedUserText || sugg.suggestedText;

      if (sugg.section === 'summary') {
        changeRecords.push({
          suggestionId: sugg.id,
          section: 'Summary',
          original: updatedData.summary,
          approved: chosenText,
          timestamp: new Date().toISOString()
        });
        updatedData.summary = chosenText;
      } else if (sugg.section === 'experience' && sugg.targetItemIndex !== undefined) {
        if (updatedData.experience[sugg.targetItemIndex]) {
          const orig = updatedData.experience[sugg.targetItemIndex].highlights[0] || sugg.originalText;
          updatedData.experience[sugg.targetItemIndex].highlights[0] = chosenText;
          changeRecords.push({
            suggestionId: sugg.id,
            section: `Experience (${updatedData.experience[sugg.targetItemIndex].role})`,
            original: orig,
            approved: chosenText,
            timestamp: new Date().toISOString()
          });
        }
      } else if (sugg.section === 'projects' && sugg.targetItemIndex !== undefined) {
        if (updatedData.projects[sugg.targetItemIndex]) {
          const orig = updatedData.projects[sugg.targetItemIndex].highlights[0] || sugg.originalText;
          updatedData.projects[sugg.targetItemIndex].highlights[0] = chosenText;
          changeRecords.push({
            suggestionId: sugg.id,
            section: `Project (${updatedData.projects[sugg.targetItemIndex].title})`,
            original: orig,
            approved: chosenText,
            timestamp: new Date().toISOString()
          });
        }
      }
    }

    // Re-score the new version
    const newAnalysis = await AIProviderService.analyzeResume(updatedData);

    const newVersionNumber = (resume.versions?.length || 1) + 1;
    const newVersion: ResumeVersion = {
      id: new mongoose.Types.ObjectId().toString(),
      versionNumber: newVersionNumber,
      versionName: `${versionName} (v${newVersionNumber})`,
      templateId: (resume.versions[resume.versions.length - 1]?.templateId) || 'modern-professional',
      structuredContent: updatedData,
      changeSummary: `Applied ${approvedSuggestions.length} approved improvements. Score increased to ${newAnalysis.overallScore}/100.`,
      approvedChanges: changeRecords,
      createdAt: new Date().toISOString()
    };

    resume.versions.push(newVersion);
    resume.activeVersionId = newVersion.id;
    resume.structuredData = updatedData;
    resume.latestScore = newAnalysis.overallScore;
    resume.latestAnalysis = newAnalysis;

    await resume.save();

    return {
      resume: this.toResumeDocument(resume),
      newVersion
    };
  }

  /**
   * Restore previous version
   */
  public static async restoreVersion(userId: string, resumeId: string, versionId: string): Promise<ResumeDocument> {
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      throw new Error('Resume not found or access denied.');
    }

    const targetVersion = resume.versions.find((v) => v.id === versionId);
    if (!targetVersion) {
      throw new Error('Target version not found.');
    }

    resume.activeVersionId = targetVersion.id;
    resume.structuredData = targetVersion.structuredContent;

    const analysis = await AIProviderService.analyzeResume(targetVersion.structuredContent);
    resume.latestScore = analysis.overallScore;
    resume.latestAnalysis = analysis;

    await resume.save();

    return this.toResumeDocument(resume);
  }

  /**
   * Update structured resume content directly from interactive builder
   */
  public static async updateContent(
    userId: string,
    resumeId: string,
    content: StructuredResumeData,
    templateId?: string
  ): Promise<ResumeDocument> {
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      throw new Error('Resume not found or access denied.');
    }

    resume.structuredData = content;
    const analysis = await AIProviderService.analyzeResume(content);
    resume.latestScore = analysis.overallScore;
    resume.latestAnalysis = analysis;

    // Update active version if present
    if (resume.activeVersionId) {
      const v = resume.versions.find((ver) => ver.id === resume.activeVersionId);
      if (v) {
        v.structuredContent = content;
        if (templateId) v.templateId = templateId;
      }
    }

    await resume.save();

    return this.toResumeDocument(resume);
  }

  /**
   * Re-run analysis on an existing resume
   */
  public static async reAnalyze(userId: string, resumeId: string): Promise<ResumeAnalysisResult> {
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      throw new Error('Resume not found or access denied.');
    }

    const analysis = await AIProviderService.analyzeResume(resume.structuredData, resume.extractedText);
    resume.latestScore = analysis.overallScore;
    resume.latestAnalysis = analysis;
    await resume.save();

    return analysis;
  }

  /**
   * Get all resumes for user
   */
  public static async getUserResumes(userId: string): Promise<ResumeDocument[]> {
    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });
    return resumes.map((r) => this.toResumeDocument(r));
  }

  /**
   * Get resume by id with ownership enforcement
   */
  public static async getResumeById(userId: string, resumeId: string): Promise<ResumeDocument> {
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      throw new Error('Resume not found or access denied.');
    }
    return this.toResumeDocument(resume);
  }

  /**
   * Delete resume and purge underlying uploaded file
   */
  public static async deleteResume(userId: string, resumeId: string): Promise<void> {
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      throw new Error('Resume not found or access denied.');
    }

    // Delete uploaded file if present
    if (resume.secureStorageKey) {
      const filePath = path.join(__dirname, '../../uploads', resume.secureStorageKey);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn(`Could not delete file ${filePath}:`, e);
        }
      }
    }

    await Resume.deleteOne({ _id: resumeId, userId });
  }

  private static toResumeDocument(resume: IResume): ResumeDocument {
    return {
      id: resume._id.toString(),
      userId: resume.userId.toString(),
      originalFilename: resume.originalFilename,
      fileType: resume.fileType,
      fileSize: resume.fileSize,
      extractedText: resume.extractedText,
      structuredData: resume.structuredData,
      latestScore: resume.latestScore,
      activeVersionId: resume.activeVersionId,
      versions: resume.versions,
      createdAt: resume.createdAt.toISOString(),
      updatedAt: resume.updatedAt.toISOString()
    };
  }
}
