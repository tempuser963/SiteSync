import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useProject } from '../context/ProjectContext';
import { Card } from '../components/ui/Card';
import { ROLE_LABELS, ROLE_BADGES } from '../config/permissions';
import {
  User,
  Mail,
  Building2,
  Shield,
  Layers,
  Calendar,
  Save,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useProject();

  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  const badge = ROLE_BADGES[user.role];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, department });
    setIsEditing(false);
    showToast('Profile updated successfully', 'success');
  };

  return (
    <div className="w-full max-w-none space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              User Profile &amp; Account Settings
            </h1>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
            >
              {badge.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Manage your personal enterprise credentials, department binding, and assigned project permissions
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-brand dark:bg-yellow-400 dark:text-zinc-950 hover:bg-brand-dark dark:hover:bg-yellow-300 text-white text-xs font-semibold rounded-md shadow-xs transition"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-brand dark:bg-yellow-400 dark:text-zinc-950 hover:bg-brand-dark dark:hover:bg-yellow-300 text-white text-xs font-semibold rounded-md shadow-xs transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Main Profile Card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100 dark:border-zinc-800">
          <div className="w-16 h-16 rounded-full bg-navy-900 dark:bg-yellow-400 dark:text-zinc-950 border-2 border-brand dark:border-yellow-400 text-white font-bold text-xl flex items-center justify-center shadow-md">
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                {user.name}
              </h2>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {ROLE_LABELS[user.role]} • {user.department}
            </p>
            <p className="font-mono text-xs text-brand dark:text-yellow-300">
              {user.email}
            </p>
          </div>
        </div>

        {/* Profile Details Form / Grid */}
        <form onSubmit={handleSave} className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              disabled={!isEditing}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 font-medium focus:outline-none focus:border-brand dark:focus:border-yellow-400 disabled:opacity-75"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Work Email Address
            </label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full px-3 py-2 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 font-mono text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Department
            </label>
            <input
              type="text"
              disabled={!isEditing}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 font-medium focus:outline-none focus:border-brand dark:focus:border-yellow-400 disabled:opacity-75"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Role Authority
            </label>
            <input
              type="text"
              disabled
              value={`${ROLE_LABELS[user.role]} (Assigned by Administrator)`}
              className="w-full px-3 py-2 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Account Status
            </label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Active Enterprise Member</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Last Login Activity
            </label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>22 Sep 2026 • 09:12 (Session active)</span>
            </div>
          </div>
        </form>
      </Card>

      {/* Assigned Projects Card */}
      <Card
        title="Assigned Project Boundaries"
        subtitle="Infrastructure capital projects provisioned for your enterprise profile"
      >
        <div className="space-y-3">
          {user.projectIds.map((pid) => (
            <div
              key={pid}
              className="p-3.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/40 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-brand-tint dark:bg-yellow-400/10 border border-brand-tint dark:border-yellow-400/30 text-brand dark:text-yellow-300 flex items-center justify-center font-mono font-bold">
                  {pid.replace('PRJ-', 'P')}
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-zinc-100 block">
                    {pid === 'PRJ-001'
                      ? 'OILFIELD EXPANSION'
                      : pid === 'PRJ-002'
                      ? 'GAS PROCESSING UNIT'
                      : 'PIPELINE DEVELOPMENT'}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    ID: {pid} • Onshore Facility
                  </span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold">
                Authorized Access
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
