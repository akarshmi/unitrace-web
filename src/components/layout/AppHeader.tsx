import React, { useState } from 'react';
import { User } from '../../types';
import { Shield, GraduationCap, Moon, Sun, Home, LogOut, Menu, X, PlusSquare, Search, Sparkles, Bell, Layers, LayoutDashboard } from 'lucide-react';
import { Link, useRouter } from '../../lib/router';

interface AppHeaderProps {
  currentUser: User | null;
  activePortal: 'student' | 'desk';
  currentPath?: string;
  onSwitchPortal: (portal: 'student' | 'desk') => void;
  onNavigateToLanding: () => void;
  onNavigateToLogin: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  unreadCount?: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentUser,
  activePortal,
  currentPath = '',
  onSwitchPortal,
  onNavigateToLanding,
  onNavigateToLogin,
  onLogout,
  isDarkMode,
  onToggleTheme,
  unreadCount = 0,
}) => {
  const { navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNav = (to: string) => {
    setMobileMenuOpen(false);
    navigate(to);
  };

  return (
    <header className="border-b-2 border-black dark:border-neutral-800 bg-white dark:bg-[#0B1422] sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-14 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={onNavigateToLanding}
            className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer"
            title="Return to UniTrace Home"
          >
            <span className="flex size-8 sm:size-9 items-center justify-center bg-black dark:bg-white text-xs sm:text-sm font-bold text-white dark:text-black font-mono-numbers">
              UT
            </span>
            <span className="text-base sm:text-lg font-bold tracking-[-0.04em] text-black dark:text-white">
              UNITRACE
            </span>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        {currentUser && (
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-[0.12em]">
            {activePortal === 'student' ? (
              <>
                <Link
                  href="/app"
                  className={`py-1 border-b-2 transition-colors ${
                    currentPath === '/app'
                      ? 'border-black dark:border-white text-black dark:text-white'
                      : 'border-transparent text-[var(--muted)] hover:text-black dark:hover:text-white'
                  }`}
                >
                  Overview
                </Link>
                <Link
                  href="/app/items"
                  className={`py-1 border-b-2 transition-colors ${
                    currentPath === '/app/items' || currentPath.startsWith('/app/items/')
                      ? 'border-black dark:border-white text-black dark:text-white'
                      : 'border-transparent text-[var(--muted)] hover:text-black dark:hover:text-white'
                  }`}
                >
                  My Items
                </Link>
                <Link
                  href="/app/matches"
                  className={`py-1 border-b-2 transition-colors ${
                    currentPath === '/app/matches'
                      ? 'border-black dark:border-white text-black dark:text-white'
                      : 'border-transparent text-[var(--muted)] hover:text-black dark:hover:text-white'
                  }`}
                >
                  Matches
                </Link>
                <Link
                  href="/app/notifications"
                  className={`py-1 border-b-2 transition-colors flex items-center gap-1.5 ${
                    currentPath === '/app/notifications'
                      ? 'border-black dark:border-white text-black dark:text-white'
                      : 'border-transparent text-[var(--muted)] hover:text-black dark:hover:text-white'
                  }`}
                >
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-black text-white dark:bg-white dark:text-black px-1.5 py-0.2 text-[10px] font-mono-numbers">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                {(currentUser.role === 'MODERATOR' || currentUser.role === 'ADMIN') && (
                  <button
                    onClick={() => onSwitchPortal('desk')}
                    className="py-1 border-b-2 border-transparent text-[var(--muted)] hover:text-black dark:hover:text-white cursor-pointer font-bold"
                  >
                    Security Desk →
                  </button>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/desk"
                  className={`py-1 border-b-2 transition-colors ${
                    currentPath === '/desk'
                      ? 'border-black dark:border-white text-black dark:text-white'
                      : 'border-transparent text-[var(--muted)] hover:text-black dark:hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/desk/submissions"
                  className={`py-1 border-b-2 transition-colors ${
                    currentPath === '/desk/submissions'
                      ? 'border-black dark:border-white text-black dark:text-white'
                      : 'border-transparent text-[var(--muted)] hover:text-black dark:hover:text-white'
                  }`}
                >
                  Submissions
                </Link>
                <Link
                  href="/desk/matches"
                  className={`py-1 border-b-2 transition-colors ${
                    currentPath === '/desk/matches'
                      ? 'border-black dark:border-white text-black dark:text-white'
                      : 'border-transparent text-[var(--muted)] hover:text-black dark:hover:text-white'
                  }`}
                >
                  Moderation
                </Link>
                <Link
                  href="/desk/handovers"
                  className={`py-1 border-b-2 transition-colors ${
                    currentPath === '/desk/handovers'
                      ? 'border-black dark:border-white text-black dark:text-white'
                      : 'border-transparent text-[var(--muted)] hover:text-black dark:hover:text-white'
                  }`}
                >
                  Handovers
                </Link>
                <button
                  onClick={() => onSwitchPortal('student')}
                  className="py-1 border-b-2 border-transparent text-[var(--muted)] hover:text-black dark:hover:text-white cursor-pointer"
                >
                  ← Student Portal
                </button>
              </>
            )}
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onNavigateToLanding}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border-2 border-black dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-slate-800 text-xs font-bold uppercase tracking-[0.12em] text-black dark:text-white transition-colors cursor-pointer"
            title="Public Homepage"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2 border-2 border-black dark:border-neutral-700 text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {currentUser ? (
            <div className="hidden sm:flex items-center border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2 px-3 py-1.5">
                <div className="w-6 h-6 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xs">
                  {currentUser.role === 'STUDENT' ? (
                    <GraduationCap className="w-3.5 h-3.5" />
                  ) : (
                    <Shield className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="text-xs leading-none">
                  <div className="font-bold text-black dark:text-white truncate max-w-[110px]">
                    {currentUser.fullName}
                  </div>
                  <div className="font-mono-numbers text-[10px] text-[var(--muted)] mt-0.5">
                    {currentUser.registrationNumber}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="px-2.5 py-1.5 border-l-2 border-black dark:border-neutral-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold uppercase"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[10px]">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onNavigateToLogin}
              className="px-3.5 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-[0.12em] transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Hamburger Button */}
          {currentUser && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border-2 border-black dark:border-white text-black dark:text-white md:hidden cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>

      </div>

      {/* Mobile Slide-Down Drawer */}
      {currentUser && mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black dark:border-neutral-800 bg-white dark:bg-[#0B1422] shadow-xl animate-in slide-in-from-top-2 duration-150">
          {/* User info bar */}
          <div className="p-4 bg-[var(--surface)] dark:bg-neutral-900 border-b-2 border-black dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xs">
                {currentUser.role === 'STUDENT' ? <GraduationCap className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
              </div>
              <div>
                <p className="font-bold text-sm text-black dark:text-white">{currentUser.fullName}</p>
                <p className="text-xs text-[var(--muted)] font-mono-numbers">{currentUser.registrationNumber} · {currentUser.email}</p>
              </div>
            </div>
            <span className="text-[10px] font-mono-numbers px-2 py-0.5 border border-black dark:border-neutral-700 bg-white dark:bg-black font-bold uppercase">
              {activePortal === 'student' ? 'Student' : 'Desk'}
            </span>
          </div>

          {/* Navigation Links */}
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800 text-sm font-bold uppercase tracking-wider">
            {activePortal === 'student' ? (
              <>
                <button
                  onClick={() => handleMobileNav('/app')}
                  className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                    currentPath === '/app' ? 'bg-neutral-100 dark:bg-neutral-800' : ''
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Overview</span>
                  </span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => handleMobileNav('/app/items')}
                  className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                    currentPath === '/app/items' ? 'bg-neutral-100 dark:bg-neutral-800' : ''
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Layers className="w-4 h-4" />
                    <span>My Items</span>
                  </span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => handleMobileNav('/app/report/lost')}
                  className="w-full p-4 flex items-center justify-between text-left transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <Search className="w-4 h-4" />
                    <span>Report Lost Item</span>
                  </span>
                  <span>+</span>
                </button>

                <button
                  onClick={() => handleMobileNav('/app/report/found')}
                  className="w-full p-4 flex items-center justify-between text-left transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <PlusSquare className="w-4 h-4" />
                    <span>Report Found Item</span>
                  </span>
                  <span>+</span>
                </button>

                <button
                  onClick={() => handleMobileNav('/app/matches')}
                  className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                    currentPath === '/app/matches' ? 'bg-neutral-100 dark:bg-neutral-800' : ''
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4" />
                    <span>Verified Matches</span>
                  </span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => handleMobileNav('/app/notifications')}
                  className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                    currentPath === '/app/notifications' ? 'bg-neutral-100 dark:bg-neutral-800' : ''
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </span>
                  {unreadCount > 0 && (
                    <span className="bg-black text-white dark:bg-white dark:text-black px-1.5 py-0.5 text-xs font-mono-numbers font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {(currentUser.role === 'MODERATOR' || currentUser.role === 'ADMIN') && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSwitchPortal('desk');
                    }}
                    className="w-full p-4 flex items-center justify-between text-left bg-black text-white dark:bg-white dark:text-black font-bold"
                  >
                    <span>Switch to Security Desk</span>
                    <span>→</span>
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => handleMobileNav('/desk')}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <span>Desk Dashboard</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => handleMobileNav('/desk/submissions')}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <span>Submissions Intake</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => handleMobileNav('/desk/matches')}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <span>Match Moderation</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => handleMobileNav('/desk/handovers')}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <span>Handover Terminal</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSwitchPortal('student');
                  }}
                  className="w-full p-4 flex items-center justify-between text-left bg-black text-white dark:bg-white dark:text-black font-bold"
                >
                  <span>← Return to Student Portal</span>
                </button>
              </>
            )}
          </div>

          {/* Quick Actions Footer */}
          <div className="p-4 border-t-2 border-black dark:border-neutral-800 flex items-center justify-between gap-3">
            <button
              onClick={() => handleMobileNav('/')}
              className="flex-1 py-2.5 border-2 border-black dark:border-white text-xs font-bold uppercase tracking-wider text-center"
            >
              Public Home
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="flex-1 py-2.5 bg-black text-white dark:bg-white dark:text-black text-xs font-bold uppercase tracking-wider text-center"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
