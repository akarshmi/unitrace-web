import React, { useState } from 'react';
import { useRouter, Link } from '../../lib/router';
import { Lock, ArrowLeft, Check, AlertCircle } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const { navigate } = useRouter();
  const [token, setToken] = useState('UT-RESET-8921');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[var(--ground)] text-[var(--ink)] flex flex-col justify-between selection:bg-[var(--navy)] selection:text-white">
      <header className="border-b-2 border-black dark:border-neutral-800">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 sm:px-8 lg:px-14">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center bg-[var(--navy)] text-sm font-bold text-white font-mono-numbers">UT</span>
            <span className="text-lg font-bold tracking-[-0.04em]">UNITRACE</span>
          </Link>
          <Link href="/login" className="text-xs font-bold uppercase tracking-[0.12em] flex items-center gap-1.5 hover:text-[var(--navy)]">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto px-5 py-12 flex flex-col justify-center">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--navy)] mb-2 font-mono-numbers">
              Security Protocol // 04
            </p>
            <h1 className="text-3xl font-extrabold tracking-[-0.05em] uppercase text-black dark:text-white">
              Reset Password
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Specify your new university account password.
            </p>
          </div>

          {error && (
            <div className="border-2 border-black bg-neutral-100 dark:bg-slate-900 p-3 text-xs text-black dark:text-white flex items-center gap-2 font-mono-numbers">
              <AlertCircle className="w-4 h-4 shrink-0 text-neutral-600" />
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div className="border-2 border-[var(--navy)] bg-[var(--navy-light)] dark:bg-slate-900/60 p-5 space-y-4">
              <div className="flex items-center gap-2 font-bold uppercase text-xs text-[var(--navy)] dark:text-blue-300">
                <Check className="w-4 h-4" />
                <span>Password Successfully Updated</span>
              </div>
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Your credentials have been securely updated in the university security directory.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Proceed to Sign In
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                  Reset Authorization Token
                </label>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-3 py-2 text-sm border-2 border-black dark:border-neutral-700 dark:bg-slate-900 font-mono-numbers uppercase font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                  New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border-2 border-black dark:border-neutral-700 dark:bg-slate-900 focus:outline-none focus:border-[var(--navy)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border-2 border-black dark:border-neutral-700 dark:bg-slate-900 focus:outline-none focus:border-[var(--navy)]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-[0.1em] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Updating Credentials...' : 'Save New Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};
