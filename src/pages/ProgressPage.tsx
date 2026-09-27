import React, { useState, useMemo } from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../auth/AuthContext';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Filter,
  Search,
  ArrowUpDown,
  Download,
  Gauge,
  ShieldAlert,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { progressChartData } from '../data/mockActivities';
import { Discipline, ActivityStatus } from '../types';
import { useChartTheme } from '../theme/useChartTheme';

export const ProgressPage: React.FC = () => {
  const { activities, currentProject } = useProject();
  const { user } = useAuth();
  const chartThemeConfig = useChartTheme();

  const [selectedDiscipline, setSelectedDiscipline] = useState<string>(
    user?.role === 'DISCIPLINE_ENGINEER' ? user.discipline ?? 'All' : 'All'
  );
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedWbs, setSelectedWbs] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string>('id');
  const [sortAsc, setSortAsc] = useState(true);
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

  // Filtering & Sorting
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchDiscipline =
        selectedDiscipline === 'All' || act.discipline === selectedDiscipline;
      const matchStatus =
        selectedStatus === 'All' || act.status === selectedStatus;
      const matchWbs =
        selectedWbs === 'All' || act.wbsCode.startsWith(selectedWbs);
      const matchSearch =
        act.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDiscipline && matchStatus && matchWbs && matchSearch;
    });
  }, [activities, selectedDiscipline, selectedStatus, selectedWbs, searchQuery]);

  const sortedActivities = useMemo(() => {
    return [...filteredActivities].sort((a, b) => {
      let aVal: any = (a as any)[sortField] ?? '';
      let bVal: any = (b as any)[sortField] ?? '';
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredActivities, sortField, sortAsc]);

  const totalPages = Math.ceil(sortedActivities.length / itemsPerPage);
  const paginatedActivities = sortedActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // ---- Forecast projection (PM / Project Controls) ----
  const forecast = useMemo(() => {
    const data = progressChartData;
    if (data.length < 2) return null;
    const last = data[data.length - 1];
    const back = data[Math.max(0, data.length - 5)];
    const gain = (last.actual - back.actual) / Math.max(1, data.length - 1 - Math.max(0, data.length - 5));
    const remaining = Math.max(0, 100 - last.actual);
    const daysToFinish = gain > 0.05 ? Math.ceil(remaining / gain) : 60;
    const capped = Math.min(45, daysToFinish);

    const future = Array.from({ length: capped }, (_, i) => ({
      date: `+${i + 1}d`,
      planned: undefined as number | undefined,
      actual: undefined as number | undefined,
      forecast: Math.min(100, Math.round((last.actual + gain * (i + 1)) * 10) / 10),
    }));
    const merged = [...data.map((d) => ({ ...d, forecast: undefined as number | undefined })), ...future];

    const plannedFinish = data.find((d) => d.planned >= 100);
    const lastDate = new Date(`22 Sep 2026`);
    const projected = new Date(lastDate.getTime() + daysToFinish * 86400000);
    const baseline = plannedFinish ? new Date(`${plannedFinish.date} 2026`) : lastDate;
    const slipDays = Math.round((projected.getTime() - baseline.getTime()) / 86400000);

    return { merged, projected, slipDays, daysToFinish, cagr: Math.round(gain * 100) / 100 };
  }, []);

  // ---- Delay & risk derivation ----
  const risk = useMemo(() => {
    const delayed = activities.filter((a) => a.status === 'Delayed' || a.status === 'Blocked');
    const behind = activities.filter((a) => a.actualProgress < a.plannedProgress - 15);
    const byDiscipline = delayed.reduce<Record<string, number>>((acc, a) => {
      acc[a.discipline] = (acc[a.discipline] ?? 0) + 1;
      return acc;
    }, {});
    const hotspot = Object.entries(byDiscipline).sort((x, y) => y[1] - x[1])[0];
    return {
      delayed: delayed.sort((a, b) => b.variance - a.variance).slice(0, 5),
      behindCount: behind.length,
      delayedCount: delayed.length,
      riskIndex: Math.min(100, Math.round((delayed.length / Math.max(1, activities.length)) * 220 + behind.length * 1.5)),
      hotspot: hotspot ? hotspot[0] : 'None',
    };
  }, [activities]);

  const riskLevel = risk.riskIndex >= 60 ? 'High' : risk.riskIndex >= 30 ? 'Medium' : 'Low';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            Progress Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Detailed variance analysis, physical S-curve tracking, and discipline execution metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" /> Export Progress Report
          </button>
        </div>
      </div>

      {/* KPI Cards: Planned 65%, Actual 61%, Variance -4%, Delayed 47, Ahead 19 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
            Planned Progress
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-zinc-100">
            65%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Baseline S-Curve target</div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-brand-tint dark:border-yellow-400/25 shadow-xs">
          <div className="text-xs font-medium text-brand dark:text-yellow-300 mb-1">
            Actual Progress
          </div>
          <div className="text-2xl font-bold text-brand dark:text-yellow-300">
            61%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Field verified progress</div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-900 shadow-xs">
          <div className="text-xs font-medium text-rose-600 dark:text-rose-400 mb-1">
            Variance
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            -4%
          </div>
          <div className="text-[10px] text-rose-500 mt-1">Schedule Slippage</div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-900 shadow-xs">
          <div className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Activities Delayed
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            47
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Critical & near-critical</div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900 shadow-xs">
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Activities Ahead
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            19
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">
            Ahead of schedule baseline
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <Card
        title="Project S-Curve Tracking (Cumulative Planned vs Actual)"
        subtitle="Cut-off date: 22 Sep 2026 • Oilfield Expansion"
      >
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={progressChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorProgPlanned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartThemeConfig.colors.planned} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={chartThemeConfig.colors.planned} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProgActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartThemeConfig.colors.actual} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartThemeConfig.colors.actual} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...chartThemeConfig.gridProps} />
              <XAxis dataKey="date" {...chartThemeConfig.xAxisProps} />
              <YAxis {...chartThemeConfig.yAxisProps} domain={[0, 100]} unit="%" />
              <Tooltip
                {...chartThemeConfig.tooltipProps}
                formatter={(val: any) => [`${val}%`]}
              />
              <Area
                type="monotone"
                dataKey="planned"
                stroke={chartThemeConfig.colors.planned}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorProgPlanned)"
                name="Planned %"
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke={chartThemeConfig.colors.actual}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorProgActual)"
                name="Actual %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-300">
            <Filter className="w-4 h-4 text-brand dark:text-yellow-300" />
            Filters &amp; Search
          </div>
          <div className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-800 dark:text-zinc-200">{filteredActivities.length}</span> of {activities.length} activities
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, activity name..."
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
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Delayed">Delayed</option>
              <option value="Not Started">Not Started</option>
            </select>
          </div>

          {/* WBS filter */}
          <div>
            <select
              value={selectedWbs}
              onChange={(e) => {
                setSelectedWbs(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-brand dark:focus:border-yellow-400"
            >
              <option value="All">WBS: All Levels</option>
              <option value="1.1">WBS 1.1 — Civil Works</option>
              <option value="1.2">WBS 1.2 — Piping Systems</option>
              <option value="1.3">WBS 1.3 — Electrical Systems</option>
              <option value="1.4">WBS 1.4 — Instrumentation</option>
              <option value="1.5">WBS 1.5 — Mechanical Equipment</option>
              <option value="1.6">WBS 1.6 — HSE &amp; Commissioning</option>
            </select>
          </div>
        </div>
      </div>

      {/* Forecasting & Delay Risk (PM / Project Controls) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card
          title="Completion Forecast"
          subtitle="Trend-based projection of the actual progress curve against the baseline"
          action={
            forecast && (
              <span
                className={`px-2 py-1 rounded-md text-[11px] font-bold border ${
                  forecast.slipDays > 3
                    ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                    : forecast.slipDays >= 0
                    ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                }`}
              >
                {forecast.slipDays > 0 ? `+${forecast.slipDays}d vs baseline` : `${Math.abs(forecast.slipDays)}d early`}
              </span>
            )
          }
        >
          {forecast ? (
            <>
              <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
                <div className="p-2.5 rounded-md bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Projected Finish</div>
                  <div className="font-bold text-slate-800 dark:text-zinc-100 mt-0.5">
                    {forecast.projected.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </div>
                </div>
                <div className="p-2.5 rounded-md bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Days Remaining</div>
                  <div className="font-bold text-slate-800 dark:text-zinc-100 mt-0.5">~{forecast.daysToFinish}</div>
                </div>
                <div className="p-2.5 rounded-md bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Current Run Rate</div>
                  <div className="font-bold text-slate-800 dark:text-zinc-100 mt-0.5">{forecast.cagr}%/day</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={forecast.merged} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
                  <CartesianGrid {...chartThemeConfig.gridProps} />
                  <XAxis dataKey="date" {...chartThemeConfig.xAxisProps} />
                  <YAxis domain={[0, 100]} unit="%" {...chartThemeConfig.yAxisProps} />
                  <Tooltip {...chartThemeConfig.tooltipProps} />
                  <Legend {...chartThemeConfig.legendProps} />
                  <Line type="monotone" dataKey="actual" name="Actual" stroke={chartThemeConfig.colors.actual} strokeWidth={2.5} dot={false} connectNulls />
                  <Line type="monotone" dataKey="planned" name="Planned" stroke={chartThemeConfig.colors.planned} strokeWidth={2} dot={false} connectNulls />
                  <Line type="monotone" dataKey="forecast" name="Forecast" stroke={chartThemeConfig.colors.planned} strokeWidth={2} strokeDasharray="6 4" dot={false} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div className="py-10 text-center text-xs text-slate-400">Not enough data points for a projection.</div>
          )}
        </Card>

        <Card
          title="Delay & Risk Insights"
          subtitle="Bottlenecks and deviations derived from validated actual progress"
          action={
            <span
              className={`px-2 py-1 rounded-md text-[11px] font-bold border ${
                riskLevel === 'High'
                  ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                  : riskLevel === 'Medium'
                  ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              }`}
            >
              <Gauge className="w-3 h-3 inline mr-1" />
              Risk Index: {risk.riskIndex}/100 · {riskLevel}
            </span>
          }
        >
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-md bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700">
                <div className="text-[10px] uppercase font-bold text-slate-400">Delayed / Blocked</div>
                <div className="font-bold text-slate-800 dark:text-zinc-100 mt-0.5">{risk.delayedCount}</div>
              </div>
              <div className="p-2.5 rounded-md bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700">
                <div className="text-[10px] uppercase font-bold text-slate-400">{'>'}15% Behind</div>
                <div className="font-bold text-slate-800 dark:text-zinc-100 mt-0.5">{risk.behindCount}</div>
              </div>
              <div className="p-2.5 rounded-md bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700">
                <div className="text-[10px] uppercase font-bold text-slate-400">Hotspot</div>
                <div className="font-bold text-slate-800 dark:text-zinc-100 mt-0.5 truncate">{risk.hotspot}</div>
              </div>
            </div>

            <div className="space-y-2">
              {risk.delayed.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-md border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                  <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-slate-800 dark:text-zinc-100 truncate">
                      <span className="font-mono text-[11px] text-slate-400 mr-1.5">{a.id}</span>
                      {a.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                      {a.discipline} · actual {a.actualProgress}% vs planned {a.plannedProgress}%
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-[10px] font-bold shrink-0">
                    +{a.variance}d
                  </span>
                </div>
              ))}
              {risk.delayed.length === 0 && (
                <div className="py-6 text-center text-xs text-slate-400 dark:text-zinc-500">
                  <CheckCircle2 className="w-5 h-5 mx-auto mb-1.5 text-emerald-500" />
                  No delayed or blocked activities — execution is on track.
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Activity Progress Table */}
      <Card
        title="Schedule Activity Progress Registry"
        subtitle="L5/L6 activities with planned vs actual duration and variance"
      >
        <div className="overflow-x-auto -mx-5 -mb-5">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">
                <th
                  className="py-2.5 px-4 cursor-pointer hover:text-brand-dark dark:hover:text-yellow-200"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center gap-1">
                    Activity ID <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-2.5 px-3 cursor-pointer hover:text-brand-dark dark:hover:text-yellow-200"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Activity Name <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Discipline</th>
                <th className="py-2.5 px-3">Planned Start</th>
                <th className="py-2.5 px-3">Planned Finish</th>
                <th className="py-2.5 px-3">Actual Start</th>
                <th className="py-2.5 px-3">Actual Finish</th>
                <th className="py-2.5 px-3 min-w-[120px]">Progress</th>
                <th
                  className="py-2.5 px-3 cursor-pointer hover:text-brand-dark dark:hover:text-yellow-200"
                  onClick={() => handleSort('variance')}
                >
                  <div className="flex items-center gap-1">
                    Variance <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {paginatedActivities.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No activities found matching filters.
                  </td>
                </tr>
              ) : (
                paginatedActivities.map((act) => (
                  <tr
                    key={act.id}
                    className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition"
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-brand dark:text-yellow-300">
                      {act.id}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-zinc-100">
                      {act.name}
                      <span className="block text-[10px] text-slate-400 font-mono">
                        {act.location} • WBS: {act.wbsCode}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700 dark:text-zinc-300">
                      {act.discipline}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-zinc-400 font-mono text-[11px]">
                      {act.plannedStart}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-zinc-400 font-mono text-[11px]">
                      {act.plannedFinish}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px]">
                      {act.actualStart ? (
                        <span className="text-slate-800 dark:text-zinc-200">
                          {act.actualStart}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px]">
                      {act.actualFinish ? (
                        <span className="text-slate-800 dark:text-zinc-200">
                          {act.actualFinish}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              act.actualProgress >= 100
                                ? 'bg-emerald-500'
                                : act.status === 'Delayed'
                                ? 'bg-amber-500'
                                : 'bg-brand dark:bg-yellow-400 dark:text-zinc-950'
                            }`}
                            style={{ width: `${act.actualProgress}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-zinc-300">
                          {act.actualProgress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px]">
                      {act.variance > 0 ? (
                        <span className="text-rose-600 font-semibold">
                          +{act.variance}d delay
                        </span>
                      ) : act.variance < 0 ? (
                        <span className="text-emerald-600 font-semibold">
                          {act.variance}d early
                        </span>
                      ) : (
                        <span className="text-slate-400">0d</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <StatusBadge status={act.status} size="sm" />
                    </td>
                  </tr>
                ))
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
    </div>
  );
};
