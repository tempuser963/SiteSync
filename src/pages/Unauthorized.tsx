import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ROLE_LABELS, ROLE_BADGES } from '../config/permissions';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';

export const Unauthorized: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state as any) || {};
  const currentRole = state.currentRole || user?.role || 'PROJECT_PLANNER';
  const requiredRoles = state.requiredRoles as string[] | undefined;
  const requiredPermission = state.requiredPermission as string | undefined;

  const badge = ROLE_BADGES[currentRole as keyof typeof ROLE_BADGES] || ROLE_BADGES.PROJECT_PLANNER;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-lg p-6 sm:p-8 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest block mb-1">
            HTTP 403 Forbidden
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
            Access Restricted
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
            Your current role does not have authorization to access this enterprise module or perform this action.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-xs space-y-2.5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Your Current Role:</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
            >
              {ROLE_LABELS[currentRole as keyof typeof ROLE_LABELS] || currentRole}
            </span>
          </div>

          {(requiredPermission || requiredRoles) && (
            <div className="flex items-start justify-between border-t border-slate-200/60 dark:border-zinc-700/60 pt-2">
              <span className="text-slate-500">Required Authorization:</span>
              <span className="font-mono text-[10px] font-bold text-slate-800 dark:text-zinc-200 text-right">
                {requiredPermission
                  ? requiredPermission.replace(/_/g, ' ')
                  : requiredRoles?.join(', ')}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-zinc-700/60 pt-2">
            <span className="text-slate-500">Governance Policy:</span>
            <span className="text-[11px] text-slate-700 dark:text-zinc-300">
              Role-Based Access Control (RBAC)
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-2 px-3 border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-md transition flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-2 px-3 bg-brand dark:bg-yellow-400 dark:text-zinc-950 hover:bg-brand-dark dark:hover:bg-yellow-300 text-white text-xs font-semibold rounded-md shadow-xs transition flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" /> Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
