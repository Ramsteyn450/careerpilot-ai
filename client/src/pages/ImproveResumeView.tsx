import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Check,
  X,
  Edit3,
  RotateCcw,
  ShieldCheck,
  History,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Layers,
  RefreshCw
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { ImprovementSuggestion, ResumeVersion } from '../../../shared/types';

interface ImproveResumeViewProps {
  onNavigate: (tab: string) => void;
}

export const ImproveResumeView: React.FC<ImproveResumeViewProps> = ({ onNavigate }) => {
  const {
    activeResume,
    activeAnalysis,
    applyApprovedSuggestions,
    restoreVersion,
    restoreOriginal,
    reAnalyzeActive,
    loading
  } = useResume();

  const [mode, setMode] = useState<'suggestion' | 'edit'>('suggestion');
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [editingSuggestionId, setEditingSuggestionId] = useState<string | null>(null);
  const [manualText, setManualText] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedSection, setSelectedSection] = useState<'all' | 'summary' | 'experience' | 'projects'>('all');

  // Keep suggestions synced whenever activeAnalysis updates
  useEffect(() => {
    if (activeAnalysis?.actionableRecommendations) {
      setSuggestions(activeAnalysis.actionableRecommendations);
    }
  }, [activeAnalysis]);

  if (!activeResume) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">No Resume Uploaded Yet</h2>
        <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
          Please upload your resume in the Resume Analyzer first. The system will inspect your content and generate personalized side-by-side improvement suggestions.
        </p>
        <button
          onClick={() => onNavigate('analyze')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 inline-flex items-center gap-2 transition-all hover:scale-105"
        >
          <span>Go to Resume Analyzer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Handle suggestion status toggles
  const handleAccept = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'accepted' } : s))
    );
  };

  const handleReject = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'rejected' } : s))
    );
  };

  const handleAcceptAll = () => {
    setSuggestions((prev) => prev.map((s) => ({ ...s, status: 'accepted' })));
  };

  const handleRejectAll = () => {
    setSuggestions((prev) => prev.map((s) => ({ ...s, status: 'rejected' })));
  };

  const handleStartManualEdit = (s: ImprovementSuggestion) => {
    setEditingSuggestionId(s.id);
    setManualText(s.modifiedUserText || s.suggestedText);
  };

  const handleSaveManualEdit = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              modifiedUserText: manualText,
              status: 'accepted'
            }
          : s
      )
    );
    setEditingSuggestionId(null);
  };

  const acceptedCount = suggestions.filter((s) => s.status === 'accepted').length;

  const handleConfirmApply = async () => {
    setIsApplying(true);
    try {
      const accepted = suggestions.filter((s) => s.status === 'accepted');
      const newVersion = await applyApprovedSuggestions(accepted, 'AI Enhanced Version');
      setShowConfirmModal(false);
      setSuccessMessage(
        `Applied ${accepted.length} approved changes! Saved as ${newVersion?.versionName || 'New Version'}. Your original resume remains safely intact.`
      );
      setTimeout(() => setSuccessMessage(''), 7000);
    } catch (err: any) {
      alert(`Error applying changes: ${err.message}`);
    } finally {
      setIsApplying(false);
    }
  };

  const filteredSuggestions = selectedSection === 'all'
    ? suggestions
    : suggestions.filter((s) => s.section === selectedSection);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <span>Improve My Resume</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
              User-Controlled Alteration
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Section-by-section AI enhancements with side-by-side comparisons. No changes are applied without your explicit consent.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => reAnalyzeActive()}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-indigo-500/40 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors disabled:opacity-50"
            title="Generate fresh recommendations"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Regenerate Suggestions</span>
          </button>

          <button
            onClick={() => setShowVersionHistory(!showVersionHistory)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-indigo-500/40 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors"
          >
            <History className="w-4 h-4 text-indigo-400" />
            <span>Version History ({activeResume?.versions?.length || 1})</span>
          </button>

          <button
            onClick={() => onNavigate('builder')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-500/25 flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Open in Builder</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-white/10 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-950 p-1 border border-white/10">
            <button
              onClick={() => setMode('suggestion')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'suggestion'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Suggestion Mode
            </button>
            <button
              onClick={() => setMode('edit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'edit'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Approval / Edit Mode
            </button>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            {mode === 'suggestion'
              ? 'Preview recommendations without modifying your document.'
              : 'Accept, reject, or fine-tune individual changes.'}
          </span>
        </div>

        {/* Bulk Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAcceptAll}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
          >
            Accept All
          </button>
          <button
            onClick={handleRejectAll}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            Reject All
          </button>
          <button
            disabled={acceptedCount === 0}
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Apply Approved ({acceptedCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Section Filter Pills */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-medium mr-1">Filter Section:</span>
        {(['all', 'summary', 'experience', 'projects'] as const).map((sec) => (
          <button
            key={sec}
            onClick={() => setSelectedSection(sec)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
              selectedSection === sec
                ? 'bg-slate-800 text-white border border-indigo-500/40'
                : 'text-slate-400 hover:text-white bg-slate-950/60'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Side-by-Side Comparison Suggestions */}
      <div className="space-y-6">
        {filteredSuggestions.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-white/10 text-slate-400 space-y-3">
            <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
            <p className="text-sm">No suggestions found for this section.</p>
            <button
              onClick={() => reAnalyzeActive()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors"
            >
              Analyze & Generate Suggestions
            </button>
          </div>
        ) : (
          filteredSuggestions.map((sugg) => {
            const isEditing = editingSuggestionId === sugg.id;
            return (
              <div
                key={sugg.id}
                className={`rounded-2xl border transition-all p-6 ${
                  sugg.status === 'accepted'
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : sugg.status === 'rejected'
                    ? 'border-red-500/20 bg-slate-900/20 opacity-60'
                    : 'border-white/10 bg-slate-900/60'
                }`}
              >
                {/* Header tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      Section: {sugg.section}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        sugg.impact === 'High'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-indigo-500/10 text-indigo-400'
                      }`}
                    >
                      {sugg.impact} Impact
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {sugg.status === 'accepted' && (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Approved
                      </span>
                    )}
                    {sugg.status === 'rejected' && (
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <X className="w-4 h-4" />
                        Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Side-by-side comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Original Content */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Original Resume Text
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {sugg.originalText}
                    </p>
                  </div>

                  {/* AI Suggested Content */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/30 to-violet-950/30 border border-indigo-500/20 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        AI Enhanced Proposal
                      </span>
                      {sugg.modifiedUserText && (
                        <span className="text-[10px] text-amber-400 font-medium">User Customized</span>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          rows={3}
                          value={manualText}
                          onChange={(e) => setManualText(e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-slate-950 border border-indigo-500 text-xs text-white focus:outline-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingSuggestionId(null)}
                            className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveManualEdit(sugg.id)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-bold"
                          >
                            Save & Accept
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-emerald-300/90 leading-relaxed font-sans">
                        {sugg.modifiedUserText || sugg.suggestedText}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rationale explanation */}
                <div className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 font-semibold">Why this matters:</span>
                    <span>{sugg.rationale}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleStartManualEdit(sugg)}
                      className="px-2.5 py-1 rounded-lg text-xs text-slate-300 hover:text-white bg-slate-900 border border-white/10 hover:border-white/20 transition-all flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleReject(sugg.id)}
                      className="px-2.5 py-1 rounded-lg text-xs text-red-400 hover:text-red-300 bg-red-950/30 border border-red-500/20 transition-all flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleAccept(sugg.id)}
                      className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-lg w-full rounded-2xl bg-slate-900 border border-indigo-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Confirm Resume Version Creation</h3>
                <p className="text-xs text-slate-400">Permission-based resume alteration</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-2 text-xs text-slate-300">
              <p className="font-semibold text-white">
                "Review your changes before applying them. Your original resume will remain unchanged."
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-400">
                <li>{acceptedCount} approved enhancements will be applied.</li>
                <li>Saved automatically as a new version with a complete audit trail.</li>
                <li>You can restore or compare with any previous version anytime.</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800"
              >
                Back to Review
              </button>
              <button
                disabled={isApplying}
                onClick={handleConfirmApply}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/30 disabled:opacity-50"
              >
                {isApplying ? 'Creating New Version...' : 'Confirm & Save Version'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History Drawer / Modal */}
      {showVersionHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-2xl w-full rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Resume Version History</h3>
              </div>
              <button
                onClick={() => setShowVersionHistory(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {activeResume?.versions?.map((ver) => {
                const isActive = activeResume.activeVersionId === ver.id;
                return (
                  <div
                    key={ver.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isActive
                        ? 'border-indigo-500/50 bg-indigo-950/20'
                        : 'border-white/5 bg-slate-950/60'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{ver.versionName}</h4>
                          {isActive && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                              Active Version
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{new Date(ver.createdAt).toLocaleString()}</span>
                        </p>
                      </div>

                      {!isActive && (
                        <button
                          onClick={async () => {
                            await restoreVersion(ver.id);
                            setShowVersionHistory(false);
                          }}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-colors"
                        >
                          Restore This Version
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-900/50 p-2.5 rounded-lg border border-white/5">
                      {ver.changeSummary || 'Original upload state.'}
                    </p>

                    {ver.approvedChanges && ver.approvedChanges.length > 0 && (
                      <div className="mt-3 text-[11px] text-slate-400 space-y-1">
                        <span className="font-semibold text-slate-300">Audit Trail:</span>
                        {ver.approvedChanges.map((c, i) => (
                          <div key={i} className="truncate text-slate-400">
                            • [{c.section}]: {c.approved}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
