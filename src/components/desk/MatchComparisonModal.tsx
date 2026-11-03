import React, { useState } from 'react';
import { Match, User } from '../../types';
import { X, ShieldCheck, AlertCircle } from 'lucide-react';

interface MatchComparisonModalProps {
  match: Match | null;
  isOpen: boolean;
  currentUser: User;
  onClose: () => void;
  onApprove: (matchId: string, remarks: string) => Promise<void>;
  onReject: (matchId: string, remarks: string) => Promise<void>;
}

export const MatchComparisonModal: React.FC<MatchComparisonModalProps> = ({
  match,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) => {
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !match) return null;

  const isPending = match.status === 'PENDING_REVIEW';
  const isFoundInCustody = match.foundItem.submissionStatus === 'RECEIVED_BY_DESK';

  const handleApprove = async () => {
    if (!remarks.trim()) {
      setError('Please provide verification remarks before approving.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onApprove(match.id, remarks);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to approve match.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      setError('Please specify reason for rejecting match.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onReject(match.id, remarks);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to reject match.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-white dark:bg-[#0B1422] border-2 border-black dark:border-white shadow-none my-6"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="border-b-2 border-black dark:border-neutral-800 p-5 flex items-center justify-between">
          <div>
            <div className="label text-[var(--muted)]">
              MODERATION DOSSIER // {match.id}
            </div>
            <h2 className="text-xl font-extrabold text-black dark:text-white uppercase tracking-tight">
              Match Inspection &amp; Decision
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="border border-black dark:border-white px-2 py-0.5 text-xs font-bold uppercase">
              {match.status}
            </span>
            <button
              onClick={onClose}
              className="p-1 border border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-800 text-black dark:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Similarity Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-2 border-black dark:border-neutral-800 divide-x-2 divide-y-2 sm:divide-y-0 divide-black dark:divide-neutral-800 text-center font-mono-numbers">
            <div className="p-3">
              <div className="label text-[var(--muted)] text-[10px]">Description</div>
              <div className="text-lg font-bold mt-1 text-black dark:text-white">
                {Math.round(match.similarity.textSimilarity * 100)}%
              </div>
            </div>
            <div className="p-3">
              <div className="label text-[var(--muted)] text-[10px]">Visual Match</div>
              <div className="text-lg font-bold mt-1 text-black dark:text-white">
                {Math.round(match.similarity.imageSimilarity * 100)}%
              </div>
            </div>
            <div className="p-3">
              <div className="label text-[var(--muted)] text-[10px]">Location/Time</div>
              <div className="text-lg font-bold mt-1 text-black dark:text-white">
                {Math.round(match.similarity.timeSimilarity * 100)}%
              </div>
            </div>
            <div className="p-3 bg-black text-white dark:bg-white dark:text-black">
              <div className="label text-white/70 dark:text-black/70 text-[10px]">Confidence</div>
              <div className="text-lg font-bold mt-1">
                {Math.round(match.similarity.finalScore * 100)}%
              </div>
            </div>
          </div>

          {/* Physical Custody Info */}
          <div className="p-4 border-2 border-black dark:border-neutral-800 bg-[var(--surface)] dark:bg-[#111F31] text-xs flex items-center justify-between font-mono-numbers">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-black dark:text-white" />
              <span>
                {isFoundInCustody 
                  ? 'Found property verified in Security Desk vault. Ready for authorized handover.'
                  : 'Physical item still pending drop-off by student finder.'}
              </span>
            </div>
            <span className="font-bold border border-black dark:border-white px-2 py-0.5 uppercase shrink-0">
              {match.foundItem.submissionStatus}
            </span>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Lost Item */}
            <div className="border-2 border-black dark:border-neutral-800 p-4 space-y-3 bg-white dark:bg-[#0B1422]">
              <div className="flex items-center justify-between border-b-2 border-black dark:border-neutral-800 pb-2">
                <span className="label text-[var(--muted)]">LOST REPORT // {match.lostItem.id}</span>
                <span className="font-mono-numbers text-xs font-bold text-black dark:text-white">
                  Reg: {match.lostItem.reporterRegNo}
                </span>
              </div>
              {match.lostItem.imageUrl && (
                <img
                  src={match.lostItem.imageUrl}
                  alt={match.lostItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-40 object-cover border-2 border-black dark:border-neutral-700"
                />
              )}
              <h4 className="font-bold text-sm text-black dark:text-white truncate">
                {match.lostItem.title}
              </h4>
              <p className="text-xs text-[var(--muted)] line-clamp-2">
                {match.lostItem.description}
              </p>
              <div className="text-xs font-mono-numbers text-[var(--muted)] pt-1">
                {match.lostItem.location} ({match.lostItem.eventDate})
              </div>
            </div>

            {/* Right: Found Item */}
            <div className="border-2 border-black dark:border-neutral-800 p-4 space-y-3 bg-white dark:bg-[#0B1422]">
              <div className="flex items-center justify-between border-b-2 border-black dark:border-neutral-800 pb-2">
                <span className="label text-[var(--muted)]">FOUND INTAKE // {match.foundItem.id}</span>
                <span className="font-mono-numbers text-xs font-bold text-black dark:text-white">
                  Finder: {match.foundItem.reporterRegNo}
                </span>
              </div>
              {match.foundItem.imageUrl && (
                <img
                  src={match.foundItem.imageUrl}
                  alt={match.foundItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-40 object-cover border-2 border-black dark:border-neutral-700"
                />
              )}
              <h4 className="font-bold text-sm text-black dark:text-white truncate">
                {match.foundItem.title}
              </h4>
              <p className="text-xs text-[var(--muted)] line-clamp-2">
                {match.foundItem.description}
              </p>
              <div className="text-xs font-mono-numbers text-[var(--muted)] pt-1">
                {match.foundItem.location} ({match.foundItem.eventDate})
              </div>
            </div>
          </div>

          {/* Decision Section */}
          {isPending ? (
            <div className="border-t-2 border-black dark:border-neutral-800 pt-4 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-[0.12em] text-black dark:text-white">
                  Officer Inspection Remarks *
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Record verification basis (e.g. Serial tag and visual marks confirmed)..."
                  className="w-full px-3 py-2 text-xs border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white focus:outline-none"
                />
              </div>

              {error && (
                <p className="text-xs text-red-700 dark:text-red-400 font-mono-numbers flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{error}</span>
                </p>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border-2 border-black dark:border-white text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Defer
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleReject}
                    className="px-4 py-2 border-2 border-black dark:border-white text-xs font-bold uppercase tracking-[0.12em] cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleApprove}
                    className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-[0.12em] cursor-pointer hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Authorizing...' : 'Approve Match & Issue Handover Key'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-t-2 border-black dark:border-neutral-800 pt-4 space-y-2">
              <div className="label text-[var(--muted)]">MODERATOR DECISION LOGGED</div>
              <div className="text-xs bg-[var(--surface)] dark:bg-[#111F31] p-3 border-2 border-black dark:border-neutral-800 font-mono-numbers">
                Remarks: <strong>{match.moderatorRemarks || 'Approved for collection'}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
