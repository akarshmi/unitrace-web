import React from 'react';
import { NotificationItem } from '../../types';
import { 
  Bell, 
  CheckCircle, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  Clock,
  ArrowRight
} from 'lucide-react';

interface StudentNotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onNavigateToSection: (section: any) => void;
}

export const StudentNotificationsView: React.FC<StudentNotificationsViewProps> = ({
  notifications,
  onMarkAsRead,
  onNavigateToSection,
}) => {
  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'MATCH_APPROVED':
        return <CheckCircle className="w-4 h-4 text-[var(--navy)] dark:text-blue-400" />;
      case 'MATCH_FOUND':
        return <Sparkles className="w-4 h-4 text-black dark:text-white" />;
      case 'SUBMISSION_RECEIVED':
        return <Clock className="w-4 h-4 text-[var(--navy)] dark:text-blue-400" />;
      case 'HANDOVER_COMPLETED':
        return <ShieldCheck className="w-4 h-4 text-black dark:text-white" />;
      default:
        return <Bell className="w-4 h-4 text-neutral-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-black dark:border-neutral-800 pb-4 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest font-mono-numbers text-neutral-500 mb-1">
            Section // 06
          </div>
          <h1 className="text-3xl font-display text-black dark:text-white uppercase tracking-tight">
            Campus Dispatch &amp; Alerts
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            Official system notifications from AI matching workers and Security Office duty logs.
          </p>
        </div>

        <div className="text-xs font-mono-numbers text-neutral-500">
          Total: {notifications.length} · Unread: {notifications.filter(n => !n.isRead).length}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="border-2 border-neutral-200 dark:border-neutral-800 p-12 text-center bg-white dark:bg-[#0B1422]">
          <Bell className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-black dark:text-white uppercase">
            No Notifications
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            You will be alerted here whenever there is an update to your items or matches.
          </p>
        </div>
      ) : (
        <div className="border-2 border-black dark:border-neutral-800 divide-y-2 divide-black dark:divide-neutral-800 bg-white dark:bg-[#0B1422]">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                notif.isRead 
                  ? 'bg-white dark:bg-[#0B1422]' 
                  : 'bg-[#E8EDF3]/40 dark:bg-blue-950/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 border border-black dark:border-neutral-700 bg-white dark:bg-slate-800 shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono-numbers">
                    <span className="font-bold text-black dark:text-white uppercase">
                      {notif.type.replace(/_/g, ' ')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-neutral-500">{notif.createdAt.slice(0, 10)}</span>
                    {!notif.isRead && (
                      <span className="px-1.5 py-0.2 text-[10px] uppercase font-bold bg-[#142B4A] text-white">
                        NEW
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-black dark:text-white">
                    {notif.title}
                  </h3>

                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-2xl">
                    {notif.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {!notif.isRead && (
                  <button
                    onClick={() => onMarkAsRead(notif.id)}
                    className="px-3 py-1 text-xs border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                  >
                    Mark Read
                  </button>
                )}

                {notif.type === 'MATCH_APPROVED' && (
                  <button
                    onClick={() => onNavigateToSection('matches')}
                    className="px-3 py-1 bg-[#142B4A] hover:bg-[#1D3B63] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View Match</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
