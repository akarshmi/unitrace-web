import React, { useState } from 'react';
import { Match } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  KeyRound, 
  ShieldCheck, 
  MapPin, 
  Calendar 
} from 'lucide-react';

interface StudentMatchesViewProps {
  matches: Match[];
  studentId: string;
  onOpenMatchDetail?: (match: Match) => void;
}

export const StudentMatchesView: React.FC<StudentMatchesViewProps> = ({
  matches,
  studentId,
}) => {
  const studentMatches = matches.filter(
    m => m.lostItem.reporterId === studentId || m.foundItem.reporterId === studentId
  );
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(studentMatches[0] || null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-black dark:border-neutral-800 pb-4">
        <div className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--navy)] dark:text-blue-400 font-mono-numbers mb-1">
          Verification Queue // 05
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black dark:text-white">
          Verified Matches
        </h1>
        <p className="text-xs text-[var(--muted)] mt-1">
          Candidate matches identified between your reports and items cataloged by Campus Security.
        </p>
      </div>

      {studentMatches.length === 0 ? (
        <div className="border-2 border-black dark:border-neutral-800 p-12 text-center bg-white dark:bg-[#0B1422]">
          <Sparkles className="w-8 h-8 text-[var(--navy)] mx-auto mb-3" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">
            No Active Matches Detected
          </h3>
          <p className="text-xs text-[var(--muted)] mt-1 max-w-sm mx-auto">
            UniTrace continuously scans newly surrendered items. You will receive an instant notification when a match is verified.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Match Selection List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold font-mono-numbers uppercase tracking-wider text-[var(--muted)]">
              Candidate Pairs ({studentMatches.length})
            </div>

            {studentMatches.map(match => {
              const isSelected = selectedMatch?.id === match.id;
              const isApproved = match.status === 'APPROVED';

              return (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className={`border-2 p-4 cursor-pointer transition-colors text-left ${
                    isSelected
                      ? 'border-black bg-white dark:bg-[#111F31] shadow-none'
                      : 'border-neutral-300 dark:border-neutral-800 bg-[var(--surface)] dark:bg-[#0B1422] hover:border-black'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono-numbers font-bold text-[var(--muted)]">
                      REF: {match.id}
                    </span>
                    <StatusBadge status={match.status} />
                  </div>

                  <h3 className="text-sm font-bold text-black dark:text-white line-clamp-1 mb-2">
                    {match.lostItem.title}
                  </h3>

                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2 shrink-0">
                      <img
                        src={match.lostItem.imageUrl}
                        alt="Lost"
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover border-2 border-black"
                      />
                      <img
                        src={match.foundItem.imageUrl}
                        alt="Found"
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover border-2 border-black"
                      />
                    </div>

                    <div className="space-y-0.5 text-xs font-mono-numbers">
                      <div className="text-[var(--muted)]">Match Confidence</div>
                      <div className="font-bold text-sm text-[var(--navy)] dark:text-blue-400">
                        {Math.round(match.similarity.finalScore * 100)}% Match
                      </div>
                    </div>
                  </div>

                  {isApproved && (
                    <div className="mt-3 pt-2 border-t-2 border-black dark:border-neutral-700 flex items-center justify-between text-xs">
                      <span className="text-black dark:text-white font-bold flex items-center gap-1">
                        <KeyRound className="w-3.5 h-3.5 text-[var(--navy)]" />
                        <span>Key Issued</span>
                      </span>
                      <span className="font-mono-numbers font-bold text-[var(--navy)] dark:text-blue-300">
                        {match.oneTimeHandoverKey}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Comparison & Collection Details (7 cols) */}
          <div className="lg:col-span-7">
            {selectedMatch ? (
              <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#0B1422] p-6 space-y-6">
                
                {/* Header & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black dark:border-neutral-700 pb-4">
                  <div>
                    <div className="text-xs font-mono-numbers uppercase text-[var(--muted)] font-bold">
                      Match File
                    </div>
                    <h2 className="text-xl font-bold uppercase tracking-tight text-black dark:text-white">
                      {selectedMatch.id}
                    </h2>
                  </div>
                  <StatusBadge status={selectedMatch.status} />
                </div>

                {/* Side-by-Side Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Lost Item */}
                  <div className="border-2 border-black dark:border-neutral-700 p-4 space-y-3">
                    <div className="text-[11px] font-mono-numbers uppercase text-[var(--muted)] font-bold">
                      Your Lost Report ({selectedMatch.lostItem.id})
                    </div>
                    <img
                      src={selectedMatch.lostItem.imageUrl}
                      alt="Lost"
                      referrerPolicy="no-referrer"
                      className="w-full h-36 object-cover border border-black"
                    />
                    <div className="font-bold text-sm text-black dark:text-white">
                      {selectedMatch.lostItem.title}
                    </div>
                    <p className="text-xs text-[var(--muted)] line-clamp-2">
                      {selectedMatch.lostItem.description}
                    </p>
                    <div className="text-[11px] font-mono-numbers text-[var(--muted)]">
                      {selectedMatch.lostItem.location} · {selectedMatch.lostItem.eventDate}
                    </div>
                  </div>

                  {/* Found Item */}
                  <div className="border-2 border-black dark:border-neutral-700 p-4 space-y-3 bg-[var(--surface)] dark:bg-slate-900/60">
                    <div className="text-[11px] font-mono-numbers uppercase text-[var(--navy)] dark:text-blue-400 font-bold">
                      Surrendered Property ({selectedMatch.foundItem.id})
                    </div>
                    <img
                      src={selectedMatch.foundItem.imageUrl}
                      alt="Found"
                      referrerPolicy="no-referrer"
                      className="w-full h-36 object-cover border border-black"
                    />
                    <div className="font-bold text-sm text-black dark:text-white">
                      {selectedMatch.foundItem.title}
                    </div>
                    <p className="text-xs text-[var(--muted)] line-clamp-2">
                      {selectedMatch.foundItem.description}
                    </p>
                    <div className="text-[11px] font-mono-numbers text-[var(--muted)]">
                      {selectedMatch.foundItem.location} · {selectedMatch.foundItem.eventDate}
                    </div>
                  </div>
                </div>

                {/* Collection Directives (If Approved) */}
                {selectedMatch.status === 'APPROVED' ? (
                  <div className="border-2 border-black dark:border-neutral-700 bg-[var(--surface)] dark:bg-slate-900/60 p-5 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--navy)] dark:text-blue-300">
                      <CheckCircle2 className="w-4 h-4 text-[var(--navy)] dark:text-blue-400" />
                      <span>Collection Authorized by Campus Security</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-white dark:bg-black border-2 border-black dark:border-neutral-700">
                        <div className="text-[10px] font-mono-numbers uppercase text-[var(--muted)] font-bold">
                          One-Time Verification Key
                        </div>
                        <div className="text-2xl font-bold font-mono-numbers text-black dark:text-white mt-1">
                          {selectedMatch.oneTimeHandoverKey}
                        </div>
                        <div className="text-[10px] text-[var(--muted)] mt-1 font-mono-numbers">
                          Show this key at Security Desk
                        </div>
                      </div>

                      <div className="p-3 bg-white dark:bg-black border-2 border-black dark:border-neutral-700 text-xs">
                        <div className="text-[10px] font-mono-numbers uppercase text-[var(--muted)] font-bold">
                          Pickup Location
                        </div>
                        <div className="font-bold text-black dark:text-white mt-1">
                          Security Office, Block 29 Room 102
                        </div>
                        <div className="text-[10px] text-[var(--muted)] mt-1">
                          Present Student ID Card
                        </div>
                      </div>
                    </div>
                  </div>
                ) : selectedMatch.status === 'PENDING_REVIEW' ? (
                  <div className="border-2 border-black dark:border-neutral-800 p-4 bg-white dark:bg-[#0B1422] text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-black dark:text-white">
                      <Clock className="w-4 h-4 text-[var(--navy)]" />
                      <span>Security Review in Progress</span>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      A security officer is verifying this item in physical custody. Once approved, your collection key will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="border-2 border-black dark:border-neutral-800 p-4 bg-[var(--surface)] dark:bg-slate-900 text-xs text-[var(--muted)] font-mono-numbers">
                    Item successfully collected and closed in campus ledger.
                  </div>
                )}

              </div>
            ) : (
              <div className="border-2 border-black p-8 text-center text-xs text-[var(--muted)] font-mono-numbers">
                Select a match from the list to view item comparison.
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
