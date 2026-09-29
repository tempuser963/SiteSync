import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../auth/AuthContext';
import { Card } from '../components/ui/Card';
import { StatusBadge, ConfidenceBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  FolderSync,
  HelpCircle,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Lock,
} from 'lucide-react';
import { ActivityMatch } from '../types';

export const ReviewPage: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const {
    activityMatches,
    activities,
    approveMapping,
    rejectMapping,
    remapActivity,
    stats,
  } = useProject();

  const { hasPermission } = useAuth();
  const canApprove = hasPermission('APPROVE_MAPPING');

  const [activeTab, setActiveTab] = useState<
    'All' | 'High' | 'Medium' | 'Low' | 'Unmatched'
  >('All');

  // Remap modal state
  const [remapModalOpen, setRemapModalOpen] = useState(false);
  const [activeMatchForRemap, setActiveMatchForRemap] =
    useState<ActivityMatch | null>(null);
  const [remapSearchQuery, setRemapSearchQuery] = useState('');
  const [selectedNewActivityId, setSelectedNewActivityId] = useState<string>('');

  // Pending review items (or items with status 'Review Required')
  const reviewItems = activityMatches.filter((m) => {
    if (m.status !== 'Review Required' && m.status !== 'Unmatched') return false;

    if (activeTab === 'High') return m.overallConfidence >= 90;
    if (activeTab === 'Medium')
      return m.overallConfidence >= 70 && m.overallConfidence < 90;
    if (activeTab === 'Low')
      return m.overallConfidence > 0 && m.overallConfidence < 70;
    if (activeTab === 'Unmatched') return m.status === 'Unmatched' || m.overallConfidence < 50;

    return true;
  });

  const handleOpenRemap = (match: ActivityMatch) => {
    if (!canApprove) return;
    setActiveMatchForRemap(match);
    setSelectedNewActivityId(match.activityId);
    setRemapModalOpen(true);
  };

  const handleConfirmRemap = () => {
    if (!activeMatchForRemap || !selectedNewActivityId) return;
    remapActivity(activeMatchForRemap.id, selectedNewActivityId);
    setRemapModalOpen(false);
    setActiveMatchForRemap(null);
  };

  const filteredScheduleActivities = activities.filter(
    (a) =>
      a.id.toLowerCase().includes(remapSearchQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(remapSearchQuery.toLowerCase()) ||
      a.discipline.toLowerCase().includes(remapSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {!embedded && <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              AI Review Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              {stats.pendingReview} Pending Review
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Human-in-the-loop verification for uncertain correlations and ambiguous field observations
          </p>
        </div>

        {!canApprove && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-md text-xs text-slate-600 dark:text-zinc-300">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Read-Only View • Planner Authority Required to Approve</span>
          </div>
        )}
      </div>}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2 text-xs font-medium overflow-x-auto">
        {(['All', 'High', 'Medium', 'Low', 'Unmatched'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === tab
                ? 'bg-brand dark:bg-yellow-400 dark:text-zinc-950 text-white font-semibold shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            {tab === 'All' ? 'All Pending' : `${tab} Confidence`}
          </button>
        ))}
      </div>

      {/* Review Item Cards */}
      {reviewItems.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No pending review items"
          description={`All items in the "${activeTab}" category have been verified or accepted.`}
          actionText="Switch to All Pending"
          onAction={() => setActiveTab('All')}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {reviewItems.map((item) => {
            const currentScheduleAct = activities.find(
              (a) => a.id === item.activityId
            );

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-5 shadow-xs space-y-4 flex flex-col justify-between"
              >
                {/* Top: Source & Confidence */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-800 dark:text-zinc-200">
                      Source:
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 font-mono text-[11px] text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                      {item.sourceDocument}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-medium">
                      {item.aiInterpretation.discipline}
                    </span>
                  </div>

                  <ConfidenceBadge confidence={item.overallConfidence} showBar />
                </div>

                {/* Section 1: Field Report */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    FIELD REPORT
                  </span>
                  <div className="p-3 rounded-md bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-xs font-mono text-slate-800 dark:text-zinc-200 italic">
                    "{item.fieldDescription}"
                  </div>
                </div>

                {/* Section 2: AI Suggestion */}
                <div>
                  <span className="text-[10px] font-bold text-brand dark:text-yellow-300 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI SUGGESTION
                  </span>
                  <div className="p-3 rounded-md bg-brand-soft/50 dark:bg-yellow-400/10 border border-brand-tint dark:border-yellow-400/20 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-sm font-bold text-brand-dark dark:text-yellow-200">
                        {item.activityId}
                      </div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200 mt-0.5">
                        {currentScheduleAct?.name || item.aiInterpretation.activity}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Location: {currentScheduleAct?.location || 'Area-A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: "WHY?" Evidence Checklist */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    WHY THIS MATCH?
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-zinc-300">
                    {item.matchEvidence.map((ev, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {ev.matched ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <span className="w-3.5 h-3.5 text-rose-500 font-bold shrink-0 text-center">
                            ✕
                          </span>
                        )}
                        <span className="text-[11px] leading-tight">
                          <strong className="text-slate-800 dark:text-zinc-200">
                            {ev.type}:
                          </strong>{' '}
                          {ev.detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Section 4: Interactive Actions (Respects Permissions) */}
                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-2 text-xs">
                  {canApprove ? (
                    <>
                      <button
                        onClick={() => approveMapping(item.id)}
                        className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md flex items-center justify-center gap-1.5 transition shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </button>

                      <button
                        onClick={() => rejectMapping(item.id, 'Planner rejected AI correlation')}
                        className="py-2 px-3 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-semibold rounded-md flex items-center justify-center gap-1.5 transition"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>

                      <button
                        onClick={() => handleOpenRemap(item)}
                        className="py-2 px-3 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 font-semibold rounded-md flex items-center justify-center gap-1.5 transition"
                      >
                        <FolderSync className="w-4 h-4" /> Choose Activity
                      </button>
                    </>
                  ) : (
                    <div className="w-full py-2 px-3 bg-slate-100 dark:bg-zinc-800 text-slate-500 text-center rounded-md font-medium text-xs">
                      View Only (Approval restricted to Project Planners and Managers)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Remap Modal */}
      <Modal
        isOpen={remapModalOpen}
        onClose={() => setRemapModalOpen(false)}
        title="Choose Target Schedule Activity"
        subtitle="Remap field observation to an alternative L5/L6 activity in master schedule"
        maxWidth="2xl"
        footer={
          <>
            <button
              onClick={() => setRemapModalOpen(false)}
              className="px-3 py-1.5 border border-slate-300 dark:border-zinc-700 rounded-md text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              disabled={!selectedNewActivityId}
              onClick={handleConfirmRemap}
              className="px-4 py-1.5 bg-brand dark:bg-yellow-400 dark:text-zinc-950 hover:bg-brand-dark dark:hover:bg-yellow-300 disabled:opacity-50 text-white text-xs font-semibold rounded-md shadow-xs transition"
            >
              Confirm Remap
            </button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-md border border-slate-200 dark:border-zinc-700">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">
              Field Observation
            </span>
            <p className="font-mono text-slate-800 dark:text-zinc-200 mt-0.5">
              "{activeMatchForRemap?.fieldDescription}"
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search schedule activities..."
              value={remapSearchQuery}
              onChange={(e) => setRemapSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-brand dark:focus:border-yellow-400"
            />
          </div>

          <div className="max-h-60 overflow-y-auto border border-slate-200 dark:border-zinc-800 rounded-md divide-y divide-slate-100 dark:divide-zinc-800">
            {filteredScheduleActivities.map((act) => {
              const isSelected = selectedNewActivityId === act.id;
              return (
                <div
                  key={act.id}
                  onClick={() => setSelectedNewActivityId(act.id)}
                  className={`p-2.5 flex items-center justify-between cursor-pointer transition ${
                    isSelected
                      ? 'bg-brand-soft dark:bg-yellow-400/10 text-brand-deep dark:text-yellow-100'
                      : 'hover:bg-slate-50 dark:hover:bg-zinc-800/40 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  <div>
                    <div className="font-mono font-bold text-brand dark:text-yellow-300">
                      {act.id}
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-zinc-100">
                      {act.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {act.discipline} • {act.location} • Status: {act.status}
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-brand dark:text-yellow-300 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
};
