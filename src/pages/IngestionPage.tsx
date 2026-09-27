import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Sparkles,
  ArrowRight,
  RefreshCw,
  FolderUp,
} from 'lucide-react';
import { IngestionFile } from '../types';
import { useAuth } from '../auth/AuthContext';

export const IngestionPage: React.FC = () => {
  const { ingestionFiles, addIngestionFile } = useProject();
  const { hasPermission } = useAuth();
  const canUpload = hasPermission('UPLOAD_REPORT');

  const [isDragging, setIsDragging] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [recentUploadedFile, setRecentUploadedFile] =
    useState<IngestionFile | null>(null);

  const pipelineSteps = [
    { title: 'Uploaded', desc: 'Secure payload checksum & integrity validation' },
    { title: 'Parsed', desc: 'OCR, layout parsing & table structure extraction' },
    { title: 'Events Extracted', desc: 'Named Entity Recognition (NER) for spools, tags, crews' },
    { title: 'Activities Matched', desc: 'Cosine semantic similarity & WBS correlation' },
    { title: 'Confidence Evaluated', desc: 'Multi-factor Bayesian scoring & contradiction checks' },
  ];

  const handleSimulateUpload = (fileName = 'DPR_2212_FieldLog.pdf') => {
    if (isSimulating) return;
    setIsSimulating(true);
    setCurrentStepIndex(0);

    const steps = [0, 1, 2, 3, 4];
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setCurrentStepIndex(step);
        if (idx === steps.length - 1) {
          setTimeout(() => {
            setIsSimulating(false);
            const newFile: IngestionFile = {
              id: `ING-00${ingestionFiles.length + 1}`,
              projectId: 'PRJ-001',
              filename: fileName,
              fileType: fileName.endsWith('.xlsx')
                ? 'XLSX'
                : fileName.endsWith('.csv')
                ? 'CSV'
                : 'PDF',
              uploadedAt: new Date().toISOString(),
              uploadedBy: 'Ahmed Al-Rashidi',
              eventsExtracted: 11,
              matchedEvents: 9,
              contradictions: 1,
              reviewRequired: 1,
              status: 'Completed',
              processingSteps: pipelineSteps.map((s) => ({
                name: s.title,
                status: 'done',
              })),
            };
            addIngestionFile(newFile);
            setRecentUploadedFile(newFile);
          }, 800);
        }
      }, (idx + 1) * 700);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              Field Data Ingestion
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-tint text-brand-deep dark:bg-yellow-400/15 dark:text-yellow-200">
              Multi-Source Ingestion Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Ingest heterogeneous daily progress reports (DPRs), spreadsheets, inspection logs, and site diaries
          </p>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      {!canUpload && (
        <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            <strong>Read-Only Mode:</strong> Your account role has view permissions only. Uploading execution reports requires the <code>UPLOAD_REPORT</code> permission.
          </span>
        </div>
      )}

      <div
        onDragOver={(e) => {
          if (!canUpload) return;
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          if (!canUpload) return;
          e.preventDefault();
          setIsDragging(false);
          handleSimulateUpload('DPR_SiteDiary_Batch.pdf');
        }}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition bg-white dark:bg-zinc-900 ${
          !canUpload
            ? 'border-slate-200 dark:border-zinc-800 opacity-60 cursor-not-allowed'
            : isDragging
            ? 'border-brand dark:border-yellow-400 bg-brand-soft/30 dark:bg-yellow-400/10'
            : 'border-slate-300 dark:border-zinc-700 hover:border-brand dark:hover:border-yellow-400'
        }`}
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-brand-soft dark:bg-yellow-400/10 border border-brand-tint dark:border-yellow-400/30 text-brand dark:text-yellow-300 flex items-center justify-center mx-auto">
            <UploadCloud className="w-6 h-6" />
          </div>

          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
            {canUpload
              ? 'Drag & drop field documents, or click to simulate ingestion'
              : 'Document Upload Restricted for Your Role'}
          </h3>

          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Supported enterprise formats: <span className="font-semibold text-slate-700 dark:text-zinc-300">PDF, XLSX, CSV, TXT</span> (Max file size: 25 MB)
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              disabled={isSimulating || !canUpload}
              onClick={() => handleSimulateUpload('DPR_2212_DailyLog.pdf')}
              title={!canUpload ? 'Permission UPLOAD_REPORT required' : undefined}
              className="px-4 py-2 bg-brand dark:bg-yellow-400 dark:text-zinc-950 hover:bg-brand-dark dark:hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-md shadow-xs transition flex items-center gap-1.5"
            >
              <FolderUp className="w-4 h-4" /> Simulate DPR Upload (.pdf)
            </button>
            <button
              disabled={isSimulating || !canUpload}
              onClick={() => handleSimulateUpload('Subcontractor_Daily_Piping.xlsx')}
              title={!canUpload ? 'Permission UPLOAD_REPORT required' : undefined}
              className="px-4 py-2 border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-md transition"
            >
              Simulate Contractor Sheet (.xlsx)
            </button>
          </div>
        </div>
      </div>

      {/* Mock 5-Stage Processing Pipeline */}
      <Card
        title="AI Field Ingestion Pipeline"
        subtitle="Automated transformation of unstructured field text into verified schedule updates"
      >
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
          {pipelineSteps.map((step, idx) => {
            const isCompleted = isSimulating ? idx <= currentStepIndex : true;
            const isCurrent = isSimulating && idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-lg border text-xs transition-all ${
                  isCurrent
                    ? 'border-brand dark:border-yellow-400 bg-brand-soft/60 dark:bg-yellow-400/10 ring-1 ring-brand dark:ring-yellow-400'
                    : isCompleted
                    ? 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900'
                    : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/20 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-[10px] text-slate-400">
                    STAGE {idx + 1}
                  </span>
                  {isCurrent ? (
                    <RefreshCw className="w-3.5 h-3.5 text-brand dark:text-yellow-300 animate-spin" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <div className="font-bold text-slate-900 dark:text-zinc-100 text-xs mb-1">
                  {step.title}
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Processing Result Banner */}
        <div className="mt-4 p-3 rounded-md bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand dark:text-yellow-300 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-zinc-200">
                Latest Processed File:
              </span>{' '}
              <span className="font-mono text-brand dark:text-yellow-300 font-bold">
                {recentUploadedFile?.filename || 'DPR_2209.pdf'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-medium text-[11px] text-slate-600 dark:text-zinc-300">
            <span className="text-emerald-600">✓ 14 events extracted</span>
            <span className="text-brand dark:text-yellow-300">✓ 12 matched</span>
            <span className="text-rose-600">⚠ 1 contradiction</span>
            <span className="text-amber-600">⏱ 1 requires review</span>
          </div>
        </div>
      </Card>

      {/* Recent Files Table */}
      <Card
        title="Recent Ingested Files"
        subtitle="Chronological log of uploaded execution evidence documents"
      >
        <div className="overflow-x-auto -mx-5 -mb-5">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-4">File Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Discipline</th>
                <th className="py-2.5 px-3">Uploaded</th>
                <th className="py-2.5 px-3 text-center">Extracted Events</th>
                <th className="py-2.5 px-3 text-center">Matched</th>
                <th className="py-2.5 px-3 text-center">Contradictions</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {ingestionFiles.map((file) => (
                <tr
                  key={file.id}
                  className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition"
                >
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-zinc-100">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand dark:text-yellow-300 shrink-0" />
                      <span>{file.filename}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                      {file.fileType}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700 dark:text-zinc-300">
                    {file.discipline || 'Multi-Discipline'}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                    {new Date(file.uploadedAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800 dark:text-zinc-200">
                    {file.eventsExtracted}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-emerald-600 font-semibold">
                    {file.matchedEvents}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold">
                    {file.contradictions > 0 ? (
                      <span className="text-rose-600 font-bold">
                        {file.contradictions}
                      </span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <StatusBadge
                      status={file.status === 'Completed' ? 'Completed' : 'In Progress'}
                      size="sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
