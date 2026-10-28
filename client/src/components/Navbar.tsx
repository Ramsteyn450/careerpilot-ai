import React, { useState } from 'react';
import { Sparkles, ArrowRight, Menu, X, FileCheck, Wand2, LayoutTemplate, Info, Home } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { activeResume } = useResume();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'analyze', label: 'Analyze Resume', icon: FileCheck },
    { id: 'improve', label: 'Improve Resume', icon: Wand2 },
    { id: 'templates', label: 'Resume Templates', icon: LayoutTemplate },
    { id: 'about', label: 'About', icon: Info }
  ];

  const handleNavClick = (tabId: string) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-[#090d16]/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer group select-none"
          onClick={() => handleNavClick('home')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                CareerPilot <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">AI</span>
              </span>
              <span className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                Resume Intelligence
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden md:block">
              AI-Powered Resume Evaluation &amp; Improvement
            </span>
          </div>
        </div>

        {/* 5 Main Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300 font-bold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.id === 'analyze' && activeResume && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" title="Resume uploaded" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={() => handleNavClick('templates')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            Explore Templates
          </button>
          <button
            onClick={() => handleNavClick('analyze')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Analyze My Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 text-indigo-500" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('analyze')}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/25"
            >
              <span>Analyze My Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleNavClick('templates')}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200"
            >
              Explore Templates
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
