import React from 'react';
import { useRouter } from '../../lib/router';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen bg-[var(--ground)] text-[var(--ink)] flex flex-col justify-between selection:bg-[var(--navy)] selection:text-white">
      <header className="border-b-2 border-black dark:border-neutral-800 bg-white dark:bg-[#0B1422]">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 sm:px-8 lg:px-14">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group text-left"
          >
            <span className="flex size-9 items-center justify-center bg-[var(--navy)] text-sm font-bold text-white font-mono-numbers">
              UT
            </span>
            <span className="text-lg font-bold tracking-[-0.04em] text-black dark:text-white group-hover:text-[var(--navy)] transition-colors">
              UNITRACE
            </span>
          </button>
          
          <button
            onClick={() => navigate('/app')}
            className="text-xs font-bold uppercase tracking-[0.12em] flex items-center gap-1.5 hover:text-[var(--navy)] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Student Portal</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-lg w-full mx-auto px-5 py-16 flex flex-col justify-center text-center">
        <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#0B1422] p-8 space-y-6">
          <div className="w-12 h-12 bg-[var(--navy)] text-white flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--navy)] dark:text-blue-400 font-mono-numbers mb-1">
              Restricted Terminal
            </p>
            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-black dark:text-white">
              Security Desk Access Only
            </h1>
            <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed">
              This terminal requires Security Officer credentials. To access physical reception, match moderation, or property handovers, please sign in with an authorized officer account.
            </p>
          </div>

          <div className="pt-4 border-t-2 border-black dark:border-neutral-800 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/app')}
              className="px-5 py-2.5 border-2 border-black dark:border-neutral-700 text-xs font-bold uppercase tracking-[0.12em] hover:bg-neutral-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Return to Student Portal
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 bg-[var(--navy)] hover:bg-[var(--navy-hover)] text-white text-xs font-bold uppercase tracking-[0.12em] flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In as Officer</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
