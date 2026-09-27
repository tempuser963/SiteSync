import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../auth/AuthContext';
import { Card } from '../components/ui/Card';
import { SeverityBadge, StatusBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  FileText,
  ArrowRight,
  Eye,
  Check,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { Contradiction } from '../types';

export const ContradictionsPage: React.FC = () => {
  const { contradictions, resolveContradiction, stats } = useProject();
  const { hasPermission } = useAuth();
  const canResolve = hasPermission('RESOLVE_CONTRADICTION');

  const [selectedContradiction, setSelectedContradiction] =
    useState<Contradiction | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  const highCount = contradictions.filter(
    (c) => c.severity === 'High' && c.status !== 'Resolved'
  ).length;
  const mediumCount = contradictions.filter(
    (c) => c.severity === 'Medium' && c.status !== 'Resolved'
  ).length;
  const lowCount = contradictions.filter(
    (c) => c.severity === 'Low' && c.status !== 'Resolved'
  ).length;

  const filteredContradictions = contradictions.filter((c) => {
    if (severityFilter === 'All') return true;
    return c.severity === severityFilter;
  });

  const handleOpenDetail = (contra: Contradiction) => {
    setSelectedContradiction(contra);
    setDetailModalOpen(true);
  };

  const handleResolveAction = (resolution: string) => {
    if (!selectedContradiction || !canResolve) return;
    resolveContradiction(selectedContradiction.id, resolution);
    setDetailModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              Evidence &amp; Contradiction Center
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
              Integrity Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Identify conflicting field observations before they affect project records
          </p>
        </div>

        {!canResolve && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-md text-xs text-slate-600 dark:text-zinc-300">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Read-Only View • Planner Authority Required to Resolve</span>
          </div>
        )}
      </div>

      {/* Summary Cards: 7 Total, 2 High, 3 Medium, 2 Low */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setSeverityFilter('All')}
          className={`p-4 rounded-lg bg-white dark:bg-zinc-900 border transition cursor-pointer ${
            severityFilter === 'All'
              ? 'border-brand dark:border-yellow-400 ring-1 ring-brand dark:ring-yellow-400'
              : 'border-slate-200 dark:border-zinc-800'
          }`}
        >
          <div className="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
            Total Contradictions
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-zinc-100">
            {stats.contradictions} Total
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Cross-source discrepancies</div>
        </div>

        <div
          onClick={() => setSeverityFilter('High')}
          className={`p-4 rounded-lg bg-white dark:bg-zinc-900 border transition cursor-pointer ${
            severityFilter === 'High'
              ? 'border-rose-500 ring-1 ring-rose-500'
              : 'border-rose-200 dark:border-rose-900'
          }`}
        >
          <div className="text-xs font-medium text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> High Severity
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            {highCount} High
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Completion conflicts</div>
        </div>

        <div
          onClick={() => setSeverityFilter('Medium')}
          className={`p-4 rounded-lg bg-white dark:bg-zinc-900 border transition cursor-pointer ${
            severityFilter === 'Medium'
              ? 'border-amber-500 ring-1 ring-amber-500'
              : 'border-amber-200 dark:border-amber-900'
          }`}
        >
          <div className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Medium Severity
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {mediumCount} Medium
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Progress &amp; start discrepancies</div>
        </div>

        <div
          onClick={() => setSeverityFilter('Low')}
          className={`p-4 rounded-lg bg-white dark:bg-zinc-900 border transition cursor-pointer ${
            severityFilter === 'Low'
              ? 'border-slate-500 ring-1 ring-slate-500'
              : 'border-slate-200 dark:border-zinc-800'
          }`}
        >
          <div className="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
            Low Severity
          </div>
          <div className="text-2xl font-bold text-slate-700 dark:text-zinc-300">
            {lowCount} Low
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Duplicates &amp; minor lags</div>
        </div>
      </div>

      {/* Main Contradiction Cards */}
      <div className="space-y-4">
        {filteredContradictions.map((contra) => (
          <div
            key={contra.id}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-5 shadow-xs space-y-4 transition hover:border-slate-300 dark:hover:border-zinc-700"
          >
            {/* Top row: ID, Name, Severity, Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    {contra.id}
                  </span>
                  <span className="font-mono font-bold text-brand dark:text-yellow-300 text-sm">
                    {contra.activityId}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="font-semibold text-slate-900 dark:text-zinc-100 text-sm">
                    {contra.activityName}
                  </span>
                  <span className="text-slate-400 text-xs">({contra.discipline})</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <SeverityBadge severity={contra.severity} />
                <StatusBadge status={contra.status} size="sm" />
              </div>
            </div>

            {/* AI Conclusion Alert Box */}
            <div className="p-3 rounded-md bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 text-xs">
              <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                AI Conclusion: {contra.aiConclusion}
              </span>
              <p className="text-slate-700 dark:text-zinc-300 leading-normal pl-5">
                {contra.aiReasoning}
              </p>
            </div>

            {/* Evidence Items Strip */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Contradicting Evidence Sources ({contra.evidenceItems.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {contra.evidenceItems.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-md bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-zinc-200">
                        {ev.source}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {new Date(ev.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Reported: <strong className="text-brand dark:text-yellow-300 font-semibold">{ev.value}</strong>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-zinc-400 italic line-clamp-2">
                      "{ev.rawText}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resolution Note if resolved */}
            {contra.resolution && (
              <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Resolved by {contra.resolvedBy}:</strong> {contra.resolution}
                </span>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleOpenDetail(contra)}
                className="py-1.5 px-3 border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-md flex items-center gap-1.5 transition"
              >
                <Eye className="w-3.5 h-3.5" /> View Evidence Side-by-Side
              </button>

              {contra.status !== 'Resolved' && canResolve && (
                <button
                  onClick={() => handleOpenDetail(contra)}
                  className="py-1.5 px-3 bg-brand dark:bg-yellow-400 dark:text-zinc-950 hover:bg-brand-dark dark:hover:bg-yellow-300 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 shadow-xs transition"
                >
                  <Check className="w-3.5 h-3.5" /> Resolve Contradiction
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Contradiction Detail Side-by-Side Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={selectedContradiction ? `Resolve Contradiction: ${selectedContradiction.activityId}` : 'Contradiction Resolution'}
        subtitle={selectedContradiction?.activityName}
        maxWidth="3xl"
        footer={
          selectedContradiction?.status !== 'Resolved' ? (
            canResolve ? (
              <div className="flex flex-wrap gap-2 w-full justify-between items-center">
                <button
                  onClick={() => handleResolveAction('Under Review')}
                  className="py-1.5 px-3 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  Keep Under Review
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleResolveAction('Supervisor Report marked as authoritative')
                    }
                    className="py-1.5 px-3 bg-slate-800 hover:bg-slate-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white text-xs font-semibold rounded-md transition"
                  >
                    Mark Supervisor as Correct
                  </button>
                  <button
                    onClick={() =>
                      handleResolveAction('Inspection Report marked as authoritative')
                    }
                    className="py-1.5 px-3 bg-brand dark:bg-yellow-400 dark:text-zinc-950 hover:bg-brand-dark dark:hover:bg-yellow-300 text-white text-xs font-semibold rounded-md shadow-xs transition"
                  >
                    Mark Inspection as Correct
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-between items-center text-xs text-slate-500">
                <span>Resolution restricted to Project Planners and Managers</span>
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="py-1.5 px-4 bg-slate-800 text-white text-xs font-semibold rounded-md"
                >
                  Close
                </button>
              </div>
            )
          ) : (
            <button
              onClick={() => setDetailModalOpen(false)}
              className="py-1.5 px-4 bg-slate-800 text-white text-xs font-semibold rounded-md"
            >
              Close
            </button>
          )
        }
      >
        {selectedContradiction && (
          <div className="space-y-4 text-xs">
            {/* Side-by-Side Evidence Table */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Side-by-Side Evidence Comparison
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedContradiction.evidenceItems.slice(0, 2).map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2">
                      <span className="font-bold text-slate-900 dark:text-zinc-100 text-sm">
                        {ev.source}
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">
                        {new Date(ev.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-semibold">
                        Claimed Value:
                      </span>
                      <div className="text-base font-bold text-brand dark:text-yellow-300">
                        {ev.value}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-semibold">
                        Raw Transcript:
                      </span>
                      <p className="text-slate-700 dark:text-zinc-300 italic font-mono mt-0.5 leading-relaxed">
                        "{ev.rawText}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why This Matters Box */}
            <div className="p-3.5 bg-brand-soft/70 dark:bg-yellow-400/10 border border-brand-tint dark:border-yellow-400/25 rounded-md space-y-1">
              <span className="font-bold text-brand-deep dark:text-yellow-200 block text-xs">
                Why this matters
              </span>
              <p className="text-slate-700 dark:text-zinc-300 leading-relaxed text-xs">
                Different sources report inconsistent completion states for the same activity.
                Accepting an incorrect completion record prematurely releases successor tasks,
                distorting EVM (Earned Value Management) metrics and creating physical safety
                hazards on site.
              </p>
            </div>

            {/* AI Integrity Analysis */}
            <div className="p-3.5 bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-md space-y-1">
              <span className="font-bold text-slate-800 dark:text-zinc-200 block text-xs">
                AI Evidentiary Assessment
              </span>
              <p className="text-slate-600 dark:text-zinc-400 leading-normal">
                {selectedContradiction.aiReasoning}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
