import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Clock, KeyRound, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { StudentMatch, StudentMatchItem } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';

interface StudentMatchesViewProps {
  matches: StudentMatch[];
  loading?: boolean;
  error?: string | null;
  onOpenMatchDetail?: (match: StudentMatch) => void;
}

const formatDate = (value: string | null | undefined) => {
  if (!value) return 'Not available';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Not available'
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

const formatEventRange = (item: StudentMatchItem) => {
  if (!item.eventFrom && !item.eventTo) return 'Event date not available';
  if (item.eventFrom && item.eventTo) {
    return `${formatDate(item.eventFrom)} - ${formatDate(item.eventTo)}`;
  }
  return formatDate(item.eventFrom || item.eventTo);
};

const ItemCard: React.FC<{ label: string; item: StudentMatchItem }> = ({ label, item }) => (
  <div className="border-2 border-black dark:border-neutral-700 p-4 space-y-3 min-w-0">
    <div className="text-[11px] font-mono-numbers uppercase text-[var(--muted)] font-bold break-words">
      {label} · <span className="break-all">{item.id}</span>
    </div>
    {item.imageUrl ? (
      <img src={item.imageUrl} alt={item.title} referrerPolicy="no-referrer" className="w-full h-40 object-cover border border-black" />
    ) : (
      <div className="w-full h-40 border border-dashed border-neutral-400 flex items-center justify-center text-xs text-[var(--muted)]">No image provided</div>
    )}
    <div className="font-bold text-sm text-black dark:text-white">{item.title}</div>
    <p className="text-xs text-[var(--muted)] leading-relaxed">{item.description}</p>
    <div className="space-y-2 text-[11px] font-mono-numbers text-[var(--muted)]">
      <div className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 shrink-0" /> <span>{item.location}</span></div>
      <div className="flex items-start gap-2"><Calendar className="w-3.5 h-3.5 shrink-0" /> <span>{formatEventRange(item)}</span></div>
      <div className="flex items-center justify-between gap-2 border-t border-neutral-200 dark:border-neutral-800 pt-2">
        <span>Report status</span><StatusBadge status={item.status} />
      </div>
    </div>
  </div>
);

const MatchInstructions: React.FC<{ match: StudentMatch }> = ({ match }) => {
  const isLostOwner = match.yourRole === 'LOST_OWNER';
  const received = match.otherItem.deskReceivedAt !== null;
  let instruction = match.nextStep;

  if (match.status === 'COMPLETED') {
    instruction = 'The handover has been completed.';
  } else if (match.status === 'APPROVED' && isLostOwner && received && match.handoverKeyIssued) {
    instruction = 'Your item is ready for collection. Visit the Security Office with your university ID. A handover key has been issued; email delivery status is not available here.';
  } else if (match.status === 'APPROVED' && isLostOwner && !received) {
    instruction = 'Your match has been approved. Collection will be available once Campus Security receives the physical item.';
  } else if (match.status === 'APPROVED' && !isLostOwner && !match.yourItem.deskReceivedAt) {
    instruction = 'Please bring the found item to the Campus Security Office. The item must be physically received before collection can be authorized.';
  } else if (match.status === 'APPROVED' && !isLostOwner && match.yourItem.deskReceivedAt) {
    instruction = 'Campus Security has received your item. It is now in university custody.';
  }

  return (
    <div className="border-2 border-[#142B4A] dark:border-blue-500 bg-[#E8EDF3]/40 dark:bg-blue-950/20 p-4 space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#142B4A] dark:text-blue-300">
        <ShieldCheck className="w-4 h-4" /> Next step
      </div>
      <p className="text-sm text-black dark:text-white leading-relaxed">{instruction || 'No next step is available from the backend.'}</p>
    </div>
  );
};

const HandoverCard: React.FC<{ match: StudentMatch }> = ({ match }) => {
  if (match.yourRole !== 'LOST_OWNER') {
    return (
      <div className="border-2 border-black dark:border-neutral-700 p-4 space-y-2 bg-[var(--surface)] dark:bg-[#111F31]">
        <div className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">Physical custody</div>
        <p className="text-xs text-[var(--muted)]">
          {match.yourItem.deskReceivedAt
            ? `Campus Security accepted custody on ${formatDate(match.yourItem.deskReceivedAt)}.`
            : 'Awaiting physical deposit at the Campus Security Office.'}
        </p>
      </div>
    );
  }

  const received = match.otherItem.deskReceivedAt !== null;
  const expired = match.handoverKeyExpiresAt !== null && new Date(match.handoverKeyExpiresAt).getTime() < Date.now();
  let state = 'Awaiting moderator approval.';
  if (match.status === 'APPROVED' && !received) state = 'Approved; awaiting physical deposit.';
  if (match.status === 'APPROVED' && received && !match.handoverKeyIssued) state = 'Awaiting key delivery.';
  if (match.status === 'APPROVED' && received && match.handoverKeyIssued && !expired) state = 'Collection authorized.';
  if (expired) state = 'Key expired.';
  if (match.status === 'COMPLETED') state = 'Handover completed.';

  return (
    <div className="border-2 border-black dark:border-neutral-700 p-4 space-y-4 bg-[var(--surface)] dark:bg-[#111F31] min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black dark:text-white"><KeyRound className="w-4 h-4" /> Collection authorization</div>
        <span className="text-xs font-bold text-[var(--muted)]">{state}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-numbers">
        <div><div className="text-[var(--muted)]">Physical custody</div><div className="font-bold mt-1">{received ? `Received ${formatDate(match.otherItem.deskReceivedAt)}` : 'Awaiting physical deposit'}</div></div>
        <div><div className="text-[var(--muted)]">Key status</div><div className="font-bold mt-1">{match.handoverKeyIssued ? (expired ? 'Expired' : 'Issued; delivery not tracked') : 'Not issued'}</div></div>
        {match.handoverKeyExpiresAt && <div><div className="text-[var(--muted)]">Key expiry</div><div className="font-bold mt-1">{formatDate(match.handoverKeyExpiresAt)}</div></div>}
        <div><div className="text-[var(--muted)]">Pickup location</div><div className="font-bold mt-1">Campus Security Office</div></div>
      </div>
      {match.status === 'APPROVED' && received && match.handoverKeyIssued && !expired && (
        <p className="text-xs text-[var(--muted)] border-t border-neutral-300 dark:border-neutral-700 pt-3">Bring your university ID. A handover key has been issued, but email delivery confirmation is not exposed by the backend.</p>
      )}
    </div>
  );
};

export const StudentMatchesView: React.FC<StudentMatchesViewProps> = ({ matches, loading = false, error = null }) => {
  const [selectedMatch, setSelectedMatch] = useState<StudentMatch | null>(matches[0] || null);
  useEffect(() => setSelectedMatch(matches[0] || null), [matches]);

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-black dark:border-neutral-800 pb-4">
        <div className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--navy)] dark:text-blue-400 font-mono-numbers mb-1">Verification Queue // 05</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black dark:text-white">Verified Matches</h1>
        <p className="text-xs text-[var(--muted)] mt-1">Matches approved by Campus Security and their current custody and collection state.</p>
      </div>

      {loading ? (
        <div className="border-2 border-black dark:border-neutral-800 p-12 text-center text-xs font-mono-numbers text-[var(--muted)]">Loading your matches...</div>
      ) : error ? (
        <div className="border-2 border-red-700 p-12 text-center text-xs text-red-700 dark:text-red-300">{error}</div>
      ) : matches.length === 0 ? (
        <div className="border-2 border-black dark:border-neutral-800 p-12 text-center bg-white dark:bg-[#0B1422]">
          <Sparkles className="w-8 h-8 text-[var(--navy)] mx-auto mb-3" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">No Approved Matches</h3>
          <p className="text-xs text-[var(--muted)] mt-1 max-w-sm mx-auto">Matches appear here after Campus Security approves them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-3 min-w-0">
            <div className="text-xs font-bold font-mono-numbers uppercase tracking-wider text-[var(--muted)]">Match records ({matches.length})</div>
            {matches.map(match => (
              <button key={match.id} onClick={() => setSelectedMatch(match)} className={`w-full border-2 p-4 cursor-pointer transition-colors text-left min-w-0 ${selectedMatch?.id === match.id ? 'border-black bg-white dark:bg-[#111F31]' : 'border-neutral-300 dark:border-neutral-800 bg-[var(--surface)] dark:bg-[#0B1422] hover:border-black'}`}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-mono-numbers font-bold text-[var(--muted)] break-all">REF: {match.id}</span><StatusBadge status={match.status} />
                </div>
                <h3 className="text-sm font-bold text-black dark:text-white line-clamp-1 mb-1">{match.yourItem.title}</h3>
                <div className="text-xs text-[var(--muted)]">{match.yourRole === 'LOST_OWNER' ? 'Your lost item' : 'Your found item'} · {Math.round(match.finalScore * 100)}% confidence</div>
                <div className="text-[11px] font-mono-numbers text-[var(--muted)] mt-2">Created {formatDate(match.createdAt)}</div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-7 min-w-0">
            {selectedMatch && (
              <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#0B1422] p-4 sm:p-6 space-y-6 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black dark:border-neutral-700 pb-4">
                  <div className="min-w-0"><div className="text-xs font-mono-numbers uppercase text-[var(--muted)] font-bold">Match reference</div><h2 className="text-sm sm:text-xl font-bold tracking-tight text-black dark:text-white break-all">{selectedMatch.id}</h2></div>
                  <StatusBadge status={selectedMatch.status} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono-numbers">
                  {[
                    ['Final', selectedMatch.finalScore],
                    ['Text', selectedMatch.textScore],
                    ['Image', selectedMatch.imageCompared ? selectedMatch.imageScore : null],
                    ['Time', selectedMatch.timeScore],
                  ].map(([label, score]) => <div key={label as string} className="border border-black dark:border-neutral-700 p-3"><div className="font-bold text-lg">{score === null ? 'N/A' : `${Math.round(Number(score) * 100)}%`}</div><div className="text-[10px] text-[var(--muted)] uppercase">{label as string}</div></div>)}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ItemCard label={selectedMatch.yourRole === 'LOST_OWNER' ? 'Your lost item' : 'Your found item'} item={selectedMatch.yourItem} />
                  <ItemCard label="Matched found item" item={selectedMatch.otherItem} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-numbers border-y-2 border-black dark:border-neutral-700 py-3">
                  <div><span className="text-[var(--muted)]">Created</span><div className="font-bold mt-1">{formatDate(selectedMatch.createdAt)}</div></div>
                  <div><span className="text-[var(--muted)]">Approved</span><div className="font-bold mt-1">{formatDate(selectedMatch.reviewedAt)}</div></div>
                  <div><span className="text-[var(--muted)]">Completed</span><div className="font-bold mt-1">{formatDate(selectedMatch.completedAt)}</div></div>
                </div>
                <HandoverCard match={selectedMatch} />
                <MatchInstructions match={selectedMatch} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
