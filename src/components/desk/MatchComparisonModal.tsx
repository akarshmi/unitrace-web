import React, { useState } from 'react';
import { Match, User } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { 
  X, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';

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
  currentUser,
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
      setError('Please provide moderator verification remarks before approving.');
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
        className="w-full max-w-4xl bg-white dark:bg-[#0B1422] border-2 border-black dark:border-neutral-700 shadow-none my-6"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="border-b-2 border-black dark:border-neutral-700 p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono-numbers uppercase text-neutral-500 mb-0.5">
              Desk Moderation Dossier // {match.id}
            </div>
            <h2 className="text-xl font-heading text-black dark:text-white uppercase tracking-tight">
              Match Comparison &amp; Verification
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={match.status} />
            <button
              onClick={onClose}
              className="p-1 border border-neutral-300 dark:border-neutral-700 hover:border-black text-neutral-500 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Similarity Metric Ribbons */}
          <div className="border-2 border-black dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#142B4A] dark:text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                  Automated Correspondence Metrics
                </span>
              </div>
              <span className="text-xs font-mono-numbers text-neutral-500">
                Visual &amp; textual similarity
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono-numbers">
              <div className="p-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-slate-800">
                <div className="text-[10px] uppercase text-neutral-500">Description</div>
                <div className="text-xl font-bold mt-1 text-black dark:text-white">
                  {Math.round(match.similarity.textSimilarity * 100)}%
                </div>
              </div>
              <div className="p-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-slate-800">
                <div className="text-[10px] uppercase text-neutral-500">Visual Match</div>
                <div className="text-xl font-bold mt-1 text-black dark:text-white">
                  {Math.round(match.similarity.imageSimilarity * 100)}%
                </div>
              </div>
              <div className="p-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-slate-800">
                <div className="text-[10px] uppercase text-neutral-500">Location/Time</div>
                <div className="text-xl font-bold mt-1 text-black dark:text-white">
                  {Math.round(match.similarity.timeSimilarity * 100)}%
                </div>
              </div>
              <div className="p-3 border-2 border-[#142B4A] dark:border-blue-400 bg-[#142B4A] text-white">
                <div className="text-[10px] uppercase text-blue-200">Combined Score</div>
                <div className="text-xl font-bold mt-1">
                  {Math.round(match.similarity.finalScore * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Physical Custody Verification Status */}
          <div className={`p-4 border text-xs flex items-center justify-between ${
            isFoundInCustody 
              ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300'
              : 'border-amber-600 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300'
          }`}>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                {isFoundInCustody 
                  ? 'Found item has been physically checked into the Security Desk vault. Ready for authorized handover.'
                  : 'Warning: Found item has NOT yet been physically surrendered to the desk. Moderator approval will require student to complete drop-off first.'}
              </span>
            </div>
            <span className="font-mono-numbers font-bold shrink-0">
              {match.foundItem.submissionStatus}
            </span>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Lost Item (Claimant) */}
            <div className="border-2 border-black dark:border-neutral-700 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <span className="text-xs font-mono-numbers uppercase text-neutral-500 font-bold">
                  Claimant Lost Report // {match.lostItem.id}
                </span>
                <span className="text-xs font-mono-numbers font-bold text-black dark:text-white">
                  Student: {match.lostItem.reporterRegNo}
                </span>
              </div>

              <img
                src={match.lostItem.imageUrl}
                alt={match.lostItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-48 object-cover border border-neutral-300 dark:border-neutral-700"
              />

              <h4 className="font-bold text-base text-black dark:text-white">
                {match.lostItem.title}
              </h4>

              <div className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-slate-900/40 p-3 border border-neutral-200 dark:border-neutral-800 leading-relaxed">
                {match.lostItem.description}
              </div>

              <div className="space-y-1 text-xs font-mono-numbers text-neutral-500 pt-1">
                <div>Venue: <strong className="text-black dark:text-white">{match.lostItem.location}</strong></div>
                <div>Lost at: <strong className="text-black dark:text-white">{match.lostItem.eventDate} ({match.lostItem.eventTime})</strong></div>
                <div>Category: <strong className="text-black dark:text-white">{match.lostItem.category}</strong></div>
              </div>
            </div>

            {/* Right: Found Item in Desk Custody */}
            <div className="border-2 border-[#142B4A] dark:border-neutral-700 p-4 space-y-3 bg-[#F5F7FA]/50 dark:bg-slate-900/30">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <span className="text-xs font-mono-numbers uppercase text-[#142B4A] dark:text-blue-400 font-bold">
                  Custody Intake Record // {match.foundItem.id}
                </span>
                <span className="text-xs font-mono-numbers font-bold text-black dark:text-white">
                  Finder: {match.foundItem.reporterRegNo}
                </span>
              </div>

              <img
                src={match.foundItem.imageUrl}
                alt={match.foundItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-48 object-cover border border-neutral-300 dark:border-neutral-700"
              />

              <h4 className="font-bold text-base text-black dark:text-white">
                {match.foundItem.title}
              </h4>

              <div className="text-xs text-neutral-600 dark:text-neutral-400 bg-white dark:bg-slate-900/60 p-3 border border-neutral-200 dark:border-neutral-800 leading-relaxed">
                {match.foundItem.description}
              </div>

              <div className="space-y-1 text-xs font-mono-numbers text-neutral-500 pt-1">
                <div>Recovered at: <strong className="text-black dark:text-white">{match.foundItem.location}</strong></div>
                <div>Intake at: <strong className="text-black dark:text-white">{match.foundItem.eventDate} ({match.foundItem.eventTime})</strong></div>
                <div>Custody Notes: <strong className="text-black dark:text-white">{match.foundItem.deskNotes || 'Vault Checked'}</strong></div>
              </div>
            </div>

          </div>

          {/* Moderator Remarks & Decision Section */}
          {isPending ? (
            <div className="border-t-2 border-black dark:border-neutral-700 pt-4 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-black dark:text-white">
                  Duty Moderator Verification Remarks *
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Record your inspection basis (e.g. Serial tag verified against student report, sleeve material matches)..."
                  className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 dark:bg-slate-900"
                />
              </div>

              {error && (
                <p className="text-xs text-red-700 font-mono-numbers flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{error}</span>
                </p>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-neutral-300 text-xs font-semibold uppercase cursor-pointer"
                >
                  Defer Review
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleReject}
                    className="px-4 py-2 border border-red-700 text-red-700 hover:bg-red-700 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Reject Match
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleApprove}
                    className="px-6 py-2 bg-[#142B4A] hover:bg-[#1D3B63] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {submitting ? 'Authorizing...' : 'Approve Match & Issue Handover Key'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-2">
              <div className="text-xs font-mono-numbers text-neutral-500 uppercase">
                Moderator Decision Logged
              </div>
              <div className="text-xs bg-neutral-100 dark:bg-slate-900 p-3 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
                Remarks: <strong>{match.moderatorRemarks || 'Approved for collection'}</strong>
              </div>
              {match.oneTimeHandoverKey && (
                <div className="flex items-center gap-2 text-xs font-mono-numbers">
                  <span className="text-neutral-500">Handover Key:</span>
                  <span className="font-bold text-black dark:text-white px-2 py-0.5 border border-black">
                    {match.oneTimeHandoverKey}
                  </span>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
