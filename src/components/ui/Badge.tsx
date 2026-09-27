import React from 'react';
import { ActivityStatus, MappingStatus, SeverityLevel } from '../../types';

interface StatusBadgeProps {
  status: ActivityStatus | MappingStatus | 'Contradiction' | 'Resolved' | 'Under Review' | 'Open' | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';

  switch (status) {
    case 'Auto Accepted':
    case 'Approved':
    case 'Completed':
    case 'Resolved':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      break;
    case 'In Progress':
    case 'Under Review':
      colorClasses = 'bg-brand-soft text-brand-dark border-brand-tint dark:bg-yellow-400/10 dark:text-yellow-200 dark:border-yellow-400/30';
      break;
    case 'Review Required':
    case 'Delayed':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      break;
    case 'Contradiction':
    case 'Rejected':
    case 'Blocked':
    case 'Open':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
      break;
    case 'Unmatched':
    case 'Not Started':
      colorClasses = 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700';
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium tracking-wide ${sizeClasses} ${colorClasses}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};

interface ConfidenceBadgeProps {
  confidence: number;
  showBar?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  showBar = false,
  size = 'md',
}) => {
  let tier: 'High' | 'Medium' | 'Low' = 'High';
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
  let barColor = 'bg-emerald-600 dark:bg-emerald-500';

  if (confidence < 70) {
    tier = 'Low';
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
    barColor = 'bg-rose-600 dark:bg-rose-500';
  } else if (confidence < 90) {
    tier = 'Medium';
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    barColor = 'bg-amber-500 dark:bg-amber-500';
  }

  const padding = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1.5 text-sm font-semibold' : 'px-2 py-0.5 text-xs font-medium';

  return (
    <div className="inline-flex flex-col gap-1">
      <div className={`inline-flex items-center gap-1.5 rounded-md border ${padding} ${badgeColor}`}>
        <span className="font-semibold">{confidence}%</span>
        <span className="opacity-75">{tier}</span>
      </div>
      {showBar && (
        <div className="w-full bg-slate-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${Math.min(100, Math.max(0, confidence))}%` }}
          />
        </div>
      )}
    </div>
  );
};

interface SeverityBadgeProps {
  severity: SeverityLevel;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  let classes = 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
  if (severity === 'Medium') {
    classes = 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
  } else if (severity === 'Low') {
    classes = 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold border ${classes}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {severity} Severity
    </span>
  );
};
