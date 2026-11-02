import React from 'react';
import { useRouter } from '../../lib/router';
import { 
  LayoutDashboard, 
  Layers, 
  PlusSquare, 
  Sparkles, 
  Bell,
  CheckCircle,
  FileText
} from 'lucide-react';
import { User } from '../../types';

interface MobileNavBarProps {
  currentUser: User | null;
  activePortal: 'student' | 'desk';
  currentPath: string;
  unreadCount?: number;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  active: boolean;
  isCenter?: boolean;
  badge?: number;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  currentUser,
  activePortal,
  currentPath,
  unreadCount = 0,
}) => {
  const { navigate } = useRouter();

  if (!currentUser) {
    return null;
  }

  const isStudent = activePortal === 'student';

  const studentNavItems: NavItem[] = [
    {
      label: 'Overview',
      path: '/app',
      icon: <LayoutDashboard className="w-5 h-5" />,
      active: currentPath === '/app',
    },
    {
      label: 'My Items',
      path: '/app/items',
      icon: <Layers className="w-5 h-5" />,
      active: currentPath === '/app/items' || currentPath.startsWith('/app/items/'),
    },
    {
      label: 'Report',
      path: '/app/report/lost',
      icon: <PlusSquare className="w-5 h-5" />,
      active: currentPath.startsWith('/app/report'),
      isCenter: true,
    },
    {
      label: 'Matches',
      path: '/app/matches',
      icon: <Sparkles className="w-5 h-5" />,
      active: currentPath === '/app/matches',
    },
    {
      label: 'Alerts',
      path: '/app/notifications',
      icon: <Bell className="w-5 h-5" />,
      active: currentPath === '/app/notifications',
      badge: unreadCount,
    },
  ];

  const deskNavItems: NavItem[] = [
    {
      label: 'Desk',
      path: '/desk',
      icon: <LayoutDashboard className="w-5 h-5" />,
      active: currentPath === '/desk',
    },
    {
      label: 'Intake',
      path: '/desk/submissions',
      icon: <PlusSquare className="w-5 h-5" />,
      active: currentPath === '/desk/submissions',
    },
    {
      label: 'Matches',
      path: '/desk/matches',
      icon: <Sparkles className="w-5 h-5" />,
      active: currentPath === '/desk/matches',
    },
    {
      label: 'Handover',
      path: '/desk/handovers',
      icon: <CheckCircle className="w-5 h-5" />,
      active: currentPath === '/desk/handovers',
    },
    {
      label: 'Records',
      path: '/desk/items',
      icon: <FileText className="w-5 h-5" />,
      active: currentPath === '/desk/items',
    },
  ];

  const items: NavItem[] = isStudent ? studentNavItems : deskNavItems;

  return (
    <nav 
      aria-label="Mobile navigation" 
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-[#0B1422] border-t-2 border-black dark:border-neutral-800 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1"
    >
      <div className="grid grid-cols-5 items-center justify-around h-14 px-1">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center h-full w-full relative transition-colors cursor-pointer select-none active:scale-95 ${
              item.active 
                ? 'text-black dark:text-white font-bold' 
                : 'text-[var(--muted)] hover:text-black dark:hover:text-white'
            }`}
          >
            {item.isCenter ? (
              <div className="flex flex-col items-center">
                <div className={`p-1.5 border-2 ${
                  item.active 
                    ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' 
                    : 'border-black dark:border-neutral-700 bg-[var(--surface)] text-black dark:bg-neutral-800 dark:text-white'
                }`}>
                  {item.icon}
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5 font-mono-numbers">
                  {item.label}
                </span>
              </div>
            ) : (
              <>
                <div className="relative">
                  {item.icon}
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1 -right-2 bg-black text-white dark:bg-white dark:text-black text-[9px] font-mono-numbers font-bold px-1 border border-white dark:border-black leading-none py-0.5">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <span className={`text-[10px] uppercase tracking-wider mt-1 font-mono-numbers ${
                  item.active ? 'font-extrabold underline decoration-2 underline-offset-2' : 'font-medium'
                }`}>
                  {item.label}
                </span>
              </>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};
