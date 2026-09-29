import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useProject } from '../context/ProjectContext';
import { UserRole } from '../types';
import { ROLE_LABELS, ROLE_BADGES } from '../config/permissions';
import {
  User,
  Mail,
  Lock,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useProject();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState<UserRole>('PROJECT_PLANNER');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);
  const [createdUserName, setCreatedUserName] = useState('');

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    return {
      minLength,
      hasUpper,
      hasNumber,
      isValid: minLength && hasUpper && hasNumber,
    };
  };

  const passwordStatus = validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }
    if (!department.trim()) {
      setErrorMessage('Department is required.');
      return;
    }
    if (!passwordStatus.isValid) {
      setErrorMessage(
        'Password must contain at least 8 characters, one uppercase letter, and one number.'
      );
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('You must agree to the terms of service.');
      return;
    }

    setLoading(true);
    const result = await register({
      name,
      email,
      password,
      department,
      role,
    });
    setLoading(false);

    if (result.success) {
      setCreatedUserName(name);
      setRegistrationSuccess(true);
      showToast('Account created successfully', 'success');
    } else {
      setErrorMessage(result.error || 'Failed to create account.');
    }
  };

  if (registrationSuccess) {
    const badge = ROLE_BADGES[role];
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-zinc-100 transition-colors duration-200 relative">
        {/* Theme switcher pill */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 p-1 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 shadow-sm backdrop-blur-xs">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-1.5 rounded-md text-xs transition ${
              theme === 'light'
                ? 'bg-brand-soft text-brand dark:text-yellow-300 dark:bg-zinc-800 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
            title="Light Theme"
          >
            <Sun className="w-4 h-4 text-amber-500" />
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-1.5 rounded-md text-xs transition ${
              theme === 'dark'
                ? 'bg-blue-900/40 text-blue-400 dark:bg-zinc-800 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
            title="Dark Theme"
          >
            <Moon className="w-4 h-4 text-blue-500 dark:text-yellow-300" />
          </button>
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-1.5 rounded-md text-xs transition ${
              theme === 'system'
                ? 'bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
            title="System Default"
          >
            <Monitor className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 py-10 px-6 sm:px-10 shadow-xl dark:shadow-2xl rounded-xl text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Account Created</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Welcome to KaryaSetu AI, <span className="font-semibold text-slate-900 dark:text-white">{createdUserName}</span>.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60 text-xs space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Assigned Role:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                >
                  {ROLE_LABELS[role]}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Work Email:</span>
                <span className="font-mono text-slate-800 dark:text-zinc-200">{email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Department:</span>
                <span className="text-slate-800 dark:text-zinc-200">{department}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Your mock enterprise credentials are active. You can now sign in to access your role-governed project workspace.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 px-4 bg-brand dark:bg-yellow-400 dark:text-zinc-950 hover:bg-brand-dark dark:hover:bg-yellow-300 text-white text-xs font-semibold rounded-md shadow-md shadow-brand/20 dark:shadow-yellow-400/20 transition flex items-center justify-center gap-2"
            >
              <span>Continue to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-zinc-100 transition-colors duration-200 relative">
      {/* Theme switcher pill */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 p-1 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 shadow-sm backdrop-blur-xs">
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`p-1.5 rounded-md text-xs transition ${
            theme === 'light'
              ? 'bg-brand-soft text-brand dark:text-yellow-300 dark:bg-zinc-800 font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
          title="Light Theme"
          aria-label="Switch to light mode"
        >
          <Sun className="w-4 h-4 text-amber-500" />
        </button>
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`p-1.5 rounded-md text-xs transition ${
            theme === 'dark'
              ? 'bg-blue-900/40 text-blue-400 dark:bg-zinc-800 font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
          title="Dark Theme"
          aria-label="Switch to dark mode"
        >
          <Moon className="w-4 h-4 text-blue-500 dark:text-yellow-300" />
        </button>
        <button
          type="button"
          onClick={() => setTheme('system')}
          className={`p-1.5 rounded-md text-xs transition ${
            theme === 'system'
              ? 'bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
          title="System Default"
          aria-label="Switch to system theme"
        >
          <Monitor className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center mb-6">
        <div className="inline-flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-lg bg-brand dark:bg-yellow-400 dark:text-zinc-950 flex items-center justify-center text-white font-bold shadow-md shadow-brand/20 dark:shadow-yellow-400/20">
            <span className="text-lg">◈</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            KaryaSetu <span className="text-brand dark:text-yellow-300">AI</span>
          </span>
        </div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Create your enterprise workspace account
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Join project execution, activity mapping, and progress analytics
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 backdrop-blur-md py-8 px-6 sm:px-10 shadow-xl dark:shadow-2xl rounded-xl">
          {errorMessage && (
            <div className="mb-5 p-3 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Kumar"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand dark:focus:border-yellow-400 transition"
                />
              </div>
            </div>

            {/* Work Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Work Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand dark:focus:border-yellow-400 transition"
                />
              </div>
            </div>

            {/* Department & Role Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Department *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Planning & Controls"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand dark:focus:border-yellow-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Project Role *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-xs rounded-md bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand dark:focus:border-yellow-400 transition cursor-pointer"
                >
                  <option value="PROJECT_PLANNER" className="bg-white dark:bg-zinc-900">Planner / Scheduler</option>
                  <option value="PROJECT_MANAGER" className="bg-white dark:bg-zinc-900">Project Manager</option>
                  <option value="DISCIPLINE_ENGINEER" className="bg-white dark:bg-zinc-900">Discipline Engineer</option>
                  <option value="SITE_SUPERVISOR" className="bg-white dark:bg-zinc-900">Site Supervisor</option>
                </select>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-zinc-400 italic">
              * Administrator access is provisioned separately by IT Operations.
            </p>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-9 pr-10 py-2 text-xs rounded-md bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand dark:focus:border-yellow-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password requirement checklist */}
              <div className="mt-1.5 flex flex-wrap gap-2 text-[10px]">
                <span
                  className={
                    passwordStatus.minLength
                      ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                      : 'text-slate-400 dark:text-zinc-500'
                  }
                >
                  ✓ 8+ chars
                </span>
                <span
                  className={
                    passwordStatus.hasUpper
                      ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                      : 'text-slate-400 dark:text-zinc-500'
                  }
                >
                  ✓ 1 uppercase
                </span>
                <span
                  className={
                    passwordStatus.hasNumber
                      ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                      : 'text-slate-400 dark:text-zinc-500'
                  }
                >
                  ✓ 1 number
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand dark:focus:border-yellow-400 font-mono"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 dark:text-zinc-400 select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-3.5 h-3.5 mt-0.5 rounded bg-slate-100 dark:bg-zinc-800 border-slate-300 dark:border-zinc-700 text-brand dark:text-yellow-300 focus:ring-brand dark:focus:ring-yellow-400"
                />
                <span>
                  I agree to the enterprise data processing terms and project governance policies
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-brand dark:bg-yellow-400 dark:text-zinc-950 hover:bg-brand-dark dark:hover:bg-yellow-300 disabled:opacity-50 text-white text-xs font-semibold rounded-md shadow-md shadow-brand/20 dark:shadow-yellow-400/20 transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin text-sm">⟳</span>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-zinc-800 text-center text-xs text-slate-500 dark:text-zinc-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-brand dark:text-yellow-300 hover:text-brand-dark dark:hover:text-yellow-200 ml-1"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
