import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../auth/AuthContext';
import { ROLE_LABELS } from '../../config/permissions';
import {
  LayoutDashboard,
  TrendingUp,
  GitMerge,
  CheckSquare,
  ClipboardCheck,
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
  Shield,
  FileCheck,
  Check,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { Permission } from '../../types';
import { Modal } from '../ui/Modal';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onMobileClose?: () => void;
}

type NavItem = {
  to: string;
  label: string;
  icon: React.ElementType;
  permission: Permission;
  permissions?: Permission[];
  visible: boolean;
  badge?: number;
  badgeVariant?: 'warning' | 'danger';
  children?: NavItem[];
};

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
    currentProject,
  } = useProject();

  const { user, hasPermission } = useAuth();
  const location = useLocation();

  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [executionOpen, setExecutionOpen] = useState(
    location.pathname === '/timeline' || location.pathname === '/memory'
  );
  const projectMenuRef = useRef<HTMLDivElement>(null);

  // Close project dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (projectMenuRef.current && !projectMenuRef.current.contains(e.target as Node)) {
        setProjectMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter projects by user's assigned projectIds (Admin has access to all)
  const accessibleProjects =
    user?.role === 'ADMIN'
      ? projects
      : projects.filter((p) => user?.projectIds.includes(p.id));

  const role = user?.role || 'PROJECT_PLANNER';

  // Dynamic role-aware navigation configuration (Section 26)
  const navItems: NavItem[] = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      permission: 'VIEW_DASHBOARD',
      visible: true,
    },
    {
      to: '/progress',
      label: 'Progress Intelligence',
      icon: TrendingUp,
      permission: 'VIEW_PROGRESS',
      visible: role !== 'DISCIPLINE_ENGINEER',
    },
    {
      to: '/field-operations',
      label: 'Field Operations',
      icon: ClipboardCheck,
      permission: 'APPROVE_MAPPING',
      permissions: ['APPROVE_MAPPING', 'RESOLVE_CONTRADICTION'],
      visible: role !== 'ADMIN',
    },
    {
      to: '/activities',
      label: role === 'SITE_SUPERVISOR' ? 'My Activities' : 'Activity Mapping',
      icon: GitMerge,
      permission: 'VIEW_ACTIVITIES',
      visible: true,
    },
    {
      to: '/incoming',
      label: 'Incoming Field Updates',
      icon: Inbox,
      permission: 'APPROVE_MAPPING',
      visible: role === 'ADMIN',
      badge: stats.pendingFieldUpdates > 0 ? stats.pendingFieldUpdates : undefined,
      badgeVariant: 'warning' as const,
    },
    {
      to: '/review',
      label: 'Review Center',
      icon: CheckSquare,
      permission: 'APPROVE_MAPPING',
      visible: role === 'ADMIN',
      badge: stats.pendingReview > 0 ? stats.pendingReview : undefined,
      badgeVariant: 'warning',
    },
    {
      to: '/contradictions',
      label: 'Contradictions',
      icon: AlertTriangle,
      permission: 'RESOLVE_CONTRADICTION',
      visible: role === 'ADMIN',
      badge: stats.contradictions > 0 ? stats.contradictions : undefined,
      badgeVariant: 'danger',
    },
    {
      to: '#execution',
      label: 'Execution',
      icon: History,
      permission: 'VIEW_PROGRESS',
      visible: role === 'PROJECT_PLANNER' || role === 'PROJECT_MANAGER',
      children: [
        {
          to: '/timeline',
          label: 'Execution Timeline',
          icon: History,
          permission: 'VIEW_PROGRESS',
          visible: true,
        },
        {
          to: '/memory',
          label: 'Execution Memory',
          icon: BrainCircuit,
          permission: 'VIEW_MEMORY',
          visible: true,
        },
      ],
    },
    {
      to: '/timeline',
      label: 'Execution Timeline',
      icon: History,
      permission: 'VIEW_PROGRESS',
      visible: role !== 'PROJECT_PLANNER' && role !== 'PROJECT_MANAGER',
    },
    {
      to: '/report',
      label: 'Report Progress',
      icon: ClipboardPen,
      permission: 'UPLOAD_REPORT',
      visible: role !== 'PROJECT_PLANNER',
    },
    {
      to: '/ingestion',
      label: role === 'SITE_SUPERVISOR' ? 'My Reports' : 'Reports & Ingestion',
      icon: UploadCloud,
      permission: 'UPLOAD_REPORT',
      visible: role !== 'PROJECT_PLANNER',
    },
    {
      to: '/report',
      label: 'Progress Reporting',
      icon: ClipboardPen,
      permission: 'UPLOAD_REPORT',
      visible: role === 'PROJECT_PLANNER',
    },
    {
      to: '/memory',
      label: 'Execution Memory',
      icon: BrainCircuit,
      permission: 'VIEW_MEMORY',
      visible: role !== 'PROJECT_PLANNER' && role !== 'PROJECT_MANAGER',
    },
    {
      to: '/copilot',
      label: 'AI Copilot',
      icon: Bot,
      permission: 'USE_COPILOT',
      visible: true,
    },
    {
      to: '/users',
      label: 'Users & Roles',
      icon: Shield,
      permission: 'MANAGE_USERS',
      visible: true,
    },
    {
      to: '/audit',
      label: 'Audit Logs',
      icon: FileCheck,
      permission: 'VIEW_AUDIT_LOG',
      visible: true,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      permission: 'MANAGE_AI_SETTINGS',
      visible: true,
    },
  ];

  // Filter items based on permissions
  const visibleNavItems = navItems.filter((item) =>
    item.visible && (item.permissions?.some((permission) => hasPermission(permission)) ?? hasPermission(item.permission))
  );

  const renderNavItem = (item: NavItem, nested = false): React.ReactNode => {
    const Icon = item.icon;
    const childItems = item.children?.filter(
      (child) => child.visible && hasPermission(child.permission)
    );
    const hasActiveChild = childItems?.some((child) => location.pathname === child.to) ?? false;
    const isExecutionOpen = executionOpen || hasActiveChild;

    if (childItems?.length) {
      return (
        <React.Fragment key={item.to}>
          <button
            type="button"
            onClick={() => setExecutionOpen((open) => !open)}
            title={collapsed ? item.label : undefined}
            aria-expanded={isExecutionOpen}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              hasActiveChild
                ? 'bg-brand-soft text-brand-dark dark:bg-yellow-400/15 dark:text-yellow-200 font-semibold border-l-2 border-brand dark:border-yellow-400 pl-2.5 shadow-2xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800/60'
            } ${collapsed ? 'justify-center px-0' : ''}`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="flex-1 truncate text-left">{item.label}</span>}
            {!collapsed && (
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${isExecutionOpen ? 'rotate-180' : ''}`}
              />
            )}
          </button>
          {isExecutionOpen && childItems.map((child) => renderNavItem(child, true))}
        </React.Fragment>
      );
    }

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
          } ${nested ? 'ml-4' : ''} ${collapsed ? 'justify-center px-0 ml-0' : ''}`
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
  };

  return (
    <aside
      className={`h-full flex flex-col bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 transition-all duration-200 select-none shadow-xs ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div
        className={`h-14 flex items-center border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 ${
          collapsed ? 'justify-center px-0' : 'justify-between px-3'
        }`}
      >
        <button
          onClick={collapsed ? onToggleCollapse : undefined}
          className={`flex items-center gap-2.5 overflow-hidden ${collapsed ? 'cursor-pointer' : 'cursor-default'}`}
          title={collapsed ? 'Expand sidebar' : undefined}
          aria-label={collapsed ? 'Expand sidebar' : undefined}
        >
          <div className="w-8 h-8 rounded-md bg-brand dark:bg-yellow-400 dark:text-zinc-950 flex items-center justify-center text-white font-bold shrink-0 shadow-md shadow-brand/20 dark:shadow-yellow-400/20">
            <span className="text-base tracking-tighter">◈</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white leading-none">
                KaryaSetu <span className="text-brand dark:text-yellow-300">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 leading-tight mt-0.5 font-medium tracking-wide uppercase">
                EPC Execution Bridge
              </span>
            </div>
          )}
        </button>

        {/* Desktop collapse toggle (expanded only — collapsed sidebar expands via logo) */}
        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
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
              /* Custom styled dropdown if multiple projects available */
              <div className="relative" ref={projectMenuRef}>
                <button
                  onClick={() => setProjectMenuOpen(!projectMenuOpen)}
                  aria-haspopup="listbox"
                  aria-expanded={projectMenuOpen}
                  className="w-full flex items-center justify-between gap-2 bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand/40 dark:focus:ring-yellow-400/40 text-xs font-semibold rounded-md py-2 pl-2.5 pr-2 transition"
                >
                  <span className="truncate text-left text-slate-900 dark:text-zinc-100">
                    {currentProject?.name}
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <span className="font-mono text-[10px] text-brand dark:text-yellow-300 font-bold">
                      {currentProjectId.replace('PRJ-', '')}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform ${projectMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </span>
                </button>

                {projectMenuOpen && (
                  <div
                    role="listbox"
                    className="absolute left-0 right-0 mt-1 rounded-lg border-2 border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 shadow-2xl z-50 p-1 overflow-y-auto max-h-64 animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    {accessibleProjects.map((p) => {
                      const isActive = p.id === currentProjectId;
                      return (
                        <button
                          key={p.id}
                          role="option"
                          aria-selected={isActive}
                          onClick={() => {
                            setCurrentProjectId(p.id);
                            setProjectMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 my-0.5 text-xs rounded-md border transition ${
                            isActive
                              ? 'bg-brand-soft dark:bg-yellow-400/10 text-brand-dark dark:text-yellow-200 font-semibold border-brand-tint dark:border-yellow-400/40'
                              : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:border-brand dark:hover:border-yellow-400/60 hover:bg-slate-50 dark:hover:bg-zinc-800'
                          }`}
                        >
                          <span className="truncate text-left">
                            {p.name}
                            <span className="block text-[10px] font-normal text-slate-400 dark:text-zinc-500">
                              {p.location}
                            </span>
                          </span>
                          {isActive ? (
                            <Check className="w-3.5 h-3.5 shrink-0 text-brand dark:text-yellow-300" />
                          ) : (
                            <span className="font-mono text-[10px] text-slate-400 shrink-0">{p.id}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
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
        {visibleNavItems.map((item) => renderNavItem(item))}
      </nav>

      {/* Platform Overview & Workflow (moved from header) */}
      <div className={`px-2 pb-1 ${collapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={() => setShowHelpModal(true)}
          title="Platform Overview & Workflow"
          className={`flex items-center gap-3 rounded-md text-xs font-medium transition-colors text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800/60 ${
            collapsed ? 'p-2 justify-center' : 'px-3 py-2 w-full'
          }`}
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="flex-1 text-left">Platform Overview</span>}
        </button>
      </div>

      <Modal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        title="KaryaSetu AI — Platform Overview & Workflow"
        subtitle="AI-Powered Planning-to-Execution Bridge for Infrastructure Projects"
        maxWidth="3xl"
      >
        <div className="space-y-4 text-xs text-slate-700 dark:text-zinc-300">
          <div className="p-3 bg-brand-soft dark:bg-yellow-400/10 border border-brand-tint dark:border-yellow-400/30 rounded-md">
            <div className="font-semibold text-brand-deep dark:text-yellow-200 flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-brand dark:text-yellow-300" />
              Core Principle: Field Evidence → AI Decision → Schedule Result
            </div>
            <p className="leading-relaxed text-brand-deep dark:text-yellow-200/90">
              KaryaSetu AI ingests heterogeneous unstructured field reports (DPRs, site diaries,
              spreadsheets), extracts actual execution progress events, matches them to structured
              L5/L6 activities, evaluates confidence, flags contradictions, and keeps human planners
              in full control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 border border-slate-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900">
              <span className="font-bold text-slate-900 dark:text-zinc-100 block mb-1">
                1. Field Data Ingestion
              </span>
              <p className="text-slate-600 dark:text-zinc-400 leading-normal">
                Upload DPRs (PDF), site logs (CSV), or contractor sheets (XLSX). The 5-stage
                pipeline extracts events with entity recognition.
              </p>
            </div>
            <div className="p-3 border border-slate-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900">
              <span className="font-bold text-slate-900 dark:text-zinc-100 block mb-1">
                2. L5/L6 Activity Matching
              </span>
              <p className="text-slate-600 dark:text-zinc-400 leading-normal">
                Matches line numbers, spool IDs, equipment tags, and semantic descriptions.
                Threshold &gt;90% auto-approves; 70–89% routes to Planner Review.
              </p>
            </div>
            <div className="p-3 border border-slate-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900">
              <span className="font-bold text-slate-900 dark:text-zinc-100 block mb-1">
                3. Contradiction Detection
              </span>
              <p className="text-slate-600 dark:text-zinc-400 leading-normal">
                Detects conflicting completion claims, progress discrepancies between contractor
                and supervisor, and prerequisite violations.
              </p>
            </div>
            <div className="p-3 border border-slate-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900">
              <span className="font-bold text-slate-900 dark:text-zinc-100 block mb-1">
                4. Execution Memory &amp; Copilot
              </span>
              <p className="text-slate-600 dark:text-zinc-400 leading-normal">
                Learns historical activity durations and delay root causes from past oil &amp; gas
                projects, providing conversational insights to planners.
              </p>
            </div>
          </div>
        </div>
      </Modal>

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
