import React from 'react';
import { StructuredResumeData } from '../../../../shared/types';
import { ATSClassicTemplate } from './ATSClassicTemplate';
import { ModernProfessionalTemplate } from './ModernProfessionalTemplate';
import { MinimalTechTemplate } from './MinimalTechTemplate';
import { DataAnalystTemplate } from './DataAnalystTemplate';
import { CloudArchitectTemplate } from './CloudArchitectTemplate';
import { CreativePortfolioTemplate } from './CreativePortfolioTemplate';
import { CleanCorporateTemplate } from './CleanCorporateTemplate';
import { FresherStarterTemplate } from './FresherStarterTemplate';
import { CybersecuritySentinelTemplate } from './CybersecuritySentinelTemplate';
import { AcademicResearcherTemplate } from './AcademicResearcherTemplate';
import { TwoColumnModernTemplate } from './TwoColumnModernTemplate';
import { ElegantMonochromeTemplate } from './ElegantMonochromeTemplate';

interface TemplateRendererProps {
  templateId: string;
  data: StructuredResumeData;
  accentColor?: string;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  templateId,
  data,
  accentColor
}) => {
  switch (templateId) {
    case 'ats-classic':
      return <ATSClassicTemplate data={data} accentColor={accentColor} />;
    case 'modern-professional':
      return <ModernProfessionalTemplate data={data} accentColor={accentColor} />;
    case 'minimal-tech':
      return <MinimalTechTemplate data={data} accentColor={accentColor} />;
    case 'data-analytics-pro':
      return <DataAnalystTemplate data={data} accentColor={accentColor} />;
    case 'cloud-architect':
      return <CloudArchitectTemplate data={data} accentColor={accentColor} />;
    case 'creative-portfolio':
      return <CreativePortfolioTemplate data={data} accentColor={accentColor} />;
    case 'clean-corporate':
      return <CleanCorporateTemplate data={data} accentColor={accentColor} />;
    case 'fresher-starter':
      return <FresherStarterTemplate data={data} accentColor={accentColor} />;
    case 'cybersecurity-sentinel':
      return <CybersecuritySentinelTemplate data={data} accentColor={accentColor} />;
    case 'academic-researcher':
      return <AcademicResearcherTemplate data={data} accentColor={accentColor} />;
    case 'two-column-modern':
      return <TwoColumnModernTemplate data={data} accentColor={accentColor} />;
    case 'elegant-monochrome':
      return <ElegantMonochromeTemplate data={data} accentColor={accentColor} />;
    default:
      return <ModernProfessionalTemplate data={data} accentColor={accentColor} />;
  }
};
