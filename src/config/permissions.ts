import { UserRole, Permission } from '../types';

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'System Administrator',
  PROJECT_MANAGER: 'Project Manager',
  PROJECT_PLANNER: 'Planner / Scheduler',
  DISCIPLINE_ENGINEER: 'Discipline Engineer',
  SITE_SUPERVISOR: 'Site Supervisor',
};

export const ROLE_BADGES: Record<
  UserRole,
  { label: string; bg: string; text: string; border: string }
> = {
  ADMIN: {
    label: 'ADMIN',
    bg: 'bg-purple-100 dark:bg-purple-950/60',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-300 dark:border-purple-800',
  },
  PROJECT_MANAGER: {
    label: 'PROJECT MANAGER',
    bg: 'bg-blue-100 dark:bg-blue-950/60',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-800',
  },
  PROJECT_PLANNER: {
    label: 'PLANNER',
    bg: 'bg-emerald-100 dark:bg-emerald-950/60',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-300 dark:border-emerald-800',
  },
  DISCIPLINE_ENGINEER: {
    label: 'ENGINEER',
    bg: 'bg-cyan-100 dark:bg-cyan-950/60',
    text: 'text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-300 dark:border-cyan-800',
  },
  SITE_SUPERVISOR: {
    label: 'SUPERVISOR',
    bg: 'bg-amber-100 dark:bg-amber-950/60',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-800',
  },
};

/**
 * UI role plan (4 business roles + internal admin):
 * - SITE_SUPERVISOR: reports what is happening on site.
 * - PROJECT_PLANNER: validates field updates and maintains schedule-linked actual progress.
 * - PROJECT_MANAGER: monitors the project using validated actual-progress data.
 * - DISCIPLINE_ENGINEER: discipline-specific visibility and technical review.
 * - ADMIN: internal system permissions/configuration only (kept as superuser).
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    'VIEW_DASHBOARD',
    'VIEW_PROGRESS',
    'VIEW_ACTIVITIES',
    'UPLOAD_REPORT',
    'APPROVE_MAPPING',
    'REJECT_MAPPING',
    'RESOLVE_CONTRADICTION',
    'VIEW_MEMORY',
    'USE_COPILOT',
    'MANAGE_USERS',
    'MANAGE_ROLES',
    'MANAGE_PROJECTS',
    'MANAGE_AI_SETTINGS',
    'VIEW_AUDIT_LOG',
  ],
  SITE_SUPERVISOR: [
    'VIEW_DASHBOARD',
    'VIEW_ACTIVITIES',
    'UPLOAD_REPORT',
  ],
  PROJECT_PLANNER: [
    'VIEW_DASHBOARD',
    'VIEW_PROGRESS',
    'VIEW_ACTIVITIES',
    'UPLOAD_REPORT',
    'APPROVE_MAPPING',
    'REJECT_MAPPING',
    'RESOLVE_CONTRADICTION',
    'VIEW_MEMORY',
  ],
  PROJECT_MANAGER: [
    'VIEW_DASHBOARD',
    'VIEW_PROGRESS',
    'VIEW_ACTIVITIES',
    'VIEW_MEMORY',
    'USE_COPILOT',
    'MANAGE_PROJECTS',
    'MANAGE_AI_SETTINGS',
    'VIEW_AUDIT_LOG',
  ],
  DISCIPLINE_ENGINEER: [
    'VIEW_DASHBOARD',
    'VIEW_PROGRESS',
    'VIEW_ACTIVITIES',
    'UPLOAD_REPORT',
  ],
};

export const hasPermission = (
  role: UserRole | undefined,
  permission: Permission
): boolean => {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};

export const hasAnyRole = (
  userRole: UserRole | undefined,
  allowedRoles: UserRole[]
): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};
