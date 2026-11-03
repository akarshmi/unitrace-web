import React, { useEffect, useState } from 'react';
import { useRouter } from '../../lib/router';
import { CheckCircle2, AlertCircle, Lock, RefreshCw } from 'lucide-react';
import { DeskMatch } from '../../lib/api/adapters';
import { deskApi } from '../../lib/api/desk.api';
import { Link, PageHeader, PortalShell } from '../portal-shell';

interface HandoverDetailPageProps {
  matchId: string;
}

export const HandoverDetailPage: React.FC<HandoverDetailPageProps> = ({ matchId }) => {
  const { navigate } = useRouter();
  const [match, setMatch] = useState<DeskMatch | null>(null);
  const [claimantRegNo, setClaimantRegNo] = useState('');
  const [keyEntered, setKeyEntered] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const loadMatch = async () => {
    setLoading(true);
    setError(null);
    try {
      const loaded = await deskApi.getMatch(matchId);
      setMatch(loaded);
      setClaimantRegNo(String(loaded.lostItem.reporterRegistrationNumber));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load handover details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMatch();
  }, [matchId]);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!match || submitting) return;
    const registrationNumber = Number(claimantRegNo.trim());
    if (!Number.isSafeInteger(registrationNumber) || registrationNumber <= 0 || !keyEntered.trim()) {
      setResult({ success: false, message: 'Enter a valid registration number and handover key.' });
      return;
    }
    if (!window.confirm('Confirm completion of this handover?')) return;

    setSubmitting(true);
    setResult(null);
    try {
      const completed = await deskApi.completeHandover(match.id, keyEntered.trim(), registrationNumber);
      setMatch(completed);
      setKeyEntered('');
      setResult({ success: true, message: 'Handover completed successfully.' });
    } catch (reason) {
      setResult({ success: false, message: reason instanceof Error ? reason.message : 'Verification failed.' });
      await loadMatch();
    } finally {
      setSubmitting(false);
    }
  };

  const handleReissue = async () => {
    if (!match || submitting) return;
    if (!window.confirm('Reissue the handover key for this approved match?')) return;
    setSubmitting(true);
    setResult(null);
    try {
      const updated = await deskApi.reissueHandoverKey(match.id);
      setMatch(updated);
      setResult({ success: true, message: 'A new handover key was reissued by the backend.' });
    } catch (reason) {
      setResult({ success: false, message: reason instanceof Error ? reason.message : 'Failed to reissue the key.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PortalShell><div className="border-2 border-black p-10 text-center text-xs text-[var(--muted)]">Loading handover dossier...</div></PortalShell>;
  if (error || !match) return <PortalShell><div className="border-2 border-red-700 p-8 text-center text-xs text-red-700 dark:text-red-300">{error || 'Handover dossier not found.'}<div className="mt-5"><Link href="/desk/handovers" className="px-5 py-3 bg-black text-white text-xs font-bold uppercase">Return to Queue</Link></div></div></PortalShell>;

  const isApproved = match.status === 'APPROVED';
  return (
    <PortalShell>
      <PageHeader
        eyebrow={`HANDOVER TERMINAL / ${match.id}`}
        title="KEY VERIFICATION."
        copy="Verify the single-use key and release property from campus custody."
        action={<Link href="/desk/handovers" className="border-2 border-black dark:border-white px-5 py-3 text-xs font-bold uppercase tracking-[.12em] block text-center">Back to Queue</Link>}
      />
      <div className="py-4 sm:py-6 space-y-6 max-w-2xl mx-auto">
        <div className="border-2 border-black dark:border-neutral-800 bg-white dark:bg-[#0B1422] p-5 flex items-start gap-4">
          {match.lostItem.imageUrl && <img src={match.lostItem.imageUrl} alt={match.lostItem.title} referrerPolicy="no-referrer" className="w-16 h-16 object-cover border-2 border-black shrink-0" />}
          <div className="space-y-1 min-w-0">
            <div className="text-xs font-mono-numbers text-[var(--muted)]">STATUS: {match.status}</div>
            <h3 className="text-base font-bold text-black dark:text-white truncate">{match.lostItem.title}</h3>
            <div className="text-xs text-[var(--muted)] font-mono-numbers">Claimant registration: {match.lostItem.reporterRegistrationNumber}</div>
            <div className="text-xs text-[var(--muted)] font-mono-numbers">Key expires: {match.handoverKeyExpiresAt || 'Unavailable'}</div>
            <div className="text-xs text-[var(--muted)] font-mono-numbers">Failed attempts: {match.handoverFailedAttempts}</div>
            <div className="text-xs text-[var(--muted)] font-mono-numbers">Created: {match.createdAt}</div>
            {match.completedAt && <div className="text-xs text-[var(--muted)] font-mono-numbers">Completed: {match.completedAt}</div>}
          </div>
        </div>
        {match.handoverFailedAttempts >= 3 && isApproved && (
          <div className="border-2 border-red-700 bg-red-50 dark:bg-red-950/20 p-5 space-y-3">
            <div className="text-xs font-bold uppercase text-red-800 dark:text-red-300"><Lock className="inline w-4 h-4 mr-1" />Attempt limit exceeded</div>
            <p className="text-xs text-[var(--muted)]">Reissue the key only after verifying the student's physical identity.</p>
            <button onClick={handleReissue} disabled={submitting} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs uppercase font-bold disabled:opacity-50"><RefreshCw className="inline w-3.5 h-3.5 mr-1" />Reissue Handover Key</button>
          </div>
        )}
        {result && (
          <div className="p-4 border-2 border-black dark:border-neutral-800 bg-[var(--surface)] text-xs font-mono-numbers">
            <div className="flex items-center gap-2 font-bold mb-1">{result.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}{result.success ? 'HANDOVER COMPLETED' : 'VERIFICATION FAILED'}</div>
            <div className="text-[var(--muted)]">{result.message}</div>
          </div>
        )}
        {isApproved ? (
          <form onSubmit={handleVerify} className="border-2 border-black dark:border-neutral-800 bg-white dark:bg-[#0B1422] p-6 space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider">Student Registration Number *</label>
              <input type="text" inputMode="numeric" required value={claimantRegNo} onChange={event => setClaimantRegNo(event.target.value)} className="w-full px-3 py-2 text-xs border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 font-mono-numbers" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider">One-Time Handover Key *</label>
              <input type="password" required value={keyEntered} onChange={event => setKeyEntered(event.target.value)} autoComplete="off" className="w-full py-2.5 px-3 text-lg font-mono-numbers font-bold tracking-widest border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900" />
            </div>
            <button type="submit" disabled={submitting} className="w-full px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-[0.12em] disabled:opacity-50">{submitting ? 'Verifying...' : 'Confirm Handover'}</button>
          </form>
        ) : (
          <div className="border-2 border-black dark:border-neutral-800 p-5 text-xs text-[var(--muted)]">This handover is no longer available for completion. Backend status: {match.status}.</div>
        )}
      </div>
    </PortalShell>
  );
};
