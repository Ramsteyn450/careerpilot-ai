import React from 'react';
import { StructuredResumeData } from '../../../../shared/types';

interface TemplateProps {
  data: StructuredResumeData;
  accentColor?: string;
}

export const CleanCorporateTemplate: React.FC<TemplateProps> = ({
  data,
  accentColor = '#1D4ED8'
}) => {
  return (
    <div className="w-full bg-white text-slate-800 p-8 sm:p-12 font-sans text-[10.5pt] leading-relaxed">
      {/* Corporate Executive Header */}
      <div className="border-b-3 pb-5 mb-5 text-center sm:text-left" style={{ borderColor: accentColor }}>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
          {data.contact.fullName || 'Alex Morgan'}
        </h1>
        <p className="text-sm font-semibold tracking-wider uppercase text-blue-900 mt-1">
          {data.experience?.[0]?.role || 'Engineering Director & Executive Leader'}
        </p>
        <div className="mt-2 text-xs text-slate-600 flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1">
          <span>{data.contact.location}</span>
          <span>•</span>
          <span>{data.contact.phone}</span>
          <span>•</span>
          <span className="font-semibold text-slate-900">{data.contact.email}</span>
          {data.contact.linkedinUrl && (
            <>
              <span>•</span>
              <span className="text-blue-800">{data.contact.linkedinUrl.replace(/^https?:\/\//, '')}</span>
            </>
          )}
        </div>
      </div>

      {/* Executive Summary */}
      {data.summary && (
        <div className="mb-5">
          <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Executive Profile &amp; Leadership Scope
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            {data.summary}
          </p>
        </div>
      )}

      {/* Executive Competencies Grid */}
      {data.skills && (
        <div className="mb-5">
          <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Core Leadership &amp; Operational Competencies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {(data.skills.technical || []).slice(0, 3).map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 text-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-800 shrink-0" />
                <span className="font-medium">{s}</span>
              </div>
            ))}
            {(data.skills.soft || []).slice(0, 3).map((s, i) => (
              <div key={`soft-${i}`} className="flex items-center gap-1.5 text-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-800 shrink-0" />
                <span className="font-medium">{s}</span>
              </div>
            ))}
            {(data.skills.tools || []).slice(0, 3).map((s, i) => (
              <div key={`tool-${i}`} className="flex items-center gap-1.5 text-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-800 shrink-0" />
                <span className="font-medium">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Career History */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            Professional Experience &amp; Organizational Impact
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-slate-900 text-sm font-serif">{exp.role}</span>
                    <span className="text-slate-700 font-semibold"> — {exp.company}</span>
                  </div>
                  <span className="text-slate-600 font-mono text-[11px] font-semibold">{exp.startDate} – {exp.endDate}</span>
                </div>
                {exp.location && <div className="text-[11px] text-slate-500 italic mb-1.5">{exp.location}</div>}
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

      {/* Major Projects & Initiatives */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Strategic Initiatives &amp; Deliverables
          </h2>
          <div className="space-y-2">
            {data.projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{proj.title}</span>
                  {proj.toolsUsed && proj.toolsUsed.length > 0 && (
                    <span className="font-normal text-slate-500 text-[10px]">
                      {proj.toolsUsed.join(', ')}
                    </span>
                  )}
                </div>
                <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-700 mt-0.5">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-300 pt-3">
        {data.education && data.education.length > 0 && (
          <div>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 mb-1.5">
              Education
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
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 mb-1.5">
              Executive Credentials
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
