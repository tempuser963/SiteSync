import React, { useState, useMemo } from 'react';
import { useProject } from '../context/ProjectContext';
import { Card } from '../components/ui/Card';
import { StatusBadge, ConfidenceBadge } from '../components/ui/Badge';
import { Drawer } from '../components/ui/Drawer';
import {
  GitMerge,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { ActivityMatch, Discipline } from '../types';

export const ActivitiesPage: React.FC = () => {
  const { activityMatches, activities, approveMapping, rejectMapping } =
    useProject();

  const [selectedMatch, setSelectedMatch] = useState<ActivityMatch | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedConfidence, setSelectedConfidence] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const disciplines: (Discipline | 'All')[] = [
    'All',
    'Civil',
    'Piping',
    'Electrical',
    'Instrumentation',
    'Static Equipment',
    'Rotating Equipment',
    'HSE',
  ];

  const filteredMatches = useMemo(() => {
    return activityMatches.filter((match) => {
      const matchDiscipline =
        selectedDiscipline === 'All' ||
        match.aiInterpretation.discipline === selectedDiscipline;
      const matchStatus =
        selectedStatus === 'All' || match.status === selectedStatus;

      let matchConfidence = true;
      if (selectedConfidence === 'High') {
        matchConfidence = match.overallConfidence >= 90;
      } else if (selectedConfidence === 'Medium') {
        matchConfidence =
          match.overallConfidence >= 70 && match.overallConfidence < 90;
      } else if (selectedConfidence === 'Low') {
        matchConfidence = match.overallConfidence < 70;
      }

      const matchSearch =
        match.activityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.fieldDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.sourceDocument.toLowerCase().includes(searchQuery.toLowerCase());

      return matchDiscipline && matchStatus && matchConfidence && matchSearch;
    });
  }, [
    activityMatches,
    selectedDiscipline,
    selectedStatus,
    selectedConfidence,
    searchQuery,
  ]);

  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);
  const paginatedMatches = filteredMatches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper to find schedule activity details
  const getScheduleActivity = (activityId: string) => {
    return activities.find((a) => a.id === activityId);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              L5/L6 Activity Mapping
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-tint text-brand-deep dark:bg-yellow-400/15 dark:text-yellow-200">
              AI Matching Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Deterministic and semantic correlation between field observations and schedule activities
          </p>
        </div>
      </div>

      {/* Hero: "Field Evidence -> AI Decision -> Schedule Result" Visual Pipeline */}
      <div className="bg-brand-soft text-slate-900 dark:bg-linear-to-r dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 dark:text-white rounded-lg p-4 sm:p-5 border border-brand-tint dark:border-zinc-800 shadow-md">
        <div className="text-[11px] font-semibold text-brand-dark dark:text-yellow-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-red-400 dark:text-yellow-300" />
          Execution Correlation Architecture: Field Evidence → AI Decision → Schedule Result
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          {/* Step 1 */}
          <div className="p-3 bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-md">
            <span className="text-[10px] text-red-300 dark:text-yellow-200 font-bold uppercase block">
              1. Field Observation
            </span>
            <div className="text-xs font-medium text-slate-700 dark:text-zinc-200 mt-1 truncate">
              "SP-104 erection started at 09:30"
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">DPR-2209</div>
          </div>

          {/* Step 2 */}
          <div className="p-3 bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-md">
            <span className="text-[10px] text-red-300 dark:text-yellow-200 font-bold uppercase block">
              2. AI Interpretation
            </span>
            <div className="text-xs font-semibold text-slate-900 dark:text-zinc-100 mt-1">
              Piping / Line 24-XX / START
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Spool SP-104 detected</div>
          </div>

          {/* Step 3 */}
          <div className="p-3 bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-md">
            <span className="text-[10px] text-red-300 dark:text-yellow-200 font-bold uppercase block">
              3. Schedule Match
            </span>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
              PIP-001-01
            </div>
            <div className="text-[10px] text-slate-600 dark:text-zinc-300 truncate">Erect Line 24-XX</div>
          </div>

          {/* Step 4 */}
          <div className="p-3 bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-md">
            <span className="text-[10px] text-red-300 dark:text-yellow-200 font-bold uppercase block">
              4. Confidence
            </span>
            <div className="text-xs font-bold text-emerald-400 mt-1">
              95% High Confidence
            </div>
            <div className="text-[10px] text-slate-400">&gt;90% Auto Approved</div>
          </div>

          {/* Step 5 */}
          <div className="p-3 bg-brand-tint border border-brand-tint dark:bg-yellow-400/20 dark:border-yellow-400/50 rounded-md">
            <span className="text-[10px] text-brand-dark dark:text-yellow-100 font-bold uppercase block">
              5. Schedule Impact
            </span>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
              Actual Start: 22 Sep 09:30
            </div>
            <div className="text-[10px] text-brand-dark dark:text-yellow-100">Progress: 85% In Progress</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-300">
            <Filter className="w-4 h-4 text-brand dark:text-yellow-300" />
            Search &amp; Filter Mappings
          </div>
          <div className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-800 dark:text-zinc-200">{filteredMatches.length}</span> matches
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search activity, description, source..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-brand dark:focus:border-yellow-400"
            />
          </div>

          {/* Discipline */}
          <div>
            <select
              value={selectedDiscipline}
              onChange={(e) => {
                setSelectedDiscipline(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-brand dark:focus:border-yellow-400"
            >
              {disciplines.map((d) => (
                <option key={d} value={d}>
                  Discipline: {d}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-brand dark:focus:border-yellow-400"
            >
              <option value="All">Status: All</option>
              <option value="Auto Accepted">Auto Accepted</option>
              <option value="Review Required">Review Required</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Confidence */}
          <div>
            <select
              value={selectedConfidence}
              onChange={(e) => {
                setSelectedConfidence(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-brand dark:focus:border-yellow-400"
            >
              <option value="All">Confidence: All Tiers</option>
              <option value="High">&gt;90% High Confidence</option>
              <option value="Medium">70%–89% Medium</option>
              <option value="Low">&lt;70% Low Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Mapping Table */}
      <Card
        title="Activity Correlation Registry"
        subtitle="Click any row to open the full AI reasoning and evidence drawer"
      >
        <div className="overflow-x-auto -mx-5 -mb-5">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-4">Activity ID</th>
                <th className="py-2.5 px-3">L5/L6 Activity</th>
                <th className="py-2.5 px-3">Field Description</th>
                <th className="py-2.5 px-3">Discipline</th>
                <th className="py-2.5 px-3 text-center">Semantic</th>
                <th className="py-2.5 px-3 text-center">Entity</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {paginatedMatches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No matching activity correlations found.
                  </td>
                </tr>
              ) : (
                paginatedMatches.map((match) => {
                  const scheduleAct = getScheduleActivity(match.activityId);
                  return (
                    <tr
                      key={match.id}
                      onClick={() => setSelectedMatch(match)}
                      className="hover:bg-brand-soft/40 dark:hover:bg-zinc-800/60 transition cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-brand dark:text-yellow-300 group-hover:underline">
                        {match.activityId}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-zinc-100 max-w-[180px] truncate">
                        {scheduleAct?.name || match.aiInterpretation.activity}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {match.sourceDocument}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-zinc-300 max-w-[240px] truncate italic">
                        "{match.fieldDescription}"
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700 dark:text-zinc-300">
                        {match.aiInterpretation.discipline}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-semibold text-slate-600 dark:text-zinc-400">
                        {match.semanticScore}%
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-semibold text-slate-600 dark:text-zinc-400">
                        {match.entityScore}%
                      </td>
                      <td className="py-3 px-3">
                        <ConfidenceBadge
                          confidence={match.overallConfidence}
                          size="sm"
                          showBar
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <StatusBadge status={match.status} size="sm" />
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded border border-slate-200 dark:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded text-xs font-semibold ${
                    currentPage === i + 1
                      ? 'bg-brand dark:bg-yellow-400 dark:text-zinc-950 text-white'
                      : 'border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded border border-slate-200 dark:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Activity Detail Drawer */}
      <Drawer
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        title={selectedMatch?.activityId ? `Mapping: ${selectedMatch.activityId}` : 'Mapping Detail'}
        subtitle="AI Interpretation, Evidence Checklist & Audit Trail"
        width="xl"
      >
        {selectedMatch && (
          <div className="space-y-6 text-xs">
            {/* Header info */}
            <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-lg border border-slate-200 dark:border-zinc-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-brand dark:text-yellow-300">
                  {selectedMatch.activityId}
                </span>
                <StatusBadge status={selectedMatch.status} />
              </div>
              <div className="font-semibold text-slate-900 dark:text-zinc-100 text-sm">
                {getScheduleActivity(selectedMatch.activityId)?.name ||
                  selectedMatch.aiInterpretation.activity}
              </div>
              <div className="text-slate-500 flex items-center gap-2 text-[11px]">
                <FileText className="w-3.5 h-3.5" />
                <span>Source: {selectedMatch.sourceDocument}</span>
                <span>•</span>
                <span>{selectedMatch.aiInterpretation.discipline}</span>
              </div>
            </div>

            {/* Field Observation */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Field Observation
              </h4>
              <div className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md font-mono text-slate-800 dark:text-zinc-200 leading-relaxed italic">
                "{selectedMatch.fieldDescription}"
              </div>
            </div>

            {/* AI Interpretation */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand dark:text-yellow-300" />
                AI Interpretation
              </h4>
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-md font-mono space-y-1 text-slate-800 dark:text-zinc-200">
                <div>
                  <span className="text-slate-500">Discipline:</span>{' '}
                  <span className="font-semibold">
                    {selectedMatch.aiInterpretation.discipline}
                  </span>
                </div>
                {Object.entries(selectedMatch.aiInterpretation.identifiers).map(
                  ([k, v]) => (
                    <div key={k}>
                      <span className="text-slate-500 capitalize">{k}:</span>{' '}
                      <span className="font-semibold text-brand dark:text-yellow-300">
                        {v}
                      </span>
                    </div>
                  )
                )}
                <div>
                  <span className="text-slate-500">Event:</span>{' '}
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {selectedMatch.aiInterpretation.eventType}
                  </span>
                </div>
                {selectedMatch.aiInterpretation.timestamp && (
                  <div>
                    <span className="text-slate-500">Time:</span>{' '}
                    <span className="font-semibold">
                      {selectedMatch.aiInterpretation.timestamp}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Confidence Metrics */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Confidence Scoring
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-center">
                  <div className="text-[10px] text-slate-400">Overall</div>
                  <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedMatch.overallConfidence}%
                  </div>
                </div>
                <div className="p-2.5 rounded bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-center">
                  <div className="text-[10px] text-slate-400">Semantic</div>
                  <div className="text-base font-bold text-brand dark:text-yellow-300">
                    {selectedMatch.semanticScore}%
                  </div>
                </div>
                <div className="p-2.5 rounded bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-center">
                  <div className="text-[10px] text-slate-400">Entity</div>
                  <div className="text-base font-bold text-slate-800 dark:text-zinc-200">
                    {selectedMatch.entityScore}%
                  </div>
                </div>
              </div>
            </div>

            {/* Matching Evidence Checklist */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Matching Evidence Checklist
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-zinc-800 border border-slate-200 dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-900">
                {selectedMatch.matchEvidence.map((ev, i) => (
                  <div key={i} className="p-2.5 flex items-start gap-2.5">
                    {ev.matched ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-zinc-200">
                        {ev.type}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                        {ev.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Trail */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Audit Trail
              </h4>
              <div className="space-y-2 border-l-2 border-slate-200 dark:border-zinc-700 pl-3 ml-1 text-[11px]">
                <div>
                  <div className="font-semibold text-slate-700 dark:text-zinc-300">
                    Document Ingested
                  </div>
                  <div className="text-slate-400">
                    Source: {selectedMatch.sourceDocument} • {selectedMatch.createdAt}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-slate-700 dark:text-zinc-300">
                    AI Correlation Evaluated
                  </div>
                  <div className="text-slate-400">
                    Confidence: {selectedMatch.overallConfidence}% • Status: {selectedMatch.status}
                  </div>
                </div>
                {selectedMatch.reviewedBy && (
                  <div>
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Planner Action: {selectedMatch.status}
                    </div>
                    <div className="text-slate-400">
                      By {selectedMatch.reviewedBy} at {selectedMatch.reviewedAt}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons in Drawer */}
            {selectedMatch.status === 'Review Required' && (
              <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 flex gap-2">
                <button
                  onClick={() => {
                    approveMapping(selectedMatch.id);
                    setSelectedMatch({
                      ...selectedMatch,
                      status: 'Approved',
                      reviewedBy: 'Project Planner',
                      reviewedAt: new Date().toISOString(),
                    });
                  }}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md flex items-center justify-center gap-1.5 transition"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>
                <button
                  onClick={() => {
                    rejectMapping(selectedMatch.id);
                    setSelectedMatch({
                      ...selectedMatch,
                      status: 'Rejected',
                      reviewedBy: 'Project Planner',
                      reviewedAt: new Date().toISOString(),
                    });
                  }}
                  className="py-2 px-3 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-semibold rounded-md flex items-center justify-center gap-1.5 transition"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};
