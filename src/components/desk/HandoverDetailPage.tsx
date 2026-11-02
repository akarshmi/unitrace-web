import React, { useState } from 'react';
import { useRouter } from '../../lib/router';
import { Match, User } from '../../types';
import { deskApi } from '../../lib/api/desk.api';
import { StatusBadge } from '../ui/StatusBadge';
import { 
  ArrowLeft, 
  KeyRound, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  RefreshCw, 
  ShieldCheck 
} from 'lucide-react';

interface HandoverDetailPageProps {
  match: Match | null;
  officer: User;
  onRefreshData: () => void;
}

export const HandoverDetailPage: React.FC<HandoverDetailPageProps> = ({
  match,
  officer,
  onRefreshData,
}) => {
  const { navigate } = useRouter();
  const [claimantRegNo, setClaimantRegNo] = useState(match?.lostItem.reporterRegNo || '');
  const [keyEntered, setKeyEntered] = useState('');
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    remainingAttempts?: number;
    isLocked?: boolean;
  } | null>(null);

  if (!match) {
    return (
      <div className="border-2 border-neutral-200 dark:border-neutral-800 p-12 text-center bg-white dark:bg-[#0B1422]">
        <h2 className="text-xl font-bold uppercase text-black dark:text-white mb-2">Handover Dossier Not Found</h2>
        <p className="text-xs text-neutral-500 mb-6">The requested handover match record could not be found.</p>
        <button
          onClick={() => navigate('/desk/handovers')}
          className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider"
        >
          Return to Handover Queue
        </button>
      </div>
    );
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimantRegNo.trim() || !keyEntered.trim()) return;

    setSubmitting(true);
    try {
      const res = await deskApi.verifyHandover(
        match.id,
        claimantRegNo,
        keyEntered,
        officer,
        officerRemarks
      );
      setResult(res);
      onRefreshData();
    } catch (err: any) {
      setResult({ success: false, message: err.message || 'Verification failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReissue = async () => {
    setSubmitting(true);
    try {
      await deskApi.reissueHandoverKey(match.id);
      setResult({
        success: false,
        message: 'Security lock cleared. New one-time handover key issued and sent to student email.'
      });
      onRefreshData();
    } catch (err: any) {
      setResult({ success: false, message: err.message || 'Failed to reissue key.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-black dark:border-neutral-800 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/desk/handovers')}
            className="text-xs font-mono-numbers text-neutral-500 hover:text-black dark:hover:text-white flex items-center gap-1.5 uppercase font-semibold mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Handover Queue</span>
          </button>
          <div className="text-xs font-mono-numbers text-neutral-500 uppercase mb-1">
            HANDOVER TERMINAL // {match.id}
          </div>
          <h1 className="text-2xl sm:text-3xl font-display text-black dark:text-white uppercase tracking-tight">
            Verify Single-Use Key &amp; Release
          </h1>
        </div>

        <StatusBadge status={match.status} />
      </div>

      {/* Item Summary Banner */}
      <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#0B1422] p-5 flex items-start gap-4">
        <img
          src={match.lostItem.imageUrl}
          alt={match.lostItem.title}
          referrerPolicy="no-referrer"
          className="w-20 h-20 object-cover border-2 border-black shrink-0"
        />
        <div className="space-y-1">
          <div className="text-xs font-mono-numbers text-neutral-500">
            CLAIMANT: {match.lostItem.reporterRegNo} · {match.lostItem.reporterNameMasked}
          </div>
          <h3 className="text-lg font-bold text-black dark:text-white">
            {match.lostItem.title}
          </h3>
          <div className="text-xs text-neutral-500 font-mono-numbers">
            Custody Storage: <strong>{match.foundItem.deskNotes || 'Vault Locker B-04'}</strong>
          </div>
        </div>
      </div>

      {/* Lockout Warning */}
      {match.isKeyLocked && (
        <div className="border-2 border-red-700 bg-red-50 dark:bg-red-950/20 p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-red-800 dark:text-red-300">
            <Lock className="w-4 h-4" />
            <span>Attempt Limit Exceeded (3/3) — Locked</span>
          </div>
          <p className="text-xs text-neutral-700 dark:text-neutral-300">
            Handover is locked for security. Verify student's physical identity card in person, then reissue a new key below.
          </p>
          <button
            onClick={handleReissue}
            disabled={submitting}
            className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reissue Handover Key</span>
          </button>
        </div>
      )}

      {/* Result Alert */}
      {result && (
        <div className={`p-4 border-2 text-xs font-mono-numbers ${
          result.success
            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300'
            : 'border-red-600 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-300'
        }`}>
          <div className="flex items-center gap-2 font-bold mb-1">
            {result.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
            <span>{result.success ? 'HANDOVER AUTHORIZED' : 'VERIFICATION FAILED'}</span>
          </div>
          <div>{result.message}</div>
        </div>
      )}

      {/* Form */}
      {match.status !== 'CLAIMED' ? (
        <form onSubmit={handleVerify} className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#0B1422] p-6 space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-black dark:text-white">
              Student Registration Number *
            </label>
            <input
              type="text"
              required
              value={claimantRegNo}
              onChange={(e) => setClaimantRegNo(e.target.value)}
              placeholder="e.g. 12204598"
              className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 dark:bg-slate-900 font-mono-numbers uppercase focus:outline-none focus:border-black"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-black dark:text-white">
              One-Time Handover Key (Provided by Student) *
            </label>
            <input
              type="text"
              required
              value={keyEntered}
              onChange={(e) => setKeyEntered(e.target.value)}
              placeholder="e.g. UT-8942"
              className="w-full py-3 px-4 text-xl font-mono-numbers font-bold tracking-widest border-2 border-black dark:border-neutral-700 dark:bg-slate-900 uppercase focus:outline-none focus:border-[var(--navy)]"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 font-mono-numbers">
              <span>Single-use key verified against backend.</span>
              <span>Attempts logged: {match.keyVerificationAttempts || 0}/3</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-black dark:text-white">
              Staff Custody Notes
            </label>
            <input
              type="text"
              value={officerRemarks}
              onChange={(e) => setOfficerRemarks(e.target.value)}
              placeholder="e.g. Student identity card inspected in good order."
              className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 dark:bg-slate-900"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || match.isKeyLocked}
              className="w-full py-3 bg-[var(--navy)] hover:bg-[var(--navy-hover)] text-white text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Verifying Key...' : 'Authenticate & Complete Custody Transfer'}
            </button>
          </div>
        </form>
      ) : (
        <div className="border-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 p-6 text-xs text-emerald-900 dark:text-emerald-300 space-y-2">
          <div className="font-bold uppercase flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Custody Transfer Completed &amp; Locked</span>
          </div>
          <p>
            This item has been officially released to the student. Both lost and found master records are now archived in status <strong>CLAIMED</strong>.
          </p>
        </div>
      )}
    </div>
  );
};
