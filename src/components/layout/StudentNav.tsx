import React from 'react';
import { useRouter } from '../../lib/router';
import { 
  LayoutDashboard, 
  Search, 
  PlusSquare, 
  Layers, 
  Sparkles, 
  Bell, 
  User as UserIcon,
  Clock
} from 'lucide-react';

interface StudentNavProps {
  currentPath: string;
  unreadNotificationsCount: number;
  pendingMatchesCount: number;
}

export const StudentNav: React.FC<StudentNavProps> = ({
  currentPath,
  unreadNotificationsCount,
  pendingMatchesCount,
}) => {
  const { navigate } = useRouter();

  const navItems = [
    {
      path: '/app',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
      index: '01',
    },
    {
      path: '/app/report/lost',
      label: 'Report Lost Item',
      icon: <Search className="w-4 h-4" />,
      index: '02',
    },
    {
      path: '/app/report/found',
      label: 'Report Found Item',
      icon: <PlusSquare className="w-4 h-4" />,
      index: '03',
    },
    {
      path: '/app/items',
      label: 'My Reports',
      icon: <Layers className="w-4 h-4" />,
      index: '04',
    },
    {
      path: '/app/matches',
      label: 'Verified Matches',
      icon: <Sparkles className="w-4 h-4" />,
      index: '05',
      badge: pendingMatchesCount,
    },
    {
      path: '/app/notifications',
      label: 'Notifications',
      icon: <Bell className="w-4 h-4" />,
      index: '06',
      badge: unreadNotificationsCount,
    },
    {
      path: '/app/profile',
      label: 'Student Identity',
      icon: <UserIcon className="w-4 h-4" />,
      index: '07',
    },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r-2 border-black dark:border-[#1E293B] bg-neutral-50 dark:bg-[#0B1422] p-4 lg:p-6">
      <div className="mb-6 hidden lg:block">
        <div className="text-[11px] uppercase tracking-widest font-mono-numbers text-neutral-500 mb-1">
          Index Rail // 01
        </div>
        <h2 className="text-xl font-heading text-black dark:text-white uppercase tracking-tight">
          Student Portal
        </h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
          Report, trace & recover campus belongings.
        </p>
      </div>

      <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0" aria-label="Student Navigation">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || (item.path === '/app/items' && currentPath.startsWith('/app/items/'));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center justify-between px-3 py-2.5 text-xs font-medium tracking-tight whitespace-nowrap transition-colors cursor-pointer border text-left ${
                isActive
                  ? 'bg-black text-white border-black dark:bg-[#142B4A] dark:border-blue-400'
                  : 'bg-white dark:bg-slate-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`font-mono-numbers text-[10px] ${isActive ? 'text-neutral-300' : 'text-neutral-400'}`}>
                  {item.index}
                </span>
                <span className="font-semibold">{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-1.5 py-0.2 text-[10px] font-mono-numbers border ${
                  isActive 
                    ? 'border-white text-white bg-transparent' 
                    : 'border-[#142B4A] text-[#142B4A] bg-[#E8EDF3] dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Urgent Campus Notice Box */}
      <div className="mt-8 pt-4 border-t border-neutral-300 dark:border-neutral-800 hidden lg:block">
        <div className="flex items-center gap-1.5 text-xs text-[#142B4A] dark:text-blue-400 font-bold uppercase tracking-wider mb-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Physical Drop-off Rule</span>
        </div>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Found items reported online must be deposited at the Security Desk (Block 29 Room 102) before <strong>5:00 PM</strong> on the day of discovery.
        </p>
      </div>
    </aside>
  );
};
