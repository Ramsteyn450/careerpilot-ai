import React from 'react';
import { StructuredResumeData } from '../../../../shared/types';

interface TemplateProps {
  data: StructuredResumeData;
  accentColor?: string;
}

export const MinimalTechTemplate: React.FC<TemplateProps> = ({
  data,
  accentColor = '#0284C7'
}) => {
  return (
    <div className="w-full bg-white text-zinc-900 p-8 sm:p-12 font-mono text-[10pt] leading-snug">
      {/* Terminal Style Header */}
      <div className="border-b border-zinc-300 pb-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-sans">
              {data.contact.fullName || 'Alex Morgan'}
            </h1>
            <p className="text-xs text-sky-700 font-semibold mt-0.5">
              &gt; {data.experience?.[0]?.role || 'Software Engineer'} --location=&quot;{data.contact.location || 'Remote'}&quot;
            </p>
          </div>
          <div className="text-right text-[10px] text-zinc-600 space-y-0.5">
            <div>{data.contact.email}</div>
            <div>{data.contact.phone}</div>
            {data.contact.githubUrl && (
              <div className="text-sky-800 font-bold">{data.contact.githubUrl.replace(/^https?:\/\//, '')}</div>
            )}
            {data.contact.linkedinUrl && (
              <div>{data.contact.linkedinUrl.replace(/^https?:\/\//, '')}</div>
            )}
          </div>
        </div>
      </div>

      {/* Summary / Bio */}
      {data.summary && (
        <div className="mb-4">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">
            // 01. SUMMARY
          </div>
          <p className="text-[10pt] font-sans text-zinc-800 leading-normal bg-zinc-50 p-2.5 rounded border border-zinc-200">
            {data.summary}
          </p>
        </div>
      )}

      {/* Skills / Tech Stack in categorized chips */}
      {data.skills && (
        <div className="mb-4">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
            // 02. STACK &amp; TOOLING
          </div>
          <div className="space-y-1.5 text-[10px]">
            {data.skills.technical && data.skills.technical.length > 0 && (
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-zinc-700 w-24 shrink-0">[languages]</span>
                <span className="text-zinc-900 font-mono bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                  {data.skills.technical.join(' • ')}
                </span>
              </div>
            )}
            {data.skills.tools && data.skills.tools.length > 0 && (
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-zinc-700 w-24 shrink-0">[dev_tools]</span>
                <span className="text-zinc-900 font-mono bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                  {data.skills.tools.join(' • ')}
                </span>
              </div>
            )}
            {data.skills.soft && data.skills.soft.length > 0 && (
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-zinc-700 w-24 shrink-0">[practices]</span>
                <span className="text-zinc-700 font-mono">
                  {data.skills.soft.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
            // 03. EXPERIENCE
          </div>
          <div className="space-y-3.5">
            {data.experience.map((exp) => (
              <div key={exp.id} className="text-xs font-sans">
                <div className="flex justify-between items-baseline font-mono font-bold text-zinc-950">
                  <span className="text-sm font-sans font-bold">{exp.role} <span className="text-sky-700 font-normal font-mono">@{exp.company}</span></span>
                  <span className="text-[10px] text-zinc-500 font-normal">{exp.startDate} – {exp.endDate}</span>
                </div>
                {exp.location && <div className="text-[10px] text-zinc-500 font-mono mb-1">{exp.location}</div>}
                <ul className="list-disc list-outside pl-4 space-y-0.5 text-[10pt] text-zinc-800">
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
        <div className="mb-4">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
            // 04. PROJECTS_BUILT
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {data.projects.map((proj) => (
              <div key={proj.id} className="border border-zinc-200 rounded p-2.5 bg-zinc-50/50">
                <div className="flex justify-between items-baseline font-mono text-xs font-bold text-zinc-900 mb-1">
                  <span>{proj.title}</span>
                  {proj.link && <span className="text-[10px] text-sky-700 underline">{proj.link}</span>}
                </div>
                {proj.toolsUsed && proj.toolsUsed.length > 0 && (
                  <div className="text-[10px] text-zinc-600 font-mono mb-1.5">
                    stack: [{proj.toolsUsed.join(', ')}]
                  </div>
                )}
                <ul className="list-disc list-outside pl-4 space-y-0.5 text-[10pt] font-sans text-zinc-800">
                  {proj.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Certs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-200 pt-3">
        {data.education && data.education.length > 0 && (
          <div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
              // 05. ACADEMICS
            </div>
            {data.education.map((edu) => (
              <div key={edu.id} className="text-xs font-sans">
                <div className="font-bold text-zinc-900 font-mono">{edu.degree}</div>
                <div className="text-zinc-700">{edu.institution} ({edu.startDate} – {edu.endDate})</div>
                {edu.gradeGpa && <div className="text-[10px] text-zinc-500 font-mono">GPA: {edu.gradeGpa}</div>}
              </div>
            ))}
          </div>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
              // 06. CERTIFICATIONS
            </div>
            <div className="space-y-1">
              {data.certifications.map((c) => (
                <div key={c.id} className="text-xs font-mono text-zinc-800">
                  &gt; {c.name} <span className="text-zinc-500 text-[10px]">[{c.issuer}, {c.year}]</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
