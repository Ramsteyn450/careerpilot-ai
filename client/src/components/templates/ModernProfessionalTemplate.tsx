import React from 'react';
import { StructuredResumeData } from '../../../../shared/types';

interface TemplateProps {
  data: StructuredResumeData;
  accentColor?: string;
}

export const ModernProfessionalTemplate: React.FC<TemplateProps> = ({
  data,
  accentColor = '#7C3AED'
}) => {
  return (
    <div className="w-full bg-white text-slate-800 p-8 sm:p-12 font-sans text-[10.5pt] leading-relaxed">
      {/* Header with Electric Violet Accent Bar */}
      <div className="border-b-2 pb-5 mb-5" style={{ borderColor: accentColor }}>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              {data.contact.fullName || 'Alex Morgan'}
            </h1>
            <p className="text-sm font-semibold tracking-wide mt-1" style={{ color: accentColor }}>
              {data.experience?.[0]?.role || 'Professional Specialist'} • {data.contact.location || 'Location'}
            </p>
          </div>
          <div className="text-xs text-slate-600 sm:text-right space-y-0.5 font-medium">
            <div>{data.contact.email}</div>
            <div>{data.contact.phone}</div>
            {data.contact.linkedinUrl && (
              <div className="text-[10pt] font-mono" style={{ color: accentColor }}>
                {data.contact.linkedinUrl.replace(/^https?:\/\//, '')}
              </div>
            )}
            {data.contact.githubUrl && (
              <div className="text-[10pt] font-mono text-slate-500">
                {data.contact.githubUrl.replace(/^https?:\/\//, '')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900">
              Executive Profile
            </h2>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed pl-4 border-l-2 border-slate-200 text-justify">
            {data.summary}
          </p>
        </div>
      )}

      {/* Technical Competencies Grid */}
      {data.skills && (Boolean(data.skills.technical?.length) || Boolean(data.skills.tools?.length)) && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900">
              Core Competencies & Toolset
            </h2>
          </div>
          <div className="pl-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {data.skills.technical && data.skills.technical.length > 0 && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-bold text-slate-900 block mb-1.5 text-[11px]">
                  Technical Proficiencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.technical.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-white text-slate-800 border border-slate-200 shadow-2xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {(Boolean(data.skills.tools?.length) || Boolean(data.skills.soft?.length)) && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-bold text-slate-900 block mb-1.5 text-[11px]">
                  Tools & Methodologies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(data.skills.tools || []).concat(data.skills.soft || []).map((tool, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-white text-slate-800 border border-slate-200 shadow-2xs"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900">
              Professional Experience
            </h2>
          </div>
          <div className="pl-4 space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="relative pl-3 border-l-2" style={{ borderColor: `${accentColor}40` }}>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs font-bold text-slate-900">
                  <span className="text-sm font-extrabold text-slate-900">{exp.role}</span>
                  <span className="text-[11px] font-semibold text-slate-500 font-mono">
                    {exp.startDate} – {exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-semibold mb-1.5" style={{ color: accentColor }}>
                  {exp.company} {exp.location ? `• ${exp.location}` : ''}
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-700">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900">
              Key Engineering Projects
            </h2>
          </div>
          <div className="pl-4 space-y-3">
            {data.projects.map((proj) => (
              <div key={proj.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs font-bold text-slate-900">{proj.title}</span>
                  {proj.link && (
                    <span className="text-[10px] font-mono text-slate-500">{proj.link}</span>
                  )}
                </div>
                {proj.toolsUsed && proj.toolsUsed.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {proj.toolsUsed.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100"
                      >
                        {t}
                      </span>
                    ))}
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

      {/* Education & Certifications Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.education && data.education.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900">
                Education
              </h2>
            </div>
            <div className="pl-4 space-y-2">
              {data.education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="font-bold text-slate-900">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </div>
                  <div className="text-slate-600">{edu.institution}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {edu.startDate} – {edu.endDate} {edu.gradeGpa ? `| GPA: ${edu.gradeGpa}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900">
                Certifications
              </h2>
            </div>
            <div className="pl-4 space-y-1.5">
              {data.certifications.map((c) => (
                <div key={c.id} className="text-xs">
                  <span className="font-semibold text-slate-900">{c.name}</span>
                  <span className="text-slate-500 text-[11px]"> — {c.issuer} ({c.year})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
