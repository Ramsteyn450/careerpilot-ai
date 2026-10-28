import React from 'react';
import { StructuredResumeData } from '../../../../shared/types';

interface TemplateProps {
  data: StructuredResumeData;
  accentColor?: string;
}

export const TwoColumnModernTemplate: React.FC<TemplateProps> = ({
  data,
  accentColor = '#6366F1'
}) => {
  return (
    <div className="w-full bg-white text-slate-800 p-6 sm:p-8 font-sans text-[10.5pt] leading-relaxed">
      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column / Rail (4 of 12 cols = ~33%) */}
        <div className="md:col-span-4 bg-slate-50/80 p-5 rounded-xl border border-slate-200/80 space-y-5">
          {/* Identity */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-tight">
              {data.contact.fullName || 'Alex Morgan'}
            </h1>
            <p className="text-xs font-bold mt-1" style={{ color: accentColor }}>
              {data.experience?.[0]?.role || 'Full-Stack Developer'}
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Contact
            </span>
            <div className="break-all">{data.contact.email}</div>
            <div>{data.contact.phone}</div>
            <div>{data.contact.location}</div>
            {data.contact.linkedinUrl && (
              <div className="text-indigo-600 font-semibold break-all text-[10px]">
                {data.contact.linkedinUrl.replace(/^https?:\/\//, '')}
              </div>
            )}
            {data.contact.githubUrl && (
              <div className="text-slate-500 font-mono break-all text-[10px]">
                {data.contact.githubUrl.replace(/^https?:\/\//, '')}
              </div>
            )}
          </div>

          {/* Technical Skills */}
          {data.skills?.technical && data.skills.technical.length > 0 && (
            <div className="border-t border-slate-200 pt-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Technical Stack
              </span>
              <div className="flex flex-wrap gap-1">
                {data.skills.technical.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-slate-800 border border-slate-200 shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tools & Practices */}
          {((data.skills?.tools && data.skills.tools.length > 0) || (data.skills?.soft && data.skills.soft.length > 0)) && (
            <div className="border-t border-slate-200 pt-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Tools &amp; Methodologies
              </span>
              <div className="flex flex-wrap gap-1">
                {(data.skills.tools || []).concat(data.skills.soft || []).map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200/70 text-slate-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div className="border-t border-slate-200 pt-3 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Education
              </span>
              {data.education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-600 text-[11px]">{edu.institution}</div>
                  <div className="text-slate-400 text-[10px] font-mono">{edu.startDate} – {edu.endDate}</div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div className="border-t border-slate-200 pt-3 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Certifications
              </span>
              {data.certifications.map((c) => (
                <div key={c.id} className="text-xs">
                  <div className="font-semibold text-slate-900">{c.name}</div>
                  <div className="text-slate-500 text-[10px]">{c.issuer} ({c.year})</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column / Main Pane (8 of 12 cols = ~67%) */}
        <div className="md:col-span-8 space-y-5">
          {/* Professional Summary */}
          {data.summary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Executive Profile
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed text-justify">
                {data.summary}
              </p>
            </div>
          )}

          {/* Professional Experience */}
          {data.experience && data.experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
                Work Experience
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                      <span className="text-[11px] font-mono text-slate-500 font-semibold">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <div className="text-xs font-semibold mb-1" style={{ color: accentColor }}>
                      {exp.company} {exp.location ? `• ${exp.location}` : ''}
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs text-slate-700">
                      {exp.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Projects */}
          {data.projects && data.projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2.5">
                Featured Projects
              </h2>
              <div className="space-y-3">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-baseline text-xs font-bold text-slate-900 mb-0.5">
                      <span>{proj.title}</span>
                      {proj.link && <span className="text-[10px] text-indigo-600 font-mono">{proj.link}</span>}
                    </div>
                    {proj.toolsUsed && proj.toolsUsed.length > 0 && (
                      <div className="text-[10px] text-slate-500 font-mono mb-1">
                        Built with: {proj.toolsUsed.join(' • ')}
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
        </div>
      </div>
    </div>
  );
};
