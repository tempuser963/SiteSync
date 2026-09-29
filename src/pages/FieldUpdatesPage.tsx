import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../auth/AuthContext';
import { Card } from '../components/ui/Card';
import { FieldUpdate } from '../types';
import {
  Inbox,
  CheckCircle2,
  XCircle,
  Pencil,
  Clock,
  User as UserIcon,
  FileText,
  Sparkles,
  History as HistoryIcon,
} from 'lucide-react';

type Tab = 'pending' | 'resolved';

export const FieldUpdatesPage: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const {
    activities,
    fieldUpdates,
    acceptFieldUpdate,
    rejectFieldUpdate,
  } = useProject();
  const { user, hasPermission } = useAuth();

  const [tab, setTab] = useState<Tab>('pending');
  const [correctingId, setCorrectingId] = useState<string | null>(null);
  const [correctTo, setCorrectTo] = useState('');

  const pending = fieldUpdates.filter(
    (u) => u.status === 'Submitted' || u.status === 'Matched' || u.status === 'Under Review'
  );
  const resolved = fieldUpdates.filter(
    (u) => u.status === 'Accepted' || u.status === 'Rejected'
  );
  const list = tab === 'pending' ? pending : resolved;
  const canReview = hasPermission('APPROVE_MAPPING');

  const accept = (u: FieldUpdate, corrected?: string) => {
    acceptFieldUpdate(u.id, corrected, user?.name ?? 'Planner');
    setCorrectingId(null);
    setCorrectTo('');
  };

  return (
    <div className="space-y-6">
      {!embedded && <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">Incoming Field Updates</h1>
            {pending.length > 0 && (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-brand text-white dark:bg-yellow-400 dark:text-zinc-950">
                {pending.length} pending
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Supervisor submissions parsed by the AI Time Agent — validate, correct, and apply to the schedule
          </p>
        </div>
      </div>}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-zinc-800">
        {([
          ['pending', `Pending (${pending.length})`],
          ['resolved', `Resolved (${resolved.length})`],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition ${
              tab === key
                ? 'border-brand text-brand-dark dark:border-yellow-400 dark:text-yellow-300'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {list.length === 0 && (
          <Card>
            <div className="py-10 text-center text-xs text-slate-400 dark:text-zinc-500">
              <Inbox className="w-6 h-6 mx-auto mb-2 text-brand dark:text-yellow-400" />
              {tab === 'pending' ? 'No pending field updates — the queue is clear.' : 'No resolved updates yet.'}
            </div>
          </Card>
        )}

        {list.map((u) => (
          <Card key={u.id}>
            <div className="space-y-4">
              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="font-mono font-bold text-slate-400">{u.id}</span>
                <span className="flex items-center gap-1 text-slate-500 dark:text-zinc-400">
                  <UserIcon className="w-3 h-3" /> {u.submittedBy}
                </span>
                <span className="flex items-center gap-1 text-slate-500 dark:text-zinc-400">
                  <Clock className="w-3 h-3" /> {new Date(u.submittedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 font-semibold">{u.source}</span>
                <span
                  className={`ml-auto px-2 py-0.5 rounded text-[10px] font-bold ${
                    u.status === 'Accepted'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : u.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                      : u.status === 'Under Review'
                      ? 'bg-brand-soft text-brand-dark dark:bg-yellow-400/15 dark:text-yellow-200'
                      : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  {u.status.toUpperCase()}
                </span>
              </div>

              {/* Raw text + extraction */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="p-3 rounded-md bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Field Report
                  </div>
                  <p className="text-xs text-slate-700 dark:text-zinc-300 italic">“{u.rawText}”</p>
                  {Object.keys(u.extracted.entities).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {Object.entries(u.extracted.entities).map(([k, v]) => (
                        <span key={k} className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[10px] font-mono text-slate-600 dark:text-zinc-400">
                          {k}: {v}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-md bg-brand-soft/50 dark:bg-yellow-400/5 border border-brand-tint dark:border-yellow-400/30">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-brand-dark dark:text-yellow-300 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Suggestion
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-zinc-400">Event</span>
                    <span className="font-bold text-slate-800 dark:text-zinc-100">{u.eventType}{u.progressValue !== undefined ? ` · ${u.progressValue}%` : ''}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-slate-500 dark:text-zinc-400">Suggested L5/L6</span>
                    <span className="font-mono font-bold text-brand-dark dark:text-yellow-200">{u.activityId ?? 'None'}</span>
                  </div>
                  {u.activityId && <div className="text-[11px] text-slate-600 dark:text-zinc-400 mt-0.5">{u.suggestedActivityName}</div>}
                  {u.confidence !== undefined && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-500 dark:text-zinc-400">Confidence</span>
                        <span className={`font-bold ${u.confidence >= 90 ? 'text-emerald-600' : u.confidence >= 70 ? 'text-amber-600' : 'text-rose-600'}`}>{u.confidence}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-200 dark:bg-zinc-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${u.confidence >= 90 ? 'bg-emerald-500' : u.confidence >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${u.confidence}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status history */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-400 dark:text-zinc-500">
                {u.history.map((h, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <HistoryIcon className="w-3 h-3" />
                    <b className="text-slate-500 dark:text-zinc-400">{h.status}</b>
                    {h.note ? ` — ${h.note}` : ''}
                  </span>
                ))}
              </div>

              {/* Correct-to selector */}
              {correctingId === u.id && (
                <div className="p-3 rounded-md border border-brand-tint dark:border-yellow-400/30 bg-brand-soft/40 dark:bg-yellow-400/5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-brand-dark dark:text-yellow-300 mb-2">
                    Correct the suggested activity before accepting
                  </div>
                  <select
                    value={correctTo}
                    onChange={(e) => setCorrectTo(e.target.value)}
                    className="w-full sm:w-96 rounded-md border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-1.5 text-xs font-semibold text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-brand dark:focus:border-yellow-400"
                  >
                    <option value="">Keep AI suggestion {u.activityId ? `(${u.activityId})` : ''}</option>
                    {activities.map((a) => (
                      <option key={a.id} value={a.id}>{a.id} — {a.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Actions */}
              {tab === 'pending' && (
                <div className="flex flex-wrap items-center gap-2">
                  {canReview ? (
                    <>
                      {correctingId === u.id ? (
                        <button
                          onClick={() => accept(u, correctTo || undefined)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Confirm & Apply to Schedule
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => accept(u)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Accept & Apply
                          </button>
                          <button
                            onClick={() => {
                              setCorrectingId(correctingId === u.id ? null : u.id);
                              setCorrectTo('');
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold border transition ${
                              correctingId === u.id
                                ? 'bg-brand text-white border-brand dark:bg-yellow-400 dark:text-zinc-950 dark:border-yellow-400'
                                : 'border-brand-tint text-brand-dark dark:border-yellow-400/40 dark:text-yellow-300 hover:bg-brand-soft dark:hover:bg-yellow-400/10'
                            }`}
                          >
                            <Pencil className="w-3.5 h-3.5" /> Correct Match
                          </button>
                          <button
                            onClick={() => rejectFieldUpdate(u.id, 'Rejected by Planner')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-rose-300 text-rose-600 dark:border-rose-800 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[11px] font-semibold transition"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500 italic">
                      Read-only — planner permission required to validate updates
                    </span>
                  )}
                </div>
              )}

              {tab === 'resolved' && u.reviewedBy && (
                <div className="text-[11px] text-slate-400 dark:text-zinc-500">
                  Reviewed by <b className="text-slate-500 dark:text-zinc-400">{u.reviewedBy}</b>
                  {u.reviewedAt && ` · ${new Date(u.reviewedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}`}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
