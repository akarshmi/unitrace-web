import React, { useState } from 'react';
import { authApi } from '../../lib/api/auth.api';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Grainient from '../ui/Grainient';

interface RegisterPageProps {
  onSuccess: () => void;
  onNavigateToLogin: () => void;
  onNavigateToLanding: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onSuccess,
  onNavigateToLogin,
  onNavigateToLanding,
}) => {
  const [step, setStep] = useState<'FORM' | 'OTP'>('FORM');
  const [fullName, setFullName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!email.toLowerCase().endsWith('@lpu.in')) {
      setError('Must use university email (@lpu.in).');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.register({
        fullName,
        registrationNumber: regNo,
        email,
        phoneNumber,
        password,
      });
      setInfoMsg(res.message);
      setStep('OTP');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.verifyOtp({ email, otp: otpCode });
      setInfoMsg(res.message);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid code.');
    } finally {
      setLoading(false);
    }
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
            STUDENT ENROLLMENT
          </p>
          <h1 className="mt-5 max-w-xl text-7xl xl:text-8xl font-extrabold leading-[.85] tracking-[-.09em]">
            JOIN<br />YOUR<br />CAMPUS.
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
            {step === 'FORM' ? 'STUDENT PORTAL / REGISTER' : 'SECURITY TOKEN / OTP'}
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-[-0.08em]">
            {step === 'FORM' ? 'REGISTER.' : 'VERIFY OTP.'}
          </h1>

          {error && (
            <div className="mt-5 border-2 border-black dark:border-neutral-700 bg-neutral-100 dark:bg-slate-900 p-3 text-xs flex items-center gap-2.5 font-mono-numbers">
              <AlertCircle className="w-4 h-4 shrink-0 text-[var(--navy)]" />
              <span>{error}</span>
            </div>
          )}

          {infoMsg && (
            <div className="mt-5 border-2 border-black dark:border-neutral-700 bg-neutral-100 dark:bg-slate-900 p-3 text-xs flex items-center gap-2.5 font-mono-numbers">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[var(--navy)]" />
              <span>{infoMsg}</span>
            </div>
          )}

          {step === 'FORM' ? (
            <form onSubmit={handleRegisterSubmit} className="mt-8 space-y-4">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.12em] mb-1.5 block">
                  Full Name
                </span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Akarsh Sharma"
                  className="h-12 w-full border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 px-3 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.12em] mb-1.5 block">
                  Phone Number (10 digits)
                </span>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 9876543210"
                  className="h-12 w-full border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 px-3 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-mono-numbers"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.12em] mb-1.5 block">
                  University Reg. Number
                </span>
                <input
                  type="text"
                  required
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  placeholder="e.g. 12204598"
                  className="h-12 w-full border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 px-3 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-mono-numbers uppercase"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.12em] mb-1.5 block">
                  University Email (@lpu.in)
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student.12204598@lpu.in"
                  className="h-12 w-full border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 px-3 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-mono-numbers"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] mb-1.5 block">
                    Password
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 w-full border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 px-3 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] mb-1.5 block">
                    Confirm
                  </span>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 w-full border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 px-3 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 block w-full bg-black hover:bg-neutral-800 px-5 py-4 text-center text-xs font-bold uppercase tracking-[.12em] text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Create Account'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="mt-8 space-y-5">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.12em] mb-2 block text-center">
                  6-Digit OTP Code
                </span>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter OTP"
                  className="h-14 w-full text-center text-3xl font-mono-numbers tracking-widest border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="block w-full bg-black hover:bg-neutral-800 px-5 py-4 text-center text-xs font-bold uppercase tracking-[.12em] text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </form>
          )}

          <p className="mt-8 border-t-2 border-black dark:border-neutral-800 pt-6 text-sm">
            Already have an account?{' '}
            <button
              onClick={onNavigateToLogin}
              className="font-bold underline cursor-pointer hover:text-[var(--navy)]"
            >
              Sign in
            </button>
          </p>
        </div>
      </section>
    </main>
  );
};

export default RegisterPage;
