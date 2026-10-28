import React from 'react';
import { ShieldCheck, Cpu, Sparkles, FileText, CheckCircle2, ArrowRight, Lock, Eye, Award } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 py-6 text-slate-200">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About CareerPilot AI</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          AI-Powered Resume Evaluation &amp; Improvement
        </h1>
        <p className="text-base sm:text-lg text-slate-300 italic font-medium">
          &ldquo;Build a stronger resume. Discover your potential. Prepare for your next opportunity.&rdquo;
        </p>
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
          CareerPilot AI is an intelligent, privacy-first career intelligence platform engineered to help job seekers, fresh graduates, and experienced professionals optimize their resumes for modern Applicant Tracking Systems (ATS) and human technical recruiters.
        </p>
      </div>

      {/* Core Privacy & Architecture Commitment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">100% In-Browser Privacy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your resume is processed entirely in your browser's temporary working memory. No mandatory sign-up, no passwords, and zero persistence to third-party databases.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Truthful &amp; Unfabricated</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We never fabricate fake work experience, degrees, certifications, or numerical achievements. All suggestions and scores are derived strictly from your genuine qualifications.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center border border-violet-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">User-Approved Edits</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The platform never silently overwrites your work. You review, approve, edit, or reject every improvement individually with full versioning and instant 1-click restore.
          </p>
        </div>
      </div>

      {/* Transparent Scoring Methodology */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Eye className="w-6 h-6 text-indigo-400" />
            <span>Transparent 6-Category Evaluation Methodology</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            We evaluate your resume across 6 fundamental criteria. We never claim to reproduce the secret algorithm of any single employer, but rather follow universally established recruiting standards:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white">1. Content Quality</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">Weight: 20%</span>
            </div>
            <p className="text-slate-400 leading-normal">
              Evaluates decisive action verb usage, professional tone, and depth of technical communication across bullet points.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white">2. Section Completeness</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">Weight: 15%</span>
            </div>
            <p className="text-slate-400 leading-normal">
              Checks presence of critical sections: Contact Details, Summary, Experience, Education, Skills, and Projects.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white">3. Skills Relevance</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">Weight: 20%</span>
            </div>
            <p className="text-slate-400 leading-normal">
              Assesses the breadth, categorization, and density of technical tools, programming languages, and industry frameworks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white">4. Experience &amp; Projects</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">Weight: 20%</span>
            </div>
            <p className="text-slate-400 leading-normal">
              Validates that accomplishments are supported by measurable outcomes, percentages, scale indicators, and deliverables.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white">5. Readability &amp; Brevity</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">Weight: 10%</span>
            </div>
            <p className="text-slate-400 leading-normal">
              Analyzes bullet length, scannability, and structural clarity so recruiters can parse your qualifications in seconds.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white">6. ATS Formatting</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">Weight: 15%</span>
            </div>
            <p className="text-slate-400 leading-normal">
              Ensures universal heading terminology, parseable contact metadata, and absence of table artifacts that break ATS parsers.
            </p>
          </div>
        </div>
      </div>

      {/* Two Operating Modes Explained */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Cpu className="w-6 h-6 text-violet-400" />
          <span>Processing Modes</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/20 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-bold text-white">Mode A: Local Deterministic Engine (Default)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Active right now in your browser. Uses deterministic parsing heuristics, regex keyword boundary detection, action verb indices, and structural scoring rules. Works 100% offline without needing API keys.
            </p>
            <div className="text-[11px] text-emerald-400 font-medium">✓ Instant • Private • Always Available</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-indigo-500/20 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <h3 className="text-sm font-bold text-white">Mode B: Optional External AI Provider</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If a server-side AI provider is configured with secret credentials, deep contextual rewrites can be streamed. We never expose private AI keys in client-side code and clearly label when local deterministic analysis is active.
            </p>
            <div className="text-[11px] text-indigo-300 font-medium">✓ Deep Context • Role Adaptations</div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/80 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white">Ready to inspect your resume?</h3>
          <p className="text-xs text-slate-300 mt-1">Upload your PDF or Word document for instant, comprehensive evaluation.</p>
        </div>
        <button
          onClick={() => onNavigate('analyze')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white shadow-xl shadow-indigo-500/25 flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
        >
          <span>Analyze My Resume Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
