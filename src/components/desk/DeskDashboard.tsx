import React from 'react';
import { User, Item, Match, HandoverLog, ReceptionRecord } from '../../types';
import { DeskStats } from '../../lib/api/desk.api';
import { 
  Inbox, 
  GitCompare, 
  KeyRound, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';

interface DeskDashboardProps {
  stats: DeskStats;
  currentUser: User;
  items: Item[];
  matches: Match[];
  handovers: HandoverLog[];
  receptions: ReceptionRecord[];
  onNavigate: (section: any) => void;
  onOpenMatchModal: (match: Match) => void;
}

export const DeskDashboard: React.FC<DeskDashboardProps> = ({
  stats,
  currentUser,
  items,
  matches,
  handovers,
  onNavigate,
  onOpenMatchModal,
}) => {
  const pendingSubmissions = items.filter(
    i => i.type === 'FOUND' && i.submissionStatus === 'PENDING_SUBMISSION'
  );

  const pendingModerations = matches.filter(m => m.status === 'PENDING_REVIEW');

  return (
    <div className="space-y-8">
      {/* Authority Welcome Banner */}
      <div className="border-b-2 border-black dark:border-neutral-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--navy)] dark:text-blue-400 font-mono-numbers mb-1">
            Security Desk Command // Officer {currentUser.registrationNumber}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-black dark:text-white">
            Campus Lost &amp; Found Desk
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1 font-mono-numbers">
            Central Security Protocol Office · Block 29 Room 102
          </p>
        </div>

        {/* Rapid Desk Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('submissions')}
            className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-[0.12em] flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Inbox className="w-4 h-4" />
            <span>Physical Intake</span>
          </button>
          <button
            onClick={() => onNavigate('matches')}
            className="px-4 py-2.5 bg-[var(--navy)] hover:bg-[var(--navy-hover)] text-white text-xs font-bold uppercase tracking-[0.12em] flex items-center gap-2 cursor-pointer transition-colors"
          >
            <GitCompare className="w-4 h-4" />
            <span>Moderate Matches ({pendingModerations.length})</span>
          </button>
          <button
            onClick={() => onNavigate('handovers')}
            className="px-4 py-2.5 border-2 border-black dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-slate-800 text-black dark:text-white text-xs font-bold uppercase tracking-[0.12em] flex items-center gap-2 cursor-pointer transition-colors"
          >
            <KeyRound className="w-4 h-4" />
            <span>Handover Terminal</span>
          </button>
        </div>
      </div>

      {/* Desk Operating Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-2 border-black dark:border-neutral-800 divide-x-2 divide-y-2 md:divide-y-0 divide-black dark:divide-neutral-800 bg-white dark:bg-[#0B1422]">
        <div className="p-5">
          <div className="text-[11px] font-mono-numbers text-[var(--muted)] uppercase font-bold tracking-wider">
            Total Reports
          </div>
          <div className="text-3xl font-extrabold text-black dark:text-white font-mono-numbers mt-2">
            {stats.totalReports}
          </div>
          <div className="text-xs text-[var(--muted)] mt-1 font-mono-numbers">Master ledger count</div>
        </div>

        <div className="p-5">
          <div className="text-[11px] font-mono-numbers text-[var(--muted)] uppercase font-bold tracking-wider">
            Pending Physical Intake
          </div>
          <div className="text-3xl font-extrabold text-[var(--navy)] dark:text-blue-400 font-mono-numbers mt-2">
            {stats.pendingPhysicalSubmissions}
          </div>
          <div className="text-xs text-[var(--muted)] mt-1">Due by 5:00 PM</div>
        </div>

        <div className="p-5">
          <div className="text-[11px] font-mono-numbers text-[var(--muted)] uppercase font-bold tracking-wider">
            Matches to Review
          </div>
          <div className="text-3xl font-extrabold text-black dark:text-white font-mono-numbers mt-2">
            {stats.pendingAiMatches}
          </div>
          <div className="text-xs text-[var(--muted)] mt-1">AI confidence &ge; 80%</div>
        </div>

        <div className="p-5">
          <div className="text-[11px] font-mono-numbers text-[var(--muted)] uppercase font-bold tracking-wider">
            Pending Handover
          </div>
          <div className="text-3xl font-extrabold text-[var(--navy)] dark:text-blue-400 font-mono-numbers mt-2">
            {stats.pendingHandovers}
          </div>
          <div className="text-xs text-[var(--muted)] mt-1">Awaiting key verification</div>
        </div>
      </div>

      {/* 2-Column Split: Pending Submissions & Pending Moderation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Physical Intake Queue (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black dark:border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-black dark:text-white" />
              <h2 className="text-base font-bold uppercase tracking-tight text-black dark:text-white">
                Pending Physical Drop-offs
              </h2>
            </div>
            <button
              onClick={() => onNavigate('submissions')}
              className="text-xs font-bold text-[var(--navy)] dark:text-blue-400 hover:underline uppercase flex items-center gap-1 cursor-pointer"
            >
              <span>Intake Desk</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {pendingSubmissions.length === 0 ? (
            <div className="border-2 border-black dark:border-neutral-800 p-6 text-center text-xs text-[var(--muted)] bg-white dark:bg-[#0B1422] font-mono-numbers">
              All student-reported items have been physically checked in.
            </div>
          ) : (
            <div className="border-2 border-black dark:border-neutral-800 divide-y-2 divide-black dark:divide-neutral-800 bg-white dark:bg-[#0B1422]">
              {pendingSubmissions.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-cover border border-black dark:border-slate-700 shrink-0"
                    />
                    <div>
                      <div className="text-[11px] font-mono-numbers text-[var(--muted)]">
                        {item.id} · Student: {item.reporterRegNo}
                      </div>
                      <div className="font-bold text-sm text-black dark:text-white line-clamp-1">
                        {item.title}
                      </div>
                      <div className="text-xs text-[var(--navy)] dark:text-blue-400 font-bold font-mono-numbers">
                        Due: {item.submissionDeadline || 'Today 5:00 PM'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('submissions')}
                    className="px-3 py-1.5 bg-[var(--navy)] hover:bg-[var(--navy-hover)] text-white text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer transition-colors"
                  >
                    Receive
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: AI Match Moderation Queue (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black dark:border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-[var(--navy)] dark:text-blue-400" />
              <h2 className="text-base font-bold uppercase tracking-tight text-black dark:text-white">
                Match Moderation Queue
              </h2>
            </div>
            <button
              onClick={() => onNavigate('matches')}
              className="text-xs font-bold text-[var(--navy)] dark:text-blue-400 hover:underline uppercase flex items-center gap-1 cursor-pointer"
            >
              <span>Queue ({pendingModerations.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {pendingModerations.length === 0 ? (
            <div className="border-2 border-black dark:border-neutral-800 p-6 text-center text-xs text-[var(--muted)] bg-white dark:bg-[#0B1422] font-mono-numbers">
              No pending matches awaiting moderation review.
            </div>
          ) : (
            <div className="border-2 border-black dark:border-neutral-800 divide-y-2 divide-black dark:divide-neutral-800 bg-white dark:bg-[#0B1422]">
              {pendingModerations.slice(0, 3).map((match) => (
                <div key={match.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] font-mono-numbers">
                      <span className="font-bold text-black dark:text-white">{match.id}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[var(--navy)] dark:text-blue-400 font-bold">
                        {Math.round(match.similarity.finalScore * 100)}% Match
                      </span>
                    </div>
                    <div className="text-sm font-bold text-black dark:text-white line-clamp-1">
                      {match.lostItem.title}
                    </div>
                    <div className="text-xs text-[var(--muted)] font-mono-numbers">
                      Lost: {match.lostItem.reporterRegNo} · Location: {match.foundItem.location}
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenMatchModal(match)}
                    className="px-3 py-1.5 border-2 border-black dark:border-neutral-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer transition-colors"
                  >
                    Moderate
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Recent Handover Audit Activity */}
      <div className="border-t-2 border-black dark:border-neutral-800 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold uppercase tracking-tight text-black dark:text-white">
            Recent Custody Releases
          </h2>
          <button
            onClick={() => onNavigate('handovers')}
            className="text-xs font-bold text-[var(--navy)] dark:text-blue-400 hover:underline uppercase cursor-pointer"
          >
            All Handover Records ({handovers.length})
          </button>
        </div>

        {handovers.length === 0 ? (
          <div className="border-2 border-black dark:border-neutral-800 p-6 text-center text-xs text-[var(--muted)] bg-white dark:bg-[#0B1422] font-mono-numbers">
            No completed handovers logged today.
          </div>
        ) : (
          <div className="border-2 border-black dark:border-neutral-800 overflow-x-auto bg-white dark:bg-[#0B1422]">
            <table className="w-full text-left text-xs font-mono-numbers">
              <thead className="bg-[var(--surface)] dark:bg-slate-900 border-b-2 border-black dark:border-neutral-800 uppercase font-bold">
                <tr>
                  <th className="p-3">Log ID</th>
                  <th className="p-3">Item Title</th>
                  <th className="p-3">Claimant Reg</th>
                  <th className="p-3">Officer</th>
                  <th className="p-3">Key Used</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black dark:divide-neutral-800">
                {handovers.slice(0, 5).map(h => (
                  <tr key={h.id} className="hover:bg-neutral-50 dark:hover:bg-slate-900/50">
                    <td className="p-3 font-bold">{h.id}</td>
                    <td className="p-3 font-sans font-medium text-black dark:text-white max-w-xs truncate">{h.itemTitle}</td>
                    <td className="p-3">{h.claimantRegNo}</td>
                    <td className="p-3 font-sans">{h.moderatorName}</td>
                    <td className="p-3 font-bold">{h.handoverKeyUsed}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 border-2 text-[10px] font-bold ${
                        h.status === 'SUCCESS' ? 'border-black bg-black text-white dark:border-white' : 'border-neutral-400 text-neutral-600'
                      }`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="p-3 text-[var(--muted)]">{h.completedAt.slice(0, 16).replace('T', ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
