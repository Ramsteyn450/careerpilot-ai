import React from 'react';
import { StructuredResumeData } from '../../../../shared/types';

export const ATSClassicTemplate: React.FC<{ data: StructuredResumeData; accentColor?: string }> = ({
  data
}) => {
  return (
    <div className="w-full bg-white text-black p-8 sm:p-12 font-serif text-[11pt] leading-relaxed">
      {/* Header - Centered traditional typography */}
      <div className="text-center pb-4 mb-4 border-b border-black">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-black">
          {data.contact.fullName || 'Alex Morgan'}
        </h1>
        <div className="text-xs text-black mt-1 space-x-2">
          {data.contact.location && <span>{data.contact.location}</span>}
          {data.contact.phone && <span>• {data.contact.phone}</span>}
          {data.contact.email && <span>• {data.contact.email}</span>}
        </div>
        <div className="text-xs text-black mt-0.5 space-x-2 font-mono">
          {data.contact.linkedinUrl && <span>{data.contact.linkedinUrl}</span>}
          {data.contact.githubUrl && <span>• {data.contact.githubUrl}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5">
            Professional Summary
          </h2>
          <p className="text-xs text-justify text-black leading-normal">{data.summary}</p>
        </div>
      )}

      {/* Technical Skills */}
      {data.skills?.technical && data.skills.technical.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5">
            Technical Competencies
          </h2>
          <div className="text-xs text-black space-y-1">
            <p>
              <strong>Technical Skills:</strong> {data.skills.technical.join(', ')}
            </p>
            {data.skills.soft && data.skills.soft.length > 0 && (
              <p>
                <strong>Professional Skills:</strong> {data.skills.soft.join(', ')}
              </p>
            )}
            {data.skills.tools && data.skills.tools.length > 0 && (
              <p>
                <strong>Developer Tools:</strong> {data.skills.tools.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
            Work Experience
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs font-bold text-black">
                  <span>
                    {exp.company} — {exp.location || 'Location'}
                  </span>
                  <span>
                    {exp.startDate} – {exp.endDate}
                  </span>
                </div>
                <div className="text-xs italic text-black mb-1">{exp.role}</div>
                <ul className="list-disc list-outside pl-5 space-y-0.5 text-xs text-black">
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
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
            Selected Projects
          </h2>
          <div className="space-y-2.5">
            {data.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline text-xs font-bold text-black">
                  <span>{proj.title}</span>
                  {proj.toolsUsed && proj.toolsUsed.length > 0 && (
                    <span className="font-normal italic text-[10pt]">
                      Tools: {proj.toolsUsed.join(', ')}
                    </span>
                  )}
                </div>
                <ul className="list-disc list-outside pl-5 space-y-0.5 text-xs text-black">
                  {proj.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5">
            Education
          </h2>
          <div className="space-y-1.5">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs text-black">
                <div>
                  <strong>{edu.institution}</strong> — {edu.degree}
                  {edu.gradeGpa && <span> (GPA: {edu.gradeGpa})</span>}
                </div>
                <span>
                  {edu.startDate ? `${edu.startDate} – ` : ''}
                  {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5">
            Certifications
          </h2>
          <div className="text-xs text-black space-y-0.5">
            {data.certifications.map((c) => (
              <p key={c.id}>
                <strong>{c.name}</strong> — {c.issuer} {c.year ? `(${c.year})` : ''}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
