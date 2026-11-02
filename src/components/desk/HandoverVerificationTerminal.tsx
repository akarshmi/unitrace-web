import React, { useState } from 'react';
import { Match, User } from '../../types';
import { deskApi } from '../../lib/api/desk.api';
import { StatusBadge } from '../ui/StatusBadge';
import { 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  RefreshCw 
} from 'lucide-react';

interface HandoverVerificationTerminalProps {
  matches: Match[];
  officer: User;
  onRefreshData: () => void;
  selectedMatchId?: string;
}

export const HandoverVerificationTerminal: React.FC<HandoverVerificationTerminalProps> = ({
  matches,
  officer,
  onRefreshData,
  selectedMatchId,
}) => {
  const approvedMatches = matches.filter(m => m.status === 'APPROVED');
  const [activeMatch, setActiveMatch] = useState<Match | null>(
    matches.find(m => m.id === selectedMatchId) || approvedMatches[0] || null
  );

  const [claimantRegNo, setClaimantRegNo] = useState('');
  const [keyEntered, setKeyEntered] = useState('');
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
    remainingAttempts?: number;
    isLocked?: boolean;
  } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMatch) return;

    if (!claimantRegNo.trim()) {
      setVerificationResult({ success: false, message: 'Please enter claimant registration number.' });
      return;
    }

    if (!keyEntered.trim()) {
      setVerificationResult({ success: false, message: 'Please enter the one-time handover key.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await deskApi.verifyHandover(
        activeMatch.id,
        claimantRegNo,
        keyEntered,
        officer,
        officerRemarks
      );
      setVerificationResult(res);
      onRefreshData();
    } catch (err: any) {
      setVerificationResult({ success: false, message: err.message || 'Verification failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReissueKey = async () => {
    if (!activeMatch) return;
    setSubmitting(true);
    try {
      await deskApi.reissueHandoverKey(activeMatch.id);
      setVerificationResult({
        success: false,
        message: 'Lock cleared. New verification key reissued to student.'
      });
      onRefreshData();
    } catch (err: any) {
      setVerificationResult({ success: false, message: err.message || 'Failed to reissue key.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b-2 border-black dark:border-neutral-800 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--navy)] dark:text-blue-400 font-mono-numbers mb-1">
            Section // 05 · Physical Handover
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black dark:text-white">
            Key Verification &amp; Item Release
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Validate claimant student identity and single-use handover key to authorize property release.
          </p>
        </div>

        <div className="text-xs font-mono-numbers text-[var(--muted)]">
          Approved Collections Ready: <strong className="text-black dark:text-white">{approvedMatches.length}</strong>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Verification Terminal (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeMatch ? (
            <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#0B1422] p-6 space-y-6">
              
              {/* Item Info Banner */}
              <div className="border-b-2 border-black dark:border-neutral-800 pb-4 flex items-start gap-4">
                <img
                  src={activeMatch.lostItem.imageUrl}
                  alt={activeMatch.lostItem.title}
                  referrerPolicy="no-referrer"
                  className="w-18 h-18 object-cover border-2 border-black shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono-numbers text-[var(--muted)] font-bold">
                    <span>DOSSIER: {activeMatch.id}</span>
                    <span aria-hidden="true">·</span>
                    <StatusBadge status={activeMatch.status} />
                  </div>
                  <h3 className="text-base font-bold text-black dark:text-white">
                    {activeMatch.lostItem.title}
                  </h3>
                  <div className="text-xs text-[var(--muted)] font-mono-numbers">
                    Claimant Reg: <strong className="text-black dark:text-white">{activeMatch.lostItem.reporterRegNo}</strong>
                  </div>
                  <div className="text-xs text-[var(--muted)] font-mono-numbers">
                    Vault Storage: {activeMatch.foundItem.deskNotes || 'Vault Locker B-04'}
                  </div>
                </div>
              </div>

              {/* Lockout Warning */}
              {activeMatch.isKeyLocked && (
                <div className="border-2 border-black bg-[var(--surface)] dark:bg-slate-900 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-black dark:text-white font-bold uppercase text-xs">
                    <Lock className="w-4 h-4 text-[var(--navy)]" />
                    <span>Terminal Locked (3 Failed Attempts)</span>
                  </div>
                  <p className="text-xs text-[var(--muted)]">
                    Duty officer must verify student photo ID manually before clearing lock.
                  </p>
                  <button
                    onClick={handleReissueKey}
                    disabled={submitting}
                    className="px-4 py-1.5 bg-[var(--navy)] hover:bg-[var(--navy-hover)] text-white text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Unlock &amp; Reissue Key</span>
                  </button>
                </div>
              )}

              {/* Feedback Alert */}
              {verificationResult && (
                <div className="p-4 border-2 border-black bg-[var(--surface)] dark:bg-slate-900 text-xs font-mono-numbers">
                  <div className="flex items-center gap-2 font-bold mb-1 text-black dark:text-white">
                    {verificationResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-[var(--navy)]" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-[var(--navy)]" />
                    )}
                    <span>{verificationResult.success ? 'HANDOVER AUTHORIZED & COMPLETED' : 'VERIFICATION FAILED'}</span>
                  </div>
                  <div className="text-[var(--muted)]">{verificationResult.message}</div>
                </div>
              )}

              {/* Verification Form */}
              {activeMatch.status !== 'CLAIMED' ? (
                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-[0.12em] text-black dark:text-white">
                      Step 1: Claimant Student Registration Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={claimantRegNo}
                      onChange={(e) => setClaimantRegNo(e.target.value)}
                      placeholder="e.g. 12204598"
                      className="w-full px-3 py-2 text-sm border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white uppercase font-mono-numbers focus:outline-none focus:border-[var(--navy)]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-[0.12em] text-black dark:text-white">
                      Step 2: One-Time Handover Key (OTP) *
                    </label>
                    <input
                      type="text"
                      required
                      value={keyEntered}
                      onChange={(e) => setKeyEntered(e.target.value)}
                      placeholder="e.g. UT-8942"
                      className="w-full px-3 py-2 text-base border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white uppercase font-mono-numbers tracking-widest font-bold focus:outline-none focus:border-[var(--navy)]"
                    />
                    <div className="flex items-center justify-between text-[10px] font-mono-numbers text-[var(--muted)]">
                      <span>Attempts: {activeMatch.keyVerificationAttempts || 0}/3</span>
                      <span>Single-use verification token</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-[0.12em] text-black dark:text-white">
                      Step 3: Officer Notes
                    </label>
                    <input
                      type="text"
                      value={officerRemarks}
                      onChange={(e) => setOfficerRemarks(e.target.value)}
                      placeholder="e.g. Student presented physical ID; item inspected intact."
                      className="w-full px-3 py-2 text-xs border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white focus:outline-none focus:border-[var(--navy)]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting || activeMatch.isKeyLocked}
                      className="w-full py-3 bg-[var(--navy)] hover:bg-[var(--navy-hover)] text-white text-xs font-bold uppercase tracking-[0.12em] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? 'Verifying...' : 'Authorize Key & Mark Claimed'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="border-2 border-black bg-[var(--surface)] dark:bg-slate-900 p-5 text-xs text-black dark:text-white space-y-1 font-mono-numbers">
                  <div className="font-bold uppercase flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--navy)]" />
                    <span>Property Released &amp; Claimed</span>
                  </div>
                  <p className="text-[var(--muted)]">
                    Both item records marked CLAIMED in university custody ledger.
                  </p>
                </div>
              )}

            </div>
          ) : (
            <div className="border-2 border-black p-12 text-center text-xs text-[var(--muted)] font-mono-numbers">
              Select an approved match from the queue to start verification.
            </div>
          )}
        </div>

        {/* Right Column: Queue of Approved Matches (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border-2 border-black dark:border-neutral-700 p-5 bg-white dark:bg-[#0B1422] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold uppercase tracking-tight text-black dark:text-white">
                Ready for Collection
              </h2>
              <span className="text-xs font-mono-numbers font-bold text-[var(--navy)] dark:text-blue-400">
                {approvedMatches.length} READY
              </span>
            </div>

            <div className="divide-y-2 divide-black dark:divide-neutral-800 border-t-2 border-black dark:border-neutral-800 pt-2">
              {approvedMatches.length === 0 ? (
                <div className="py-6 text-center text-xs text-[var(--muted)] font-mono-numbers">
                  No items currently awaiting pickup.
                </div>
              ) : (
                approvedMatches.map(m => {
                  const isSelected = activeMatch?.id === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        setActiveMatch(m);
                        setVerificationResult(null);
                        setClaimantRegNo(m.lostItem.reporterRegNo);
                      }}
                      className={`p-3 cursor-pointer transition-colors border-2 my-1 ${
                        isSelected 
                          ? 'bg-[var(--navy)] text-white border-[var(--navy)]' 
                          : 'bg-white dark:bg-slate-900 hover:bg-neutral-100 text-black dark:text-white border-neutral-300 dark:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono-numbers font-bold">
                        <span>{m.id}</span>
                        <span className={isSelected ? 'text-blue-200' : 'text-[var(--muted)]'}>
                          Claimant: {m.lostItem.reporterRegNo}
                        </span>
                      </div>
                      <div className="font-bold text-xs line-clamp-1 mt-1">
                        {m.lostItem.title}
                      </div>
                      <div className={`text-[10px] font-mono-numbers mt-1 flex items-center justify-between ${
                        isSelected ? 'text-blue-200' : 'text-[var(--muted)]'
                      }`}>
                        <span>Locker: {m.foundItem.deskNotes?.slice(0, 18) || 'Vault Locker B-04'}</span>
                        {m.isKeyLocked && <span className="font-bold uppercase text-white bg-black px-1">LOCKED</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Verification Protocol Rule Box */}
          <div className="border-2 border-black dark:border-neutral-800 p-4 bg-[var(--surface)] dark:bg-slate-900 text-xs space-y-2">
            <div className="font-bold text-black dark:text-white uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[var(--navy)] dark:text-blue-400" />
              <span>Handover Invariants</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-[var(--muted)] font-mono-numbers">
              <li>Student must present University ID card.</li>
              <li>OTP key must match the student portal code.</li>
              <li>Attempt limit: 3 tries before security lockout.</li>
              <li>Both records set to CLAIMED simultaneously.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};
