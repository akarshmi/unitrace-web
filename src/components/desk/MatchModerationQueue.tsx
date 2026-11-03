import React, { useEffect, useState } from 'react';
import { DeskMatch } from '../../lib/api/adapters';
import { BackendDeskItemView, BackendMatchStatus } from '../../lib/api/backend.types';
import { deskApi } from '../../lib/api/desk.api';
import { PageHeader, PortalShell, ActionLink, Link } from '../portal-shell';

interface MatchModerationQueueProps {
  onOpenMatchModal: (matchId: string) => void;
}

const STATUSES: BackendMatchStatus[] = ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'EXPIRED'];

export const MatchModerationQueue: React.FC<MatchModerationQueueProps> = ({
  onOpenMatchModal,
}) => {
  const [statusFilter, setStatusFilter] = useState<BackendMatchStatus>('PENDING');
  const [matches, setMatches] = useState<DeskMatch[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    deskApi.getMatches(statusFilter, page)
      .then(result => {
        if (!active) return;
        setMatches(result.content);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      })
      .catch(reason => {
        if (active) setError(reason instanceof Error ? reason.message : 'Unable to load the moderation queue.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [statusFilter, page]);

  const selectStatus = (status: BackendMatchStatus) => {
    setStatusFilter(status);
    setPage(0);
  };

  return (
    <PortalShell>
      <PageHeader
        eyebrow="CAMPUS SECURITY DESK / MODERATION"
        title="MATCH QUEUE."
        copy="Review candidate pairs surfaced by AI matching before authorizing one-time collection keys."
        action={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <ActionLink href="/desk/handovers" className="w-full sm:w-auto text-center">Handover Terminal</ActionLink>
            <Link href="/desk/items" className="border-2 border-black dark:border-white px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors w-full sm:w-auto text-center">
              Master Ledger
            </Link>
          </div>
        }
      />

      <div className="py-4 sm:py-6 space-y-6">
        <div className="flex gap-4 sm:gap-6 border-b-2 border-black dark:border-neutral-800 overflow-x-auto whitespace-nowrap -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          {STATUSES.map(status => (
            <button
              key={status}
              onClick={() => selectStatus(status)}
              className={`pb-3 sm:pb-4 text-xs font-bold uppercase tracking-[.12em] cursor-pointer transition-colors -mb-[2px] ${
                statusFilter === status
                  ? 'border-b-4 border-black dark:border-white text-black dark:text-white'
                  : 'border-b-4 border-transparent text-[var(--muted)] hover:text-black dark:hover:text-white'
              }`}
            >
              {status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="border-2 border-black dark:border-neutral-800 p-8 sm:p-12 text-center text-xs text-[var(--muted)]">
            Loading moderation queue...
          </div>
        ) : error ? (
          <div className="border-2 border-red-700 p-8 text-center text-xs text-red-700 dark:text-red-300">{error}</div>
        ) : matches.length === 0 ? (
          <div className="border-2 border-black dark:border-neutral-800 p-8 sm:p-12 text-center bg-white dark:bg-[#0B1422]">
            <p className="font-bold uppercase tracking-wider text-black dark:text-white text-base">No matches in this view</p>
            <p className="mt-2 text-xs text-[var(--muted)] max-w-sm mx-auto">New candidate matches will appear here automatically.</p>
          </div>
        ) : (
          <>
            <div className="text-xs font-mono-numbers text-[var(--muted)]">
              {totalElements} record{totalElements === 1 ? '' : 's'} · sorted by final score
            </div>
            <div className="space-y-4">
              {matches.map(match => (
                <div key={match.id} className="border-2 border-black dark:border-neutral-800 bg-white dark:bg-[#0B1422] p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black dark:border-neutral-800 pb-3">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <span className="text-xs font-mono-numbers font-bold text-black dark:text-white">REF: {match.id}</span>
                      <span className="text-neutral-400">·</span>
                      <span className="text-xs font-mono-numbers text-[var(--muted)]">{match.createdAt.slice(0, 10)}</span>
                      <span className="border border-black dark:border-white px-2 py-0.5 text-[10px] font-bold uppercase">{match.status}</span>
                    </div>
                    <span className="text-xs font-bold font-mono-numbers px-2.5 py-1 bg-black text-white dark:bg-white dark:text-black">
                      {Math.round(match.finalScore * 100)}% Match
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {([
                      ['LOST ITEM', match.lostItem],
                      ['FOUND INTAKE', match.foundItem],
                    ] as [string, BackendDeskItemView][]).map(([label, item]) => (
                      <div key={label as string} className="p-4 border-2 border-black dark:border-neutral-800 bg-[var(--surface)] dark:bg-[#111F31] space-y-1">
                        <div className="text-[10px] font-mono-numbers uppercase font-bold text-[var(--muted)]">
                          {label as string} · REG: {item.reporterRegistrationNumber}
                        </div>
                        <p className="font-bold text-sm text-black dark:text-white truncate">{item.title}</p>
                        <p className="text-xs text-[var(--muted)] line-clamp-2">{item.description}</p>
                        <p className="text-[11px] text-[var(--muted)] font-mono-numbers pt-1">{item.location}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="flex gap-3 text-xs font-mono-numbers text-[var(--muted)]">
                      <span>Text: <strong className="text-black dark:text-white">{Math.round(match.textScore * 100)}%</strong></span>
                      <span>Visual: <strong className="text-black dark:text-white">{match.imageCompared ? `${Math.round(match.imageScore * 100)}%` : 'N/A'}</strong></span>
                      <span>Time: <strong className="text-black dark:text-white">{Math.round(match.timeScore * 100)}%</strong></span>
                    </div>
                    <button onClick={() => onOpenMatchModal(match.id)} className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-[0.12em] cursor-pointer hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                      Review Decision →
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t-2 border-black dark:border-neutral-800 pt-4">
              <button disabled={page === 0} onClick={() => setPage(current => current - 1)} className="px-4 py-2 border-2 border-black dark:border-white text-xs font-bold uppercase disabled:opacity-40">Previous</button>
              <span className="text-xs font-mono-numbers text-[var(--muted)]">Page {page + 1} of {totalPages}</span>
              <button disabled={page + 1 >= totalPages} onClick={() => setPage(current => current + 1)} className="px-4 py-2 border-2 border-black dark:border-white text-xs font-bold uppercase disabled:opacity-40">Next</button>
            </div>
          </>
        )}
      </div>
    </PortalShell>
  );
};
