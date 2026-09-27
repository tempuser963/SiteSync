import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 400);
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
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Reset Account Access</h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 py-8 px-6 sm:px-10 shadow-xl dark:shadow-2xl rounded-xl">
          {!submitted ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Forgot your password?
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  Enter your registered work email and we'll simulate sending a secure password reset link.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand dark:focus:border-yellow-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-2.5 px-4 bg-brand dark:bg-yellow-400 dark:text-zinc-950 hover:bg-brand-dark dark:hover:bg-yellow-300 disabled:opacity-50 text-white text-xs font-semibold rounded-md shadow-md shadow-brand/20 dark:shadow-yellow-400/20 transition flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span>Generating simulated link...</span>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-3 text-center">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Reset Link Sent</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                  If an account exists for <span className="font-semibold text-slate-900 dark:text-white">{email}</span>, a password reset link has been simulated for this demo session.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60 rounded-md text-[11px] text-slate-600 dark:text-zinc-400 font-mono">
                Simulation token generated: st-reset-90234
              </div>

              <button
                onClick={() => navigate('/reset-password')}
                className="w-full py-2.5 px-4 bg-brand dark:bg-yellow-400 dark:text-zinc-950 hover:bg-brand-dark dark:hover:bg-yellow-300 text-white text-xs font-semibold rounded-md shadow-md shadow-brand/20 dark:shadow-yellow-400/20 transition flex items-center justify-center gap-2"
              >
                <span>Simulate Reset Password</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
