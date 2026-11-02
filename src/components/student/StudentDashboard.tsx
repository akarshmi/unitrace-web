import React from 'react';
import { User, Item, Match, NotificationItem } from '../../types';
import { 
  PortalShell, 
  PageHeader, 
  StatGrid, 
  ActionLink, 
  Row,
  Link 
} from '../portal-shell';
import { useRouter } from '../../lib/router';

interface StudentDashboardProps {
  currentUser: User;
  items: Item[];
  matches: Match[];
  notifications: NotificationItem[];
  onNavigate?: (section: any, itemId?: string) => void;
  onOpenItemDetail?: (item: Item) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  items,
  matches,
  notifications,
  onNavigate,
  onOpenItemDetail,
}) => {
  const { navigate } = useRouter();

  const myItems = items.filter(i => i.reporterId === currentUser.id);
  const activeReports = myItems.filter(i => i.status === 'OPEN' || i.status === 'MATCHED').length;
  const awaitingReview = myItems.filter(i => i.status === 'OPEN').length;
  const pendingSubmissions = myItems.filter(
    i => i.type === 'FOUND' && i.submissionStatus === 'PENDING_SUBMISSION'
  ).length;

  const userMatches = matches.filter(m => m.lostItem.reporterId === currentUser.id);
  const approvedMatches = userMatches.filter(m => m.status === 'APPROVED');

  const firstName = currentUser.fullName ? currentUser.fullName.split(' ')[0].toUpperCase() : 'STUDENT';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';
  const pageTitle = `${greeting}, ${firstName}.`;

  const formatStat = (val: number) => {
    if (val === 0) return '—';
    return val < 10 ? `0${val}` : `${val}`;
  };

  const candidateActivities: Array<{
    id: string;
    title: string;
    meta: string;
    badge?: string;
    onClick: () => void;
  }> = [];

  approvedMatches.forEach(m => {
    candidateActivities.push({
      id: `match-${m.id}`,
      title: `Ready for collection · ${m.lostItem.title}`,
      meta: `Security Desk (Room 102) · Key: ${m.oneTimeHandoverKey || 'KEY-PENDING'}`,
      badge: 'APPROVED',
      onClick: () => {
        if (onNavigate) onNavigate('matches');
        else navigate('/app/matches');
      },
    });
  });

  myItems.slice(0, 2).forEach(item => {
    candidateActivities.push({
      id: `item-${item.id}`,
      title: `${item.title} report created`,
      meta: `${item.eventDate || 'Today'} · ${item.type === 'LOST' ? 'Lost item' : 'Found item'} · ${item.location}`,
      badge: item.type,
      onClick: () => {
        if (onOpenItemDetail) onOpenItemDetail(item);
        else navigate(`/app/items/${item.id}`);
      },
    });
  });

  notifications.slice(0, 2).forEach(notif => {
    candidateActivities.push({
      id: `notif-${notif.id}`,
      title: notif.title,
      meta: `${notif.message} · Notification`,
      onClick: () => {
        if (onNavigate) onNavigate('notifications');
        else navigate('/app/notifications');
      },
    });
  });

  // Keep strictly 2 rows so Recent Activity and the "Next Step" aside stay balanced in the same sort
  const displayActivities = candidateActivities.slice(0, 2);
  if (displayActivities.length === 1) {
    displayActivities.push({
      id: 'inbox-clear',
      title: 'No new notifications',
      meta: 'Your inbox is clear',
      onClick: () => navigate('/app/notifications'),
    });
  } else if (displayActivities.length === 0) {
    displayActivities.push(
      {
        id: 'sample-report',
        title: 'Water bottle report created',
        meta: 'Today · Lost item',
        onClick: () => navigate('/app/items'),
      },
      {
        id: 'inbox-clear',
        title: 'No new notifications',
        meta: 'Your inbox is clear',
        onClick: () => navigate('/app/notifications'),
      }
    );
  }

  return (
    <PortalShell>
      <PageHeader
        eyebrow="STUDENT PORTAL / OVERVIEW"
        title={pageTitle}
        copy="Your reports, matches and collection updates in one place."
        action={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <ActionLink href="/app/report/lost" className="w-full sm:w-auto text-center">
              Report lost
            </ActionLink>
            <Link
              href="/app/report/found"
              className="border-2 border-black dark:border-white px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors w-full sm:w-auto text-center"
            >
              Report found
            </Link>
          </div>
        }
      />

      <StatGrid
        stats={[
          [formatStat(activeReports), 'Active reports'],
          [formatStat(awaitingReview), 'Awaiting review'],
          [formatStat(pendingSubmissions), 'Pending submissions'],
          [formatStat(approvedMatches.length), 'Approved matches'],
        ]}
      />

      {/* Balanced 2-Row Section matching the "Next Step" aside height exactly */}
      <section className="grid max-w-6xl gap-0 py-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="label">RECENT ACTIVITY</p>
          <div className="mt-5 divide-y-2 divide-black dark:divide-neutral-800 border-y-2 border-black dark:border-neutral-800">
            {displayActivities.map(activity => (
              <Row
                key={activity.id}
                title={activity.title}
                meta={activity.meta}
                onClick={activity.onClick}
              />
            ))}
          </div>
        </div>

        <aside className="mt-8 lg:mt-0 bg-[var(--surface)] dark:bg-[#111F31] p-6 lg:col-span-4 lg:col-start-10 flex flex-col justify-between">
          <div>
            <p className="label">NEXT STEP</p>
            <h2 className="mt-5 text-2xl font-bold tracking-[-.05em] text-black dark:text-white">
              Have you found something?
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Help return it to its owner by reporting it to the Security Office.
            </p>
          </div>
          <Link
            href="/app/report/found"
            className="mt-7 block border-2 border-black dark:border-white px-4 py-3 text-center text-xs font-bold uppercase tracking-[.1em] text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            Report a found item
          </Link>
        </aside>
      </section>
    </PortalShell>
  );
};
