import React, { useEffect, useMemo } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import { AlertTriangle, ClipboardCheck, Inbox, ArrowRight } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useProject } from '../context/ProjectContext';
import { FieldUpdatesPage } from './FieldUpdatesPage';
import { ReviewPage } from './ReviewPage';
import { ContradictionsPage } from './ContradictionsPage';

type FieldOperationsTab = 'updates' | 'reviews' | 'conflicts';

interface FieldOperationsPageProps {
  initialTab?: FieldOperationsTab;
}

const tabLabels: Record<FieldOperationsTab, string> = {
  updates: 'Updates',
  reviews: 'Reviews',
  conflicts: 'Conflicts',
};

export const FieldOperationsPage: React.FC<FieldOperationsPageProps> = ({
  initialTab = 'updates',
}) => {
  const { hasPermission } = useAuth();
  const { fieldUpdates, activityMatches, contradictions } = useProject();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const canViewUpdates = hasPermission('APPROVE_MAPPING');
  const canViewReviews = hasPermission('APPROVE_MAPPING');
  const canViewConflicts = hasPermission('RESOLVE_CONTRADICTION');

  const availableTabs = useMemo<FieldOperationsTab[]>(
    () => [
      ...(canViewUpdates ? ['updates' as const] : []),
      ...(canViewReviews ? ['reviews' as const] : []),
      ...(canViewConflicts ? ['conflicts' as const] : []),
    ],
    [canViewConflicts, canViewReviews, canViewUpdates]
  );

  const requestedTab = searchParams.get('tab') as FieldOperationsTab | null;
  const activeTab = availableTabs.includes(requestedTab ?? initialTab)
    ? (requestedTab ?? initialTab)
    : availableTabs[0];

  useEffect(() => {
    if (activeTab && searchParams.get('tab') !== activeTab) {
      setSearchParams({ tab: activeTab }, { replace: true });
    }
  }, [activeTab, searchParams, setSearchParams]);

  if (!availableTabs.length) {
    return <Navigate to="/unauthorized" replace />;
  }

  const pendingUpdates = fieldUpdates.filter(
    (update) =>
      update.status === 'Submitted' ||
      update.status === 'Matched' ||
      update.status === 'Under Review'
  ).length;
  const pendingReviews = activityMatches.filter(
    (match) => match.status === 'Review Required' || match.status === 'Unmatched'
  ).length;
  const unresolvedConflicts = contradictions.filter(
    (contradiction) => contradiction.status !== 'Resolved'
  ).length;

  const tabs = [
    {
      key: 'updates' as const,
      label: tabLabels.updates,
      icon: Inbox,
      count: pendingUpdates,
      visible: canViewUpdates,
      badge: 'warning',
    },
    {
      key: 'reviews' as const,
      label: tabLabels.reviews,
      icon: ClipboardCheck,
      count: pendingReviews,
      visible: canViewReviews,
      badge: 'warning',
    },
    {
      key: 'conflicts' as const,
      label: tabLabels.conflicts,
      icon: AlertTriangle,
      count: unresolvedConflicts,
      visible: canViewConflicts,
      badge: 'danger',
    },
  ];

  const recentActivity = [
    ...fieldUpdates.slice(0, 2).map((update) => ({
      id: update.id,
      description: `Field update ${update.status.toLowerCase()}`,
      detail: update.activityId || update.source,
      timestamp: update.submittedAt,
      tab: 'updates' as const,
    })),
    ...activityMatches
      .filter((match) => match.reviewedAt)
      .slice(0, 2)
      .map((match) => ({
        id: match.id,
        description: `Mapping ${match.status.toLowerCase()}`,
        detail: match.activityId,
        timestamp: match.reviewedAt || match.createdAt,
        tab: 'reviews' as const,
      })),
    ...contradictions
      .filter((contradiction) => contradiction.status !== 'Open')
      .slice(0, 2)
      .map((contradiction) => ({
        id: contradiction.id,
        description: `Contradiction ${contradiction.status.toLowerCase()}`,
        detail: contradiction.activityId,
        timestamp: contradiction.resolvedAt || contradiction.detectedAt,
        tab: 'conflicts' as const,
      })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 4);

  const selectTab = (tab: FieldOperationsTab) => {
    setSearchParams({ tab });
  };

  const openTab = (tab: FieldOperationsTab) => {
    if (!availableTabs.includes(tab)) return;
    selectTab(tab);
    navigate(`/field-operations?tab=${tab}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              Field Operations
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-soft text-brand-dark dark:bg-yellow-400/15 dark:text-yellow-200 border border-brand-tint dark:border-yellow-400/30">
              Unified Workspace
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Monitor incoming updates, review pending work, and resolve contradictions in one workspace.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Incoming Updates', count: pendingUpdates, tab: 'updates' as const, tone: 'brand' },
          { label: 'Pending Reviews', count: pendingReviews, tab: 'reviews' as const, tone: 'amber' },
          { label: 'Unresolved Conflicts', count: unresolvedConflicts, tab: 'conflicts' as const, tone: 'rose' },
        ].map((metric) => (
          <button
            key={metric.tab}
            type="button"
            onClick={() => openTab(metric.tab)}
            disabled={!availableTabs.includes(metric.tab)}
            className={`text-left p-4 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs transition ${
              availableTabs.includes(metric.tab)
                ? 'hover:border-brand dark:hover:border-yellow-400 cursor-pointer'
                : 'opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="text-xs font-medium text-slate-500 dark:text-zinc-400">{metric.label}</div>
            <div className="mt-1 flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900 dark:text-zinc-100">{metric.count}</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-1 border-b border-slate-200 dark:border-zinc-800 overflow-x-auto" role="tablist" aria-label="Field Operations sections">
        {tabs.filter((tab) => tab.visible).map(({ key, label, icon: Icon, count, badge }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeTab === key}
            onClick={() => selectTab(key)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition ${
              activeTab === key
                ? 'border-brand text-brand-dark dark:border-yellow-400 dark:text-yellow-300'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            <span className={`min-w-5 px-1.5 py-0.5 rounded-full text-[10px] text-center font-bold ${
              badge === 'danger'
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {activeTab === 'updates' && <FieldUpdatesPage embedded />}
      {activeTab === 'reviews' && <ReviewPage embedded />}
      {activeTab === 'conflicts' && <ContradictionsPage embedded />}

      {recentActivity.length > 0 && (
        <section className="border-t border-slate-200 dark:border-zinc-800 pt-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Recent Activity</h2>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">Latest changes across field operations</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {recentActivity.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => openTab(event.tab)}
                className="flex items-center gap-3 text-left p-3 rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-brand dark:hover:border-yellow-400 transition"
              >
                <span className="w-2 h-2 rounded-full bg-brand dark:bg-yellow-400 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate">{event.description}</span>
                  <span className="block text-[10px] text-slate-500 dark:text-zinc-400 truncate">{event.detail}</span>
                </span>
                <span className="text-[10px] text-slate-400 shrink-0">{new Date(event.timestamp).toLocaleDateString()}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
