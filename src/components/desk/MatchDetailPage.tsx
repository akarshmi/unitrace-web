import React, { useState } from 'react';
import { useRouter } from '../../lib/router';
import { Match, User } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

interface MatchDetailPageProps {
  match: Match | null;
  currentUser: User;
  onApprove: (matchId: string, remarks: string) => Promise<void>;
  onReject: (matchId: string, remarks: string) => Promise<void>;
}

export const MatchDetailPage: React.FC<MatchDetailPageProps> = ({
  match,
  onApprove,
  onReject,
}) => {
  const { navigate } = useRouter();
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!match) {
    return (
      <div className="border-2 border-black dark:border-neutral-800 p-12 text-center bg-white dark:bg-[#0B1422]">
        <h2 className="text-xl font-bold uppercase text-black dark:text-white mb-2">Match Record Not Found</h2>
        <p className="text-xs text-[var(--muted)] mb-6">The match reference could not be located in the desk queue.</p>
        <button
          onClick={() => navigate('/desk/matches')}
          className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
        >
          Return to Queue
        </button>
      </div>
    );
  }

  const isPending = match.status === 'PENDING_REVIEW';
  const isFoundInCustody = match.foundItem.submissionStatus === 'RECEIVED_BY_DESK';

  const handleApprove = async () => {
    if (!remarks.trim()) {
      setError('Please provide officer verification remarks before approving.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onApprove(match.id, remarks);
      navigate('/desk/matches');
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
      navigate('/desk/matches');
    } catch (err: any) {
      setError(err.message || 'Failed to reject match.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-black dark:border-neutral-800 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/desk/matches')}
            className="text-xs font-mono-numbers text-[var(--muted)] hover:text-black dark:hover:text-white flex items-center gap-1.5 uppercase font-bold mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Moderation Queue</span>
          </button>
          <div className="text-xs font-mono-numbers text-[var(--muted)] uppercase font-bold mb-1">
            MODERATION DOSSIER // {match.id}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black dark:text-white">
            Match Inspection &amp; Decision
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={match.status} />
        </div>
      </div>

      {/* Similarity Metrics Strip */}
      <div className="border-2 border-black dark:border-neutral-800 p-5 bg-[var(--surface)] dark:bg-slate-900/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--navy)] dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
              AI Matching Metrics
            </span>
          </div>
          <span className="text-xs font-mono-numbers text-[var(--muted)]">
            Verified Factors
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono-numbers">
          <div className="p-3 border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-800">
            <div className="text-[10px] uppercase text-[var(--muted)] font-bold">Description Match</div>
            <div className="text-xl font-bold mt-1 text-black dark:text-white">
              {Math.round(match.similarity.textSimilarity * 100)}%
            </div>
          </div>
          <div className="p-3 border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-800">
            <div className="text-[10px] uppercase text-[var(--muted)] font-bold">Visual Match</div>
            <div className="text-xl font-bold mt-1 text-black dark:text-white">
              {Math.round(match.similarity.imageSimilarity * 100)}%
            </div>
          </div>
          <div className="p-3 border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-800">
            <div className="text-[10px] uppercase text-[var(--muted)] font-bold">Location &amp; Time</div>
            <div className="text-xl font-bold mt-1 text-black dark:text-white">
              {Math.round(match.similarity.timeSimilarity * 100)}%
            </div>
          </div>
          <div className="p-3 border-2 border-[var(--navy)] bg-[var(--navy)] text-white">
            <div className="text-[10px] uppercase font-bold text-neutral-200">Overall Confidence</div>
            <div className="text-xl font-bold mt-1">
              {Math.round(match.similarity.finalScore * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Custody Info */}
      <div className="p-4 border-2 border-black bg-white dark:bg-slate-900 text-xs flex items-center justify-between font-mono-numbers">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[var(--navy)] shrink-0" />
          <span>
            {isFoundInCustody 
              ? 'Found item verified in Security Vault. Ready for collection upon approval.'
              : 'Physical item still pending drop-off by student finder.'}
          </span>
        </div>
        <span className="font-bold shrink-0">
          STATUS: {match.foundItem.submissionStatus}
        </span>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Lost Item */}
        <div className="border-2 border-black dark:border-neutral-700 p-5 space-y-3 bg-white dark:bg-[#0B1422]">
          <div className="flex items-center justify-between border-b-2 border-black dark:border-neutral-800 pb-2">
            <span className="text-xs font-mono-numbers uppercase text-[var(--muted)] font-bold">
              Claimant Report // {match.lostItem.id}
            </span>
            <span className="text-xs font-mono-numbers font-bold text-black dark:text-white">
              Student ID: {match.lostItem.reporterRegNo}
            </span>
          </div>

          <img
            src={match.lostItem.imageUrl}
            alt={match.lostItem.title}
            referrerPolicy="no-referrer"
            className="w-full h-48 object-cover border-2 border-black"
          />

          <h3 className="font-bold text-base text-black dark:text-white">
            {match.lostItem.title}
          </h3>

          <div className="text-xs text-[var(--muted)] bg-[var(--surface)] dark:bg-slate-900/40 p-3 border-2 border-black leading-relaxed">
            {match.lostItem.description}
          </div>

          <div className="space-y-1 text-xs font-mono-numbers text-[var(--muted)] pt-1">
            <div>Location: <strong className="text-black dark:text-white">{match.lostItem.location}</strong></div>
            <div>Lost: <strong className="text-black dark:text-white">{match.lostItem.eventDate} ({match.lostItem.eventTime})</strong></div>
            <div>Category: <strong className="text-black dark:text-white">{match.lostItem.category}</strong></div>
          </div>
        </div>

        {/* Right: Found Item in Custody */}
        <div className="border-2 border-black dark:border-neutral-700 p-5 space-y-3 bg-[var(--surface)] dark:bg-slate-900/30">
          <div className="flex items-center justify-between border-b-2 border-black dark:border-neutral-800 pb-2">
            <span className="text-xs font-mono-numbers uppercase text-[var(--navy)] dark:text-blue-400 font-bold">
              Surrendered Property // {match.foundItem.id}
            </span>
            <span className="text-xs font-mono-numbers font-bold text-black dark:text-white">
              Finder ID: {match.foundItem.reporterRegNo}
            </span>
          </div>

          <img
            src={match.foundItem.imageUrl}
            alt={match.foundItem.title}
            referrerPolicy="no-referrer"
            className="w-full h-48 object-cover border-2 border-black"
          />

          <h3 className="font-bold text-base text-black dark:text-white">
            {match.foundItem.title}
          </h3>

          <div className="text-xs text-[var(--muted)] bg-white dark:bg-slate-900/60 p-3 border-2 border-black leading-relaxed">
            {match.foundItem.description}
          </div>

          <div className="space-y-1 text-xs font-mono-numbers text-[var(--muted)] pt-1">
            <div>Recovered at: <strong className="text-black dark:text-white">{match.foundItem.location}</strong></div>
            <div>Intake Date: <strong className="text-black dark:text-white">{match.foundItem.eventDate} ({match.foundItem.eventTime})</strong></div>
            <div>Locker Placement: <strong className="text-black dark:text-white">{match.foundItem.deskNotes || 'Vault Locker B-04'}</strong></div>
          </div>
        </div>

      </div>

      {/* Moderator Decision Area */}
      {isPending ? (
        <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#0B1422] p-6 space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-[0.12em] text-black dark:text-white">
              Duty Officer Decision Remarks *
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Record inspection notes (e.g. Serial tag and visual identifiers confirmed against student report)..."
              className="w-full px-3 py-2.5 text-xs border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white"
            />
          </div>

          {error && (
            <p className="text-xs text-black dark:text-white font-mono-numbers flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-[var(--navy)]" />
              <span>{error}</span>
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t-2 border-black dark:border-neutral-800">
            <button
              type="button"
              onClick={() => navigate('/desk/matches')}
              className="px-4 py-2 border-2 border-black text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-neutral-100"
            >
              Back
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={submitting}
                onClick={handleReject}
                className="px-4 py-2 border-2 border-black hover:bg-neutral-100 text-xs font-bold uppercase tracking-[0.12em] transition-colors cursor-pointer"
              >
                Reject Match
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleApprove}
                className="px-6 py-2 bg-[var(--navy)] hover:bg-[var(--navy-hover)] text-white text-xs font-bold uppercase tracking-[0.12em] transition-colors cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Authorizing...' : 'Approve Match & Issue Handover Key'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#0B1422] p-5 space-y-2">
          <div className="text-xs font-mono-numbers text-[var(--muted)] uppercase font-bold">
            Moderator Decision Logged
          </div>
          <div className="text-xs bg-[var(--surface)] dark:bg-slate-900 p-3 border-2 border-black font-mono-numbers">
            Officer Remarks: <strong>{match.moderatorRemarks || 'Approved'}</strong>
          </div>
          {match.oneTimeHandoverKey && (
            <div className="flex items-center gap-2 text-xs font-mono-numbers pt-1">
              <span className="text-[var(--muted)] font-bold">Handover Key:</span>
              <span className="font-bold text-black dark:text-white px-2.5 py-1 border-2 border-black bg-white dark:bg-black">
                {match.oneTimeHandoverKey}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
