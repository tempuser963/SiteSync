import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../auth/AuthContext';
import { ROLE_LABELS, ROLE_BADGES } from '../../config/permissions';
import { UserRole } from '../../types';
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  Sun,
  Moon,
  CheckCheck,
  ChevronRight,
  ShieldCheck,
  User,
  LogOut,
  Sparkles,
  ChevronDown,
  Monitor,
  Check,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentProject,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    showToast,
  } = useProject();

  const { user, logout, switchRole } = useAuth();
  const {
    theme,
    resolvedTheme,
    setTheme,
    fontScale,
    decreaseFont,
    increaseFont,
    resetFont,
  } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setShowProfileMenu(false);
      }
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(e.target as Node)
      ) {
        setShowThemeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const unreadNotifications = notifications.filter((n) => !n.read);

  // Generate breadcrumb from path
  const pathMap: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/progress': 'Progress Intelligence',
    '/activities': 'L5/L6 Activity Mapping',
    '/review': 'AI Review Center',
    '/contradictions': 'Evidence & Contradictions',
    '/timeline': 'Execution Timeline',
    '/ingestion': 'Field Data Ingestion',
    '/memory': 'Execution Memory',
    '/copilot': 'SiteSync AI Copilot',
    '/settings': 'Settings',
    '/profile': 'My Profile',
    '/users': 'User & Role Management',
    '/users/roles': 'Role Permission Matrix',
    '/audit': 'Enterprise Audit Trail',
    '/unauthorized': 'Access Restricted',
  };

  const currentRouteName = pathMap[location.pathname] || 'Dashboard';
  const roleBadge = user ? ROLE_BADGES[user.role] : ROLE_BADGES.PROJECT_PLANNER;

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    setShowProfileMenu(false);
    showToast(`Demo role switched to ${ROLE_LABELS[newRole]}`, 'info');
  };

  const handleSignOut = () => {
    logout();
    showToast('You have been signed out', 'info');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 border-t-[3px] border-t-brand dark:border-t-transparent flex items-center justify-between px-4 lg:px-6 transition-colors">
      {/* Left side: Hamburger (mobile) + Breadcrumbs & Project tag */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 rounded-md text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
          <span className="font-semibold text-slate-800 dark:text-zinc-200">
            {currentProject.name}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-brand dark:text-yellow-300 font-medium">
            {currentRouteName}
          </span>
        </div>

        <div className="sm:hidden font-semibold text-sm text-slate-800 dark:text-zinc-200 truncate max-w-[160px]">
          {currentRouteName}
        </div>
      </div>

      {/* Right side: Search, Notifications, Theme toggle, Help, Profile */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Search bar */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search activities, WBS, events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-slate-100 dark:bg-zinc-800 border border-transparent focus:border-brand dark:focus:border-yellow-400 text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none transition"
          />
        </div>

        {/* Data freshness indicator */}
        <div className="hidden xl:flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800/60 px-2.5 py-1 rounded-full border border-slate-200 dark:border-zinc-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand dark:bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand dark:bg-emerald-500"></span>
          </span>
          <span>Live • Synchronized 2 min ago</span>
        </div>

        {/* Text size control (accessibility): 50%–150% in 10% steps */}
        <div
          className="hidden md:flex items-center rounded-md border border-slate-200 dark:border-zinc-700 overflow-hidden shrink-0"
          role="group"
          aria-label={`Adjust text size (currently ${fontScale}%)`}
        >
          <button
            type="button"
            onClick={decreaseFont}
            disabled={fontScale <= 50}
            title={`Decrease text size (${fontScale}% → ${Math.max(50, fontScale - 10)}%)`}
            aria-label="Decrease text size"
            className="px-2 py-1.5 text-[11px] font-bold text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-35 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent transition"
          >
            A-
          </button>
          <button
            type="button"
            onClick={resetFont}
            title={`Reset text size to 100% (currently ${fontScale}%)`}
            aria-label="Reset text size to normal"
            className={`px-2 py-1.5 text-[13px] font-bold border-x border-slate-200 dark:border-zinc-700 transition ${
              fontScale === 100
                ? 'bg-brand-soft text-brand-dark dark:bg-yellow-400/20 dark:text-yellow-300'
                : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            A
          </button>
          <button
            type="button"
            onClick={increaseFont}
            disabled={fontScale >= 150}
            title={`Increase text size (${fontScale}% → ${Math.min(150, fontScale + 10)}%)`}
            aria-label="Increase text size"
            className="px-2 py-1.5 text-[15px] font-bold text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-35 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent transition"
          >
            A+
          </button>
        </div>

        {/* Dark/Light/System mode selector */}
        <div className="relative" ref={themeMenuRef}>
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-1.5 rounded-md text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition duration-150 flex items-center gap-1"
            aria-label={`Current theme: ${theme}. Click to switch appearance mode.`}
            title={`Appearance: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
          >
            {theme === 'system' ? (
              <Monitor className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
            ) : resolvedTheme === 'dark' ? (
              <Moon className="w-4 h-4 text-blue-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xl z-50 p-1 animate-in fade-in slide-in-from-top-2">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Appearance
              </div>
              <button
                type="button"
                onClick={() => {
                  setTheme('light');
                  setShowThemeMenu(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                  theme === 'light'
                    ? 'bg-brand-soft text-brand-dark dark:bg-yellow-400/15 dark:text-yellow-200'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light</span>
                </div>
                {theme === 'light' && <Check className="w-3.5 h-3.5 text-brand dark:text-yellow-300" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme('dark');
                  setShowThemeMenu(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                  theme === 'dark'
                    ? 'bg-brand-soft text-brand-dark dark:bg-yellow-400/15 dark:text-yellow-200'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                  <span>Dark</span>
                </div>
                {theme === 'dark' && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme('system');
                  setShowThemeMenu(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                  theme === 'system'
                    ? 'bg-brand-soft text-brand-dark dark:bg-yellow-400/15 dark:text-yellow-200'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Monitor className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                  <span>System</span>
                </div>
                {theme === 'system' && <Check className="w-3.5 h-3.5 text-blue-500" />}
              </button>
            </div>
          )}
        </div>

        {/* Help icon */}
        <button
          onClick={() => setShowHelpModal(true)}
          className="p-1.5 rounded-md text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
          aria-label="Help and Architecture Overview"
          title="Product Architecture & Guide"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Notification bell & dropdown */}
        <div className="relative" ref={notificationMenuRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 rounded-md text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-3 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50 dark:bg-zinc-800/40">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                    Notifications
                  </span>
                  {unreadNotifications.length > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-brand-tint text-brand-dark dark:bg-yellow-400/15 dark:text-yellow-200 rounded">
                      {unreadNotifications.length} new
                    </span>
                  )}
                </div>
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-brand dark:text-yellow-300 hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-3 cursor-pointer transition text-xs ${
                        notif.read
                          ? 'bg-transparent text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50'
                          : 'bg-brand-soft/60 dark:bg-yellow-400/10 text-slate-900 dark:text-zinc-100 hover:bg-brand-soft dark:hover:bg-yellow-400/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-slate-800 dark:text-zinc-200">
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(notif.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-normal">
                        {notif.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Dropdown (Section 25) */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-zinc-800 hover:opacity-90 transition focus:outline-none"
            aria-label="User Profile and Role Switcher"
          >
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-navy-800 dark:bg-yellow-400 dark:text-zinc-950 text-white font-semibold text-xs flex items-center justify-center border border-slate-300 dark:border-zinc-700">
                {user ? user.name.split(' ').map((n) => n[0]).join('') : 'U'}
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
            </div>

            <div className="hidden lg:flex flex-col text-left">
              <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200 leading-none truncate max-w-[120px]">
                {user?.name || 'Ahmed Al-Rashidi'}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${roleBadge.bg} ${roleBadge.text} ${roleBadge.border}`}
                >
                  {roleBadge.label}
                </span>
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </button>

          {/* User Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800">
                <div className="font-bold text-slate-900 dark:text-zinc-100 text-sm">
                  {user?.name}
                </div>
                <div className="text-slate-500 font-medium text-[11px] mt-0.5">
                  {user?.department}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${roleBadge.bg} ${roleBadge.text} ${roleBadge.border}`}
                  >
                    {ROLE_LABELS[user?.role || 'PROJECT_PLANNER']}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {user?.id}
                  </span>
                </div>
              </div>

              <div className="p-1 border-b border-slate-100 dark:border-zinc-800">
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition"
                >
                  <User className="w-4 h-4 text-brand dark:text-yellow-300" />
                  <span>My Profile</span>
                </Link>
              </div>

              {/* Demo Role Switcher (Section 23) */}
              <div className="p-3 bg-slate-50/70 dark:bg-zinc-800/30 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand dark:text-yellow-300" /> Switch Demo Role
                </span>
                <div className="space-y-1">
                  {(
                    [
                      'PROJECT_MANAGER',
                      'PROJECT_PLANNER',
                      'DISCIPLINE_ENGINEER',
                      'SITE_SUPERVISOR',
                    ] as UserRole[]
                  ).map((r) => {
                    const isCurrent = user?.role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRoleSwitch(r)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between text-xs transition ${
                          isCurrent
                            ? 'bg-brand dark:bg-yellow-400 dark:text-zinc-950 text-white font-bold'
                            : 'hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                        }`}
                      >
                        <span>{ROLE_LABELS[r]}</span>
                        {isCurrent && <span className="text-[10px]">● Active</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sign out */}
              <div className="p-1">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-medium transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help / Architecture modal */}
      <Modal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        title="SiteSync AI — Platform Overview & Workflow"
        subtitle="AI-Powered Planning-to-Execution Bridge for Infrastructure Projects"
        maxWidth="3xl"
      >
        <div className="space-y-4 text-xs text-slate-700 dark:text-zinc-300">
          <div className="p-3 bg-brand-soft dark:bg-yellow-400/10 border border-brand-tint dark:border-yellow-400/30 rounded-md">
            <div className="font-semibold text-brand-deep dark:text-yellow-200 flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-brand dark:text-yellow-300" />
              Core Principle: Field Evidence → AI Decision → Schedule Result
            </div>
            <p className="leading-relaxed text-brand-deep dark:text-yellow-200">
              SiteSync AI ingests heterogeneous unstructured field reports (DPRs, site diaries,
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
                2. L5/L6 Activity Mapping
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
    </header>
  );
};
