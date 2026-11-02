import React from 'react';
import { User, StudentItem, StudentMatch } from '../../types';
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
  items: StudentItem[];
  matches: StudentMatch[];
  totalItems: number;
  totalMatches: number;
  loading?: boolean;
  error?: string | null;
  onNavigate?: (section: any, itemId?: string) => void;
  onOpenItemDetail?: (item: StudentItem) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  items,
  matches,
  totalItems,
  totalMatches,
  loading = false,
  error = null,
  onNavigate,
  onOpenItemDetail,
}) => {
  const { navigate } = useRouter();

  const approvedMatches = matches.filter(m => m.status === 'APPROVED');

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
      title: `Ready for collection · ${m.otherItem.title}`,
      meta: `Security Desk · ${m.nextStep || 'Follow the instructions sent to you.'}`,
      badge: 'APPROVED',
      onClick: () => {
        if (onNavigate) onNavigate('matches');
        else navigate('/app/matches');
      },
    });
  });

  items.slice(0, 2).forEach(item => {
    candidateActivities.push({
      id: `item-${item.id}`,
      title: `${item.title} report created`,
      meta: `${item.eventFrom || 'Recent'} · ${item.type === 'LOST' ? 'Lost item' : 'Found item'} · ${item.location}`,
      badge: item.type,
      onClick: () => {
        if (onOpenItemDetail) onOpenItemDetail(item);
        else navigate(`/app/items/${item.id}`);
      },
    });
  });

  const displayActivities = candidateActivities.slice(0, 2);

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

      {error && <div className="border-2 border-red-700 p-4 text-xs text-red-700 dark:text-red-300">{error}</div>}
      <StatGrid
        stats={[
          [loading ? '...' : formatStat(totalItems), 'My reports'],
          ['—', 'Awaiting review'],
          ['—', 'Pending submissions'],
          [loading ? '...' : formatStat(totalMatches), 'Visible matches'],
        ]}
      />

      {/* Balanced 2-Row Section matching the "Next Step" aside height exactly */}
      <section className="grid max-w-6xl gap-0 py-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="label">RECENT ACTIVITY</p>
          <div className="mt-5 divide-y-2 divide-black dark:divide-neutral-800 border-y-2 border-black dark:border-neutral-800">
            {displayActivities.length === 0 ? (
              <div className="py-5 text-sm text-[var(--muted)]">No recent student activity available.</div>
            ) : displayActivities.map(activity => (
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
