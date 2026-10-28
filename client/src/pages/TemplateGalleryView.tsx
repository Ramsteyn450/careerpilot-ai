import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  Eye,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Palette,
  X
} from 'lucide-react';
import { SEED_TEMPLATES } from '../../../server/src/seed/seedData';
import { ResumeTemplateConfig, StructuredResumeData } from '../../../shared/types';
import { TemplateRenderer } from '../components/templates/TemplateRenderer';
import { useResume } from '../context/ResumeContext';
import { Search } from 'lucide-react';

const SAMPLE_DATA: StructuredResumeData = {
  contact: {
    fullName: 'Alex Morgan',
    email: 'alex.morgan@careerpilot.ai',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    linkedinUrl: 'https://linkedin.com/in/alexmorgan',
    githubUrl: 'https://github.com/alexmorgan'
  },
  summary: 'Results-driven software engineer and technical leader with 6+ years of experience designing scalable distributed web platforms, high-throughput microservices, and reactive user interfaces.',
  skills: {
    technical: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'Python', 'GraphQL'],
    soft: ['Technical Leadership', 'Cross-Functional Collaboration', 'Agile / Scrum', 'System Architecture'],
    tools: ['Git', 'VS Code', 'GitHub Actions', 'Postman', 'Terraform', 'Jira']
  },
  experience: [
    {
      id: 'exp-1',
      role: 'Senior Full-Stack Engineer',
      company: 'CloudScale Technologies',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      highlights: [
        'Architected high-concurrency microservices reducing average server latency by 35% across 2M daily active requests.',
        'Led engineering squad delivering reactive TypeScript/React dashboard components improving customer satisfaction by 24%.'
      ]
    },
    {
      id: 'exp-2',
      role: 'Software Engineer',
      company: 'Apex Systems',
      location: 'Austin, TX',
      startDate: '2019',
      endDate: '2022',
      current: false,
      highlights: [
        'Developed REST and GraphQL endpoints backed by PostgreSQL database with automated migration pipelines.',
        'Refactored legacy data synchronization layer, eliminating synchronization errors and decreasing API response time.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2015',
      endDate: '2019',
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
        'Engineered high-throughput fault-tolerant file storage system with client-side chunking and AES-256 encryption.',
        'Benchmarked concurrent streaming pipelines achieving 1.2 GB/s data transfer rates with zero data corruption.'
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
    'Published open-source library with 1,500+ GitHub stars.',
    'First Place Winner at National Collegiate Hackathon.'
  ],
  languages: ['English (Native)', 'Spanish (Conversational)']
};

interface TemplateGalleryViewProps {
  onSelectTemplate: (templateId: string) => void;
}

export const TemplateGalleryView: React.FC<TemplateGalleryViewProps> = ({ onSelectTemplate }) => {
  const { activeResume } = useResume();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplateConfig | null>(null);

  const categories = [
    'All',
    'Software Developer',
    'Full-Stack Developer',
    'Frontend Developer',
    'Data Science & Analytics',
    'Cloud Engineer',
    'UI/UX Designer',
    'Fresher Resume',
    'Academic Resume'
  ];

  const filtered = SEED_TEMPLATES.filter((t) => {
    const matchesCat =
      selectedCategory === 'All' || t.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesQuery =
      !searchQuery.trim() ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.targetRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <span>Role-Specific Resume Template Library</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              12 ATS-Friendly Layouts
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Engineered for high readability, modern aesthetic balance, and 100% parsing accuracy across major Applicant Tracking Systems.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates or roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900/80 border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of 12 Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="group rounded-2xl bg-slate-900/70 border border-white/10 hover:border-indigo-500/40 overflow-hidden transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between"
          >
            {/* Visual Header / Thumbnail */}
            <div
              className="h-48 p-5 flex flex-col justify-between relative overflow-hidden"
              style={{ backgroundColor: `${t.thumbnailColor}18` }}
            >
              <div className="flex justify-between items-start z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/90 text-white border border-white/10">
                  {t.styleName}
                </span>
                <div
                  className="w-4 h-4 rounded-full border border-white/30"
                  style={{ backgroundColor: t.defaultAccent }}
                  title={`Default Accent: ${t.defaultAccent}`}
                />
              </div>

              {/* Simulated resume document wireframe */}
              <div className="bg-white/95 rounded-t-lg p-3 mx-4 shadow-lg border border-slate-200 text-left space-y-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                <div className="w-1/3 h-2 rounded bg-slate-800" />
                <div className="w-1/2 h-1 rounded" style={{ backgroundColor: t.defaultAccent }} />
                <div className="w-full h-1 rounded bg-slate-200" />
                <div className="w-4/5 h-1 rounded bg-slate-200" />
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {t.name}
                </h3>
                <p className="text-xs text-indigo-300 font-medium mt-0.5">{t.targetRole}</p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{t.description}</p>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-3">
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="truncate">{t.atsFriendlinessNote}</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setPreviewTemplate(t)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Live Preview</span>
                  </button>
                  <button
                    onClick={() => onSelectTemplate(t.id)}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-1"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="max-w-4xl w-full my-8 rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-white/10 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{previewTemplate.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {previewTemplate.styleName}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{previewTemplate.targetRole} • {previewTemplate.atsFriendlinessNote}</p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Document Preview Box */}
            <div className="flex-1 overflow-y-auto rounded-xl bg-slate-950 p-4 border border-white/5">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-2xl mx-auto">
                <TemplateRenderer
                  templateId={previewTemplate.id}
                  data={activeResume?.structuredData || SAMPLE_DATA}
                  accentColor={previewTemplate.defaultAccent}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 border-t border-white/10 shrink-0">
              <span className="text-xs text-slate-400">
                Recommended For: <strong className="text-slate-200">{previewTemplate.recommendedFor.join(', ')}</strong>
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    const id = previewTemplate.id;
                    setPreviewTemplate(null);
                    onSelectTemplate(id);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/30 flex items-center gap-1.5 transition-all"
                >
                  <span>Select &amp; Edit in Builder</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
