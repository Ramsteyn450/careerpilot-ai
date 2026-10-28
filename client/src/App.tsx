import React, { useState } from 'react';
import { ResumeProvider } from './context/ResumeContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { ResumeAnalyzerView } from './pages/ResumeAnalyzerView';
import { ImproveResumeView } from './pages/ImproveResumeView';
import { TemplateGalleryView } from './pages/TemplateGalleryView';
import { ResumeBuilderView } from './pages/ResumeBuilderView';
import { AboutPage } from './pages/AboutPage';

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>(() => {
    return sessionStorage.getItem('careerpilot_tab') || 'home';
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    sessionStorage.setItem('careerpilot_tab', tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    handleTabChange('builder');
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <LandingPage
            onAnalyzeResume={() => handleTabChange('analyze')}
            onExploreTemplates={() => handleTabChange('templates')}
          />
        );
      case 'analyze':
        return <ResumeAnalyzerView onNavigate={handleTabChange} />;
      case 'improve':
        return <ImproveResumeView onNavigate={handleTabChange} />;
      case 'templates':
        return <TemplateGalleryView onSelectTemplate={handleSelectTemplate} />;
      case 'builder':
        return <ResumeBuilderView onNavigate={handleTabChange} initialTemplateId={selectedTemplateId} />;
      case 'about':
        return <AboutPage onNavigate={handleTabChange} />;
      default:
        return (
          <LandingPage
            onAnalyzeResume={() => handleTabChange('analyze')}
            onExploreTemplates={() => handleTabChange('templates')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans">
      <Navbar currentTab={currentTab} onNavigate={handleTabChange} />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <ResumeProvider>
      <AppContent />
    </ResumeProvider>
  );
}
