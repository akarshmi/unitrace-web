import React, { useState } from 'react';
import { User } from '../../types';
import { authApi } from '../../lib/api/auth.api';
import { AlertCircle } from 'lucide-react';
import Grainient from '../ui/Grainient';

interface LoginPageProps {
  onSuccess: (user: User) => void;
  onNavigateToRegister: () => void;
  onNavigateToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateToRegister,
  onNavigateToLanding,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performLogin = async (loginEmail: string, loginPass: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.login({ email: loginEmail, password: loginPass });
      onSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin(email, password);
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-2 bg-[var(--ground)] text-[var(--ink)] selection:bg-[var(--navy)] selection:text-white">
      {/* Black Side with WebGL Grainient Canvas */}
      <section className="relative hidden bg-black p-10 lg:p-14 text-white lg:flex lg:flex-col lg:justify-between overflow-hidden">
        {/* Grainient WebGL Background */}
        <div className="absolute inset-0 z-0 opacity-55 pointer-events-none">
          <Grainient
            colors={['#120f17', '#2a0f0a', '#9a3412', '#f97316', '#fed7aa']}
            angle={55}
            flow={0.8}
            silk={0.35}
            grainAmount={0.08}
          />
        </div>

        {/* Top Branding */}
        <div className="relative z-10">
          <button
            onClick={onNavigateToLanding}
            className="flex items-center gap-3 cursor-pointer text-left group"
          >
            <span className="flex size-9 items-center justify-center bg-white text-sm font-bold text-black font-mono-numbers">
              UT
            </span>
            <b className="tracking-[-0.04em] text-lg">UNITRACE</b>
          </button>
        </div>

        {/* Middle Hero Display */}
        <div className="relative z-10 my-auto py-12">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60 font-mono-numbers">
            WELCOME BACK
          </p>
          <h1 className="mt-5 max-w-xl text-7xl xl:text-8xl font-extrabold leading-[.85] tracking-[-.09em]">
            FIND<br />YOUR<br />WAY<br />BACK.
          </h1>
        </div>

        {/* Bottom Tagline */}
        <div className="relative z-10 pt-6 border-t border-white/20 flex items-center justify-between text-xs text-white/60">
          <p>University lost &amp; found, rethought.</p>
          <span className="font-mono-numbers">BLOCK 29 &bull; CENTRAL DESK</span>
        </div>
      </section>

      {/* Form Side */}
      <section className="flex min-h-screen flex-col justify-center px-6 py-12 sm:px-14 lg:px-20 bg-white dark:bg-[#0B1422]">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Back Button */}
          <button
            onClick={onNavigateToLanding}
            className="text-xs font-bold uppercase tracking-[0.12em] mb-12 block lg:hidden cursor-pointer hover:text-[var(--navy)]"
          >
            &larr; UNITRACE HOME
          </button>

          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)] font-mono-numbers">
            STUDENT PORTAL / SIGN IN
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-[-0.08em]">
            SIGN IN.
          </h1>

          {error && (
            <div className="mt-5 border-2 border-black dark:border-neutral-700 bg-neutral-100 dark:bg-slate-900 p-3 text-xs flex items-center gap-2.5 font-mono-numbers">
              <AlertCircle className="w-4 h-4 shrink-0 text-[var(--navy)]" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.12em] mb-2 block">
                University email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@lpu.in"
                className="h-12 w-full border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 px-3 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-mono-numbers"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.12em] mb-2 block">
                Password
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-12 w-full border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 px-3 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-mono-numbers"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 block w-full bg-black hover:bg-neutral-800 px-5 py-4 text-center text-xs font-bold uppercase tracking-[.12em] text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-8 border-t-2 border-black dark:border-neutral-800 pt-6 text-sm">
            New to UniTrace?{' '}
            <button
              onClick={onNavigateToRegister}
              className="font-bold underline cursor-pointer hover:text-[var(--navy)]"
            >
              Create an account
            </button>
          </p>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
