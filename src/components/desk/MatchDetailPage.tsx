import React, { useEffect, useState } from 'react';
import { useRouter } from '../../lib/router';
import { DeskMatch } from '../../lib/api/adapters';
import { deskApi } from '../../lib/api/desk.api';
import { PageHeader, PortalShell, Link } from '../portal-shell';
import { AlertCircle, ShieldCheck } from 'lucide-react';

interface MatchDetailPageProps {
  matchId: string;
}

export const MatchDetailPage: React.FC<MatchDetailPageProps> = ({ matchId }) => {
  const { navigate } = useRouter();
  const [match, setMatch] = useState<DeskMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    deskApi.getMatch(matchId)
      .then(result => {
        if (active) setMatch(result);
      })
      .catch(reason => {
        if (active) setError(reason instanceof Error ? reason.message : 'Unable to load match details.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [matchId]);

  const moderate = async (action: 'approve' | 'reject') => {
    if (!remarks.trim()) {
      setError(`Please provide officer ${action === 'approve' ? 'verification remarks' : 'a rejection reason'}.`);
      return;
    }
    if (!window.confirm(`Confirm ${action} of match ${matchId}?`)) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = action === 'approve'
        ? await deskApi.approveMatch(matchId, remarks.trim())
        : await deskApi.rejectMatch(matchId, remarks.trim());
      setMatch(updated);
      setSuccess(`Match ${action}d successfully.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : `Failed to ${action} match.`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <PortalShell><div className="border-2 border-black p-12 text-center text-xs text-[var(--muted)]">Loading match details...</div></PortalShell>;
  }

  if (error && !match) {
    return <PortalShell><div className="border-2 border-red-700 p-8 text-center text-xs text-red-700 dark:text-red-300">{error}</div></PortalShell>;
  }

  if (!match) {
    return <PortalShell><div className="border-2 border-black p-8 text-center"><h2 className="text-xl font-bold uppercase">Match Record Not Found</h2><Link href="/desk/matches" className="inline-block mt-6 px-5 py-3 bg-black text-white text-xs font-bold uppercase">Return to Queue</Link></div></PortalShell>;
  }

  const isPending = match.status === 'PENDING';
  const itemCard = (label: string, item: DeskMatch['lostItem']) => (
    <div className="border-2 border-black dark:border-neutral-800 p-6 space-y-4 bg-white dark:bg-[#0B1422]">
      <div className="flex items-center justify-between border-b-2 border-black dark:border-neutral-800 pb-2">
        <span className="label text-[var(--muted)]">{label}</span>
        <span className="font-mono-numbers text-xs font-bold">Reg: {item.reporterRegistrationNumber}</span>
      </div>
      {item.imageUrl && <img src={item.imageUrl} alt={item.title} referrerPolicy="no-referrer" className="w-full h-44 object-cover border-2 border-black dark:border-neutral-700" />}
      <h3 className="font-bold text-base">{item.title}</h3>
      <p className="text-xs text-[var(--muted)] leading-relaxed">{item.description}</p>
      <dl className="grid grid-cols-2 gap-3 pt-2 border-t-2 border-black dark:border-neutral-800 text-xs font-mono-numbers">
        <div><dt className="label text-[var(--muted)]">Location</dt><dd className="font-bold mt-0.5">{item.location}</dd></div>
        <div><dt className="label text-[var(--muted)]">Event</dt><dd className="font-bold mt-0.5">{item.eventFrom || 'Not provided'}</dd></div>
      </dl>
    </div>
  );

  return (
    <PortalShell>
      <PageHeader
        eyebrow={`MODERATION DOSSIER / ${match.id}`}
        title="MATCH INSPECTION."
        copy="Inspect claimant report against surrendered property and record authorization."
        action={<Link href="/desk/matches" className="border-2 border-black dark:border-white px-5 py-3 text-xs font-bold uppercase tracking-[.12em] block text-center">Back to Queue</Link>}
      />
      <div className="py-4 sm:py-6 space-y-6">
        {error && <p className="text-xs text-red-700 dark:text-red-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
        {success && <p className="border-2 border-emerald-700 p-3 text-xs text-emerald-700 dark:text-emerald-300">{success}</p>}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-2 border-black dark:border-neutral-800 divide-x-2 divide-y-2 lg:divide-y-0 divide-black bg-white dark:bg-[#0B1422]">
          {[
            ['Overall Confidence', match.finalScore],
            ['Visual Correlation', match.imageCompared ? match.imageScore : null],
            ['Description Match', match.textScore],
            ['Location & Time', match.timeScore],
          ].map(([label, score]) => <div key={label as string} className="p-4 sm:p-5"><div className="text-xl sm:text-2xl font-extrabold font-mono-numbers">{score === null ? 'N/A' : `${Math.round(Number(score) * 100)}%`}</div><div className="label text-[var(--muted)] mt-1 text-[10px] sm:text-xs">{label as string}</div></div>)}
        </div>
        <div className="p-4 border-2 border-black dark:border-neutral-800 bg-[var(--surface)] dark:bg-[#111F31] flex items-center justify-between gap-2 text-xs font-mono-numbers">
          <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /><span>{match.foundItem.deskReceivedAt ? 'Found property verified in Security Vault.' : 'Physical item still pending drop-off by student finder.'}</span></div>
          <span className="font-bold border border-black dark:border-white px-2 py-0.5 uppercase">{match.status}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {itemCard('CLAIMANT REPORT', match.lostItem)}
          {itemCard('SURRENDERED PROPERTY', match.foundItem)}
        </div>
        {isPending ? (
          <div className="border-2 border-black dark:border-neutral-800 bg-white dark:bg-[#0B1422] p-6 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-[0.12em]">Duty Officer Verification Remarks *</label>
            <textarea rows={3} value={remarks} onChange={event => setRemarks(event.target.value)} className="w-full px-3 py-2 text-xs border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900" placeholder="Record inspection basis..." />
            <div className="flex justify-end gap-2 border-t-2 border-black pt-4">
              <button disabled={submitting} onClick={() => moderate('reject')} className="px-4 py-2.5 border-2 border-black text-xs font-bold uppercase disabled:opacity-50">Reject Match</button>
              <button disabled={submitting} onClick={() => moderate('approve')} className="px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black text-xs font-bold uppercase disabled:opacity-50">{submitting ? 'Saving...' : 'Approve Match & Issue Handover Key'}</button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-black dark:border-neutral-800 bg-white dark:bg-[#0B1422] p-5 space-y-2">
            <div className="label text-[var(--muted)]">MODERATOR DECISION LOGGED</div>
            <div className="text-xs bg-[var(--surface)] p-3 border-2 border-black font-mono-numbers">Review note: <strong>{match.reviewNote || 'Not provided'}</strong></div>
            <div className="text-xs font-mono-numbers">Reviewed: {match.reviewedAt || 'Not provided'}</div>
          </div>
        )}
      </div>
    </PortalShell>
  );
};
