import React from 'react';
import { StructuredResumeData } from '../../../../shared/types';

interface TemplateProps {
  data: StructuredResumeData;
  accentColor?: string;
}

export const CybersecuritySentinelTemplate: React.FC<TemplateProps> = ({
  data,
  accentColor = '#0D9488'
}) => {
  return (
    <div className="w-full bg-white text-slate-800 p-8 sm:p-12 font-sans text-[10.5pt] leading-relaxed">
      {/* Security Operations Header */}
      <div className="border-b-2 pb-4 mb-4" style={{ borderColor: accentColor }}>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
          <div>
            <div className="inline-block px-2 py-0.5 rounded bg-teal-100 text-teal-900 text-[10px] font-mono font-bold tracking-wider uppercase mb-1">
              [ SEC_OPERATIONS // THREAT_DEFENSE ]
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {data.contact.fullName || 'Alex Morgan'}
            </h1>
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-teal-700 mt-0.5">
              {data.experience?.[0]?.role || 'Cybersecurity & Information Security Analyst'}
            </p>
          </div>
          <div className="text-xs text-slate-600 sm:text-right mt-2 sm:mt-0 font-mono space-y-0.5">
            <div>{data.contact.location} • {data.contact.phone}</div>
            <div className="text-teal-800 font-bold">{data.contact.email}</div>
            {data.contact.linkedinUrl && <div>{data.contact.linkedinUrl.replace(/^https?:\/\//, '')}</div>}
            {data.contact.githubUrl && <div>{data.contact.githubUrl.replace(/^https?:\/\//, '')}</div>}
          </div>
        </div>
      </div>

      {/* Security Credentials Banner */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="mb-4 bg-slate-900 text-teal-400 p-3 rounded-lg font-mono text-xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
            Verified Security Accreditations &amp; Clearance:
          </span>
          <div className="flex flex-wrap gap-2 text-white">
            {data.certifications.map((c) => (
              <span key={c.id} className="bg-slate-800 px-2 py-0.5 rounded border border-teal-500/40 text-[11px]">
                🛡️ {c.name} <span className="text-teal-400 text-[10px]">({c.issuer})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Executive Security Summary */}
      {data.summary && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 flex items-center gap-1.5 font-mono">
            <span className="text-teal-700 font-bold">#</span>
            <span>Security Profile &amp; Risk Mitigation Focus</span>
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            {data.summary}
          </p>
        </div>
      )}

      {/* Security Domain & Tool Stack */}
      {data.skills && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5 font-mono">
            <span className="text-teal-700 font-bold">#</span>
            <span>Defensive Tooling &amp; Compliance Frameworks</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-teal-900 block mb-1">SIEM &amp; Threat Detection</span>
              <span className="text-slate-700 text-[10.5px]">Splunk, Wireshark, Sentinel, Elastic SIEM</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-teal-900 block mb-1">Testing &amp; Vulnerability</span>
              <span className="text-slate-700 text-[10.5px]">{data.skills.technical?.join(', ') || 'Nessus, Burp Suite, Metasploit'}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-teal-900 block mb-1">Standards &amp; Governance</span>
              <span className="text-slate-700 text-[10.5px]">SOC 2 Type II, ISO 27001, NIST CSF, GDPR</span>
            </div>
          </div>
        </div>
      )}

      {/* Security Work Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5 font-mono">
            <span className="text-teal-700 font-bold">#</span>
            <span>Incident Response &amp; Security Engineering Experience</span>
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                  <span className="text-[11px] font-mono text-teal-800 font-semibold">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="text-xs font-semibold text-slate-600 mb-1">
                  {exp.company} {exp.location ? `— ${exp.location}` : ''}
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

      {/* Security Audits & Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5 font-mono">
            <span className="text-teal-700 font-bold">#</span>
            <span>Security Audits &amp; Penetration Testing Deliverables</span>
          </h2>
          <div className="space-y-2">
            {data.projects.map((proj) => (
              <div key={proj.id} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-baseline text-xs font-bold text-slate-900 mb-0.5">
                  <span>{proj.title}</span>
                  {proj.link && <span className="text-[10px] text-teal-700 font-mono">{proj.link}</span>}
                </div>
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 font-mono">
            # Academic Credentials
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="text-xs">
              <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
              <span className="text-slate-600"> — {edu.institution} ({edu.startDate} – {edu.endDate})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
