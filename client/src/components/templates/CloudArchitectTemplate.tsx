import React from 'react';
import { StructuredResumeData } from '../../../../shared/types';

interface TemplateProps {
  data: StructuredResumeData;
  accentColor?: string;
}

export const CloudArchitectTemplate: React.FC<TemplateProps> = ({
  data,
  accentColor = '#D97706'
}) => {
  return (
    <div className="w-full bg-white text-slate-800 p-8 sm:p-12 font-sans text-[10.5pt] leading-relaxed">
      {/* Cloud Header */}
      <div className="border-b-2 pb-4 mb-4" style={{ borderColor: accentColor }}>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                Cloud &amp; Platform Architecture
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
              {data.contact.fullName || 'Alex Morgan'}
            </h1>
            <p className="text-xs sm:text-sm font-semibold mt-0.5" style={{ color: accentColor }}>
              {data.experience?.[0]?.role || 'Cloud & DevOps Architect'} • {data.contact.location || 'Remote'}
            </p>
          </div>
          <div className="text-xs text-slate-600 sm:text-right mt-2 sm:mt-0 font-mono space-y-0.5">
            <div>{data.contact.email}</div>
            <div>{data.contact.phone}</div>
            {data.contact.githubUrl && <div className="text-amber-800 font-bold">{data.contact.githubUrl.replace(/^https?:\/\//, '')}</div>}
            {data.contact.linkedinUrl && <div>{data.contact.linkedinUrl.replace(/^https?:\/\//, '')}</div>}
          </div>
        </div>
      </div>

      {/* Cloud Certifications Callout Banner */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="mb-4 bg-amber-50/70 p-3 rounded-lg border border-amber-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-1">
            Cloud &amp; Security Accreditations
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            {data.certifications.map((c) => (
              <span
                key={c.id}
                className="px-2 py-1 rounded bg-white font-semibold text-slate-900 border border-amber-300 shadow-2xs text-[11px]"
              >
                ★ {c.name} <span className="text-slate-500 font-normal">({c.issuer})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Cloud Profile Summary */}
      {data.summary && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
            Infrastructure &amp; Reliability Profile
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            {data.summary}
          </p>
        </div>
      )}

      {/* Technical Stack / Infrastructure Toolchain */}
      {data.skills && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
            Cloud, Container &amp; Automation Toolchain
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Platforms</span>
              <span className="text-slate-800 font-medium">AWS, GCP, Azure, Linux</span>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Containers</span>
              <span className="text-slate-800 font-medium">{data.skills.technical?.slice(0, 3).join(', ') || 'Docker, Kubernetes'}</span>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">IaC &amp; CI/CD</span>
              <span className="text-slate-800 font-medium">{data.skills.tools?.join(', ') || 'Terraform, GitHub Actions'}</span>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Observability</span>
              <span className="text-slate-800 font-medium">Prometheus, Grafana, Datadog</span>
            </div>
          </div>
        </div>
      )}

      {/* Engineering Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
            Cloud &amp; DevOps Engineering Experience
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                  <span className="text-[11px] font-mono text-amber-800 font-semibold">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="text-xs font-semibold text-slate-600 mb-1">
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

      {/* Key Infrastructure Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
            Infrastructure &amp; Migration Projects
          </h2>
          <div className="space-y-2">
            {data.projects.map((proj) => (
              <div key={proj.id} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-baseline text-xs font-bold text-slate-900 mb-0.5">
                  <span>{proj.title}</span>
                  {proj.link && <span className="text-[10px] text-amber-700 font-mono">{proj.link}</span>}
                </div>
                {proj.toolsUsed && proj.toolsUsed.length > 0 && (
                  <div className="text-[10px] text-slate-500 font-mono mb-1">
                    Stack: {proj.toolsUsed.join(' • ')}
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

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="border-t border-slate-200 pt-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
            Academic Background
          </h2>
          <div className="space-y-1">
            {data.education.map((edu) => (
              <div key={edu.id} className="text-xs flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="text-slate-600"> — {edu.institution}</span>
                </div>
                <span className="text-slate-500 text-[11px] font-mono">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
