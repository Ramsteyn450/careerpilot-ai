import React from 'react';
import { StructuredResumeData } from '../../../../shared/types';

interface TemplateProps {
  data: StructuredResumeData;
  accentColor?: string;
}

export const ElegantMonochromeTemplate: React.FC<TemplateProps> = ({
  data
}) => {
  return (
    <div className="w-full bg-white text-black p-8 sm:p-14 font-serif text-[10.5pt] leading-relaxed">
      {/* Editorial Header */}
      <div className="border-b-2 border-black pb-5 mb-5">
        <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-black font-serif">
          {data.contact.fullName || 'Alex Morgan'}
        </h1>
        <div className="text-xs font-sans text-neutral-800 uppercase tracking-widest mt-1">
          {data.experience?.[0]?.role || 'Professional'} — {data.contact.location || 'Location'}
        </div>
        <div className="mt-2 text-xs font-sans text-neutral-600 flex flex-wrap gap-x-4 gap-y-0.5">
          <span>{data.contact.email}</span>
          <span>•</span>
          <span>{data.contact.phone}</span>
          {data.contact.linkedinUrl && (
            <>
              <span>•</span>
              <span>{data.contact.linkedinUrl.replace(/^https?:\/\//, '')}</span>
            </>
          )}
          {data.contact.githubUrl && (
            <>
              <span>•</span>
              <span>{data.contact.githubUrl.replace(/^https?:\/\//, '')}</span>
            </>
          )}
        </div>
      </div>

      {/* Professional Overview */}
      {data.summary && (
        <div className="mb-5">
          <h2 className="text-[11px] font-sans font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-2">
            Overview
          </h2>
          <p className="text-xs text-neutral-900 leading-relaxed text-justify font-serif">
            {data.summary}
          </p>
        </div>
      )}

      {/* Areas of Expertise */}
      {data.skills && (
        <div className="mb-5">
          <h2 className="text-[11px] font-sans font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-2">
            Areas of Expertise
          </h2>
          <div className="text-xs font-sans text-neutral-900 space-y-1">
            {data.skills.technical && data.skills.technical.length > 0 && (
              <p>
                <strong className="font-semibold text-black">Core Disciplines:</strong> {data.skills.technical.join(', ')}
              </p>
            )}
            {data.skills.tools && data.skills.tools.length > 0 && (
              <p>
                <strong className="font-semibold text-black">Systems &amp; Platforms:</strong> {data.skills.tools.join(', ')}
              </p>
            )}
            {data.skills.soft && data.skills.soft.length > 0 && (
              <p>
                <strong className="font-semibold text-black">Operational Competencies:</strong> {data.skills.soft.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Work History */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[11px] font-sans font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-3">
            Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-black text-sm font-serif">{exp.role}</span>
                  <span className="text-neutral-600 font-sans text-[11px]">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="text-xs italic text-neutral-800 mb-1 font-serif">
                  {exp.company} {exp.location ? `, ${exp.location}` : ''}
                </div>
                <ul className="list-disc list-outside pl-5 space-y-0.5 text-xs text-neutral-800 font-serif">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Engagements / Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[11px] font-sans font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-2">
            Selected Engagements &amp; Projects
          </h2>
          <div className="space-y-2.5">
            {data.projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-black font-serif">
                  <span>{proj.title}</span>
                  {proj.link && <span className="font-sans text-[10px] text-neutral-600 underline">{proj.link}</span>}
                </div>
                {proj.toolsUsed && proj.toolsUsed.length > 0 && (
                  <div className="text-[10px] font-sans text-neutral-500 mb-0.5">
                    {proj.toolsUsed.join(' • ')}
                  </div>
                )}
                <ul className="list-disc list-outside pl-5 space-y-0.5 text-neutral-800 font-serif">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-neutral-300 pt-3">
        {data.education && data.education.length > 0 && (
          <div>
            <h2 className="text-[11px] font-sans font-bold uppercase tracking-widest text-black mb-1.5">
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="font-bold text-black font-serif">{edu.degree} in {edu.fieldOfStudy}</div>
                <div className="text-neutral-700 italic font-serif">{edu.institution} ({edu.startDate} – {edu.endDate})</div>
              </div>
            ))}
          </div>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <div>
            <h2 className="text-[11px] font-sans font-bold uppercase tracking-widest text-black mb-1.5">
              Accreditations
            </h2>
            <div className="space-y-1">
              {data.certifications.map((c) => (
                <div key={c.id} className="text-xs font-serif">
                  <span className="font-bold text-black">{c.name}</span>
                  <span className="text-neutral-600 font-sans text-[11px]"> — {c.issuer}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
