import React from 'react';
import { User, Item, Match, HandoverLog, ReceptionRecord } from '../../types';
import { DeskStats } from '../../lib/api/desk.api';
import {
  PortalShell,
  PageHeader,
  StatGrid,
  ActionLink,
  Row,
  Link,
} from '../portal-shell';
import { useRouter } from '../../lib/router';

interface DeskDashboardProps {
  stats: DeskStats;
  currentUser: User;
  items: Item[];
  matches: Match[];
  handovers: HandoverLog[];
  receptions: ReceptionRecord[];
  onNavigate: (section: any) => void;
  onOpenMatchModal: (match: Match) => void;
}

export const DeskDashboard: React.FC<DeskDashboardProps> = ({
  stats,
  currentUser,
  items,
  matches,
  handovers,
  onNavigate,
  onOpenMatchModal,
}) => {
  const { navigate } = useRouter();

  const pendingSubmissions = items.filter(
    i => i.type === 'FOUND' && i.submissionStatus === 'PENDING_SUBMISSION'
  );
  const pendingModerations = matches.filter(m => m.status === 'PENDING_REVIEW');
  const approvedCollections = matches.filter(m => m.status === 'APPROVED');

  const officerName = currentUser.fullName
    ? currentUser.fullName.split(' ')[0].toUpperCase()
    : 'OFFICER';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';
  const pageTitle = `${greeting}, ${officerName}.`;

  const formatStat = (val: number) => {
    if (val === 0) return '—';
    return val < 10 ? `0${val}` : `${val}`;
  };

  const candidateActivities: Array<{
    id: string;
    title: string;
    meta: string;
    onClick: () => void;
  }> = [];

  if (pendingSubmissions.length > 0) {
    const firstSub = pendingSubmissions[0];
    candidateActivities.push({
      id: `sub-${firstSub.id}`,
      title: `Intake pending · ${firstSub.title}`,
      meta: `Student ${firstSub.reporterRegNo} · Due today before 5:00 PM · ${firstSub.location}`,
      onClick: () => {
        if (onNavigate) onNavigate('submissions');
        else navigate('/desk/submissions');
      },
    });
  }

  if (pendingModerations.length > 0) {
    const firstMod = pendingModerations[0];
    candidateActivities.push({
      id: `mod-${firstMod.id}`,
      title: `Match candidate review · ${firstMod.lostItem.title}`,
      meta: `${Math.round(firstMod.similarity.finalScore * 100)}% match confidence · ${firstMod.id}`,
      onClick: () => {
        if (onOpenMatchModal) onOpenMatchModal(firstMod);
        else navigate(`/desk/matches/${firstMod.id}`);
      },
    });
  }

  if (approvedCollections.length > 0 && candidateActivities.length < 2) {
    const firstAppr = approvedCollections[0];
    candidateActivities.push({
      id: `appr-${firstAppr.id}`,
      title: `Ready for collection · ${firstAppr.lostItem.title}`,
      meta: `Student ID: ${firstAppr.lostItem.reporterRegNo} · Locker ${firstAppr.foundItem.deskNotes || 'Vault B-04'}`,
      onClick: () => {
        if (onNavigate) onNavigate('handovers');
        else navigate('/desk/handovers');
      },
    });
  }

  const displayActivities = candidateActivities.slice(0, 2);

  return (
    <PortalShell>
      <PageHeader
        eyebrow={`CAMPUS SECURITY DESK / OFFICER ${currentUser.registrationNumber}`}
        title={pageTitle}
        copy="Physical intake custody, automated match moderation, and property release."
        action={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <ActionLink href="/desk/submissions" className="w-full sm:w-auto text-center">
              Physical Intake
            </ActionLink>
            <Link
              href="/desk/handovers"
              className="border-2 border-black dark:border-white px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors w-full sm:w-auto text-center"
            >
              Handover Terminal
            </Link>
          </div>
        }
      />

      <StatGrid
        stats={[
          [formatStat(stats.totalReports), 'Master reports'],
          [formatStat(stats.pendingPhysicalSubmissions), 'Pending intake'],
          [formatStat(stats.pendingAiMatches), 'Review queue'],
          [formatStat(stats.pendingHandovers), 'Ready release'],
        ]}
      />

      {/* Balanced 2-Row Section matching the "Next Step" aside height exactly */}
      <section className="grid max-w-6xl gap-0 py-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="label">URGENT DESK QUEUE</p>
          <div className="mt-5 divide-y-2 divide-black dark:divide-neutral-800 border-y-2 border-black dark:border-neutral-800">
            {displayActivities.length === 0 ? (
              <div className="py-5 text-sm text-[var(--muted)]">
                All physical drop-offs checked in and moderation queue is clear.
              </div>
            ) : (
              displayActivities.map(activity => (
                <Row
                  key={activity.id}
                  title={activity.title}
                  meta={activity.meta}
                  onClick={activity.onClick}
                />
              ))
            )}
          </div>
        </div>

        <aside className="mt-8 lg:mt-0 bg-[var(--surface)] dark:bg-[#111F31] p-6 lg:col-span-4 lg:col-start-10 flex flex-col justify-between">
          <div>
            <p className="label">NEXT STEP</p>
            <h2 className="mt-5 text-2xl font-bold tracking-[-.05em] text-black dark:text-white">
              Student at counter?
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Verify their registration number and single-use key to release custody.
            </p>
          </div>
          <Link
            href="/desk/handovers"
            className="mt-7 block border-2 border-black dark:border-white px-4 py-3 text-center text-xs font-bold uppercase tracking-[.1em] text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            Open Handover Terminal
          </Link>
        </aside>
      </section>

      {/* Clean Recent Custody Releases Table */}
      {handovers.length > 0 && (
        <section className="pt-2">
          <div className="flex items-center justify-between pb-3">
            <p className="label">RECENT CUSTODY RELEASES</p>
            <Link href="/desk/handovers" className="text-xs font-bold uppercase tracking-[.12em] hover:underline">
              View all ({handovers.length}) →
            </Link>
          </div>
          <div className="overflow-x-auto border-2 border-black dark:border-neutral-800">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-black text-xs uppercase tracking-[.1em] text-white">
                <tr>
                  <th className="p-3.5">Log ID</th>
                  <th className="p-3.5">Item</th>
                  <th className="p-3.5">Claimant Reg</th>
                  <th className="p-3.5">Key Used</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black dark:divide-neutral-800 bg-white dark:bg-[#0B1422]">
                {handovers.slice(0, 3).map((h) => (
                  <tr key={h.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 font-mono-numbers text-xs">
                    <td className="p-3.5 font-bold">{h.id}</td>
                    <td className="p-3.5 font-sans font-bold text-black dark:text-white">{h.itemTitle}</td>
                    <td className="p-3.5">{h.claimantRegNo}</td>
                    <td className="p-3.5 font-bold">{h.handoverKeyUsed}</td>
                    <td className="p-3.5">
                      <span className="border border-black dark:border-white px-2 py-0.5 text-[10px] font-bold uppercase">
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </PortalShell>
  );
};
