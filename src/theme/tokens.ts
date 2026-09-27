export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ColorTokens {
  background: string;
  foreground: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  border: string;
  borderSubtle: string;
  primary: string;
  primaryHover: string;
  primaryForeground: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  muted: string;
  mutedForeground: string;
  sidebarBg: string;
  sidebarBorder: string;
  sidebarText: string;
  sidebarTextMuted: string;
  sidebarActiveBg: string;
  sidebarActiveText: string;
  sidebarActiveBorder: string;
  cardBg: string;
  cardBorder: string;
}

export interface ChartColorTokens {
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  grid: string;
  border: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  purple: string;
  cyan: string;
  planned: string;
  actual: string;
}

export const chartTheme: Record<ResolvedTheme, ChartColorTokens> = {
  light: {
    background: '#ffffff',
    surface: '#ffffff',
    text: '#334155', // slate-700
    mutedText: '#64748b', // slate-500
    grid: '#e2e8f0', // slate-200
    border: '#cbd5e1', // slate-300
    tooltipBg: '#ffffff',
    tooltipBorder: '#e2e8f0',
    tooltipText: '#0f172a',
    primary: '#d9261c', // brand red (light mode)
    secondary: '#9c1b13', // brand deep
    success: '#16a34a', // green-600
    warning: '#d97706', // amber-600
    danger: '#dc2626', // red-600
    purple: '#7c3aed', // violet-600
    cyan: '#0891b2', // cyan-600
    planned: '#d9261c', // brand red (light mode)
    actual: '#10b981', // emerald-500
  },
  dark: {
    background: '#09090b',
    surface: '#18181b',
    text: '#d4d4d8', // zinc-300
    mutedText: '#a1a1aa', // zinc-400
    grid: '#2e2e32',
    border: '#3f3f46',
    tooltipBg: '#18181b',
    tooltipBorder: '#3f3f46',
    tooltipText: '#fafafa',
    primary: '#facc15', // yellow-400 (black-&-yellow dark theme)
    secondary: '#38bdf8', // sky-400
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    danger: '#ef4444', // red-500
    purple: '#a855f7', // purple-500
    cyan: '#22d3ee', // cyan-400
    planned: '#facc15', // yellow-400 (black-&-yellow dark theme)
    actual: '#34d399', // emerald-400
  },
};
