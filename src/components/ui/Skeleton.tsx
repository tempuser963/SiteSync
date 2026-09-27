import React from 'react';

export const CardSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-5 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-200 dark:bg-zinc-700 rounded w-1/3" />
        <div className="h-4 bg-slate-200 dark:bg-zinc-700 rounded w-12" />
      </div>
      <div className="h-8 bg-slate-200 dark:bg-zinc-700 rounded w-1/2" />
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-3 bg-slate-100 dark:bg-zinc-800 rounded w-full" />
        ))}
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 6,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden animate-pulse">
      <div className="h-10 bg-slate-100 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700 flex items-center px-4 gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 bg-slate-300 dark:bg-zinc-600 rounded flex-1" />
        ))}
      </div>
      <div className="divide-y divide-slate-100 dark:divide-zinc-800">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex items-center gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="h-4 bg-slate-200 dark:bg-zinc-700 rounded flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 280 }) => {
  return (
    <div
      style={{ height: `${height}px` }}
      className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-5 animate-pulse flex flex-col justify-between"
    >
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-200 dark:bg-zinc-700 rounded w-1/4" />
        <div className="h-4 bg-slate-200 dark:bg-zinc-700 rounded w-16" />
      </div>
      <div className="flex items-end gap-3 h-48 pt-6">
        {[40, 65, 30, 85, 55, 70, 95, 60, 75].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-slate-200 dark:bg-zinc-700 rounded-t"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between pt-2">
        <div className="h-2 bg-slate-200 dark:bg-zinc-700 rounded w-16" />
        <div className="h-2 bg-slate-200 dark:bg-zinc-700 rounded w-16" />
      </div>
    </div>
  );
};
