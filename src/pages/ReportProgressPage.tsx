import React, { useMemo, useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../auth/AuthContext';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { FieldUpdate, FieldUpdateStatus } from '../types';
import { parseFieldText } from '../utils/fieldUpdateParser';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  ClipboardPen,
  ListChecks,
  Bot,
  CheckCircle2,
  AlertCircle,
  Clock,
  History as HistoryIcon,
  Pencil,
} from 'lucide-react';

/* Minimal typings for the Web Speech API (not in default DOM lib) */
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

const statusStyles: Record<FieldUpdateStatus, string> = {
  Submitted: 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
  Matched: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-yellow-400/10 dark:text-yellow-200 dark:border-yellow-400/30',
  'Under Review': 'bg-brand-soft text-brand-dark border-brand-tint dark:bg-yellow-400/15 dark:text-yellow-200 dark:border-yellow-400/40',
  Accepted: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
};

const UpdateStatusBadge: React.FC<{ status: FieldUpdateStatus }> = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${statusStyles[status]}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
    {status}
  </span>
);

type Tab = 'agent' | 'manual' | 'mine';

export const ReportProgressPage: React.FC = () => {
  const { activities, fieldUpdates, submitFieldUpdate, confirmFieldUpdate, showToast } = useProject();
  const { user } = useAuth();

  const [tab, setTab] = useState<Tab>('agent');
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognitionLike | null>(null);

  // Manual form state
  const [manualActivity, setManualActivity] = useState('');
  const [manualEvent, setManualEvent] = useState<FieldUpdate['eventType']>('Progress');
  const [manualProgress, setManualProgress] = useState<number>(50);
  const [manualNote, setManualNote] = useState('');

  const supported =
    typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const parsed = useMemo(
    () => (text.trim().length > 8 ? parseFieldText(text, activities) : null),
    [text, activities]
  );

  const myUpdates = useMemo(
    () => fieldUpdates.filter((u) => u.submittedBy === user?.name),
    [fieldUpdates, user]
  );

  const startListening = () => {
    const w = window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike; SpeechRecognition?: new () => SpeechRecognitionLike };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e) => {
      const transcript = Array.from({ length: e.results.length }, (_, i) => e.results[i][0].transcript).join(' ');
      setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => {
      setListening(false);
      showToast('Voice capture failed — please type instead', 'error');
    };
    setRecognition(rec);
    rec.start();
    setListening(true);
  };

  const stopListening = () => {
    recognition?.stop();
    setListening(false);
  };

  const submitAgent = () => {
    if (!text.trim() || !user) return;
    submitFieldUpdate({ rawText: text.trim(), source: 'AI Time Agent', submittedBy: user.name, eventType: parsed?.eventType ?? 'Note' });
    setText('');
  };

  const submitManual = () => {
    if (!manualActivity || !user) {
      showToast('Select the activity this update belongs to', 'warning');
      return;
    }
    submitFieldUpdate({
      rawText: manualNote.trim() || `${manualEvent} reported for ${manualActivity}${manualEvent === 'Progress' ? ` at ${manualProgress}%` : ''}`,
      source: 'Manual Form',
      submittedBy: user.name,
      eventType: manualEvent,
      progressValue: manualEvent === 'Progress' ? manualProgress : undefined,
      activityId: manualActivity,
    });
    setManualNote('');
    setManualActivity('');
    setManualEvent('Progress');
    setManualProgress(50);
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editActivity, setEditActivity] = useState('');
  const [editEvent, setEditEvent] = useState<FieldUpdate['eventType']>('Progress');
  const [editProgress, setEditProgress] = useState<number>(50);

  const beginEdit = (u: FieldUpdate) => {
    setEditingId(u.id);
    setEditActivity(u.activityId ?? '');
    setEditEvent(u.eventType);
    setEditProgress(u.progressValue ?? 50);
  };

  const saveCorrection = (u: FieldUpdate) => {
    confirmFieldUpdate(u.id, {
      activityId: editActivity || undefined,
      eventType: editEvent,
      progressValue: editEvent === 'Progress' ? editProgress : undefined,
    });
    setEditingId(null);
  };

  const tabs: { key: Tab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'agent', label: 'AI Time Agent', icon: Bot },
    { key: 'manual', label: 'Manual Entry', icon: ClipboardPen },
    { key: 'mine', label: `My Updates (${myUpdates.length})`, icon: ListChecks },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">Report Progress</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-soft text-brand-dark dark:bg-yellow-400/15 dark:text-yellow-200">
              Field Hub
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Log what happened on site — the AI Time Agent converts your words into schedule events
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-zinc-800">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition ${
              tab === key
                ? 'border-brand text-brand-dark dark:border-yellow-400 dark:text-yellow-300'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {tab === 'agent' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
            <Card title="AI Time Agent" subtitle="Speak or type what happened — start / progress / completion / hold">
              <div className="space-y-3">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  placeholder='e.g. "Started erection of spool SP-105 on Line 24-XX at 07:30, Rigging Crew A"'
                  className="w-full rounded-md border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/80 px-3 py-2.5 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-brand dark:focus:border-yellow-400"
                />
                <div className="flex items-center gap-2">
                  {supported && (
                    <button
                      onClick={listening ? stopListening : startListening}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold border transition ${
                        listening
                          ? 'bg-brand text-white border-brand animate-pulse'
                          : 'border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {listening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      {listening ? 'Listening… (click to stop)' : 'Speak'}
                    </button>
                  )}
                  <button
                    onClick={submitAgent}
                    disabled={!text.trim()}
                    className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-md bg-brand hover:bg-brand-dark disabled:opacity-40 dark:bg-yellow-400 dark:hover:bg-yellow-300 dark:text-zinc-950 text-white text-xs font-semibold transition"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Update
                  </button>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card title="Live AI Extraction" subtitle="What the agent understood from your words">
              {!parsed ? (
                <div className="p-4 rounded-md border border-dashed border-slate-300 dark:border-zinc-700 text-xs text-slate-400 dark:text-zinc-500 text-center">
                  <Sparkles className="w-5 h-5 mx-auto mb-2 text-brand dark:text-yellow-400" />
                  Type at least a few words to see entities, event type and the suggested L5/L6 activity
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-500 dark:text-zinc-400">Event Type</span>
                    <span className="font-bold text-slate-800 dark:text-zinc-100">{parsed.eventType}</span>
                  </div>
                  {parsed.progressValue !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-500 dark:text-zinc-400">Progress</span>
                      <span className="font-bold text-slate-800 dark:text-zinc-100">{parsed.progressValue}%</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-500 dark:text-zinc-400">Discipline</span>
                    <span className="font-bold text-slate-800 dark:text-zinc-100">{parsed.discipline ?? 'Unclear'}</span>
                  </div>
                  <div className="p-2.5 rounded-md bg-brand-soft/60 dark:bg-yellow-400/10 border border-brand-tint dark:border-yellow-400/30">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-brand-dark dark:text-yellow-300 mb-1">Suggested Activity</div>
                    {parsed.activityId ? (
                      <div className="font-mono font-bold text-brand-dark dark:text-yellow-200">{parsed.activityId}</div>
                    ) : (
                      <div className="text-slate-500 dark:text-zinc-400">No confident match — planner will assign</div>
                    )}
                    <div className="text-[11px] text-slate-600 dark:text-zinc-400 mt-0.5">{parsed.activityName ?? '—'}</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-500 dark:text-zinc-400">Confidence</span>
                      <span className={`font-bold ${parsed.confidence >= 90 ? 'text-emerald-600' : parsed.confidence >= 70 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {parsed.confidence}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-200 dark:bg-zinc-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${parsed.confidence >= 90 ? 'bg-emerald-500' : parsed.confidence >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${parsed.confidence}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-500 dark:text-zinc-400 mb-1">Evidence</div>
                    <ul className="space-y-1">
                      {parsed.evidence.map((ev, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-zinc-400">
                          <CheckCircle2 className="w-3 h-3 mt-0.5 text-emerald-500 shrink-0" /> {ev}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {tab === 'manual' && (
        <Card title="Submit Activity Start / End" subtitle="Structured form — for shift logs without dictation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">L5/L6 Activity</label>
              <select
                value={manualActivity}
                onChange={(e) => setManualActivity(e.target.value)}
                className="w-full rounded-md border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/80 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-brand dark:focus:border-yellow-400"
              >
                <option value="">Select activity…</option>
                {activities.map((a) => (
                  <option key={a.id} value={a.id}>{a.id} — {a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Event</label>
              <div className="flex gap-1.5">
                {(['Start', 'Progress', 'Completion', 'Hold'] as const).map((ev) => (
                  <button
                    key={ev}
                    onClick={() => setManualEvent(ev)}
                    className={`px-3 py-2 rounded-md text-xs font-semibold border transition ${
                      manualEvent === ev
                        ? 'bg-brand text-white border-brand dark:bg-yellow-400 dark:text-zinc-950 dark:border-yellow-400'
                        : 'border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {ev}
                  </button>
                ))}
              </div>
            </div>
            {manualEvent === 'Progress' && (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Progress: <span className="text-brand dark:text-yellow-300">{manualProgress}%</span>
                </label>
                <input
                  type="range" min={0} max={100} step={5}
                  value={manualProgress}
                  onChange={(e) => setManualProgress(parseInt(e.target.value, 10))}
                  className="w-full accent-brand dark:accent-yellow-400"
                />
              </div>
            )}
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Note (optional)</label>
              <input
                value={manualNote}
                onChange={(e) => setManualNote(e.target.value)}
                placeholder="e.g. crew, delay reason, equipment used"
                className="w-full rounded-md border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/80 px-3 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-brand dark:focus:border-yellow-400"
              />
            </div>
            <div className="md:col-span-2">
              <button
                onClick={submitManual}
                className="px-4 py-2 rounded-md bg-brand hover:bg-brand-dark dark:bg-yellow-400 dark:hover:bg-yellow-300 dark:text-zinc-950 text-white text-xs font-semibold transition"
              >
                Submit Field Update
              </button>
            </div>
          </div>
        </Card>
      )}

      {tab === 'mine' && (
        <div className="space-y-3">
          {myUpdates.length === 0 && (
            <Card>
              <div className="py-8 text-center text-xs text-slate-400 dark:text-zinc-500">
                No updates yet — use the AI Time Agent or Manual Entry to submit your first update.
              </div>
            </Card>
          )}
          {myUpdates.map((u) => (
            <Card key={u.id}>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <UpdateStatusBadge status={u.status} />
                  <span className="font-mono text-[10px] font-bold text-slate-400">{u.id}</span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(u.submittedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 font-semibold">
                    {u.source}
                  </span>
                  <div className="ml-auto flex items-center gap-1.5">
                    {(u.status === 'Submitted' || u.status === 'Matched' || u.status === 'Under Review') && (
                      <button
                        onClick={() => beginEdit(u)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-brand-tint text-brand-dark dark:border-yellow-400/40 dark:text-yellow-300 hover:bg-brand-soft dark:hover:bg-yellow-400/10 text-[11px] font-semibold transition"
                      >
                        <Pencil className="w-3 h-3" /> Confirm / Correct
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-700 dark:text-zinc-300 italic">“{u.rawText}”</p>

                {editingId === u.id ? (
                  <div className="p-3 rounded-md border border-brand-tint dark:border-yellow-400/30 bg-brand-soft/40 dark:bg-yellow-400/5 space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-brand-dark dark:text-yellow-300">
                      Confirm or correct the extracted information
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">L5/L6 Activity</label>
                        <select
                          value={editActivity}
                          onChange={(e) => setEditActivity(e.target.value)}
                          className="w-full rounded-md border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-1.5 text-xs font-semibold text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-brand dark:focus:border-yellow-400"
                        >
                          <option value="">Not sure — let planner decide</option>
                          {activities.map((a) => (
                            <option key={a.id} value={a.id}>{a.id} — {a.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Event</label>
                        <div className="flex flex-wrap gap-1.5">
                          {(['Start', 'Progress', 'Completion', 'Hold'] as const).map((ev) => (
                            <button
                              key={ev}
                              onClick={() => setEditEvent(ev)}
                              className={`px-2.5 py-1.5 rounded-md text-[11px] font-semibold border transition ${
                                editEvent === ev
                                  ? 'bg-brand text-white border-brand dark:bg-yellow-400 dark:text-zinc-950 dark:border-yellow-400'
                                  : 'border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-zinc-300'
                              }`}
                            >
                              {ev}
                            </button>
                          ))}
                        </div>
                      </div>
                      {editEvent === 'Progress' && (
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Progress: <span className="text-brand dark:text-yellow-300">{editProgress}%</span>
                          </label>
                          <input
                            type="range" min={0} max={100} step={5}
                            value={editProgress}
                            onChange={(e) => setEditProgress(parseInt(e.target.value, 10))}
                            className="w-full accent-brand dark:accent-yellow-400"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => saveCorrection(u)}
                        className="px-3 py-1.5 rounded-md bg-brand hover:bg-brand-dark dark:bg-yellow-400 dark:hover:bg-yellow-300 dark:text-zinc-950 text-white text-[11px] font-semibold transition"
                      >
                        Save & Send to Planner
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 text-[11px] font-semibold transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {u.eventType}{u.progressValue !== undefined ? ` · ${u.progressValue}%` : ''}</span>
                    {u.activityId && (
                      <span className="font-mono font-semibold text-brand-dark dark:text-yellow-300">
                        {u.activityId} · {u.suggestedActivityName}
                      </span>
                    )}
                    {u.confidence !== undefined && <span>AI confidence {u.confidence}%</span>}
                  </div>
                )}
                {u.extracted.note && (
                  <div className="text-[11px] text-slate-500 dark:text-zinc-500 flex items-center gap-1.5">
                    <HistoryIcon className="w-3 h-3" /> {u.extracted.note}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
