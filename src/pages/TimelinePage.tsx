import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../auth/AuthContext';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import {
  History,
  Calendar,
  Clock,
  Play,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  Layers,
  ChevronDown,
  Wrench,
  Search,
} from 'lucide-react';
import { TimelineEvent } from '../types';

export const TimelinePage: React.FC = () => {
  const { activities, remarks, addRemark } = useProject();
  const { user } = useAuth();

  const [selectedActivityId, setSelectedActivityId] =
    useState<string>('PIP-001-01');

  const [remarkText, setRemarkText] = useState('');

  const activityRemarks = remarks.filter((r) => r.activityId === selectedActivityId);

  const submitRemark = () => {
    if (!remarkText.trim() || !user || !selectedActivity) return;
    addRemark({
      activityId: selectedActivity.id,
      author: user.name,
      role: user.role,
      discipline: user.discipline ?? selectedActivity.discipline,
      text: remarkText.trim(),
    });
    setRemarkText('');
  };

  const selectedActivity =
    activities.find((a) => a.id === selectedActivityId) || activities[0];

  // Specific timeline events for PIP-001-01 per prompt
  const activityTimelineMap: Record<string, TimelineEvent[]> = {
    'PIP-001-01': [
      {
        id: 'TE-1',
        activityId: 'PIP-001-01',
        timestamp: '2026-09-22T09:30:00',
        eventType: 'Start',
        description: 'Activity Started — Rigging Crew A deployed on site',
        source: 'DPR-2209',
        performedBy: 'Rigging Crew A',
      },
      {
        id: 'TE-2',
        activityId: 'PIP-001-01',
        timestamp: '2026-09-22T11:45:00',
        eventType: 'Progress',
        description: 'SP-104 Erected and bolted to pipe rack support',
        source: 'Supervisor Report',
        performedBy: 'Ahmed Al-Rashidi',
      },
      {
        id: 'TE-3',
        activityId: 'PIP-001-01',
        timestamp: '2026-09-22T14:10:00',
        eventType: 'Progress',
        description: 'SP-105 Erected — crane hoisting sequence completed',
        source: 'Contractor Sheet',
        performedBy: 'PetroFab Ltd.',
      },
      {
        id: 'TE-4',
        activityId: 'PIP-001-01',
        timestamp: '2026-09-22T16:00:00',
        eventType: 'Inspection',
        description: 'Inspection Requested — alignment & weld fit-up check',
        source: 'Inspection Log',
        performedBy: 'Maria Santos (QA/QC)',
      },
      {
        id: 'TE-5',
        activityId: 'PIP-001-01',
        timestamp: '2026-09-22T17:20:00',
        eventType: 'Completion',
        description: 'Activity Erection Completed — awaiting hydrotest clearance',
        source: 'DPR-2209',
        performedBy: 'Ahmed Al-Rashidi',
      },
    ],
  };

  // Fallback events if another activity is chosen
  const currentEvents: TimelineEvent[] =
    activityTimelineMap[selectedActivity.id] || [
      {
        id: 'TE-GEN-1',
        activityId: selectedActivity.id,
        timestamp: `${selectedActivity.plannedStart}T08:00:00`,
        eventType: 'Start',
        description: `Activity ${selectedActivity.name} initiated`,
        source: 'DPR-2209',
      },
      {
        id: 'TE-GEN-2',
        activityId: selectedActivity.id,
        timestamp: `${selectedActivity.plannedStart}T14:00:00`,
        eventType: 'Progress',
        description: `Physical progress achieved: ${selectedActivity.actualProgress}%`,
        source: 'Contractor Sheet',
      },
      {
        id: 'TE-GEN-3',
        activityId: selectedActivity.id,
        timestamp: `${selectedActivity.plannedFinish}T17:00:00`,
        eventType: selectedActivity.actualProgress >= 100 ? 'Completion' : 'Hold',
        description:
          selectedActivity.actualProgress >= 100
            ? 'Activity completed and verified'
            : 'Work ongoing per daily shift log',
        source: 'Site Diary',
      },
    ];

  const getEventIcon = (type: TimelineEvent['eventType']) => {
    switch (type) {
      case 'Start':
        return <Play className="w-4 h-4 text-brand dark:text-yellow-300" />;
      case 'Completion':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'Inspection':
        return <FileCheck className="w-4 h-4 text-purple-500" />;
      case 'Hold':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default:
        return <Wrench className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              Execution Timeline
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-tint text-brand-deep dark:bg-yellow-400/15 dark:text-yellow-200">
              Audit Trail
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Chronological micro-events extracted from heterogeneous field sources for any activity
          </p>
        </div>

        {/* Activity Selector Dropdown */}
        <div className="w-full md:w-80">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Select Activity
          </label>
          <div className="relative">
            <select
              value={selectedActivityId}
              onChange={(e) => setSelectedActivityId(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-md py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-brand dark:focus:border-yellow-400 appearance-none shadow-xs"
            >
              {activities.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.id} — {act.name} ({act.discipline})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Selected Activity Meta Card */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-base font-bold text-brand dark:text-yellow-300">
                {selectedActivity.id}
              </span>
              <StatusBadge status={selectedActivity.status} size="sm" />
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                {selectedActivity.discipline}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">
              {selectedActivity.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Location: {selectedActivity.location} • WBS: {selectedActivity.wbsCode}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">
                Actual Progress
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-zinc-100">
                {selectedActivity.actualProgress}%
              </span>
            </div>
            <div className="text-right pl-4 border-l border-slate-200 dark:border-zinc-700">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">
                Variance
              </span>
              <span
                className={`text-base font-bold ${
                  selectedActivity.variance > 0
                    ? 'text-rose-600'
                    : 'text-emerald-600'
                }`}
              >
                {selectedActivity.variance > 0
                  ? `+${selectedActivity.variance}d`
                  : `${selectedActivity.variance}d`}
              </span>
            </div>
          </div>
        </div>

        {/* Planned vs Actual Duration Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-zinc-800 space-y-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Schedule Comparison (Planned vs Actual)
          </span>

          <div className="space-y-2">
            {/* Planned */}
            <div className="flex items-center text-xs">
              <span className="w-20 font-bold text-slate-500 text-[11px] uppercase">
                PLANNED
              </span>
              <div className="flex-1 bg-slate-100 dark:bg-zinc-800 h-8 rounded-md flex items-center px-3 justify-between border border-slate-200 dark:border-zinc-700 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-brand/15 border-r-2 border-brand dark:bg-yellow-400/15 dark:border-yellow-400 w-3/4" />
                <span className="font-mono font-semibold text-slate-800 dark:text-zinc-200 relative z-10">
                  {selectedActivity.plannedStart}
                </span>
                <span className="text-slate-400 text-[10px] relative z-10">
                  Baseline Window
                </span>
                <span className="font-mono font-semibold text-slate-800 dark:text-zinc-200 relative z-10">
                  {selectedActivity.plannedFinish}
                </span>
              </div>
            </div>

            {/* Actual */}
            <div className="flex items-center text-xs">
              <span className="w-20 font-bold text-emerald-600 dark:text-emerald-400 text-[11px] uppercase">
                ACTUAL
              </span>
              <div className="flex-1 bg-slate-100 dark:bg-zinc-800 h-8 rounded-md flex items-center px-3 justify-between border border-slate-200 dark:border-zinc-700 relative overflow-hidden">
                <div className="absolute inset-y-0 left-[10%] bg-emerald-500/20 border-r-2 border-emerald-500 w-[75%]" />
                <span className="font-mono font-semibold text-slate-800 dark:text-zinc-200 relative z-10">
                  {selectedActivity.actualStart || selectedActivity.plannedStart}
                </span>
                <span className="text-emerald-600 text-[10px] font-semibold relative z-10">
                  {selectedActivity.status === 'Completed' ? 'Executed Window' : 'In Progress Window'}
                </span>
                <span className="font-mono font-semibold text-slate-800 dark:text-zinc-200 relative z-10">
                  {selectedActivity.actualFinish || 'Ongoing'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Vertical Event Timeline */}
      <Card
        title="Chronological Field Event Stream"
        subtitle="Verifiable field evidence trail extracted by KaryaSetu AI"
      >
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-zinc-700">
          {currentEvents.map((evt, idx) => (
            <div key={evt.id} className="relative group">
              {/* Event bullet point / icon */}
              <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border-2 border-slate-300 dark:border-zinc-700 flex items-center justify-center shadow-xs group-hover:border-brand dark:group-hover:border-yellow-400 transition">
                {getEventIcon(evt.eventType)}
              </div>

              {/* Event Content Box */}
              <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-lg border border-slate-200 dark:border-zinc-700 shadow-xs space-y-1.5 transition hover:border-slate-300 dark:hover:border-zinc-600">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-zinc-200">
                      {new Date(evt.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-xs text-slate-900 dark:text-zinc-100">
                      {evt.description}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-900 font-mono text-[10px] text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                    Source: {evt.source}
                  </span>
                </div>

                {evt.performedBy && (
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                    <span>Logged / Reported by:</span>
                    <span className="font-semibold text-slate-700 dark:text-zinc-300">
                      {evt.performedBy}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Discipline Remarks & Technical Notes */}
      <Card
        title="Discipline Remarks"
        subtitle={`Technical observations and exceptions for ${selectedActivity.id}`}
        action={
          <span className="px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
            {activityRemarks.length} remark{activityRemarks.length === 1 ? '' : 's'}
          </span>
        }
      >
        <div className="space-y-3">
          {activityRemarks.map((r) => (
            <div key={r.id} className="p-3 rounded-md border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/50">
              <div className="flex flex-wrap items-center gap-2 text-[11px] mb-1.5">
                <span className="w-6 h-6 rounded-full bg-brand dark:bg-yellow-400 dark:text-zinc-950 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  {r.author.split(' ').map((n) => n[0]).join('')}
                </span>
                <span className="font-semibold text-slate-800 dark:text-zinc-100">{r.author}</span>
                {r.discipline && (
                  <span className="px-1.5 py-0.5 rounded bg-brand-soft text-brand-dark dark:bg-yellow-400/15 dark:text-yellow-200 font-semibold">
                    {r.discipline}
                  </span>
                )}
                <span className="text-slate-400 ml-auto">
                  {new Date(r.at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-zinc-300">{r.text}</p>
            </div>
          ))}
          {activityRemarks.length === 0 && (
            <div className="text-xs text-slate-400 dark:text-zinc-500 text-center py-4">
              No remarks yet for this activity — add the first technical observation below.
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <input
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
              placeholder="Add a discipline remark — discrepancies, exceptions, sign-off conditions…"
              className="flex-1 rounded-md border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/80 px-3 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-brand dark:focus:border-yellow-400"
            />
            <button
              onClick={submitRemark}
              disabled={!remarkText.trim()}
              className="px-4 py-2 rounded-md bg-brand hover:bg-brand-dark disabled:opacity-40 dark:bg-yellow-400 dark:hover:bg-yellow-300 dark:text-zinc-950 text-white text-xs font-semibold transition shrink-0"
            >
              Add Remark
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
