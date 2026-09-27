import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../auth/AuthContext';
import { ROLE_LABELS, ROLE_BADGES } from '../config/permissions';
import {
  TrendingUp,
  Layers,
  CheckCircle2,
  Clock,
  HelpCircle,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  ShieldAlert,
  Calendar,
  Sparkles,
  Users,
  UploadCloud,
  FileCheck,
  Shield,
  ShieldCheck,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatusBadge, ConfidenceBadge } from '../components/ui/Badge';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  disciplineProgressData,
  progressChartData,
  activityStatusDistribution,
} from '../data/mockActivities';
import { recentExecutionEvents } from '../data/mockEvents';
import { useChartTheme } from '../theme/useChartTheme';

export const DashboardPage: React.FC = () => {
  const { currentProject, stats, alerts, markAlertRead, ingestionFiles } =
    useProject();
  const { user, hasPermission } = useAuth();
  const chartThemeConfig = useChartTheme();
  const navigate = useNavigate();

  const role = user?.role || 'PROJECT_PLANNER';
  const roleBadge = ROLE_BADGES[role];

  // Base KPIs
  const baseKpis = [
    {
      label: 'Overall Progress',
      value: `${stats.overallProgress}%`,
      description: 'Planned: 71.0% (Variance -2.6%)',
      trend: '+1.4% this week',
      icon: TrendingUp,
      color: 'text-brand dark:text-yellow-300',
      bg: 'bg-brand-soft dark:bg-yellow-400/10',
      border: 'border-brand-tint dark:border-yellow-400/25',
    },
    {
      label: 'Activities',
      value: stats.totalActivities.toLocaleString(),
      description: 'L5/L6 activities tracked',
      trend: '6 disciplines active',
      icon: Layers,
      color: 'text-slate-700 dark:text-zinc-300',
      bg: 'bg-slate-50 dark:bg-zinc-800/40',
      border: 'border-slate-200 dark:border-zinc-800',
    },
    {
      label: 'AI Matched',
      value: stats.aiMatched.toLocaleString(),
      description: 'High confidence auto-mapped',
      trend: '87.0% auto-acceptance',
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-900',
    },
    {
      label: 'Pending Review',
      value: stats.pendingReview.toString(),
      description: '70%–89% confidence items',
      trend: 'Requires planner review',
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-900',
      action: hasPermission('APPROVE_MAPPING') ? () => navigate('/review') : undefined,
    },
    {
      label: 'Unmatched',
      value: stats.unmatched.toString(),
      description: 'Below 70% confidence threshold',
      trend: 'Missing identifiers',
      icon: HelpCircle,
      color: 'text-slate-500 dark:text-zinc-400',
      bg: 'bg-slate-100 dark:bg-zinc-800',
      border: 'border-slate-300 dark:border-zinc-700',
      action: hasPermission('VIEW_ACTIVITIES')
        ? () => navigate('/activities')
        : undefined,
    },
    {
      label: 'Contradictions',
      value: stats.contradictions.toString(),
      description: 'Conflicting field reports',
      trend: '2 high severity open',
      icon: AlertTriangle,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-200 dark:border-rose-900',
      action: hasPermission('RESOLVE_CONTRADICTION')
        ? () => navigate('/contradictions')
        : undefined,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Context Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              {role === 'SITE_SUPERVISOR'
                ? "Site Supervisor's Execution Center"
                : role === 'DISCIPLINE_ENGINEER'
                ? "Discipline Engineer's Technical Overview"
                : role === 'ADMIN'
                ? 'System Administration & Global Telemetry'
                : 'Project Execution Overview'}
            </h1>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold border ${roleBadge.bg} ${roleBadge.text} ${roleBadge.border}`}
            >
              {roleBadge.label} VIEW
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Real-time visibility from field execution to L5/L6 schedule •{' '}
            <span className="font-semibold text-slate-700 dark:text-zinc-300">
              {currentProject.name} ({currentProject.id})
            </span>
          </p>
        </div>

        {/* Project Meta Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 bg-white dark:bg-zinc-900 rounded-md border border-slate-200 dark:border-zinc-800 flex items-center gap-2 shadow-xs">
            <span className="text-slate-400">Schedule Status:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {currentProject.scheduleStatus}
            </span>
          </div>

          <div className="px-3 py-1.5 bg-white dark:bg-zinc-900 rounded-md border border-slate-200 dark:border-zinc-800 flex items-center gap-2 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Updated:</span>
            <span className="font-medium text-slate-700 dark:text-zinc-300">
              22 Sep 2026, 17:42
            </span>
          </div>
        </div>
      </div>

      {/* Role-Specific Banner & Callouts (Section 34) */}
      {role === 'SITE_SUPERVISOR' && (
        <div className="p-4 bg-amber-50 text-slate-800 dark:bg-zinc-900 dark:bg-linear-to-r dark:from-amber-950/40 dark:via-zinc-900 dark:to-amber-950/20 dark:text-zinc-100 border border-amber-200 dark:border-amber-800/60 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div>
            <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2 text-sm mb-1">
              <UploadCloud className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Supervisor Field Hub: Today's Shift Logs &amp; DPRs
            </div>
            <p className="text-slate-700 dark:text-zinc-300 leading-relaxed">
              You are viewing the streamlined Field Supervisor console. Upload daily logs, verify
              work packages, and submit observations directly into the AI pipeline.
            </p>
          </div>
          <button
            onClick={() => navigate('/report')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-md shadow-md transition flex items-center gap-1.5 self-start md:self-auto shrink-0"
          >
            <UploadCloud className="w-4 h-4" /> Open Report Progress Hub
          </button>
        </div>
      )}

      {role === 'ADMIN' && (
        <div className="p-4 bg-purple-50 text-slate-800 dark:bg-zinc-900 dark:bg-linear-to-r dark:from-purple-950/40 dark:via-zinc-900 dark:to-purple-950/20 dark:text-zinc-100 border border-purple-200 dark:border-purple-800/60 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div>
            <div className="font-bold text-purple-800 dark:text-purple-300 flex items-center gap-2 text-sm mb-1">
              <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Administrator Control Plane Active
            </div>
            <p className="text-slate-700 dark:text-zinc-300 leading-relaxed">
              Full system authority enabled. You have privileges to manage user identities, configure
              global model thresholds, and inspect immutable audit trails.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => navigate('/users')}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-md shadow-xs transition flex items-center gap-1"
            >
              <Users className="w-3.5 h-3.5" /> Users &amp; Roles
            </button>
            <button
              onClick={() => navigate('/audit')}
              className="px-3.5 py-1.5 border border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-semibold rounded-md transition flex items-center gap-1"
            >
              <FileCheck className="w-3.5 h-3.5" /> Audit Logs
            </button>
          </div>
        </div>
      )}


      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {baseKpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={kpi.action}
              className={`p-4 rounded-lg bg-white dark:bg-zinc-900 border ${kpi.border} shadow-xs flex flex-col justify-between transition hover:shadow-md ${
                kpi.action ? 'cursor-pointer hover:border-brand dark:hover:border-yellow-400' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                  {kpi.label}
                </span>
                <div className={`p-1.5 rounded-md ${kpi.bg} ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                {kpi.value}
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
                <div className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                  {kpi.description}
                </div>
                <div className="text-[10px] font-semibold text-slate-700 dark:text-zinc-300 mt-0.5 flex items-center gap-1">
                  {kpi.trend}
                  {kpi.action && <ArrowUpRight className="w-3 h-3 text-brand dark:text-yellow-300" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Planned vs Actual Progress Area Chart */}
        <div className="lg:col-span-8">
          <Card
            title="Planned vs Actual Progress (S-Curve)"
            subtitle="Cumulative execution progress percentage across active cut-off dates"
            action={
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-brand dark:bg-yellow-400 rounded" />
                  <span className="text-slate-600 dark:text-zinc-400">Planned</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-emerald-500 rounded" />
                  <span className="text-slate-600 dark:text-zinc-400">Actual</span>
                </div>
              </div>
            }
          >
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={progressChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartThemeConfig.colors.planned} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={chartThemeConfig.colors.planned} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...chartThemeConfig.gridProps} />
                  <XAxis
                    dataKey="date"
                    {...chartThemeConfig.xAxisProps}
                    tickLine={false}
                  />
                  <YAxis
                    {...chartThemeConfig.yAxisProps}
                    tickLine={false}
                    domain={[0, 100]}
                    unit="%"
                  />
                  <Tooltip
                    {...chartThemeConfig.tooltipProps}
                    formatter={(value: any) => [`${value}%`]}
                  />
                  <Area
                    type="monotone"
                    dataKey="planned"
                    stroke={chartThemeConfig.colors.planned}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPlanned)"
                    name="Planned"
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke={chartThemeConfig.colors.actual}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorActual)"
                    name="Actual"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
              <span>Cut-off Date: 22 Sep 2026</span>
              <span className="font-semibold text-rose-500">Variance: -4.0%</span>
            </div>
          </Card>
        </div>

        {/* Activity Status Distribution Donut */}
        <div className="lg:col-span-4">
          <Card
            title="Activity Status Distribution"
            subtitle="Current breakdown of 1,250 L5/L6 activities"
          >
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityStatusDistribution}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {activityStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    {...chartThemeConfig.tooltipProps}
                    formatter={(value: any) => [`${value}%`]}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    {...chartThemeConfig.legendProps}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Discipline Progress Bar Chart */}
      <Card
        title="Discipline Progress Breakdown"
        subtitle="Planned vs Actual progress metrics across major EPC disciplines"
      >
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={disciplineProgressData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid {...chartThemeConfig.gridProps} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} unit="%" {...chartThemeConfig.xAxisProps} />
              <YAxis dataKey="discipline" type="category" {...chartThemeConfig.yAxisProps} tickLine={false} />
              <Tooltip
                {...chartThemeConfig.tooltipProps}
                formatter={(val: any) => [`${val}%`]}
              />
              <Legend {...chartThemeConfig.legendProps} />
              <Bar dataKey="planned" fill={chartThemeConfig.colors.planned} name="Planned %" radius={[0, 4, 4, 0]} />
              <Bar dataKey="actual" fill={chartThemeConfig.colors.actual} name="Actual %" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Bottom Grid: Recent Execution Events & Active Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Execution Events Table */}
        <div className="lg:col-span-8">
          <Card
            title="Recent Execution Events"
            subtitle="AI-extracted field updates matched to project schedule"
            action={
              hasPermission('VIEW_ACTIVITIES') ? (
                <button
                  onClick={() => navigate('/activities')}
                  className="text-xs font-semibold text-brand dark:text-yellow-300 hover:underline flex items-center gap-1"
                >
                  View all mapping <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : undefined
            }
          >
            <div className="overflow-x-auto -mx-5 -mb-5">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-4">Time</th>
                    <th className="py-2.5 px-3">Discipline</th>
                    <th className="py-2.5 px-3">Activity</th>
                    <th className="py-2.5 px-3">Event</th>
                    <th className="py-2.5 px-3">Source</th>
                    <th className="py-2.5 px-3">Confidence</th>
                    <th className="py-2.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {recentExecutionEvents.map((evt, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition cursor-pointer"
                      onClick={() => {
                        if (hasPermission('VIEW_ACTIVITIES')) navigate('/activities');
                      }}
                    >
                      <td className="py-3 px-4 font-mono font-medium text-slate-600 dark:text-zinc-300">
                        {evt.time}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                          {evt.discipline}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900 dark:text-zinc-100 max-w-[180px] truncate">
                        {evt.activity}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-zinc-400">
                        {evt.event}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-[11px] font-mono text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 whitespace-nowrap inline-block">
                          {evt.source}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <ConfidenceBadge confidence={evt.confidence} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <StatusBadge status={evt.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Active Alerts Panel */}
        <div className="lg:col-span-4">
          <Card
            title="Active Intelligence Alerts"
            subtitle="Flagged by contradiction engine & integrity checks"
            action={
              hasPermission('RESOLVE_CONTRADICTION') ? (
                <button
                  onClick={() => navigate('/contradictions')}
                  className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                >
                  Resolve <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : undefined
            }
          >
            <div className="space-y-3">
              {alerts.slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-md border text-xs transition ${
                    alert.severity === 'High'
                      ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                      : alert.severity === 'Medium'
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                      : 'bg-slate-50 dark:bg-zinc-800/40 border-slate-200 dark:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`font-semibold flex items-center gap-1.5 ${
                        alert.severity === 'High'
                          ? 'text-rose-700 dark:text-rose-300'
                          : alert.severity === 'Medium'
                          ? 'text-amber-700 dark:text-amber-300'
                          : 'text-slate-700 dark:text-zinc-300'
                      }`}
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {alert.severity} Severity
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(alert.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-zinc-300 leading-normal mb-2">
                    {alert.description}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-zinc-800">
                    <span className="text-[10px] text-slate-400">{alert.title}</span>
                    {alert.actionRoute && hasPermission('RESOLVE_CONTRADICTION') && (
                      <button
                        onClick={() => {
                          markAlertRead(alert.id);
                          navigate(alert.actionRoute!);
                        }}
                        className="text-xs font-semibold text-brand dark:text-yellow-300 hover:underline flex items-center gap-1"
                      >
                        View <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
