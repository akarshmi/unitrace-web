/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useRouter, RouterProvider } from './lib/router';
import { User, Item, Match, NotificationItem, ReceptionRecord, HandoverLog } from './types';
import { UniTraceStorage } from './lib/storage';
import { authApi } from './lib/api/auth.api';
import { deskApi, DeskStats } from './lib/api/desk.api';
import { notificationsApi } from './lib/api/notifications.api';

// Pages
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { VerifyEmailPage } from './components/auth/VerifyEmailPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './components/auth/ResetPasswordPage';
import { UnauthorizedPage } from './components/auth/UnauthorizedPage';

// Layout & UI
import { AppHeader } from './components/layout/AppHeader';
import { AppDock } from './components/layout/AppDock';
import { MobileNavBar } from './components/layout/MobileNavBar';
import { StudentNav } from './components/layout/StudentNav';
import { DeskNav } from './components/layout/DeskNav';
import { Breadcrumbs } from './components/layout/Breadcrumbs';

// Student Portal Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { ReportItemForm } from './components/student/ReportItemForm';
import { MyItemsView } from './components/student/MyItemsView';
import { ItemDetailPage } from './components/student/ItemDetailPage';
import { StudentMatchesView } from './components/student/StudentMatchesView';
import { StudentNotificationsView } from './components/student/StudentNotificationsView';
import { StudentProfileView } from './components/student/StudentProfileView';

// Desk Portal Views
import { DeskDashboard } from './components/desk/DeskDashboard';
import { DeskItemManagement } from './components/desk/DeskItemManagement';
import { PhysicalReceptionModule } from './components/desk/PhysicalReceptionModule';
import { MatchModerationQueue } from './components/desk/MatchModerationQueue';
import { MatchDetailPage } from './components/desk/MatchDetailPage';
import { HandoverVerificationTerminal } from './components/desk/HandoverVerificationTerminal';
import { HandoverDetailPage } from './components/desk/HandoverDetailPage';
import { StudentLookupModule } from './components/desk/StudentLookupModule';

function AppContent() {
  const { path, navigate, params } = useRouter();

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Authenticated User (null if logged out)
  const [currentUser, setCurrentUser] = useState<User | null>(() => UniTraceStorage.getCurrentUser());

  // Application Data States
  const [items, setItems] = useState<Item[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [receptions, setReceptions] = useState<ReceptionRecord[]>([]);
  const [handovers, setHandovers] = useState<HandoverLog[]>([]);
  const [deskStats, setDeskStats] = useState<DeskStats>({
    totalReports: 0,
    pendingPhysicalSubmissions: 0,
    receivedItems: 0,
    pendingAiMatches: 0,
    approvedMatches: 0,
    pendingHandovers: 0,
    completedHandovers: 0,
    todaySubmissions: 0,
  });

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load all data
  const refreshAllData = async () => {
    const loadedItems = UniTraceStorage.getItems();
    const loadedMatches = UniTraceStorage.getMatches();
    const loadedNotifs = currentUser ? UniTraceStorage.getNotifications(currentUser.id) : [];
    const loadedReceptions = UniTraceStorage.getReceptions();
    const loadedHandovers = UniTraceStorage.getHandoverLogs();
    const stats = await deskApi.getDeskStats();

    setItems(loadedItems);
    setMatches(loadedMatches);
    setNotifications(loadedNotifs);
    setReceptions(loadedReceptions);
    setHandovers(loadedHandovers);
    setDeskStats(stats);
  };

  useEffect(() => {
    refreshAllData();
  }, [currentUser]);

  const handleUserChanged = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'STUDENT' && path.startsWith('/desk')) {
      navigate('/app');
    } else if ((user.role === 'MODERATOR' || user.role === 'ADMIN') && path === '/app') {
      navigate('/desk');
    }
  };

  const handleApproveMatch = async (matchId: string, remarks: string) => {
    if (!currentUser) return;
    await deskApi.approveMatch(matchId, remarks, currentUser);
    refreshAllData();
  };

  const handleRejectMatch = async (matchId: string, remarks: string) => {
    if (!currentUser) return;
    await deskApi.rejectMatch(matchId, remarks, currentUser);
    refreshAllData();
  };

  const handleMarkNotificationRead = async (id: string) => {
    await notificationsApi.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleLogout = () => {
    authApi.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  const unreadNotifs = notifications.filter(n => !n.isRead).length;
  const pendingDeskIntake = items.filter(
    i => i.type === 'FOUND' && i.submissionStatus === 'PENDING_SUBMISSION'
  ).length;
  const pendingModerations = matches.filter(m => m.status === 'PENDING_REVIEW').length;
  const pendingHandoversCount = matches.filter(m => m.status === 'APPROVED').length;

  // ROUTE BRANCHING

  // 1. Landing Page
  if (path === '/') {
    return (
      <LandingPage
        onNavigateToLogin={() => navigate('/login')}
        onNavigateToRegister={() => navigate('/register')}
        onNavigateToDashboard={() => navigate(currentUser?.role === 'STUDENT' ? '/app' : '/desk')}
        isLoggedIn={Boolean(currentUser)}
        userRole={currentUser?.role}
      />
    );
  }

  // 2. Auth Pages
  if (path === '/login') {
    return (
      <LoginPage
        onSuccess={(user) => {
          handleUserChanged(user);
          navigate(user.role === 'STUDENT' ? '/app' : '/desk');
        }}
        onNavigateToRegister={() => navigate('/register')}
        onNavigateToLanding={() => navigate('/')}
      />
    );
  }

  if (path === '/register') {
    return (
      <RegisterPage
        onSuccess={(user) => {
          handleUserChanged(user);
          navigate('/app');
        }}
        onNavigateToLogin={() => navigate('/login')}
        onNavigateToLanding={() => navigate('/')}
      />
    );
  }

  if (path === '/verify-email') {
    return (
      <VerifyEmailPage
        onSuccess={(user) => {
          handleUserChanged(user);
          navigate('/app');
        }}
      />
    );
  }

  if (path === '/forgot-password') {
    return <ForgotPasswordPage />;
  }

  if (path === '/reset-password') {
    return <ResetPasswordPage />;
  }

  if (path === '/unauthorized') {
    return <UnauthorizedPage />;
  }

  // 3. Security Route Guard: Require authentication for /app or /desk
  if (!currentUser) {
    return (
      <LoginPage
        onSuccess={(user) => {
          handleUserChanged(user);
          navigate(user.role === 'STUDENT' ? '/app' : '/desk');
        }}
        onNavigateToRegister={() => navigate('/register')}
        onNavigateToLanding={() => navigate('/')}
      />
    );
  }

  // Security Route Guard: Student cannot enter /desk routes
  if (path.startsWith('/desk') && currentUser.role === 'STUDENT') {
    return <UnauthorizedPage />;
  }

  // Determine active portal from route
  const isDesk = path.startsWith('/desk');
  const activePortal = isDesk ? 'desk' : 'student';

  // 4. Portal Views (Student or Desk) in 12-Column Layout
  return (
    <div className="min-h-screen bg-[var(--ground)] text-[var(--ink)] flex flex-col font-sans selection:bg-[var(--navy)] selection:text-white">
      
      <AppHeader
        currentUser={currentUser}
        activePortal={activePortal}
        currentPath={path}
        onSwitchPortal={(portal) => {
          if (portal === 'desk' && currentUser.role === 'STUDENT') {
            navigate('/unauthorized');
          } else {
            navigate(portal === 'desk' ? '/desk' : '/app');
          }
        }}
        onNavigateToLanding={() => navigate('/')}
        onNavigateToLogin={() => navigate('/login')}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        unreadCount={unreadNotifs}
      />

      {activePortal === 'student' ? (
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-14 py-6 sm:py-8 pb-28 md:pb-28 min-w-0">
          {path === '/app' && (
            <StudentDashboard
              currentUser={currentUser}
              items={items}
              matches={matches}
              notifications={notifications}
              onNavigate={(sec) => {
                if (sec === 'report-lost') navigate('/app/report/lost');
                else if (sec === 'report-found') navigate('/app/report/found');
                else if (sec === 'items') navigate('/app/items');
                else if (sec === 'matches') navigate('/app/matches');
                else if (sec === 'notifications') navigate('/app/notifications');
                else if (sec === 'profile') navigate('/app/profile');
              }}
              onOpenItemDetail={(item) => navigate(`/app/items/${item.id}`)}
            />
          )}

          {path === '/app/report/lost' && (
            <ReportItemForm
              type="LOST"
              onSuccess={() => {
                refreshAllData();
                navigate('/app/items');
              }}
              onCancel={() => navigate('/app')}
            />
          )}

          {path === '/app/report/found' && (
            <ReportItemForm
              type="FOUND"
              onSuccess={() => {
                refreshAllData();
                navigate('/app/items');
              }}
              onCancel={() => navigate('/app')}
            />
          )}

          {path === '/app/items' && (
            <MyItemsView
              items={items}
              studentId={currentUser.id}
              onSelectItem={(item) => navigate(`/app/items/${item.id}`)}
              onNavigateToReport={(type) => navigate(type === 'LOST' ? '/app/report/lost' : '/app/report/found')}
            />
          )}

          {path.startsWith('/app/items/') && (
            <ItemDetailPage
              item={items.find(i => i.id === params.id) || null}
              match={matches.find(m => m.lostItemId === params.id || m.foundItemId === params.id) || null}
            />
          )}

          {path === '/app/matches' && (
            <StudentMatchesView
              matches={matches}
              studentId={currentUser.id}
              onOpenMatchDetail={(m) => navigate(`/app/items/${m.lostItemId}`)}
            />
          )}

          {path === '/app/notifications' && (
            <StudentNotificationsView
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationRead}
              onNavigateToSection={(sec) => {
                if (sec === 'matches') navigate('/app/matches');
                else navigate('/app');
              }}
            />
          )}

          {path === '/app/profile' && (
            <StudentProfileView
              user={currentUser}
              onLogout={handleLogout}
            />
          )}
        </main>
      ) : (
        <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col lg:grid lg:grid-cols-12">
          <div className="lg:col-span-3">
            <DeskNav
              currentPath={path}
              pendingSubmissionsCount={pendingDeskIntake}
              pendingMatchesCount={pendingModerations}
              pendingHandoversCount={pendingHandoversCount}
            />
          </div>

          <main className="lg:col-span-9 p-4 sm:p-6 lg:p-10 min-w-0">
            {path === '/desk' && (
              <DeskDashboard
                stats={deskStats}
                currentUser={currentUser}
                items={items}
                matches={matches}
                handovers={handovers}
                receptions={receptions}
                onNavigate={(sec) => {
                  if (sec === 'submissions') navigate('/desk/submissions');
                  else if (sec === 'matches') navigate('/desk/matches');
                  else if (sec === 'handovers') navigate('/desk/handovers');
                  else if (sec === 'items') navigate('/desk/items');
                  else if (sec === 'students') navigate('/desk/students');
                }}
                onOpenMatchModal={(m) => navigate(`/desk/matches/${m.id}`)}
              />
            )}

            {path === '/desk/items' && (
              <DeskItemManagement
                items={items}
                onSelectItem={(item) => navigate(`/app/items/${item.id}`)}
                onInitiateReception={() => navigate('/desk/submissions')}
              />
            )}

            {path === '/desk/submissions' && (
              <PhysicalReceptionModule
                items={items}
                receptions={receptions}
                officer={currentUser}
                onRefreshData={refreshAllData}
              />
            )}

            {path === '/desk/matches' && (
              <MatchModerationQueue
                matches={matches}
                currentUser={currentUser}
                onOpenMatchModal={(m) => navigate(`/desk/matches/${m.id}`)}
                onRefreshData={refreshAllData}
              />
            )}

            {path.startsWith('/desk/matches/') && (
              <MatchDetailPage
                match={matches.find(m => m.id === params.id) || null}
                currentUser={currentUser}
                onApprove={handleApproveMatch}
                onReject={handleRejectMatch}
              />
            )}

            {path === '/desk/handovers' && (
              <HandoverVerificationTerminal
                matches={matches}
                officer={currentUser}
                onRefreshData={refreshAllData}
              />
            )}

            {path.startsWith('/desk/handovers/') && (
              <HandoverDetailPage
                match={matches.find(m => m.id === params.id) || null}
                officer={currentUser}
                onRefreshData={refreshAllData}
              />
            )}

            {path === '/desk/students' && (
              <StudentLookupModule />
            )}
          </main>
        </div>
      )}

      {currentUser && (
        <>
          <div className="hidden md:block">
            <AppDock
              currentUser={currentUser}
              activePortal={activePortal}
              currentPath={path}
              unreadCount={unreadNotifs}
              pendingMatchesCount={matches.filter(m => m.lostItem.reporterId === currentUser.id && m.status === 'APPROVED').length}
              myItemsCount={items.filter(i => i.reporterId === currentUser.id).length}
              isDarkMode={isDarkMode}
              onToggleTheme={() => setIsDarkMode(!isDarkMode)}
            />
          </div>
          <MobileNavBar
            currentUser={currentUser}
            activePortal={activePortal}
            currentPath={path}
            unreadCount={unreadNotifs}
          />
        </>
      )}

    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
