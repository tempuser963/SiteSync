import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Card } from '../components/ui/Card';
import {
  Settings,
  Sliders,
  Bell,
  Sun,
  Moon,
  Monitor,
  Layers,
  Save,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { currentProject, aiSettings, updateAISettings, showToast } =
    useProject();
  const { hasPermission } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const canManageSettings = hasPermission('MANAGE_AI_SETTINGS');

  const [autoApproval, setAutoApproval] = useState(
    aiSettings.autoApprovalThreshold
  );
  const [reviewThreshold, setReviewThreshold] = useState(
    aiSettings.reviewThreshold
  );
  const [contraAlerts, setContraAlerts] = useState(
    aiSettings.contradictionAlerts
  );
  const [lowConfAlerts, setLowConfAlerts] = useState(
    aiSettings.lowConfidenceAlerts
  );
  const [unmatchedAlerts, setUnmatchedAlerts] = useState(
    aiSettings.unmatchedAlerts
  );
  const [compactMode, setCompactMode] = useState(aiSettings.compactMode);

  const handleSave = () => {
    updateAISettings({
      autoApprovalThreshold: autoApproval,
      reviewThreshold: reviewThreshold,
      contradictionAlerts: contraAlerts,
      lowConfidenceAlerts: lowConfAlerts,
      unmatchedAlerts: unmatchedAlerts,
      darkMode: resolvedTheme === 'dark',
      compactMode: compactMode,
    });
  };

  return (
    <div className="w-full max-w-none space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              System Settings &amp; AI Configuration
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-tint text-brand-deep dark:bg-yellow-400/15 dark:text-yellow-200">
              PRJ-001 Configuration
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Configure matching thresholds, alerting preferences, and UI customization
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={!canManageSettings}
          title={!canManageSettings ? 'Requires MANAGE_AI_SETTINGS permission' : undefined}
          className="px-4 py-2 bg-brand dark:bg-yellow-400 dark:text-zinc-950 hover:bg-brand-dark dark:hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-md shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>

      {!canManageSettings && (
        <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            <strong>Read-Only Mode:</strong> Modifying AI model thresholds and alerts requires the <code>MANAGE_AI_SETTINGS</code> authority (Project Planner or Administrator).
          </span>
        </div>
      )}

      {/* Section 1: Project Metadata */}
      <Card
        title="Active Project Profile"
        subtitle="Current enterprise project deployment details"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Project Name
            </label>
            <input
              type="text"
              disabled
              value={currentProject.name}
              className="w-full px-3 py-2 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 font-semibold"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Project Identifier
            </label>
            <input
              type="text"
              disabled
              value={currentProject.id}
              className="w-full px-3 py-2 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 font-mono text-slate-900 dark:text-zinc-100 font-semibold"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Facility Location
            </label>
            <input
              type="text"
              disabled
              value={currentProject.location}
              className="w-full px-3 py-2 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Master Schedule Activities
            </label>
            <input
              type="text"
              disabled
              value={`${currentProject.totalActivities} tracked activities`}
              className="w-full px-3 py-2 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 font-mono text-slate-700 dark:text-zinc-300"
            />
          </div>
        </div>
      </Card>

      {/* Section 2: AI Matching Thresholds */}
      <Card
        title="AI Matching &amp; Auto-Approval Engine"
        subtitle="Confidence score boundaries for automated schedule updates vs human review"
      >
        <div className="space-y-6 text-xs">
          {/* Auto-Approval Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-zinc-100 block">
                  Auto-Approval Threshold
                </span>
                <p className="text-slate-500 text-[11px]">
                  Correlations at or above this score are automatically accepted and update actual progress immediately.
                </p>
              </div>
              <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {autoApproval}%
              </span>
            </div>
            <input
              type="range"
              min="80"
              max="98"
              value={autoApproval}
              disabled={!canManageSettings}
              onChange={(e) => setAutoApproval(Number(e.target.value))}
              className="w-full accent-brand dark:accent-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>80% (More Permissive)</span>
              <span className="font-semibold text-brand dark:text-yellow-300">Recommended: 90%</span>
              <span>98% (Strict Verification)</span>
            </div>
          </div>

          {/* Review Threshold Slider */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-zinc-100 block">
                  Human Review Routing Threshold
                </span>
                <p className="text-slate-500 text-[11px]">
                  Matches below this threshold are marked as "Unmatched" and require manual re-tagging.
                </p>
              </div>
              <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400">
                {reviewThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="85"
              value={reviewThreshold}
              disabled={!canManageSettings}
              onChange={(e) => setReviewThreshold(Number(e.target.value))}
              className="w-full accent-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>50%</span>
              <span className="font-semibold text-amber-600">Recommended: 70%</span>
              <span>85%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 3: Notification Preferences */}
      <Card
        title="Notification &amp; Integrity Alerts"
        subtitle="Manage real-time notifications dispatched to project planners"
      >
        <div className="space-y-4 text-xs">
          <label className={`flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700 ${!canManageSettings ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
            <div>
              <span className="font-bold text-slate-900 dark:text-zinc-100 block">
                Contradiction Alerts
              </span>
              <p className="text-slate-500 text-[11px]">
                Notify immediately when conflicting field claims (e.g. Completed vs Pending) are detected.
              </p>
            </div>
            <input
              type="checkbox"
              checked={contraAlerts}
              disabled={!canManageSettings}
              onChange={(e) => setContraAlerts(e.target.checked)}
              className="w-4 h-4 accent-brand dark:accent-yellow-400 rounded disabled:cursor-not-allowed"
            />
          </label>

          <label className={`flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700 ${!canManageSettings ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
            <div>
              <span className="font-bold text-slate-900 dark:text-zinc-100 block">
                Low-Confidence Correlation Alerts
              </span>
              <p className="text-slate-500 text-[11px]">
                Notify when daily progress report items require human planner verification.
              </p>
            </div>
            <input
              type="checkbox"
              checked={lowConfAlerts}
              disabled={!canManageSettings}
              onChange={(e) => setLowConfAlerts(e.target.checked)}
              className="w-4 h-4 accent-brand dark:accent-yellow-400 rounded disabled:cursor-not-allowed"
            />
          </label>

          <label className={`flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700 ${!canManageSettings ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
            <div>
              <span className="font-bold text-slate-900 dark:text-zinc-100 block">
                Unmatched Field Activities
              </span>
              <p className="text-slate-500 text-[11px]">
                Alert when field observations cannot be mapped to any known schedule WBS code.
              </p>
            </div>
            <input
              type="checkbox"
              checked={unmatchedAlerts}
              disabled={!canManageSettings}
              onChange={(e) => setUnmatchedAlerts(e.target.checked)}
              className="w-4 h-4 accent-brand dark:accent-yellow-400 rounded disabled:cursor-not-allowed"
            />
          </label>
        </div>
      </Card>

      {/* Section 4: Appearance */}
      <Card
        title="Interface &amp; Display Preferences"
        subtitle="Theme mode and data density settings"
      >
        <div className="space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-md bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700">
            <div>
              <span className="font-bold text-slate-900 dark:text-zinc-100 block">
                Visual Theme
              </span>
              <p className="text-slate-500 text-[11px]">
                Select between Light, Dark, or System theme mode for enterprise control and monitoring.
              </p>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-zinc-800 rounded-lg border border-slate-300 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                  theme === 'light'
                    ? 'bg-white dark:bg-zinc-700 text-brand dark:text-yellow-300 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-red-400 dark:text-yellow-300 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                  theme === 'system'
                    ? 'bg-white dark:bg-zinc-700 text-brand dark:text-yellow-300 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> System
              </button>
            </div>
          </div>

          <label className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700 cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 dark:text-zinc-100 block">
                Compact Table Density
              </span>
              <p className="text-slate-500 text-[11px]">
                Reduce table padding to display maximum rows on laptop and desktop displays.
              </p>
            </div>
            <input
              type="checkbox"
              checked={compactMode}
              onChange={(e) => setCompactMode(e.target.checked)}
              className="w-4 h-4 accent-brand dark:accent-yellow-400 rounded"
            />
          </label>
        </div>
      </Card>
    </div>
  );
};
