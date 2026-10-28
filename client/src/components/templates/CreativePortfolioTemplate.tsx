import React from 'react';
import { StructuredResumeData } from '../../../../shared/types';

interface TemplateProps {
  data: StructuredResumeData;
  accentColor?: string;
}

export const CreativePortfolioTemplate: React.FC<TemplateProps> = ({
  data,
  accentColor = '#DB2777'
}) => {
  return (
    <div className="w-full bg-white text-slate-900 p-8 sm:p-12 font-sans text-[10.5pt] leading-relaxed">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start pb-6 mb-6 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-pink-600 block mb-1">
            Product &amp; Visual Design Portfolio
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
            {data.contact.fullName || 'Alex Morgan'}
          </h1>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            {data.experience?.[0]?.role || 'Lead UI/UX & Product Designer'}
          </p>
        </div>
        <div className="text-xs text-slate-600 sm:text-right mt-3 sm:mt-0 space-y-1">
          <div>{data.contact.email} • {data.contact.phone}</div>
          <div>{data.contact.location}</div>
          {data.contact.linkedinUrl && (
            <div className="font-semibold text-pink-600">{data.contact.linkedinUrl.replace(/^https?:\/\//, '')}</div>
          )}
          {data.contact.githubUrl && (
            <div className="text-slate-500 font-mono text-[10px]">{data.contact.githubUrl.replace(/^https?:\/\//, '')}</div>
          )}
        </div>
      </div>

      {/* Design Philosophy / Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            Design Philosophy &amp; Impact
          </h2>
          <p className="text-sm font-light text-slate-800 leading-relaxed italic border-l-3 pl-4" style={{ borderColor: accentColor }}>
            &ldquo;{data.summary}&rdquo;
          </p>
        </div>
      )}

      {/* Design Skills & Methodologies */}
      {data.skills && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5">
            Core Design Methodologies &amp; Tools
          </h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {data.skills.technical?.map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-pink-50 text-pink-700 border border-pink-200"
              >
                {skill}
              </span>
            ))}
            {data.skills.tools?.map((tool, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
              >
                {tool}
              </span>
            ))}
            {data.skills.soft?.map((soft, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white text-slate-600 border border-slate-200"
              >
                {soft}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Case Studies & Product Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
            Design Leadership &amp; Work Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="group">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="text-sm font-bold text-slate-900">{exp.role}</span>
                  <span className="text-xs text-slate-500 font-medium">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="text-xs font-semibold text-pink-600 mb-1.5">
                  {exp.company} {exp.location ? `— ${exp.location}` : ''}
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

      {/* Featured Projects / Case Studies */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
            Selected Design Case Studies
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {data.projects.map((proj) => (
              <div key={proj.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs font-bold text-slate-900">{proj.title}</span>
                  {proj.link && <span className="text-[10px] text-pink-600 font-semibold">{proj.link}</span>}
                </div>
                {proj.toolsUsed && proj.toolsUsed.length > 0 && (
                  <div className="text-[10px] text-slate-500 mb-1.5">
                    Design Tooling: {proj.toolsUsed.join(', ')}
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

      {/* Education & Honors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-4">
        {data.education && data.education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              Education &amp; Design Studies
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</div>
                <div className="text-slate-600">{edu.institution} ({edu.startDate} – {edu.endDate})</div>
              </div>
            ))}
          </div>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              Certifications &amp; Accreditations
            </h2>
            <div className="space-y-1">
              {data.certifications.map((c) => (
                <div key={c.id} className="text-xs">
                  <span className="font-semibold text-slate-900">{c.name}</span>
                  <span className="text-slate-500 text-[11px]"> ({c.issuer})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
