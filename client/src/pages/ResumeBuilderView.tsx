import React, { useState } from 'react';
import {
  Save,
  Download,
  Sparkles,
  Plus,
  Trash2,
  Undo2,
  Redo2,
  Eye,
  FileText,
  CheckCircle2,
  ChevronDown,
  Layers,
  ZoomIn,
  ZoomOut,
  Palette,
  RotateCcw,
  Zap,
  Briefcase
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { StructuredResumeData, WorkExperienceItem, EducationItem, ProjectItem } from '../../../shared/types';
import { SEED_TEMPLATES } from '../../../server/src/seed/seedData';
import { TemplateRenderer } from '../components/templates/TemplateRenderer';

interface ResumeBuilderViewProps {
  onNavigate: (tab: string) => void;
  initialTemplateId?: string;
}

export const ResumeBuilderView: React.FC<ResumeBuilderViewProps> = ({ onNavigate, initialTemplateId }) => {
  const { activeResume, updateActiveContent, originalData, localAnalysis, targetRole } = useResume();

  const [formData, setFormData] = useState<StructuredResumeData>(
    activeResume?.structuredData || {
      contact: {
        fullName: 'Alex Morgan',
        email: 'alex@example.com',
        phone: '+1 (555) 019-2834',
        location: 'San Francisco, CA',
        linkedinUrl: 'https://linkedin.com/in/alexmorgan',
        githubUrl: 'https://github.com/alexmorgan'
      },
      summary: 'Passionate and results-driven Software Engineer with extensive experience developing resilient web architectures, modern cloud solutions, and reactive user interfaces.',
      skills: {
        technical: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'Git'],
        soft: ['Problem Solving', 'Agile & Scrum', 'Cross-functional Collaboration'],
        tools: ['VS Code', 'GitHub', 'Postman']
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
            'Architected scalable backend microservices reducing server latency by 35%.',
            'Led development of responsive frontend interfaces using React and TypeScript.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'University of Science & Technology',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2018',
          endDate: '2022',
          gradeGpa: '3.85 / 4.0'
        }
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'Distributed Cloud Storage Platform',
          toolsUsed: ['Go', 'Docker', 'PostgreSQL'],
          highlights: [
            'Designed high-throughput fault-tolerant file storage with AES-256 encryption.',
            'Benchmarked streaming upload speeds achieving 1.2 GB/s data transfer rates.'
          ]
        }
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          year: '2023'
        }
      ],
      achievements: [
        'Published open-source library with 1,500+ GitHub stars.',
        '1st Place Winner at National Collegiate Hackathon.'
      ],
      languages: ['English (Native)', 'Spanish (Conversational)']
    }
  );

  const [activeTemplateId, setActiveTemplateId] = useState<string>(() => {
    return initialTemplateId || activeResume?.versions?.[activeResume.versions.length - 1]?.templateId || 'modern-professional';
  });
  const [zoomLevel, setZoomLevel] = useState(100);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [activeSection, setActiveSection] = useState<'contact' | 'summary' | 'experience' | 'education' | 'projects' | 'skills' | 'certifications'>('contact');
  const [accentColor, setAccentColor] = useState(() => {
    const tId = initialTemplateId || activeResume?.versions?.[activeResume.versions.length - 1]?.templateId || 'modern-professional';
    const found = SEED_TEMPLATES.find((t) => t.id === tId);
    return found?.defaultAccent || '#4f46e5';
  });

  React.useEffect(() => {
    if (initialTemplateId && initialTemplateId !== activeTemplateId) {
      setActiveTemplateId(initialTemplateId);
      const found = SEED_TEMPLATES.find((t) => t.id === initialTemplateId);
      if (found) setAccentColor(found.defaultAccent);
    }
  }, [initialTemplateId]);

  // Trigger auto-save
  const handleDataChange = (updated: StructuredResumeData) => {
    setFormData(updated);
    setSaveStatus('saving');
    setTimeout(async () => {
      await updateActiveContent(updated, activeTemplateId);
      setSaveStatus('saved');
    }, 600);
  };

  // Add work experience
  const handleAddExperience = () => {
    const newItem: WorkExperienceItem = {
      id: `exp-${Date.now()}`,
      role: 'Software Engineer',
      company: 'Tech Enterprise',
      location: 'Remote',
      startDate: '2021',
      endDate: '2023',
      current: false,
      highlights: ['Engineered key product features boosting active user retention by 20%.']
    };
    handleDataChange({
      ...formData,
      experience: [...formData.experience, newItem]
    });
  };

  const handleRemoveExperience = (id: string) => {
    handleDataChange({
      ...formData,
      experience: formData.experience.filter((e) => e.id !== id)
    });
  };

  // Add education
  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: 'State University',
      degree: 'Master of Science',
      fieldOfStudy: 'Software Engineering',
      startDate: '2020',
      endDate: '2022'
    };
    handleDataChange({
      ...formData,
      education: [...formData.education, newEdu]
    });
  };

  const handleRemoveEducation = (id: string) => {
    handleDataChange({
      ...formData,
      education: formData.education.filter((e) => e.id !== id)
    });
  };

  // Add project
  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'Full-Stack Web Application',
      toolsUsed: ['React', 'Node.js', 'PostgreSQL'],
      highlights: ['Developed end-to-end web app with secure auth and real-time updates.']
    };
    handleDataChange({
      ...formData,
      projects: [...formData.projects, newProj]
    });
  };

  const handleRemoveProject = (id: string) => {
    handleDataChange({
      ...formData,
      projects: formData.projects.filter((p) => p.id !== id)
    });
  };

  // Print PDF export
  const handlePrintPdf = () => {
    window.print();
  };

  // Export JSON
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.contact.fullName.replace(/\s+/g, '_')}_Resume.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Bar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 no-print">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>Resume Builder</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Live Preview
            </span>
          </h1>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {saveStatus === 'saving' ? 'Autosaving...' : 'All changes saved'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Template selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={activeTemplateId}
              onChange={(e) => {
                setActiveTemplateId(e.target.value);
                const t = SEED_TEMPLATES.find((x) => x.id === e.target.value);
                if (t) setAccentColor(t.defaultAccent);
              }}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              {SEED_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-slate-200">
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Color accent picker */}
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            title="Choose Accent Color"
            className="w-8 h-8 rounded-lg border border-white/10 bg-slate-900 cursor-pointer p-0.5"
          />

          <button
            onClick={() => {
              if (originalData) {
                handleDataChange(JSON.parse(JSON.stringify(originalData)));
              }
            }}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-500/40 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
            title="Restore original uploaded resume"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Restore</span>
          </button>

          <button
            onClick={handleExportJson}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            Export JSON
          </button>

          <button
            onClick={handlePrintPdf}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white shadow-md shadow-indigo-500/25 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* 3-Panel Workspace: Left Form (4 cols), Center Live Canvas (5 cols), Right Recommendations (3 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Sections & Inputs (4 cols) */}
        <div className="xl:col-span-4 rounded-2xl bg-slate-900/80 border border-white/10 p-5 shadow-xl space-y-5 max-h-[calc(100vh-160px)] overflow-y-auto no-print">
          {/* Section Selector Pills */}
          <div className="flex flex-wrap gap-1.5 pb-3 border-b border-white/10">
            {(
              [
                ['contact', 'Contact'],
                ['summary', 'Summary'],
                ['experience', 'Experience'],
                ['education', 'Education'],
                ['projects', 'Projects'],
                ['skills', 'Skills'],
                ['certifications', 'Certs']
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeSection === key
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-950/60'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Contact Fields */}
          {activeSection === 'contact' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Personal Details</h3>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.contact.fullName}
                  onChange={(e) =>
                    handleDataChange({
                      ...formData,
                      contact: { ...formData.contact, fullName: e.target.value }
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) =>
                      handleDataChange({
                        ...formData,
                        contact: { ...formData.contact, email: e.target.value }
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.contact.phone || ''}
                    onChange={(e) =>
                      handleDataChange({
                        ...formData,
                        contact: { ...formData.contact, phone: e.target.value }
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.contact.location || ''}
                    onChange={(e) =>
                      handleDataChange({
                        ...formData,
                        contact: { ...formData.contact, location: e.target.value }
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={formData.contact.linkedinUrl || ''}
                    onChange={(e) =>
                      handleDataChange({
                        ...formData,
                        contact: { ...formData.contact, linkedinUrl: e.target.value }
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Professional Summary */}
          {activeSection === 'summary' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Professional Summary</h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  {formData.summary.length} / 500 chars
                </span>
              </div>
              <textarea
                rows={5}
                value={formData.summary}
                onChange={(e) => handleDataChange({ ...formData, summary: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-xs text-white leading-relaxed focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-400">
                Tip: Include target role title, years of experience, and 1-2 quantified achievements.
              </p>
            </div>
          )}

          {/* Experience List */}
          {activeSection === 'experience' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Work Experience</h3>
                <button
                  onClick={handleAddExperience}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20 flex items-center gap-1 hover:bg-indigo-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              {formData.experience.map((exp, idx) => (
                <div key={exp.id} className="p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-300">Position #{idx + 1}</span>
                    <button
                      onClick={() => handleRemoveExperience(exp.id)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Role (e.g. Full-Stack Dev)"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].role = e.target.value;
                        handleDataChange({ ...formData, experience: updated });
                      }}
                      className="p-2 rounded bg-slate-900 border border-white/10 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].company = e.target.value;
                        handleDataChange({ ...formData, experience: updated });
                      }}
                      className="p-2 rounded bg-slate-900 border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Start Year"
                      value={exp.startDate}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].startDate = e.target.value;
                        handleDataChange({ ...formData, experience: updated });
                      }}
                      className="p-2 rounded bg-slate-900 border border-white/10 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="End Year / Present"
                      value={exp.endDate}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].endDate = e.target.value;
                        handleDataChange({ ...formData, experience: updated });
                      }}
                      className="p-2 rounded bg-slate-900 border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Highlights (One per line)</label>
                    <textarea
                      rows={3}
                      value={exp.highlights.join('\n')}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].highlights = e.target.value.split('\n').filter(Boolean);
                        handleDataChange({ ...formData, experience: updated });
                      }}
                      className="w-full p-2 rounded bg-slate-900 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education List */}
          {activeSection === 'education' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Education</h3>
                <button
                  onClick={handleAddEducation}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20 flex items-center gap-1 hover:bg-indigo-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              {formData.education.map((edu, idx) => (
                <div key={edu.id} className="p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-300">Degree #{idx + 1}</span>
                    <button
                      onClick={() => handleRemoveEducation(edu.id)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => {
                      const updated = [...formData.education];
                      updated[idx].institution = e.target.value;
                      handleDataChange({ ...formData, education: updated });
                    }}
                    className="w-full p-2 rounded bg-slate-900 border border-white/10 text-xs text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Degree / Major"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...formData.education];
                        updated[idx].degree = e.target.value;
                        handleDataChange({ ...formData, education: updated });
                      }}
                      className="p-2 rounded bg-slate-900 border border-white/10 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Graduation Year"
                      value={edu.endDate || ''}
                      onChange={(e) => {
                        const updated = [...formData.education];
                        updated[idx].endDate = e.target.value;
                        handleDataChange({ ...formData, education: updated });
                      }}
                      className="p-2 rounded bg-slate-900 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {activeSection === 'projects' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Projects</h3>
                <button
                  onClick={handleAddProject}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20 flex items-center gap-1 hover:bg-indigo-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              {formData.projects.map((proj, idx) => (
                <div key={proj.id} className="p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-300">Project #{idx + 1}</span>
                    <button
                      onClick={() => handleRemoveProject(proj.id)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Project Title"
                    value={proj.title}
                    onChange={(e) => {
                      const updated = [...formData.projects];
                      updated[idx].title = e.target.value;
                      handleDataChange({ ...formData, projects: updated });
                    }}
                    className="w-full p-2 rounded bg-slate-900 border border-white/10 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Tools used (comma separated, e.g. React, Node.js)"
                    value={proj.toolsUsed.join(', ')}
                    onChange={(e) => {
                      const updated = [...formData.projects];
                      updated[idx].toolsUsed = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                      handleDataChange({ ...formData, projects: updated });
                    }}
                    className="w-full p-2 rounded bg-slate-900 border border-white/10 text-xs text-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="Project highlights..."
                    value={proj.highlights.join('\n')}
                    onChange={(e) => {
                      const updated = [...formData.projects];
                      updated[idx].highlights = e.target.value.split('\n').filter(Boolean);
                      handleDataChange({ ...formData, projects: updated });
                    }}
                    className="w-full p-2 rounded bg-slate-900 border border-white/10 text-xs text-white"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Technical Skills */}
          {activeSection === 'skills' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Technical & Soft Skills</h3>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Technical Skills (Comma separated)
                </label>
                <textarea
                  rows={3}
                  value={formData.skills.technical.join(', ')}
                  onChange={(e) =>
                    handleDataChange({
                      ...formData,
                      skills: {
                        ...formData.skills,
                        technical: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      }
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Soft Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.skills.soft.join(', ')}
                  onChange={(e) =>
                    handleDataChange({
                      ...formData,
                      skills: {
                        ...formData.skills,
                        soft: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      }
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white"
                />
              </div>
            </div>
          )}

          {/* Certifications */}
          {activeSection === 'certifications' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Certifications</h3>
              <div className="space-y-2">
                {formData.certifications.map((cert, idx) => (
                  <div key={cert.id} className="p-3 rounded-xl bg-slate-950/70 border border-white/5 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Cert Name"
                      value={cert.name}
                      onChange={(e) => {
                        const updated = [...formData.certifications];
                        updated[idx].name = e.target.value;
                        handleDataChange({ ...formData, certifications: updated });
                      }}
                      className="p-2 rounded bg-slate-900 border border-white/10 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Issuer"
                      value={cert.issuer}
                      onChange={(e) => {
                        const updated = [...formData.certifications];
                        updated[idx].issuer = e.target.value;
                        handleDataChange({ ...formData, certifications: updated });
                      }}
                      className="p-2 rounded bg-slate-900 border border-white/10 text-xs text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center Panel: Live Document Preview (5 cols on xl, 8 on lg) */}
        <div className="xl:col-span-5 lg:col-span-8 flex flex-col items-center">
          {/* Zoom controls */}
          <div className="w-full flex justify-between items-center px-4 py-2 mb-2 bg-slate-900/60 rounded-xl border border-white/5 no-print text-xs text-slate-400">
            <span>Template: <strong className="text-white">{activeTemplateId}</strong></span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                className="p-1 hover:text-white"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px]">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(125, z + 10))}
                className="p-1 hover:text-white"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Printable Resume Sheet Canvas */}
          <div
            className="w-full bg-white text-slate-900 rounded-xl shadow-2xl print-area transition-all duration-200 overflow-hidden"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              minHeight: '840px'
            }}
          >
            <TemplateRenderer
              templateId={activeTemplateId}
              data={formData}
              accentColor={accentColor}
            />
          </div>
        </div>

        {/* Right Panel: Live Improvement Recommendations & ATS Tips (3 cols on xl, full on lg) */}
        <div className="xl:col-span-3 lg:col-span-12 rounded-2xl bg-slate-900/80 border border-white/10 p-5 shadow-xl space-y-4 max-h-[calc(100vh-160px)] overflow-y-auto no-print">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Smart Suggestions &amp; Tips</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Target Role: <strong className="text-indigo-300">{targetRole || 'Software Engineering'}</strong>
            </p>
          </div>

          {/* Quick Apply Tips */}
          <div className="space-y-3">
            {(localAnalysis?.recommendations || []).slice(0, 6).map((rec) => (
              <div key={rec.id} className="p-3 rounded-xl bg-slate-950/70 border border-white/5 space-y-1.5 text-xs">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-white text-[11px]">{rec.issue}</span>
                  <span className="text-[9px] uppercase font-bold text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-500/10">
                    {rec.section}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{rec.howToImprove}</p>
                {rec.suggestedText && rec.section === 'summary' && (
                  <button
                    onClick={() => handleDataChange({ ...formData, summary: rec.suggestedText! })}
                    className="w-full py-1 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-[10px] font-bold transition-colors"
                  >
                    Apply to Summary
                  </button>
                )}
              </div>
            ))}

            {(!localAnalysis || localAnalysis.recommendations.length === 0) && (
              <div className="text-center py-6 text-slate-500 text-xs space-y-2">
                <p>Upload a resume in the Analyzer to view real-time personalized suggestions here.</p>
                <button
                  onClick={() => onNavigate('analyze')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-xs font-semibold transition-colors"
                >
                  Analyze Resume
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
