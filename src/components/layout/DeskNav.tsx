import React from 'react';
import { useRouter } from '../../lib/router';
import { 
  ShieldCheck, 
  PackageSearch, 
  Inbox, 
  GitCompare, 
  KeyRound, 
  Users,
  AlertCircle
} from 'lucide-react';

interface DeskNavProps {
  currentPath: string;
  pendingSubmissionsCount: number;
  pendingMatchesCount: number;
  pendingHandoversCount: number;
}

export const DeskNav: React.FC<DeskNavProps> = ({
  currentPath,
  pendingSubmissionsCount,
  pendingMatchesCount,
  pendingHandoversCount,
}) => {
  const { navigate } = useRouter();

  const navItems = [
    {
      path: '/desk',
      label: 'Desk Metrics',
      icon: <ShieldCheck className="w-4 h-4" />,
      index: '01',
    },
    {
      path: '/desk/items',
      label: 'Campus Master Ledger',
      icon: <PackageSearch className="w-4 h-4" />,
      index: '02',
    },
    {
      path: '/desk/submissions',
      label: 'Physical Intake Desk',
      icon: <Inbox className="w-4 h-4" />,
      index: '03',
      badge: pendingSubmissionsCount,
    },
    {
      path: '/desk/matches',
      label: 'Match Moderation Queue',
      icon: <GitCompare className="w-4 h-4" />,
      index: '04',
      badge: pendingMatchesCount,
    },
    {
      path: '/desk/handovers',
      label: 'Key Verification & Release',
      icon: <KeyRound className="w-4 h-4" />,
      index: '05',
      badge: pendingHandoversCount,
    },
    {
      path: '/desk/students',
      label: 'Student Credential Check',
      icon: <Users className="w-4 h-4" />,
      index: '06',
    },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r-2 border-black dark:border-[#1E293B] bg-[#F5F7FA] dark:bg-[#0B1422] p-4 lg:p-6">
      <div className="mb-6 hidden lg:block">
        <div className="text-[11px] uppercase tracking-widest font-mono-numbers text-neutral-500 mb-1">
          Authority Rail // DESK-SEC
        </div>
        <h2 className="text-xl font-heading text-black dark:text-white uppercase tracking-tight">
          Security Desk
        </h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
          Physical intake, moderation & one-time key verification.
        </p>
      </div>

      <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0" aria-label="Security Desk Navigation">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || 
            (item.path === '/desk/matches' && currentPath.startsWith('/desk/matches/')) ||
            (item.path === '/desk/handovers' && currentPath.startsWith('/desk/handovers/'));

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center justify-between px-3 py-2.5 text-xs font-medium tracking-tight whitespace-nowrap transition-colors cursor-pointer border text-left ${
                isActive
                  ? 'bg-[#142B4A] text-white border-[#142B4A] dark:bg-blue-600 dark:border-blue-500'
                  : 'bg-white dark:bg-slate-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`font-mono-numbers text-[10px] ${isActive ? 'text-blue-200' : 'text-neutral-400'}`}>
                  {item.index}
                </span>
                <span className="font-semibold">{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-1.5 py-0.2 text-[10px] font-mono-numbers border ${
                  isActive 
                    ? 'border-white text-white bg-transparent' 
                    : 'border-black text-black bg-white dark:bg-black dark:text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Desk Operating Invariants */}
      <div className="mt-8 pt-4 border-t border-neutral-300 dark:border-neutral-800 hidden lg:block">
        <div className="flex items-center gap-1.5 text-xs text-black dark:text-neutral-300 font-bold uppercase tracking-wider mb-2">
          <AlertCircle className="w-3.5 h-3.5 text-[#142B4A] dark:text-blue-400" />
          <span>Security Protocol</span>
        </div>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Matches require desk physical inspection. Handover requires one-time OTP key verification subject to 3-attempt limit.
        </p>
      </div>
    </aside>
  );
};
