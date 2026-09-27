import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  compact?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  compact = false,
}) => {
  return (
    <div
      className={`bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-xs transition-shadow duration-150 ${className}`}
    >
      {(title || action) && (
        <div
          className={`flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 ${
            compact ? 'px-4 py-2.5' : 'px-5 py-3.5'
          }`}
        >
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 uppercase tracking-wider">
                {title}
              </h3>
            ) : (
              title
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={compact ? 'p-3' : 'p-5'}>{children}</div>
    </div>
  );
};
