import React from 'react';
import { useRouter } from '../../lib/router';

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
      label: 'Overview',
    },
    {
      path: '/desk/submissions',
      label: 'Physical Intake',
      badge: pendingSubmissionsCount,
    },
    {
      path: '/desk/matches',
      label: 'Matches',
      badge: pendingMatchesCount,
    },
    {
      path: '/desk/handovers',
      label: 'Handovers',
      badge: pendingHandoversCount,
    },
    {
      path: '/desk/items',
      label: 'Master Ledger',
    },
    {
      path: '/desk/students',
      label: 'Student Lookup',
    },
  ];

  return (
    <nav
      aria-label="Security Desk Navigation"
      className="flex items-center gap-2 sm:gap-3 overflow-x-auto border-b-2 border-black dark:border-neutral-800 pb-3 mb-6 sm:mb-8 text-xs font-bold uppercase tracking-[.12em]"
    >
      {navItems.map((item) => {
        const isActive =
          currentPath === item.path ||
          (item.path === '/desk/matches' && currentPath.startsWith('/desk/matches/')) ||
          (item.path === '/desk/handovers' && currentPath.startsWith('/desk/handovers/'));

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`px-3 sm:px-4 py-2 whitespace-nowrap transition-colors cursor-pointer border-2 flex items-center gap-2 ${
              isActive
                ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                : 'border-transparent text-[var(--muted)] hover:text-black dark:hover:text-white hover:border-black dark:hover:border-neutral-700 bg-transparent'
            }`}
          >
            <span>{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span
                className={`text-[10px] font-mono-numbers px-1.5 py-0.2 border ${
                  isActive
                    ? 'border-white text-white dark:border-black dark:text-black'
                    : 'border-black text-black bg-white dark:bg-black dark:text-white'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
