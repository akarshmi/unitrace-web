import React, { useState } from 'react';
import { Match, MatchStatus, User } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { 
  GitCompare, 
  ArrowRight 
} from 'lucide-react';

interface MatchModerationQueueProps {
  matches: Match[];
  currentUser: User;
  onOpenMatchModal: (match: Match) => void;
  onRefreshData: () => void;
}

export const MatchModerationQueue: React.FC<MatchModerationQueueProps> = ({
  matches,
  onOpenMatchModal,
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | MatchStatus>('PENDING_REVIEW');

  const filteredMatches = matches.filter(m => {
    if (statusFilter === 'ALL') return true;
    return m.status === statusFilter;
  });

  const counts = {
    PENDING_REVIEW: matches.filter(m => m.status === 'PENDING_REVIEW').length,
    APPROVED: matches.filter(m => m.status === 'APPROVED').length,
    CLAIMED: matches.filter(m => m.status === 'CLAIMED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-black dark:border-neutral-800 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--navy)] dark:text-blue-400 font-mono-numbers mb-1">
            Section // 04 · Moderation Gate
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black dark:text-white">
            Match Moderation Queue
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Review candidate pairs surfaced by AI matching before authorizing one-time collection keys.
          </p>
        </div>

        <div className="text-xs font-mono-numbers text-[var(--muted)]">
          Pending Action: <strong className="text-black dark:text-white">{counts.PENDING_REVIEW}</strong>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-2 border-black dark:border-neutral-800 bg-[var(--surface)] dark:bg-slate-900 p-1">
        <button
          onClick={() => setStatusFilter('PENDING_REVIEW')}
          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'PENDING_REVIEW'
              ? 'bg-[var(--navy)] text-white'
              : 'bg-transparent text-black dark:text-white hover:bg-neutral-200'
          }`}
        >
          <span>Pending Review</span>
          <span className="font-mono-numbers text-[10px]">({counts.PENDING_REVIEW})</span>
        </button>

        <button
          onClick={() => setStatusFilter('APPROVED')}
          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'APPROVED'
              ? 'bg-black text-white'
              : 'bg-transparent text-black dark:text-white hover:bg-neutral-200'
          }`}
        >
          <span>Approved for Collection</span>
          <span className="font-mono-numbers text-[10px]">({counts.APPROVED})</span>
        </button>

        <button
          onClick={() => setStatusFilter('CLAIMED')}
          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'CLAIMED'
              ? 'bg-black text-white'
              : 'bg-transparent text-black dark:text-white hover:bg-neutral-200'
          }`}
        >
          <span>Claimed</span>
          <span className="font-mono-numbers text-[10px]">({counts.CLAIMED})</span>
        </button>

        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'ALL'
              ? 'bg-black text-white'
              : 'bg-transparent text-black dark:text-white hover:bg-neutral-200'
          }`}
        >
          <span>All ({matches.length})</span>
        </button>
      </div>

      {/* Match Cards List */}
      {filteredMatches.length === 0 ? (
        <div className="border-2 border-black dark:border-neutral-800 p-12 text-center bg-white dark:bg-[#0B1422]">
          <GitCompare className="w-8 h-8 text-[var(--navy)] mx-auto mb-2" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">
            No matches in this view
          </h3>
          <p className="text-xs text-[var(--muted)] mt-1">
            New candidate matches will appear here as students report items.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map(match => (
            <div
              key={match.id}
              className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#0B1422] p-6 space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono-numbers font-bold text-black dark:text-white">
                    PAIR REF: {match.id}
                  </span>
                  <span aria-hidden="true" className="text-neutral-400">·</span>
                  <span className="text-xs font-mono-numbers text-[var(--muted)]">
                    Date: {match.createdAt.slice(0, 10)}
                  </span>
                  <span aria-hidden="true" className="text-neutral-400">·</span>
                  <StatusBadge status={match.status} />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-numbers text-[var(--muted)]">Confidence:</span>
                  <span className="text-xs font-bold font-mono-numbers px-2 py-0.5 bg-[var(--navy)] text-white">
                    {Math.round(match.similarity.finalScore * 100)}% Match
                  </span>
                </div>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lost Report */}
                <div className="p-4 border-2 border-black dark:border-neutral-800 flex items-start gap-4">
                  <img
                    src={match.lostItem.imageUrl}
                    alt="Lost"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-cover border border-black shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono-numbers uppercase text-[var(--muted)] font-bold">
                      LOST: {match.lostItem.id} · REG: {match.lostItem.reporterRegNo}
                    </div>
                    <div className="font-bold text-sm text-black dark:text-white line-clamp-1">
                      {match.lostItem.title}
                    </div>
                    <div className="text-xs text-[var(--muted)] line-clamp-2">
                      {match.lostItem.description}
                    </div>
                    <div className="text-[11px] text-[var(--muted)] font-mono-numbers">
                      {match.lostItem.location} ({match.lostItem.eventDate})
                    </div>
                  </div>
                </div>

                {/* Found Intake */}
                <div className="p-4 border-2 border-black dark:border-neutral-800 flex items-start gap-4 bg-[var(--surface)] dark:bg-slate-900/40">
                  <img
                    src={match.foundItem.imageUrl}
                    alt="Found"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-cover border border-black shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono-numbers uppercase text-[var(--navy)] dark:text-blue-400 font-bold">
                      FOUND: {match.foundItem.id} · {match.foundItem.submissionStatus}
                    </div>
                    <div className="font-bold text-sm text-black dark:text-white line-clamp-1">
                      {match.foundItem.title}
                    </div>
                    <div className="text-xs text-[var(--muted)] line-clamp-2">
                      {match.foundItem.description}
                    </div>
                    <div className="text-[11px] text-[var(--muted)] font-mono-numbers">
                      {match.foundItem.location} ({match.foundItem.eventDate})
                    </div>
                  </div>
                </div>
              </div>

              {/* Similarity Breakdown & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-4 text-xs font-mono-numbers text-[var(--muted)]">
                  <span>Visual: <strong className="text-black dark:text-white">{Math.round(match.similarity.imageSimilarity * 100)}%</strong></span>
                  <span>·</span>
                  <span>Description: <strong className="text-black dark:text-white">{Math.round(match.similarity.textSimilarity * 100)}%</strong></span>
                  <span>·</span>
                  <span>Location: <strong className="text-black dark:text-white">{Math.round(match.similarity.timeSimilarity * 100)}%</strong></span>
                </div>

                <button
                  onClick={() => onOpenMatchModal(match)}
                  className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-[0.12em] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Review Decision</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
