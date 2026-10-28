import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Briefcase,
  Zap,
  Cpu,
  Layers,
  Wand2,
  LayoutTemplate,
  Lock,
  Download,
  UploadCloud
} from 'lucide-react';

interface LandingPageProps {
  onAnalyzeResume: () => void;
  onExploreTemplates: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onAnalyzeResume,
  onExploreTemplates
}) => {
  return (
    <div className="w-full min-h-screen text-slate-100 bg-grid-pattern">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/20 to-blue-600/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs font-semibold text-slate-300 shadow-lg shadow-indigo-500/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI-Powered Resume Evaluation &amp; Improvement</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight">
            Your Resume, <br />
            <span className="bg-gradient-to-r from-white via-indigo-200 to-violet-400 bg-clip-text text-transparent">
              Upgraded with AI.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            Analyze your resume, discover suitable career paths, identify missing skills, and improve your professional profile with intelligent, actionable recommendations.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onAnalyzeResume}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm sm:text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
            >
              <span>Analyze My Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreTemplates}
              className="w-full sm:w-auto px-7 py-4 rounded-xl text-sm sm:text-base font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-indigo-500/40 shadow-sm transition-all"
            >
              Explore Resume Templates
            </button>
          </div>

          {/* Tagline */}
          <div className="pt-2 text-xs text-slate-400 font-medium">
            &ldquo;Build a stronger resume. Discover your potential. Prepare for your next opportunity.&rdquo;
          </div>

          {/* Interactive Document Preview Mockup */}
          <div className="pt-10 max-w-4xl mx-auto">
            <div className="rounded-2xl bg-slate-900/90 border border-white/15 p-6 shadow-2xl backdrop-blur-xl text-left grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left col: Score & Category bars */}
              <div className="md:col-span-5 space-y-4 pr-0 md:pr-4 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Resume Quality Score</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-4xl font-black text-white">88</span>
                      <span className="text-sm font-semibold text-indigo-300">/ 100</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">Grade A</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-lg">
                    ATS
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">Skills Relevance</span>
                      <span className="text-emerald-400 font-mono font-bold">92%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">Content Quality</span>
                      <span className="text-indigo-400 font-mono font-bold">85%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">ATS Formatting</span>
                      <span className="text-violet-400 font-mono font-bold">90%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right col: Insights & Role Recommendation */}
              <div className="md:col-span-7 space-y-3.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Top Career Match: Full-Stack Developer (85% Match)</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Strong alignment across React, Node.js, and SQL. 2 high-impact skills identified to bridge to 95% compatibility.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Actionable Suggestion Available</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Quantify performance outcomes in your CloudScale project bullet points to enhance competitive recruiter visibility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Cards */}
      <section className="py-16 border-t border-white/10 bg-slate-950/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Intelligent Career Engineering
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Designed exclusively for resume analysis, objective screening, role matching, and user-approved enhancement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-indigo-500/40 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">AI Resume Evaluation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evaluate resume content, section completeness, technical skills, project depth, readability, and ATS parsing compatibility.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-semibold text-indigo-400">6-category objective scoring →</div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-indigo-500/40 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center border border-violet-500/20">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Career Role Recommendations</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Discover suitable job roles based on your actual skills, education, experience, and projects with transparent skill gap analysis.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-semibold text-violet-400">Personalized compatibility →</div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-indigo-500/40 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-500/20">
                  <Wand2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Smart Resume Improvement</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Identify weak descriptions and receive stronger, action-oriented alternatives for user review, approval, or rejection.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-semibold text-pink-400">100% permission-based →</div>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-indigo-500/40 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <LayoutTemplate className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Professional Resume Templates</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Choose from 12 distinct, role-tailored resume layouts engineered for 100% readability across major recruitment ATS parsers.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-semibold text-emerald-400">12 unique layout engines →</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (4 Steps) */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              How CareerPilot AI Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              A streamlined 4-step workflow to evaluate and polish your resume in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3 relative">
              <div className="text-3xl font-black text-indigo-500/40 font-mono">01</div>
              <h3 className="text-base font-bold text-white">Upload your resume</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drop your current PDF or DOCX file. The text is parsed securely in your browser without saving to third-party databases.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3 relative">
              <div className="text-3xl font-black text-indigo-500/40 font-mono">02</div>
              <h3 className="text-base font-bold text-white">Review your evaluation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive an instant 0-100 quality score, category-level strengths, identified weaknesses, and suitable career role matches.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3 relative">
              <div className="text-3xl font-black text-indigo-500/40 font-mono">03</div>
              <h3 className="text-base font-bold text-white">Improve your resume</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspect side-by-side smart suggestions. Accept, reject, or edit recommendations with complete control over your content.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3 relative">
              <div className="text-3xl font-black text-indigo-500/40 font-mono">04</div>
              <h3 className="text-base font-bold text-white">Download updated resume</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pick from 12 role-specific templates, preview your live document, and export a clean text-based PDF ready for job applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="border-t border-white/10 py-10 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">CareerPilot AI</span>
            <span>—</span>
            <span>AI-Powered Resume Evaluation &amp; Improvement</span>
          </div>
          <div className="flex items-center gap-6 text-[11px]">
            <span>100% In-Browser Privacy</span>
            <span>Zero Remote Storage</span>
            <span>Applicant Tracking System Optimized</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
