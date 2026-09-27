import React, { useState, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { mockAuditLogs } from '../data/mockAudit';
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  Download,
} from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState<string>('All');
  const [actionFilter, setActionFilter] = useState<string>('All');

  const filteredLogs = useMemo(() => {
    return mockAuditLogs.filter((log) => {
      const matchSearch =
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.source.toLowerCase().includes(searchQuery.toLowerCase());
      const matchResult = resultFilter === 'All' || log.result === resultFilter;
      const matchAction = actionFilter === 'All' || log.action === actionFilter;
      return matchSearch && matchResult && matchAction;
    });
  }, [searchQuery, resultFilter, actionFilter]);

  const uniqueActions = Array.from(new Set(mockAuditLogs.map((l) => l.action)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              Enterprise Audit Trail &amp; Governance Log
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
              Compliance Vault
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Immutable chronological record of schedule modifications, model decisions, and planner actions
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center gap-1.5 shadow-xs"
        >
          <Download className="w-3.5 h-3.5" /> Export Audit Log
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-300">
            <Filter className="w-4 h-4 text-brand dark:text-yellow-300" />
            Filter Audit Entries
          </div>
          <div className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-800 dark:text-zinc-200">{filteredLogs.length}</span> audit records
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, action, activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-brand dark:focus:border-yellow-400"
            />
          </div>

          <div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-brand dark:focus:border-yellow-400"
            >
              <option value="All">All Actions</option>
              {uniqueActions.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-brand dark:focus:border-yellow-400"
            >
              <option value="All">All Results</option>
              <option value="Success">Success</option>
              <option value="Warning">Warning</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <Card
        title="Chronological Audit Records"
        subtitle="Verifiable event logging with user attribution and source references"
      >
        <div className="overflow-x-auto -mx-5 -mb-5">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-3">User &amp; Role</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Target Entity</th>
                <th className="py-2.5 px-3">Source</th>
                <th className="py-2.5 px-3">Result</th>
                <th className="py-2.5 px-4">Operational Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition"
                >
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-zinc-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900 dark:text-zinc-100">
                      {log.user}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {log.role}
                    </div>
                  </td>

                  <td className="py-3 px-3 font-semibold text-brand dark:text-yellow-300">
                    {log.action}
                  </td>

                  <td className="py-3 px-3 font-mono text-[11px] text-slate-800 dark:text-zinc-200">
                    {log.entity}
                  </td>

                  <td className="py-3 px-3 font-mono text-[10px] text-slate-500">
                    {log.source}
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold border ${
                        log.result === 'Success'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                          : log.result === 'Warning'
                          ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                          : 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                      }`}
                    >
                      {log.result}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-600 dark:text-zinc-400 text-[11px] max-w-xs truncate">
                    {log.details || '—'}
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
