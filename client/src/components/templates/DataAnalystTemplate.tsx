import React from 'react';
import { StructuredResumeData } from '../../../../shared/types';

interface TemplateProps {
  data: StructuredResumeData;
  accentColor?: string;
}

export const DataAnalystTemplate: React.FC<TemplateProps> = ({
  data,
  accentColor = '#059669'
}) => {
  return (
    <div className="w-full bg-white text-slate-800 p-8 sm:p-12 font-sans text-[10.5pt] leading-relaxed">
      {/* Header */}
      <div className="border-b-2 pb-4 mb-4" style={{ borderColor: accentColor }}>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {data.contact.fullName || 'Alex Morgan'}
            </h1>
            <p className="text-xs sm:text-sm font-bold tracking-wide uppercase mt-0.5" style={{ color: accentColor }}>
              {data.experience?.[0]?.role || 'Data Scientist & Analytics Specialist'}
            </p>
          </div>
          <div className="text-xs text-slate-600 sm:text-right mt-2 sm:mt-0 font-medium">
            <div>{data.contact.location} • {data.contact.phone}</div>
            <div className="text-emerald-700 font-semibold">{data.contact.email}</div>
            {data.contact.linkedinUrl && (
              <div className="text-[10px] text-slate-500 font-mono">{data.contact.linkedinUrl.replace(/^https?:\/\//, '')}</div>
            )}
            {data.contact.githubUrl && (
              <div className="text-[10px] text-slate-500 font-mono">{data.contact.githubUrl.replace(/^https?:\/\//, '')}</div>
            )}
          </div>
        </div>
      </div>

      {/* Quantitative Summary */}
      {data.summary && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-3 rounded-xs" style={{ backgroundColor: accentColor }} />
            <span>Analytical &amp; Quantitative Summary</span>
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify bg-emerald-50/40 p-2.5 rounded border border-emerald-100">
            {data.summary}
          </p>
        </div>
      )}

      {/* Data Tooling & Skills Matrix */}
      {data.skills && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-3 rounded-xs" style={{ backgroundColor: accentColor }} />
            <span>Data Analytics &amp; Statistical Toolset</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="font-bold text-emerald-800 text-[11px] block mb-1">
                Languages &amp; Querying
              </span>
              <div className="text-slate-700 font-mono text-[10px] space-y-0.5">
                {data.skills.technical?.slice(0, 4).join(', ') || 'SQL, Python, R'}
              </div>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="font-bold text-emerald-800 text-[11px] block mb-1">
                BI &amp; Visualization
              </span>
              <div className="text-slate-700 font-mono text-[10px] space-y-0.5">
                {data.skills.tools?.join(', ') || 'Tableau, PowerBI, Looker'}
              </div>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="font-bold text-emerald-800 text-[11px] block mb-1">
                Modeling &amp; Methods
              </span>
              <div className="text-slate-700 text-[10px] space-y-0.5">
                {(data.skills.technical?.slice(4) || []).concat(data.skills.soft || []).join(', ') || 'Statistical Testing, ETL, Regression'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Experience with Metrics */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-3 rounded-xs" style={{ backgroundColor: accentColor }} />
            <span>Quantitative Work Experience</span>
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                  <span className="text-[11px] font-semibold text-emerald-800 font-mono">
                    {exp.startDate} – {exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-600 mb-1">
                  {exp.company} {exp.location ? `| ${exp.location}` : ''}
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

      {/* Analytics Projects & Models */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-3 rounded-xs" style={{ backgroundColor: accentColor }} />
            <span>Data Science &amp; Pipeline Projects</span>
          </h2>
          <div className="space-y-2">
            {data.projects.map((proj) => (
              <div key={proj.id} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-baseline text-xs font-bold text-slate-900 mb-0.5">
                  <span>{proj.title}</span>
                  {proj.link && <span className="text-[10px] text-emerald-700 font-mono">{proj.link}</span>}
                </div>
                {proj.toolsUsed && proj.toolsUsed.length > 0 && (
                  <div className="text-[10px] text-slate-500 font-mono mb-1">
                    Dataset / Stack: {proj.toolsUsed.join(' • ')}
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

      {/* Education & Credentials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-3">
        {data.education && data.education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
              Education &amp; Quantitative Degrees
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</div>
                <div className="text-slate-600">{edu.institution} ({edu.startDate} – {edu.endDate})</div>
                {edu.gradeGpa && <div className="text-emerald-800 text-[11px] font-semibold">GPA: {edu.gradeGpa}</div>}
              </div>
            ))}
          </div>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
              Data &amp; Cloud Certifications
            </h2>
            <div className="space-y-1">
              {data.certifications.map((c) => (
                <div key={c.id} className="text-xs">
                  <span className="font-semibold text-slate-900">{c.name}</span>
                  <span className="text-slate-500 text-[11px]"> ({c.issuer}, {c.year})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
