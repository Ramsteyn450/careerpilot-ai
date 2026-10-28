import React from 'react';
import { StructuredResumeData } from '../../../../shared/types';

interface TemplateProps {
  data: StructuredResumeData;
  accentColor?: string;
}

export const AcademicResearcherTemplate: React.FC<TemplateProps> = ({
  data,
  accentColor = '#6D28D9'
}) => {
  return (
    <div className="w-full bg-white text-zinc-900 p-8 sm:p-12 font-serif text-[10.5pt] leading-relaxed">
      {/* Formal Academic Header */}
      <div className="text-center border-b border-zinc-400 pb-4 mb-4">
        <h1 className="text-3xl font-normal tracking-wide text-zinc-950 font-serif">
          {data.contact.fullName || 'Alex Morgan, Ph.D.'}
        </h1>
        <p className="text-xs italic text-zinc-600 mt-1">
          Curriculum Vitae • {data.experience?.[0]?.role || 'Research Fellow & Academic Scholar'}
        </p>
        <div className="text-xs text-zinc-700 mt-1.5 flex flex-wrap justify-center gap-x-3 gap-y-0.5 font-sans">
          <span>{data.contact.location}</span>
          <span>•</span>
          <span>{data.contact.phone}</span>
          <span>•</span>
          <span className="font-semibold text-purple-900">{data.contact.email}</span>
          {data.contact.linkedinUrl && (
            <>
              <span>•</span>
              <span>{data.contact.linkedinUrl.replace(/^https?:\/\//, '')}</span>
            </>
          )}
        </div>
      </div>

      {/* Research Statement / Summary */}
      {data.summary && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5">
            Research Interests &amp; Scholarly Focus
          </h2>
          <p className="text-xs text-zinc-800 leading-relaxed text-justify">
            {data.summary}
          </p>
        </div>
      )}

      {/* Education First (Standard in Academic CVs) */}
      {data.education && data.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-0.5 mb-2">
            Academic Background &amp; Degrees
          </h2>
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-zinc-900">
                  <span>{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="font-normal font-sans text-zinc-600 text-[11px]">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="text-zinc-700 italic">{edu.institution}</div>
                {edu.gradeGpa && <div className="text-[11px] text-zinc-600 font-sans">Thesis Honors / GPA: {edu.gradeGpa}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Academic Appointments & Research Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-0.5 mb-2">
            Academic Appointments &amp; Research Positions
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs font-bold text-zinc-900">
                  <span>{exp.role}</span>
                  <span className="font-normal font-sans text-zinc-600 text-[11px]">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="text-xs italic text-purple-900 mb-1">
                  {exp.company} {exp.location ? `, ${exp.location}` : ''}
                </div>
                <ul className="list-disc list-outside pl-5 space-y-0.5 text-xs text-zinc-800">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Publications / Scholarly Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-0.5 mb-2">
            Peer-Reviewed Publications &amp; Working Papers
          </h2>
          <div className="space-y-2">
            {data.projects.map((proj) => (
              <div key={proj.id} className="text-xs pl-3 border-l-2 border-purple-200">
                <div className="font-bold text-zinc-950">
                  &ldquo;{proj.title}&rdquo;
                </div>
                {proj.toolsUsed && proj.toolsUsed.length > 0 && (
                  <div className="text-[10px] text-zinc-500 font-sans italic">
                    Methodologies: {proj.toolsUsed.join(', ')}
                  </div>
                )}
                <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs text-zinc-700 mt-0.5">
                  {proj.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Methodological Proficiencies */}
      {data.skills && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5">
            Methodological &amp; Research Tooling
          </h2>
          <div className="text-xs font-sans text-zinc-800 space-y-1">
            <p><strong>Quantitative Tools:</strong> {data.skills.technical?.join(', ') || 'R, Python, LaTeX, MATLAB'}</p>
            {data.skills.tools && data.skills.tools.length > 0 && (
              <p><strong>Laboratories &amp; Instrumentation:</strong> {data.skills.tools.join(', ')}</p>
            )}
          </div>
        </div>
      )}

      {/* Grants, Fellowships & Honors */}
      {((data.achievements && data.achievements.length > 0) || (data.certifications && data.certifications.length > 0)) && (
        <div className="border-t border-zinc-300 pt-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 mb-1.5">
            Fellowships, Grants &amp; Academic Honors
          </h2>
          <ul className="list-disc list-outside pl-5 space-y-0.5 text-xs text-zinc-800">
            {data.achievements?.map((ach, i) => (
              <li key={`ach-${i}`}>{ach}</li>
            ))}
            {data.certifications?.map((c) => (
              <li key={c.id}>
                {c.name} — {c.issuer} ({c.year})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
