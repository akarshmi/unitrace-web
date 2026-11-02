import React from 'react';
import { ArrowUpRight, Check, ChevronRight, LockKeyhole, ScanSearch, Shield, GraduationCap } from 'lucide-react';
import Grainient from '../ui/Grainient';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
  onNavigateToDashboard: () => void;
  isLoggedIn: boolean;
  userRole?: string;
}

const workflow = [
  ['01', 'Report', 'Tell us what went missing, or register an item you found on campus.'],
  ['02', 'Match', 'UniTrace compares visual and textual descriptions to surface verified matches.'],
  ['03', 'Verify', 'The Security Office reviews every match before anything is authorized for return.'],
  ['04', 'Return', 'Verify your student identity with a one-time key and collect your item safely.'],
];

const principles = [
  'University email verification (@lpu.in)',
  'Human-moderated candidate matches',
  'Private student contact details',
  'Secure, single-use handover keys',
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToLogin,
  onNavigateToRegister,
  onNavigateToDashboard,
  isLoggedIn,
  userRole,
}) => {
  return (
    <div className="min-h-screen bg-[var(--ground)] text-[var(--ink)] selection:bg-[var(--navy)] selection:text-white">
      {/* Top Header */}
      <header className="border-b-2 border-black dark:border-neutral-800 bg-white dark:bg-[#0B1422] sticky top-0 z-30">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 sm:px-8 lg:px-14">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center bg-[var(--navy)] text-sm font-bold text-white font-mono-numbers">
              UT
            </span>
            <span className="text-lg font-bold tracking-[-0.04em]">UNITRACE</span>
          </div>

          <nav className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[0.12em] sm:flex" aria-label="Primary navigation">
            <a href="#how-it-works" className="hover:text-[var(--navy)] transition-colors">How it works</a>
            <a href="#principles" className="hover:text-[var(--navy)] transition-colors">Our standard</a>

            {isLoggedIn ? (
              <button
                onClick={onNavigateToDashboard}
                className="border-2 border-black dark:border-neutral-600 bg-black text-white px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] hover:bg-[var(--navy)] transition-colors cursor-pointer"
              >
                Go to {userRole === 'MODERATOR' ? 'Security Desk' : 'Student Portal'} &rarr;
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={onNavigateToRegister}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-neutral-600 hover:text-black cursor-pointer transition-colors"
                >
                  Register
                </button>
                <button
                  onClick={onNavigateToLogin}
                  className="border-2 border-black dark:border-neutral-600 px-4 py-2 transition-colors hover:bg-black hover:text-white cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )}
          </nav>

          <div className="sm:hidden">
            <button
              onClick={isLoggedIn ? onNavigateToDashboard : onNavigateToLogin}
              className="text-xs font-bold uppercase tracking-[0.12em] border border-black px-3 py-1.5"
            >
              {isLoggedIn ? 'Portal' : 'Sign In'} <ArrowUpRight className="ml-0.5 inline size-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Grainient in the background */}
      <section className="relative mx-auto border-b-2 border-black dark:border-neutral-800 overflow-hidden bg-[#120f17]">
        {/* React Bits Grainient in the background */}
        <div className="absolute inset-0 z-0 opacity-40 dark:opacity-60 pointer-events-none">
          <Grainient
            colors={['#120f17', '#2a0f0a', '#9a3412', '#f97316', '#fed7aa']}
            angle={55}
            flow={0.8}
            silk={0.35}
            grainAmount={0.08}
          />
        </div>

        <div className="relative z-10 mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-12 bg-white/95 dark:bg-[#0B1422]/95 backdrop-blur-sm">
          <div className="px-5 py-14 sm:px-8 sm:py-20 lg:col-span-9 lg:px-14 lg:py-28">
            <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em]">
              <span className="size-2 bg-[var(--navy)]" /> University lost &amp; found, rethought
            </p>
            <h1 className="max-w-5xl text-[clamp(3.4rem,8.5vw,8.5rem)] font-extrabold leading-[0.88] tracking-[-0.08em]">
              LOST<br />
              <span className="text-[var(--navy)] dark:text-blue-400">FOUND.</span><br />
              RETURNED.
            </h1>

            <div className="mt-10 grid max-w-3xl grid-cols-1 gap-6 border-t-2 border-black dark:border-neutral-800 pt-6 sm:grid-cols-[1fr_auto]">
              <p className="max-w-xl text-base sm:text-lg leading-7 sm:leading-8 text-neutral-700 dark:text-neutral-300">
                A trusted university platform for reporting belongings, surfacing meaningful verified matches, and making every return feel certain.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                {isLoggedIn ? (
                  <button
                    onClick={onNavigateToDashboard}
                    className="inline-flex h-fit items-center justify-center gap-3 bg-[var(--navy)] px-6 py-4 text-sm font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[var(--navy-hover)] cursor-pointer"
                  >
                    Enter Portal <ArrowUpRight className="size-5" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={onNavigateToLogin}
                      className="inline-flex h-fit items-center justify-center gap-3 bg-[var(--navy)] px-6 py-4 text-sm font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[var(--navy-hover)] cursor-pointer"
                    >
                      Open UniTrace <ArrowUpRight className="size-5" />
                    </button>
                    <button
                      onClick={onNavigateToRegister}
                      className="inline-flex h-fit items-center justify-center gap-2 border-2 border-black dark:border-neutral-600 bg-white dark:bg-slate-900 px-5 py-4 text-sm font-bold uppercase tracking-[0.1em] text-black dark:text-white transition-colors hover:bg-neutral-100 cursor-pointer"
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Index Rail Aside */}
          <aside className="flex flex-col justify-between border-t-2 border-black dark:border-neutral-800 bg-[var(--surface)] dark:bg-slate-900/60 p-5 sm:p-8 lg:col-span-3 lg:border-l-2 lg:border-t-0 lg:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)] font-mono-numbers">Index / 001</p>
              <p className="mt-12 max-w-[16rem] text-2xl font-bold leading-tight tracking-[-0.05em]">
                A clear path from a missing item to a verified return.
              </p>
            </div>
            <div className="mt-16 border-t-2 border-black dark:border-neutral-800 pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em]">Built for campus</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Students, finders, and the Security Office in one shared workflow.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* WebGL Canvas with Campus Reviews */}
      <section className="relative mx-auto max-w-[1600px] border-b-2 border-black dark:border-neutral-800 overflow-hidden">
        <div className="relative w-full min-h-[640px] md:h-[600px] overflow-hidden flex flex-col justify-between p-4 sm:p-8 lg:p-10">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Grainient
              colors={['#120f17', '#2a0f0a', '#9a3412', '#f97316', '#fed7aa']}
              angle={55}
              flow={0.8}
              silk={0.35}
              grainAmount={0.08}
            />
          </div>

          {/* Overlaid Campus Reviews Grid */}
          <div className="relative z-10 flex flex-col justify-between h-full gap-6">
            {/* Header Tag */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 bg-white/95 dark:bg-[#0B1422]/95 border-2 border-black dark:border-neutral-700 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] backdrop-blur-sm pointer-events-auto">
                <span className="size-2 bg-[var(--navy)] inline-block" />
                <span>Verified Handover Records</span>
              </span>
              <span className="hidden sm:inline-block bg-white/90 dark:bg-[#0B1422]/90 border-2 border-black dark:border-neutral-700 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)] backdrop-blur-sm pointer-events-auto font-mono-numbers">
                Campus Security Audit
              </span>
            </div>

            {/* 3 Review Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pointer-events-auto">
              <div className="bg-white/92 dark:bg-[#0B1422]/92 backdrop-blur-md border-2 border-black dark:border-neutral-700 p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--navy)] dark:text-blue-400 font-mono-numbers">
                    CLAIM #2841 &bull; BLOCK 34
                  </span>
                  <p className="mt-2 text-sm sm:text-base font-bold leading-snug">
                    &ldquo;Retrieved my scientific calculator before afternoon finals.&rdquo;
                  </p>
                  <p className="mt-2 text-xs leading-5 text-neutral-600 dark:text-neutral-300">
                    Reported at 10 AM. By 1 PM the Security Desk confirmed the match. Verified with the 6-digit key in two minutes.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-300 dark:border-neutral-700 flex items-center justify-between text-[11px]">
                  <span className="font-bold">Rohit K.</span>
                  <span className="text-neutral-500 font-mono-numbers">B.Tech CSE &bull; 12204598</span>
                </div>
              </div>

              <div className="bg-white/92 dark:bg-[#0B1422]/92 backdrop-blur-md border-2 border-black dark:border-neutral-700 p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--navy)] dark:text-blue-400 font-mono-numbers">
                    DESK PROTOCOL &bull; BLOCK 29
                  </span>
                  <p className="mt-2 text-sm sm:text-base font-bold leading-snug">
                    &ldquo;Single-use collection keys eliminated wrongful claims.&rdquo;
                  </p>
                  <p className="mt-2 text-xs leading-5 text-neutral-600 dark:text-neutral-300">
                    Students visit with their registered ID. The verification code ensures items are returned only to verified owners.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-300 dark:border-neutral-700 flex items-center justify-between text-[11px]">
                  <span className="font-bold">Security Desk</span>
                  <span className="text-neutral-500 font-mono-numbers">Central Custody Unit</span>
                </div>
              </div>

              <div className="bg-white/92 dark:bg-[#0B1422]/92 backdrop-blur-md border-2 border-black dark:border-neutral-700 p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--navy)] dark:text-blue-400 font-mono-numbers">
                    PRIVACY STANDARD &bull; BLOCK 14
                  </span>
                  <p className="mt-2 text-sm sm:text-base font-bold leading-snug">
                    &ldquo;No personal phone numbers leaked to strangers.&rdquo;
                  </p>
                  <p className="mt-2 text-xs leading-5 text-neutral-600 dark:text-neutral-300">
                    Unlike unofficial group chats, contact details remain private. Everything flows through institutional university credentials.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-300 dark:border-neutral-700 flex items-center justify-between text-[11px]">
                  <span className="font-bold">Priya S.</span>
                  <span className="text-neutral-500 font-mono-numbers">Architecture &bull; 12108742</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id="how-it-works" className="mx-auto max-w-[1600px] border-b-2 border-black dark:border-neutral-800 px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--navy)]">02 / The workflow</p>
            <h2 className="mt-5 text-3xl font-extrabold leading-none tracking-[-0.07em] sm:text-5xl">
              SIMPLE BY<br />DESIGN.
            </h2>
          </div>

          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 border-t-2 border-black dark:border-neutral-800 sm:grid-cols-2">
              {workflow.map(([number, title, copy]) => (
                <article
                  key={number}
                  className="border-b-2 border-black dark:border-neutral-800 py-7 sm:pr-8 [&:nth-child(even)]:sm:border-l-2 [&:nth-child(even)]:sm:pl-8"
                >
                  <p className="text-xs font-bold text-[var(--navy)] font-mono-numbers">{number}</p>
                  <h3 className="mt-4 text-2xl font-bold tracking-[-0.05em]">{title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Principles / Our Standard */}
      <section id="principles" className="bg-black text-white">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-12">
          <div className="border-b-2 border-white/30 px-5 py-16 sm:px-8 lg:col-span-5 lg:border-b-0 lg:border-r-2 lg:px-14 lg:py-24">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--navy)]">03 / Our standard</p>
            <h2 className="mt-6 max-w-xl text-5xl font-extrabold leading-[0.9] tracking-[-0.08em] sm:text-7xl">
              TRUST IS PART OF THE PRODUCT.
            </h2>
          </div>

          <div className="px-5 py-16 sm:px-8 lg:col-span-7 lg:px-14 lg:py-24">
            <p className="max-w-xl text-lg leading-8 text-white/70">
              Technology can suggest a connection. Only people and the right campus safeguards can complete a return.
            </p>

            <ul className="mt-10 divide-y divide-white/30 border-y-2 border-white/30">
              {principles.map((item) => (
                <li key={item} className="flex items-center justify-between py-4 sm:py-5 text-base sm:text-lg font-bold">
                  <span>{item}</span>
                  <Check className="size-5 text-[var(--navy)] shrink-0" />
                </li>
              ))}
            </ul>

            <button
              onClick={isLoggedIn ? onNavigateToDashboard : onNavigateToLogin}
              className="mt-10 inline-flex items-center gap-2 border-2 border-white px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
              <span>{isLoggedIn ? 'Access Active Portal' : 'Enter the portal'}</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-5 py-8 text-xs sm:px-8 md:grid-cols-3 lg:px-14">
        <p className="font-bold tracking-[-0.02em]">© 2026 UNITRACE</p>
        <p className="text-[var(--muted)]">A safer way back to what matters.</p>
        <div className="flex gap-6 md:justify-end text-[var(--muted)]">
          <span className="flex items-center gap-2">
            <LockKeyhole className="size-3 text-black dark:text-white" /> Private by design
          </span>
          <span className="flex items-center gap-2">
            <ScanSearch className="size-3 text-black dark:text-white" /> AI assisted
          </span>
        </div>
      </footer>
    </div>
  );
};
