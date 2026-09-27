import React, { useState, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import {
  BrainCircuit,
  Search,
  TrendingDown,
  Clock,
  Layers,
  History,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  mockHistoricalActivities,
  delayCauseData,
} from '../data/mockHistoricalData';
import { Discipline } from '../types';
import { useChartTheme } from '../theme/useChartTheme';

export const MemoryPage: React.FC = () => {
  const chartThemeConfig = useChartTheme();
  const [searchQuery, setSearchQuery] = useState('Similar piping erection activities');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');

  // Tokenize a query into meaningful search terms, with light stemming
  // ("erection" → "erect", "bottlenecks" → "bottleneck") so suggested
  // natural-language queries actually correlate with the corpus.
  const tokenize = (q: string): string[] => {
    const stopwords = new Set([
      'similar', 'activity', 'activities', 'delays', 'delay', 'patterns',
      'pattern', 'duration', 'durations', 'the', 'and', 'with', 'for', 'from',
    ]);
    return q
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 2 && !stopwords.has(t))
      .flatMap((t) => {
        const stem = t.replace(/(ions?|ing|es|s)$/, '');
        return stem.length > 2 && stem !== t ? [t, stem] : [t];
      });
  };

  const filteredActivities = useMemo(() => {
    const inDiscipline = mockHistoricalActivities.filter(
      (act) => selectedDiscipline === 'All' || act.discipline === selectedDiscipline
    );
    const tokens = tokenize(searchQuery);
    if (tokens.length === 0) return inDiscipline;

    return inDiscipline
      .map((act) => {
        const haystack = `${act.activityName} ${act.discipline} ${act.projectName} ${act.delayCause} ${act.location}`.toLowerCase();
        const hits = tokens.filter((t) => haystack.includes(t)).length;
        return { act, hits };
      })
      .filter(({ hits }) => hits > 0)
      .sort((a, b) => b.hits - a.hits)
      .map(({ act }) => act);
  }, [searchQuery, selectedDiscipline]);

  const resultStats = useMemo(() => {
    const list = filteredActivities;
    const n = list.length || 1;
    const sum = (f: (a: (typeof list)[number]) => number) => list.reduce((acc, a) => acc + f(a), 0);
    return {
      count: list.length,
      avgPlanned: Math.round((sum((a) => a.plannedDuration) / n) * 10) / 10,
      avgActual: Math.round((sum((a) => a.actualDuration) / n) * 10) / 10,
      avgDelay: Math.round((sum((a) => a.delay) / n) * 10) / 10,
    };
  }, [filteredActivities]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              Execution Memory
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-tint text-brand-deep dark:bg-yellow-400/15 dark:text-yellow-200">
              Institutional Knowledge
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Learn from completed project execution and historical patterns across past mega-projects
          </p>
        </div>
      </div>

      {/* Top Search Box */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs space-y-3">
        <div className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand dark:text-yellow-300" />
          Semantic Query over Historical Execution Corpus
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search historical execution patterns (e.g. 'Similar piping erection activities', 'crane bottlenecks')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-md border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-brand dark:focus:border-yellow-400"
          />
        </div>

        {/* Quick query chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="text-[11px]">Suggested queries:</span>
          {[
            'Similar piping erection activities',
            'Material availability delays in Civil',
            'Hydrotest inspection bottlenecks',
            'Pump alignment duration patterns',
          ].map((q) => (
            <button
              key={q}
              onClick={() => setSearchQuery(q)}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-[11px] transition"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards from search result */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
            Correlated Activities
          </div>
          <div className="text-2xl font-bold text-brand dark:text-yellow-300">
            {resultStats.count} Found
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Matching your query</div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
            Avg Planned Duration
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-zinc-100">
            {resultStats.avgPlanned} Days
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Scheduled baseline avg</div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
            Avg Actual Duration
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-zinc-100">
            {resultStats.avgActual} Days
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Real-world execution avg</div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-900 shadow-xs">
          <div className="text-xs font-medium text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> Average Delay
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            +{resultStats.avgDelay} Days
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Historical slippage margin</div>
        </div>
      </div>

      {/* Delay-Cause Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <Card
            title="Historical Delay Root Causes"
            subtitle="Percentage distribution of execution delay drivers"
          >
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={delayCauseData}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {delayCauseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    {...chartThemeConfig.tooltipProps}
                    formatter={(val: any) => [`${val}%`]}
                  />
                  <Legend
                    {...chartThemeConfig.legendProps}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ ...chartThemeConfig.legendProps.wrapperStyle, fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <Card
            title="Delay Impact by Primary Cause"
            subtitle="Frequency and aggregate impact across completed work packages"
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={delayCauseData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <CartesianGrid {...chartThemeConfig.gridProps} />
                  <XAxis
                    dataKey="name"
                    {...chartThemeConfig.xAxisProps}
                    fontSize={10}
                    interval={0}
                    tickFormatter={(val) => val.split(' ')[0]}
                  />
                  <YAxis {...chartThemeConfig.yAxisProps} domain={[0, 40]} unit="%" />
                  <Tooltip
                    {...chartThemeConfig.tooltipProps}
                    formatter={(val: any) => [`${val}% of all delays`]}
                  />
                  <Bar dataKey="value" fill={chartThemeConfig.colors.primary} radius={[4, 4, 0, 0]} name="Delay Share %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Historical Activities Table */}
      <Card
        title="Historical Execution Database"
        subtitle={`Comparable completed activities with planned vs actual duration — ${filteredActivities.length} of ${mockHistoricalActivities.length} records correlated`}
      >
        <div className="overflow-x-auto -mx-5 -mb-5">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-4">Activity Name</th>
                <th className="py-2.5 px-3">Discipline</th>
                <th className="py-2.5 px-3">Project</th>
                <th className="py-2.5 px-3 text-center">Planned Dur</th>
                <th className="py-2.5 px-3 text-center">Actual Dur</th>
                <th className="py-2.5 px-3 text-center">Delay</th>
                <th className="py-2.5 px-3">Primary Delay Cause</th>
                <th className="py-2.5 px-4 text-right">Similarity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filteredActivities.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-xs text-slate-400 dark:text-zinc-500">
                    <AlertTriangle className="w-5 h-5 mx-auto mb-2 text-amber-500" />
                    No historical records correlate with “{searchQuery}” — try a suggested query or clear the search.
                  </td>
                </tr>
              )}
              {filteredActivities.map((act) => (
                <tr
                  key={act.id}
                  className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition"
                >
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-zinc-100">
                    {act.activityName}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      Completed: {act.completedDate} • {act.location}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700 dark:text-zinc-300">
                    {act.discipline}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-zinc-400">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 font-mono text-[10px] border border-slate-200 dark:border-zinc-700">
                      {act.projectName}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-600 dark:text-zinc-300">
                    {act.plannedDuration} days
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 dark:text-zinc-100">
                    {act.actualDuration} days
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold">
                    {act.delay > 0 ? (
                      <span className="text-rose-600">+{act.delay}d</span>
                    ) : (
                      <span className="text-emerald-600">0d</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        act.delayCause === 'None'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                      }`}
                    >
                      {act.delayCause}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-brand dark:text-yellow-300">
                    {act.similarityScore}%
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
