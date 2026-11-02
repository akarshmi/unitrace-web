import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../../lib/router';
import { authApi } from '../../lib/api/auth.api';
import { User } from '../../types';
import { Mail, Check, RotateCcw, ArrowLeft, AlertCircle } from 'lucide-react';

interface VerifyEmailPageProps {
  onSuccess: (user: User) => void;
}

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ onSuccess }) => {
  const { navigate } = useRouter();
  const [email, setEmail] = useState('student@lpu.in');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>('Demonstration verification code: 482910');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.verifyOtp({ email, otp });
      onSuccess(res.user);
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(60);
    setInfo('New code 482910 dispatched to your university inbox.');
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
              Security Protocol // 02
            </p>
            <h1 className="text-3xl font-extrabold tracking-[-0.05em] uppercase text-black dark:text-white">
              Verify University Email
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Enter the 6-digit confirmation code issued to your university account.
            </p>
          </div>

          {error && (
            <div className="border-2 border-black bg-neutral-100 dark:bg-slate-900 p-3 text-xs text-black dark:text-white flex items-center gap-2 font-mono-numbers">
              <AlertCircle className="w-4 h-4 shrink-0 text-neutral-600" />
              <span>{error}</span>
            </div>
          )}

          {info && (
            <div className="border-2 border-[var(--navy)] bg-[var(--navy-light)] dark:bg-slate-900/60 p-3 text-xs text-[var(--navy)] dark:text-blue-300 font-mono-numbers">
              {info}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                University Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student.12204598@lpu.in"
                className="w-full px-3 py-2.5 text-sm border-2 border-black dark:border-neutral-700 dark:bg-slate-900 font-mono-numbers"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-black dark:text-white text-center">
                6-Digit Single-Use Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="482910"
                className="w-full py-3 text-center text-3xl font-mono-numbers tracking-widest border-2 border-black dark:border-neutral-700 dark:bg-slate-900 focus:outline-none focus:border-[var(--navy)]"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono-numbers pt-1">
              <span className="text-[var(--muted)]">
                {countdown > 0 ? `Resend available in ${countdown}s` : 'Code expired?'}
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0}
                className="font-bold uppercase tracking-wider text-[var(--navy)] dark:text-blue-400 hover:underline disabled:opacity-40 cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Resend Code</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[var(--navy)] hover:bg-[var(--navy-hover)] text-white text-xs font-bold uppercase tracking-[0.1em] transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP & Enter Workspace'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
