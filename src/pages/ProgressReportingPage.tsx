import React, { useState } from 'react';
import { ClipboardPen, UploadCloud } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { IngestionPage } from './IngestionPage';
import { ReportProgressPage } from './ReportProgressPage';

type ReportingView = 'progress' | 'ingestion';

export const ProgressReportingPage: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<ReportingView>('progress');

  if (user?.role !== 'PROJECT_PLANNER') {
    return <ReportProgressPage />;
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-1 border-b border-slate-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setView('progress')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition ${
            view === 'progress'
              ? 'border-brand text-brand-dark dark:border-yellow-400 dark:text-yellow-300'
              : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
          }`}
        >
          <ClipboardPen className="w-3.5 h-3.5" /> Report Progress
        </button>
        <button
          type="button"
          onClick={() => setView('ingestion')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition ${
            view === 'ingestion'
              ? 'border-brand text-brand-dark dark:border-yellow-400 dark:text-yellow-300'
              : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" /> Reports &amp; Ingestion
        </button>
      </div>

      {view === 'progress' ? <ReportProgressPage /> : <IngestionPage />}
    </div>
  );
};
