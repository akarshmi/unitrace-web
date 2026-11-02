import React from 'react';
import { useRouter } from '../../lib/router';
import Dock, { DockItemData } from '../ui/Dock';
import { 
  LayoutDashboard, 
  Layers, 
  Search, 
  PlusSquare, 
  Sparkles, 
  Bell, 
  Sun, 
  Moon, 
  Shield 
} from 'lucide-react';
import { User } from '../../types';

interface AppDockProps {
  currentUser: User | null;
  activePortal: 'student' | 'desk';
  currentPath: string;
  unreadCount?: number;
  pendingMatchesCount?: number;
  myItemsCount?: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const AppDock: React.FC<AppDockProps> = ({
  currentUser,
  activePortal,
  currentPath,
  unreadCount = 0,
  pendingMatchesCount = 0,
  myItemsCount = 0,
  isDarkMode,
  onToggleTheme,
}) => {
  const { navigate } = useRouter();

  if (!currentUser) return null;

  const isStaff = currentUser.role === 'MODERATOR' || currentUser.role === 'ADMIN';

  const items: DockItemData[] = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'Overview',
      active: currentPath === '/app',
      onClick: () => navigate('/app'),
      menu: [
        { label: 'Student Dashboard', onClick: () => navigate('/app') },
        { separator: true },
        { label: 'View Profile', onClick: () => navigate('/app/profile') },
      ],
    },
    {
      icon: <Layers className="w-5 h-5" />,
      label: 'My Items',
      active: currentPath === '/app/items' || currentPath.startsWith('/app/items/'),
      badge: myItemsCount > 0 ? myItemsCount : undefined,
      onClick: () => navigate('/app/items'),
      menu: [
        { label: 'All Items', onClick: () => navigate('/app/items') },
        { separator: true },
        { label: 'Report Lost Item', onClick: () => navigate('/app/report/lost') },
        { label: 'Report Found Item', onClick: () => navigate('/app/report/found') },
      ],
    },
    {
      icon: <Search className="w-5 h-5" />,
      label: 'Report Lost',
      active: currentPath === '/app/report/lost',
      onClick: () => navigate('/app/report/lost'),
    },
    {
      icon: <PlusSquare className="w-5 h-5" />,
      label: 'Report Found',
      active: currentPath === '/app/report/found',
      onClick: () => navigate('/app/report/found'),
    },
    { separator: true },
    {
      icon: <Sparkles className="w-5 h-5" />,
      label: 'Matches',
      active: currentPath === '/app/matches',
      badge: pendingMatchesCount > 0 ? pendingMatchesCount : undefined,
      onClick: () => navigate('/app/matches'),
    },
    {
      icon: <Bell className="w-5 h-5" />,
      label: 'Alerts',
      active: currentPath === '/app/notifications',
      badge: unreadCount > 0 ? unreadCount : undefined,
      onClick: () => navigate('/app/notifications'),
    },
    { separator: true },
    {
      icon: isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />,
      label: isDarkMode ? 'Light Mode' : 'Dark Mode',
      onClick: onToggleTheme,
    },
    ...(isStaff ? [
      { separator: true },
      {
        icon: <Shield className="w-5 h-5" />,
        label: activePortal === 'desk' ? 'Student View' : 'Desk Terminal',
        active: activePortal === 'desk',
        onClick: () => navigate(activePortal === 'desk' ? '/app' : '/desk'),
      }
    ] : [])
  ];

  return (
    <Dock
      items={items}
      position="bottom"
      theme={isDarkMode ? 'dark' : 'light'}
      baseItemSize={44}
      magnification={64}
      distance={160}
      panelHeight={60}
      gap={6}
      roundness={0.08}
      tiles={true}
      bounce={true}
      showBadges={true}
      showLabels={true}
      showIndicators={true}
      badgeColor={isDarkMode ? '#ffffff' : '#000000'}
      accentColor={isDarkMode ? '#ffffff' : '#000000'}
    />
  );
};
