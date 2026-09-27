import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import {
  ROLE_LABELS,
  ROLE_BADGES,
  ROLE_PERMISSIONS,
} from '../config/permissions';
import { UserRole, Permission } from '../types';
import { Shield, Check, X, Layers, Lock, Sparkles, Users as UsersIcon } from 'lucide-react';

export const Roles: React.FC = () => {
  const roleList: UserRole[] = [
    'ADMIN',
    'PROJECT_MANAGER',
    'PROJECT_PLANNER',
    'DISCIPLINE_ENGINEER',
    'SITE_SUPERVISOR',
  ];

  const allPermissions: { key: Permission; label: string; group: string }[] = [
    { key: 'VIEW_DASHBOARD', label: 'View Project Dashboard', group: 'Navigation' },
    { key: 'VIEW_PROGRESS', label: 'View Progress & S-Curve', group: 'Analytics' },
    { key: 'VIEW_ACTIVITIES', label: 'View L5/L6 Activities', group: 'Schedule' },
    { key: 'UPLOAD_REPORT', label: 'Upload & Ingest Field Reports', group: 'Field Ingestion' },
    { key: 'APPROVE_MAPPING', label: 'Approve / Reject AI Mappings', group: 'AI Governance' },
    { key: 'RESOLVE_CONTRADICTION', label: 'Resolve Evidence Contradictions', group: 'AI Governance' },
    { key: 'VIEW_MEMORY', label: 'Access Execution Memory Database', group: 'Institutional Memory' },
    { key: 'USE_COPILOT', label: 'Query AI Copilot Assistant', group: 'Copilot' },
    { key: 'MANAGE_USERS', label: 'User Provisioning & Lifecycle', group: 'Administration' },
    { key: 'MANAGE_ROLES', label: 'Role Authority Configuration', group: 'Administration' },
    { key: 'MANAGE_PROJECTS', label: 'Project Settings & Workspaces', group: 'Management' },
    { key: 'MANAGE_AI_SETTINGS', label: 'Configure AI Approval Thresholds', group: 'AI Governance' },
    { key: 'VIEW_AUDIT_LOG', label: 'View Enterprise Audit Trail', group: 'Compliance' },
  ];

  const roleDescriptions: Record<UserRole, { focus: string; summary: string }> = {
    ADMIN: {
      focus: 'Full Access & Governance',
      summary: 'Complete system control, identity provisioning, audit logs, and global model configuration.',
    },
    PROJECT_MANAGER: {
      focus: 'Project Analytics & Delivery',
      summary: 'Monitors the project using validated actual-progress data: variance, delays, risk insights, forecasting, and execution history.',
    },
    PROJECT_PLANNER: {
      focus: 'Schedule Correlation & AI Review',
      summary: 'Primary operational user for L5/L6 schedule alignment, review center approvals, and contradiction resolution.',
    },
    DISCIPLINE_ENGINEER: {
      focus: 'Discipline-Specific Visibility',
      summary: 'Discipline-scoped schedule, progress, discrepancy review, and productivity history across Civil, Piping, Electrical, Instrumentation, Static & Rotating Equipment, and HSE.',
    },
    SITE_SUPERVISOR: {
      focus: 'Field Reporting & Shift Logs',
      summary: 'Streamlined field interface for rapid daily progress reporting, DPR upload, and work package tracking.',
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              Role Authority &amp; Permission Matrix
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-brand-tint text-brand-deep dark:bg-yellow-400/15 dark:text-yellow-200 border border-brand-tint dark:border-yellow-400/30">
              RBAC Model
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Centralized role-based access matrix governing page visibility and action-level authorizations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/users"
            className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <UsersIcon className="w-3.5 h-3.5" /> Users Directory
          </Link>
          <Link
            to="/users/roles"
            className="px-3 py-1.5 rounded-md bg-brand dark:bg-yellow-400 dark:text-zinc-950 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5" /> Roles Matrix
          </Link>
        </div>
      </div>

      {/* Role Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roleList.map((r) => {
          const badge = ROLE_BADGES[r];
          const info = roleDescriptions[r];
          const perms = ROLE_PERMISSIONS[r];

          return (
            <div
              key={r}
              className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                  >
                    {badge.label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {perms.length} Permissions
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                  {ROLE_LABELS[r]}
                </h3>
                <div className="text-[11px] font-semibold text-brand dark:text-yellow-300 mt-0.5">
                  {info.focus}
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  {info.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>Access Scope:</span>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                  {r === 'ADMIN' ? 'Site-Wide Global' : 'Project-Bound'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Permission Matrix Table */}
      <Card
        title="Comprehensive Permission Matrix (Section 45 Source of Truth)"
        subtitle="Detailed granular authorizations by enterprise role"
      >
        <div className="overflow-x-auto -mx-5 -mb-5">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 min-w-[200px]">Permission</th>
                <th className="py-3 px-3 text-center">Admin</th>
                <th className="py-3 px-3 text-center">Manager</th>
                <th className="py-3 px-3 text-center">Planner</th>
                <th className="py-3 px-3 text-center">Engineer</th>
                <th className="py-3 px-3 text-center">Supervisor</th>
                <th className="py-3 px-4 text-center">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {allPermissions.map((perm) => (
                <tr
                  key={perm.key}
                  className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition"
                >
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 dark:text-zinc-100 block">
                      {perm.label}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {perm.key} • {perm.group}
                    </span>
                  </td>

                  {roleList.map((r) => {
                    const hasAccess = ROLE_PERMISSIONS[r].includes(perm.key);
                    return (
                      <td key={r} className="py-3 px-3 text-center">
                        {hasAccess ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 flex items-center justify-center mx-auto">
                            <span className="text-xs font-bold">—</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
