import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useProject } from '../context/ProjectContext';
import { DEMO_CREDENTIALS } from '../data/mockUsers';
import { ROLE_BADGES } from '../config/permissions';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Users,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Login: React.FC = () => {
  const { login, switchRole } = useAuth();
  const { showToast } = useProject();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('planner@karyasetu.ai');
  const [password, setPassword] = useState('Planner@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const validateEmail = (str: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your work email address.');
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password, rememberMe);
    setLoading(false);

    if (result.success) {
      showToast('Welcome back to KaryaSetu AI', 'success');
      navigate(from, { replace: true });
    } else {
      setErrorMessage(result.error || 'Authentication failed.');
    }
  };

  const handleSelectDemo = (demo: (typeof DEMO_CREDENTIALS)[0]) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setErrorMessage(null);
  };

  const handleQuickLogin = async (demo: (typeof DEMO_CREDENTIALS)[0]) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setLoading(true);
    const result = await login(demo.email, demo.password, true);
    setLoading(false);
    if (result.success) {
      showToast(`Signed in as ${demo.name} (${demo.roleName})`, 'success');
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-zinc-100 relative overflow-hidden transition-colors duration-200">
      {/* Top right theme switcher pill */}
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

      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand/5 dark:bg-yellow-400/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-emerald-600/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Logo */}
        <div className="inline-flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-lg bg-brand dark:bg-yellow-400 dark:text-zinc-950 flex items-center justify-center text-white font-bold shadow-lg shadow-brand/20 dark:shadow-yellow-400/20">
            <span className="text-xl">◈</span>
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
            KaryaSetu <span className="text-brand dark:text-yellow-300">AI</span>
          </span>
        </div>

        <h2 className="text-sm font-semibold tracking-wide uppercase text-brand dark:text-yellow-300">
          AI-Powered Planning-to-Execution Bridge
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
          Enterprise EPC Execution &amp; Schedule Intelligence Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 backdrop-blur-md py-8 px-6 sm:px-10 shadow-xl dark:shadow-2xl rounded-xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sign in to your workspace</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Access role-governed execution data &amp; schedule mapping
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1"
              >
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand dark:focus:border-yellow-400 focus:ring-1 focus:ring-brand dark:focus:ring-yellow-400 transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2 text-xs rounded-md bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand dark:focus:border-yellow-400 focus:ring-1 focus:ring-brand dark:focus:ring-yellow-400 transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-300 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-slate-100 dark:bg-zinc-800 border-slate-300 dark:border-zinc-700 text-brand dark:text-yellow-300 focus:ring-brand dark:focus:ring-yellow-400"
                />
                <span>Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="font-medium text-brand dark:text-yellow-300 hover:text-brand-dark dark:hover:text-yellow-200 transition"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-brand dark:bg-yellow-400 dark:text-zinc-950 hover:bg-brand-dark dark:hover:bg-yellow-300 disabled:opacity-50 text-white text-xs font-semibold rounded-md shadow-md shadow-brand/20 dark:shadow-yellow-400/20 transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin text-sm">⟳</span>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-zinc-800 text-center text-xs text-slate-500 dark:text-zinc-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-brand dark:text-yellow-300 hover:text-brand-dark dark:hover:text-yellow-200 ml-1"
            >
              Register here
            </Link>
          </div>
        </div>

        {/* Demo Accounts Quick-Picker Section */}
        <div className="mt-6 bg-slate-100/80 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800/80 rounded-xl p-4 backdrop-blur-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-brand dark:text-yellow-300" />
              Demo Roles Quick Sign-In
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Click to Auto-Fill &amp; Enter
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DEMO_CREDENTIALS.map((demo) => {
              const badge = ROLE_BADGES[demo.role];
              return (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => handleQuickLogin(demo)}
                  className="text-left p-2.5 rounded-lg bg-white dark:bg-zinc-800/60 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700/60 hover:border-brand dark:hover:border-yellow-400/60 transition group flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800 dark:text-white group-hover:text-brand dark:group-hover:text-brand dark:text-yellow-300 dark:group-hover:text-brand-tint dark:hover:text-yellow-200 transition truncate">
                        {demo.name}
                      </span>
                    </div>
                    <span
                      className={`inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 mt-2 block font-mono truncate">
                    {demo.email}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-6 text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
          <span>Secure Enterprise Workspace • Role-Based Access Active</span>
        </div>
      </div>
    </div>
  );
};
