import React from 'react';
import { NavLink } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../auth/AuthContext';
import { ROLE_LABELS, ROLE_BADGES } from '../../config/permissions';
import {
  LayoutDashboard,
  TrendingUp,
  GitMerge,
  CheckSquare,
  AlertTriangle,
  History,
  UploadCloud,
  Inbox,
  ClipboardPen,
  BrainCircuit,
  Bot,
  Settings,
  ChevronDown,
  Layers,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileCheck,
} from 'lucide-react';
import { Permission } from '../../types';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  onMobileClose,
}) => {
  const {
    projects,
    currentProjectId,
    setCurrentProjectId,
    stats,
  } = useProject();

  const { user, hasPermission } = useAuth();

  // Filter projects by user's assigned projectIds (Admin has access to all)
  const accessibleProjects =
    user?.role === 'ADMIN'
      ? projects
      : projects.filter((p) => user?.projectIds.includes(p.id));

  const role = user?.role || 'PROJECT_PLANNER';
  const roleBadge = ROLE_BADGES[role];

  // Dynamic role-aware navigation configuration (Section 26)
  const navItems: {
    to: string;
    label: string;
    icon: any;
    permission: Permission;
    badge?: number;
    badgeVariant?: 'warning' | 'danger';
  }[] = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      permission: 'VIEW_DASHBOARD',
    },
    {
      to: '/progress',
      label: 'Progress Intelligence',
      icon: TrendingUp,
      permission: 'VIEW_PROGRESS',
    },
    {
      to: '/activities',
      label: role === 'SITE_SUPERVISOR' ? 'My Activities' : 'Activity Mapping',
      icon: GitMerge,
      permission: 'VIEW_ACTIVITIES',
    },
    {
      to: '/incoming',
      label: 'Incoming Field Updates',
      icon: Inbox,
      permission: 'APPROVE_MAPPING',
      badge: stats.pendingFieldUpdates > 0 ? stats.pendingFieldUpdates : undefined,
      badgeVariant: 'warning' as const,
    },
    {
      to: '/review',
      label: 'Review Center',
      icon: CheckSquare,
      permission: 'APPROVE_MAPPING',
      badge: stats.pendingReview > 0 ? stats.pendingReview : undefined,
      badgeVariant: 'warning',
    },
    {
      to: '/contradictions',
      label: 'Contradictions',
      icon: AlertTriangle,
      permission: 'RESOLVE_CONTRADICTION',
      badge: stats.contradictions > 0 ? stats.contradictions : undefined,
      badgeVariant: 'danger',
    },
    {
      to: '/timeline',
      label: 'Execution Timeline',
      icon: History,
      permission: 'VIEW_PROGRESS',
    },
    {
      to: '/report',
      label: 'Report Progress',
      icon: ClipboardPen,
      permission: 'UPLOAD_REPORT',
    },
    {
      to: '/ingestion',
      label: role === 'SITE_SUPERVISOR' ? 'My Reports' : 'Reports & Ingestion',
      icon: UploadCloud,
      permission: 'UPLOAD_REPORT',
    },
    {
      to: '/memory',
      label: 'Execution Memory',
      icon: BrainCircuit,
      permission: 'VIEW_MEMORY',
    },
    {
      to: '/copilot',
      label: 'AI Copilot',
      icon: Bot,
      permission: 'USE_COPILOT',
    },
    {
      to: '/users',
      label: 'Users & Roles',
      icon: Shield,
      permission: 'MANAGE_USERS',
    },
    {
      to: '/audit',
      label: 'Audit Logs',
      icon: FileCheck,
      permission: 'VIEW_AUDIT_LOG',
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      permission: 'MANAGE_AI_SETTINGS',
    },
  ];

  // Filter items based on permissions
  const visibleNavItems = navItems.filter((item) =>
    hasPermission(item.permission)
  );

  return (
    <aside
      className={`h-full flex flex-col bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 transition-all duration-200 select-none shadow-xs ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-md bg-brand dark:bg-yellow-400 dark:text-zinc-950 flex items-center justify-center text-white font-bold shrink-0 shadow-md shadow-brand/20 dark:shadow-yellow-400/20">
            <span className="text-base tracking-tighter">◈</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white leading-none">
                SiteSync <span className="text-brand dark:text-yellow-300">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 leading-tight mt-0.5 font-medium tracking-wide uppercase">
                EPC Execution Bridge
              </span>
            </div>
          )}
        </div>

        {/* Desktop collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Project Selector (Sections 35 & 36) */}
      <div className="p-3 border-b border-slate-200 dark:border-zinc-800">
        {!collapsed ? (
          <div>
            <label className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <Layers className="w-3 h-3 text-brand dark:text-yellow-300" />
              Active Project
            </label>

            {accessibleProjects.length > 1 ? (
              /* Dropdown if multiple projects available */
              <div className="relative">
                <select
                  value={currentProjectId}
                  onChange={(e) => setCurrentProjectId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-xs font-semibold rounded-md py-2 pl-2.5 pr-8 appearance-none focus:outline-none focus:border-brand dark:focus:border-yellow-400 transition cursor-pointer"
                >
                  {accessibleProjects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-200">
                      {p.name} — {p.id}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              </div>
            ) : (
              /* Static clean card if single project available */
              <div className="p-2 rounded-md bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/60 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-white truncate max-w-[150px]">
                  {accessibleProjects[0]?.name || 'OILFIELD EXPANSION'}
                </span>
                <span className="font-mono text-[10px] text-brand dark:text-yellow-300 font-bold">
                  {accessibleProjects[0]?.id || 'PRJ-001'}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center" title="Active Project">
            <div className="w-8 h-8 rounded bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-brand dark:text-yellow-300 border border-slate-200 dark:border-zinc-700">
              {currentProjectId.replace('PRJ-', 'P')}
            </div>
          </div>
        )}
      </div>

      {/* Navigation list */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onMobileClose}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-soft text-brand-dark dark:bg-yellow-400/15 dark:text-yellow-200 font-semibold border-l-2 border-brand dark:border-yellow-400 pl-2.5 shadow-2xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800/60'
                } ${collapsed ? 'justify-center px-0' : ''}`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    item.badgeVariant === 'danger'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
                      : 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User profile footer */}
      <div className="p-3 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2.5">
          <div className="relative shrink-0">
            <div className="w-7 h-7 rounded-full bg-brand dark:bg-yellow-400 dark:text-zinc-950 text-white text-[11px] font-bold flex items-center justify-center">
              {user ? user.name.split(' ').map((n) => n[0]).join('') : 'U'}
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-zinc-900" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate">
                {user?.name || 'Ahmed Al-Rashidi'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="truncate">{ROLE_LABELS[role]}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
