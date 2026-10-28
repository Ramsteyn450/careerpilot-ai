import React from 'react';
import { StructuredResumeData } from '../../../../shared/types';

interface TemplateProps {
  data: StructuredResumeData;
  accentColor?: string;
}

export const FresherStarterTemplate: React.FC<TemplateProps> = ({
  data,
  accentColor = '#4F46E5'
}) => {
  return (
    <div className="w-full bg-white text-slate-800 p-8 sm:p-12 font-sans text-[10.5pt] leading-relaxed">
      {/* Graduate Header */}
      <div className="border-b-2 pb-4 mb-4" style={{ borderColor: accentColor }}>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {data.contact.fullName || 'Alex Morgan'}
            </h1>
            <p className="text-xs sm:text-sm font-semibold tracking-wide mt-0.5" style={{ color: accentColor }}>
              Aspiring Software Developer • Computer Science Graduate
            </p>
          </div>
          <div className="text-xs text-slate-600 sm:text-right mt-2 sm:mt-0 space-y-0.5 font-medium">
            <div>{data.contact.location} • {data.contact.phone}</div>
            <div className="text-indigo-600 font-semibold">{data.contact.email}</div>
            {data.contact.githubUrl && (
              <div className="text-slate-700 font-mono text-[10px]">{data.contact.githubUrl.replace(/^https?:\/\//, '')}</div>
            )}
            {data.contact.linkedinUrl && (
              <div className="text-slate-500 font-mono text-[10px]">{data.contact.linkedinUrl.replace(/^https?:\/\//, '')}</div>
            )}
          </div>
        </div>
      </div>

      {/* Career Objective / Summary */}
      {data.summary && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-indigo-100 pb-0.5 mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: accentColor }} />
            <span>Career Objective</span>
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            {data.summary}
          </p>
        </div>
      )}

      {/* 1. ACADEMIC BACKGROUND (First for freshers!) */}
      {data.education && data.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-indigo-100 pb-0.5 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: accentColor }} />
            <span>Education &amp; Academic Qualifications</span>
          </h2>
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id} className="p-3 rounded-lg bg-indigo-50/40 border border-indigo-100">
                <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                  <span className="text-sm font-bold text-indigo-950">
                    {edu.degree} in {edu.fieldOfStudy}
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                <div className="text-xs text-slate-700 font-medium">
                  {edu.institution}
                </div>
                {edu.gradeGpa && (
                  <div className="text-xs font-semibold text-indigo-700 mt-1">
                    Cumulative GPA: {edu.gradeGpa}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. TECHNICAL SKILLS */}
      {data.skills && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-indigo-100 pb-0.5 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: accentColor }} />
            <span>Technical Skills &amp; Coursework</span>
          </h2>
          <div className="space-y-1.5 text-xs">
            {data.skills.technical && data.skills.technical.length > 0 && (
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-slate-900 w-28 shrink-0">Programming:</span>
                <span className="text-slate-700">{data.skills.technical.join(', ')}</span>
              </div>
            )}
            {data.skills.tools && data.skills.tools.length > 0 && (
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-slate-900 w-28 shrink-0">Tools &amp; Platforms:</span>
                <span className="text-slate-700">{data.skills.tools.join(', ')}</span>
              </div>
            )}
            {data.skills.soft && data.skills.soft.length > 0 && (
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-slate-900 w-28 shrink-0">Core Competencies:</span>
                <span className="text-slate-700">{data.skills.soft.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. CAPSTONE & ACADEMIC PROJECTS (Essential for freshers) */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-indigo-100 pb-0.5 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: accentColor }} />
            <span>Academic Projects &amp; Open-Source</span>
          </h2>
          <div className="space-y-3">
            {data.projects.map((proj) => (
              <div key={proj.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="text-xs font-bold text-slate-900">{proj.title}</span>
                  {proj.link && (
                    <span className="text-[10px] text-indigo-600 font-mono underline">{proj.link}</span>
                  )}
                </div>
                {proj.toolsUsed && proj.toolsUsed.length > 0 && (
                  <div className="text-[10px] text-slate-500 font-mono mb-1">
                    Technologies: {proj.toolsUsed.join(', ')}
                  </div>
                )}
                <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs text-slate-700">
                  {proj.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. WORK EXPERIENCE / INTERNSHIPS (If any) */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-indigo-100 pb-0.5 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: accentColor }} />
            <span>Internships &amp; Practical Experience</span>
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-slate-900">{exp.role} — {exp.company}</span>
                  <span className="text-slate-500 text-[11px] font-mono">{exp.startDate} – {exp.endDate}</span>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs text-slate-700 mt-0.5">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. ACHIEVEMENTS & CERTIFICATIONS */}
      {((data.achievements && data.achievements.length > 0) || (data.certifications && data.certifications.length > 0)) && (
        <div className="border-t border-slate-200 pt-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
            Honors, Hackathons &amp; Certifications
          </h2>
          <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs text-slate-700">
            {data.achievements?.map((ach, i) => (
              <li key={`ach-${i}`}>{ach}</li>
            ))}
            {data.certifications?.map((c) => (
              <li key={c.id}>
                <strong>{c.name}</strong> — {c.issuer} ({c.year})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
