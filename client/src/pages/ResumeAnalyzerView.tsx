import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  FileCheck,
  RefreshCw,
  Search,
  Zap,
  Info,
  XCircle,
  HelpCircle,
  Briefcase,
  Layers,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';

interface ResumeAnalyzerViewProps {
  onNavigate: (tab: string) => void;
}

export const ResumeAnalyzerView: React.FC<ResumeAnalyzerViewProps> = ({ onNavigate }) => {
  const {
    activeResume,
    activeAnalysis,
    localAnalysis,
    uploading,
    uploadStage,
    uploadError,
    clearUploadError,
    uploadResume,
    cancelUpload,
    clearResume,
    targetRole,
    setTargetRole
  } = useResume();

  const [dragActive, setDragActive] = useState(false);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Optional manual job description comparison state
  const [showJobMatcher, setShowJobMatcher] = useState(false);
  const [customJobDesc, setCustomJobDesc] = useState('');
  const [jobMatchResult, setJobMatchResult] = useState<{
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
  } | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    clearUploadError();
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx' && ext !== 'doc' && ext !== 'txt') {
      alert('Invalid file format. Please upload a PDF (.pdf) or Word document (.docx).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit. Please upload a smaller document.');
      return;
    }
    setStagedFile(file);
  };

  const handleStartEvaluation = async () => {
    if (!stagedFile) return;
    try {
      await uploadResume(stagedFile);
      setStagedFile(null);
    } catch (err) {
      console.error('Evaluation failed:', err);
    }
  };

  const handleCustomJobCompare = () => {
    if (!customJobDesc.trim() || !activeResume) return;

    const resumeSkills = [
      ...(activeResume.structuredData.skills?.technical || []),
      ...(activeResume.structuredData.skills?.tools || [])
    ].map((s) => s.toLowerCase());

    const words = customJobDesc
      .toLowerCase()
      .split(/[^a-zA-Z0-9#+.-]+/)
      .filter((w) => w.length > 2);

    const commonTechTerms = [
      'react', 'node.js', 'typescript', 'javascript', 'python', 'sql', 'postgresql', 'mongodb',
      'docker', 'kubernetes', 'aws', 'git', 'rest api', 'graphql', 'html', 'css', 'tailwind',
      'java', 'c++', 'c#', 'linux', 'agile', 'scrum', 'ci/cd', 'figma'
    ];

    const jobKeywords = commonTechTerms.filter((term) => customJobDesc.toLowerCase().includes(term));
    const matched = jobKeywords.filter((k) => resumeSkills.some((s) => s.includes(k) || k.includes(s)));
    const missing = jobKeywords.filter((k) => !matched.includes(k));

    const score = jobKeywords.length > 0 ? Math.round((matched.length / jobKeywords.length) * 100) : 70;

    setJobMatchResult({
      score: Math.min(95, Math.max(25, score)),
      matchedSkills: matched.map((s) => s.toUpperCase()),
      missingSkills: missing.map((s) => s.toUpperCase())
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              AI Resume Screening &amp; Evaluation
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
              6-Category Analysis
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Deterministic in-browser text extraction, ATS parsing compliance, and personalized career role compatibility.
          </p>
        </div>

        {activeResume && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('improve')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
            >
              <span>Improve Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={clearResume}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 flex items-center gap-1"
              title="Remove resume from session"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Upload Error Banner with Retry */}
      {uploadError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-shake">
          <div className="flex items-start gap-2.5">
            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-rose-300 block mb-0.5">Upload &amp; Evaluation Issue</strong>
              <span>{uploadError}</span>
            </div>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold shrink-0 self-start sm:self-auto transition-colors"
          >
            Retry Upload
          </button>
        </div>
      )}

      {/* Upload Zone & Staged File Preview */}
      <div className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        {!stagedFile && !uploading && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                : 'border-slate-300 dark:border-white/15 bg-white/50 dark:bg-slate-900/60 hover:border-indigo-500/50 hover:bg-indigo-500/5'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-inner">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Drag &amp; Drop your Resume here, or <span className="text-indigo-600 dark:text-indigo-400 underline">browse files</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Supports PDF (.pdf) and Word (.docx) documents up to 10MB.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  100% In-Browser &amp; Private
                </span>
                <span>•</span>
                <span>Zero Database Storage</span>
                <span>•</span>
                <span>Original File Preserved</span>
              </div>
            </div>
          </div>
        )}

        {/* Staged File Confirmation State */}
        {stagedFile && !uploading && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{stagedFile.name}</h4>
                  <p className="text-xs text-slate-400">
                    {(stagedFile.size / 1024).toFixed(1)} KB • Ready to analyze your resume.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStagedFile(null)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Change File
                </button>
                <button
                  onClick={handleStartEvaluation}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Evaluate Resume</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Processing Progress Bar with Stage Indicators & Cancel Option */}
        {uploading && (
          <div className="p-8 rounded-2xl bg-slate-900 border border-indigo-500/30 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Analyzing Resume Content...</h4>
              <p className="text-xs font-mono text-indigo-300">{uploadStage || 'Processing document...'}</p>
            </div>
            {/* Visual 5-Stage Stepper */}
            <div className="max-w-md mx-auto grid grid-cols-5 gap-2 pt-2">
              {[
                { step: 1, label: 'Read' },
                { step: 2, label: 'Extract' },
                { step: 3, label: 'Parse' },
                { step: 4, label: 'Score' },
                { step: 5, label: 'Match' }
              ].map(({ step, label }) => {
                const currentStageNum = parseInt(uploadStage?.[0] || '1', 10);
                const isDone = currentStageNum > step;
                const isCurrent = currentStageNum === step;
                return (
                  <div key={step} className="flex flex-col items-center gap-1">
                    <div
                      className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                        isDone
                          ? 'bg-emerald-500'
                          : isCurrent
                          ? 'bg-indigo-500 animate-pulse'
                          : 'bg-slate-700'
                      }`}
                    />
                    <span
                      className={`text-[10px] font-medium ${
                        isDone
                          ? 'text-emerald-400'
                          : isCurrent
                          ? 'text-indigo-300 font-bold'
                          : 'text-slate-500'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={cancelUpload}
                className="px-4 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              >
                Cancel Analysis
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Analysis Results Dashboard */}
      {activeResume && localAnalysis && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Score Banner */}
          <div className="rounded-3xl bg-slate-900/90 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Overall Score Circle (4 cols) */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Overall Resume Quality Score
              </span>
              <div className="relative flex items-center justify-center">
                <div
                  className={`w-32 h-32 rounded-full border-8 flex flex-col items-center justify-center ${
                    localAnalysis.overallScore >= 80
                      ? 'border-emerald-500 shadow-lg shadow-emerald-500/20'
                      : localAnalysis.overallScore >= 65
                      ? 'border-indigo-500 shadow-lg shadow-indigo-500/20'
                      : 'border-amber-500 shadow-lg shadow-amber-500/20'
                  }`}
                >
                  <span className="text-4xl font-black text-white">{localAnalysis.overallScore}</span>
                  <span className="text-xs font-semibold text-slate-400">/ 100</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Grade {localAnalysis.grade}
                </span>
                <span className="text-xs text-slate-400 font-medium">ATS Screened</span>
              </div>
            </div>

            {/* Verdict and Next Steps (8 cols) */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Executive Screening Summary</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  {localAnalysis.summaryVerdict}
                </p>
              </div>

              {/* Detected Sections Checklist */}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                  Identified Resume Sections:
                </span>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {[
                    ['Contact Info', Boolean(activeResume.structuredData.contact.email)],
                    ['Summary', Boolean(activeResume.structuredData.summary)],
                    ['Work Experience', Boolean(activeResume.structuredData.experience?.length)],
                    ['Education', Boolean(activeResume.structuredData.education?.length)],
                    ['Technical Skills', Boolean(activeResume.structuredData.skills?.technical?.length)],
                    ['Projects', Boolean(activeResume.structuredData.projects?.length)],
                    ['Certifications', Boolean(activeResume.structuredData.certifications?.length)],
                    ['Achievements', Boolean(activeResume.structuredData.achievements?.length)]
                  ].map(([label, found], i) => (
                    <span
                      key={i}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                        found
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-500 border border-white/5 line-through'
                      }`}
                    >
                      {found ? '✓' : '✗'} {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => onNavigate('improve')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 flex items-center gap-1.5"
                >
                  <span>Improve Resume with Smart Suggestions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('templates')}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700"
                >
                  Explore Compatible Templates
                </button>
              </div>
            </div>
          </div>

          {/* 6 Category Scores Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span>Category Breakdown &amp; Performance</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {localAnalysis.categories.map((cat, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-white text-xs">{cat.name}</span>
                      <span className="text-[10px] font-mono font-semibold text-slate-400">
                        Weight: {cat.weight}%
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-black text-white">{cat.score}</span>
                      <span className="text-xs text-slate-400">/ 100</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full ${
                          cat.score >= 80 ? 'bg-emerald-500' : cat.score >= 60 ? 'bg-indigo-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">{cat.description}</p>
                  </div>

                  <span
                    className={`self-start text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      cat.status === 'excellent'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : cat.status === 'good'
                        ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}
                  >
                    {cat.status.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Weaknesses 2-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-emerald-500/20 space-y-4">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Identified Strengths ({localAnalysis.strengths.length})</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {localAnalysis.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-amber-500/20 space-y-4">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Areas for Improvement ({localAnalysis.weaknesses.length})</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {localAnalysis.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">!</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Recommendations List */}
          {localAnalysis.recommendations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400" />
                <span>Actionable Recommendations</span>
              </h3>

              <div className="space-y-3">
                {localAnalysis.recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300">
                          {rec.category}
                        </span>
                        <span className="font-bold text-white text-sm">{rec.issue}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">Section: {rec.section}</span>
                    </div>

                    <p className="text-slate-300 leading-relaxed">
                      <strong className="text-indigo-300 font-semibold">Why it matters: </strong>
                      {rec.whyItMatters}
                    </p>

                    <p className="text-slate-300 leading-relaxed">
                      <strong className="text-emerald-300 font-semibold">How to improve: </strong>
                      {rec.howToImprove}
                    </p>

                    {rec.concreteExample && (
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 text-slate-400 font-sans italic text-[11px]">
                        <strong className="text-slate-200 not-italic font-semibold">Example: </strong>
                        &ldquo;{rec.concreteExample}&rdquo;
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Job-Role Recommendations Engine */}
          <div className="space-y-6 pt-4 border-t border-white/10">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <span>Personalized Career Role Recommendations</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Roles tailored to your actual skills, experience, and projects. Compatibility is an estimate, not a hiring prediction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {localAnalysis.roleRecommendations.map((role, idx) => {
                const isSelected = targetRole === role.roleTitle;
                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl bg-slate-900/80 border transition-all flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 bg-indigo-950/20'
                        : 'border-white/10 hover:border-indigo-500/30'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-base font-bold text-white">{role.roleTitle}</h4>
                          <span className="text-[10px] text-slate-400 font-medium">Match Level: {role.matchLevel}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-indigo-400">{role.compatibilityScore}%</span>
                          <span className="block text-[9px] uppercase font-bold text-slate-500">Compatibility</span>
                        </div>
                      </div>

                      {/* Matching Skills */}
                      {role.matchingSkills.length > 0 && (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                            Matching Skills ({role.matchingSkills.length})
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {role.matchingSkills.map((s, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Missing Skills */}
                      {role.missingSkills.length > 0 && (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                            Potential Skill Gaps to Learn
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {role.missingSkills.map((s, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggested Next Steps */}
                      {role.suggestedNextSteps.length > 0 && (
                        <div className="pt-1 text-[11px] text-slate-400 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Next Steps:</span>
                          <p className="leading-snug">{role.suggestedNextSteps[0]}</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setTargetRole(isSelected ? null : role.roleTitle);
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {isSelected ? '✓ Selected as Target Role' : 'Set as Target Role'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Optional Specific Job Description Matcher */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
              <div
                className="flex justify-between items-center cursor-pointer select-none"
                onClick={() => setShowJobMatcher(!showJobMatcher)}
              >
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-indigo-400" />
                    <span>Compare with a Specific Job Description (Optional)</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Paste a job description text to test compatibility against your resume.
                  </p>
                </div>
                <button className="text-slate-400 hover:text-white p-1">
                  {showJobMatcher ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {showJobMatcher && (
                <div className="space-y-4 pt-2">
                  <textarea
                    rows={4}
                    placeholder="Paste job description text here (e.g. requirements, responsibilities, desired technical stack)..."
                    value={customJobDesc}
                    onChange={(e) => setCustomJobDesc(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleCustomJobCompare}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-500/25"
                    >
                      Compare Resume with Description
                    </button>
                  </div>

                  {jobMatchResult && (
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="font-bold text-white text-sm">Job Description Match Score</span>
                        <span className="text-lg font-black text-indigo-400">{jobMatchResult.score}%</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="font-bold text-emerald-400 block mb-1">
                            Skills You Demonstrate ({jobMatchResult.matchedSkills.length})
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {jobMatchResult.matchedSkills.map((s, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px]">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-bold text-amber-400 block mb-1">
                            Job Requirements to Address ({jobMatchResult.missingSkills.length})
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {jobMatchResult.missingSkills.map((s, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px]">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
