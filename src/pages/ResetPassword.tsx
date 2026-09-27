import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { Lock, ArrowRight, CheckCircle2, Eye, EyeOff, AlertCircle, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useProject();
  const { theme, setTheme } = useTheme();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      showToast('Password reset successfully', 'success');
    }, 450);
  };

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

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-md bg-brand dark:bg-yellow-400 dark:text-zinc-950 flex items-center justify-center text-white font-bold shadow-md shadow-brand/20 dark:shadow-yellow-400/20">
            ◈
          </div>
          <span className="font-bold text-xl text-slate-900 dark:text-white">
            SiteSync <span className="text-brand dark:text-yellow-300">AI</span>
          </span>
        </div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Choose New Password</h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 py-8 px-6 sm:px-10 shadow-xl dark:shadow-2xl rounded-xl">
          {!success ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Set new password
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Ensure your password meets enterprise complexity requirements.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
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
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand dark:focus:border-yellow-400 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-brand dark:bg-yellow-400 dark:text-zinc-950 hover:bg-brand-dark dark:hover:bg-yellow-300 disabled:opacity-50 text-white text-xs font-semibold rounded-md shadow-md shadow-brand/20 dark:shadow-yellow-400/20 transition flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span>Resetting password...</span>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Password Reset Successfully
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Your mock credentials have been updated. You can now sign in with your new password.
                </p>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full py-2.5 px-4 bg-brand dark:bg-yellow-400 dark:text-zinc-950 hover:bg-brand-dark dark:hover:bg-yellow-300 text-white text-xs font-semibold rounded-md shadow-md shadow-brand/20 dark:shadow-yellow-400/20 transition flex items-center justify-center gap-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
