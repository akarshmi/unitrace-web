import React from 'react';
import { Item, Match } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  AlertCircle,
  KeyRound
} from 'lucide-react';

interface ItemDetailModalProps {
  item: Item | null;
  match?: Match | null;
  isOpen: boolean;
  onClose: () => void;
  onViewMatch?: (match: Match) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  match,
  isOpen,
  onClose,
  onViewMatch,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-[#0B1422] border-2 border-black dark:border-neutral-700 shadow-none my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="border-b-2 border-black dark:border-neutral-700 p-4 sm:p-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-numbers text-neutral-500 mb-1">
              <span>DOSSIER: {item.id}</span>
              <span aria-hidden="true">/</span>
              <span className="uppercase font-bold text-black dark:text-white">{item.type} REPORT</span>
              <span aria-hidden="true">/</span>
              <StatusBadge status={item.status} />
            </div>
            <h2 className="text-xl sm:text-2xl font-heading text-black dark:text-white uppercase tracking-tight">
              {item.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Main Visual & Key Parameters Split */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5">
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-56 object-cover border-2 border-black dark:border-neutral-700"
              />
              <div className="mt-2 text-[11px] font-mono-numbers text-neutral-500 text-center">
                Visual Evidence Index · SHA-256 Verified
              </div>
            </div>

            <div className="md:col-span-7 space-y-3">
              <div className="border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800 text-xs">
                <div className="p-2.5 flex justify-between">
                  <span className="text-neutral-500 uppercase">Category:</span>
                  <span className="font-semibold text-black dark:text-white">{item.category.replace(/_/g, ' ')}</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span className="text-neutral-500 uppercase">Campus Location:</span>
                  <span className="font-semibold text-black dark:text-white text-right">{item.location}</span>
                </div>
                <div className="p-2.5 flex justify-between font-mono-numbers">
                  <span className="text-neutral-500 uppercase">Incident Timestamp:</span>
                  <span className="font-semibold text-black dark:text-white">{item.eventDate} at {item.eventTime}</span>
                </div>
                <div className="p-2.5 flex justify-between font-mono-numbers">
                  <span className="text-neutral-500 uppercase">Reporting Student:</span>
                  <span className="font-semibold text-black dark:text-white">{item.reporterNameMasked} ({item.reporterRegNo})</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span className="text-neutral-500 uppercase">Physical Intake Status:</span>
                  <span className="font-semibold text-black dark:text-white">
                    {item.submissionStatus === 'RECEIVED_BY_DESK'
                      ? 'In Security Desk Custody'
                      : item.submissionStatus === 'PENDING_SUBMISSION'
                      ? 'Awaiting Physical Handover'
                      : 'Not Applicable (Lost Report)'}
                  </span>
                </div>
              </div>

              {item.deskNotes && (
                <div className="p-3 bg-neutral-100 dark:bg-slate-900 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300">
                  <div className="font-bold uppercase text-[10px] text-neutral-500 mb-0.5">Desk Officer Remarks</div>
                  <div>{item.deskNotes}</div>
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2 border-t border-neutral-200 dark:border-neutral-800 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
              Full Item Description & Distinguishing Characteristics
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed bg-neutral-50 dark:bg-slate-900/50 p-4 border border-neutral-200 dark:border-neutral-800">
              {item.description}
            </p>
          </div>

          {/* AI Matching Connection (If Exists) */}
          {match && (
            <div className="border-2 border-[#142B4A] dark:border-blue-500 bg-[#E8EDF3]/40 dark:bg-blue-950/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#142B4A] dark:text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#142B4A] dark:text-blue-300">
                    Associated AI Vector Match
                  </span>
                </div>
                <StatusBadge status={match.status} />
              </div>

              <div className="text-xs text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
                <span>
                  Similarity Confidence Score: <strong>{Math.round(match.similarity.finalScore * 100)}%</strong>
                </span>
                {match.oneTimeHandoverKey && (
                  <span className="font-mono-numbers font-bold bg-white dark:bg-black px-2 py-0.5 border border-black dark:border-neutral-700">
                    KEY: {match.oneTimeHandoverKey}
                  </span>
                )}
              </div>

              {onViewMatch && (
                <button
                  onClick={() => {
                    onClose();
                    onViewMatch(match);
                  }}
                  className="w-full py-2 bg-[#142B4A] hover:bg-[#1D3B63] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Inspect Full Match Details
                </button>
              )}
            </div>
          )}

          {/* Activity Timeline */}
          <div className="space-y-2 border-t border-neutral-200 dark:border-neutral-800 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
              Chain of Custody & Audit Log
            </h4>
            <div className="space-y-2 text-xs font-mono-numbers">
              <div className="flex items-center justify-between text-neutral-500 py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span>01. Report Registered on UniTrace Engine</span>
                <span>{item.createdAt.slice(0, 10)}</span>
              </div>
              {item.receivedAt && (
                <div className="flex items-center justify-between text-[#142B4A] dark:text-blue-400 font-semibold py-1 border-b border-neutral-100 dark:border-neutral-800">
                  <span>02. Physical Custody Verified at Security Desk</span>
                  <span>{item.receivedAt.slice(0, 10)}</span>
                </div>
              )}
              {item.status === 'MATCHED' && (
                <div className="flex items-center justify-between text-black dark:text-white font-semibold py-1">
                  <span>03. AI Match Identified & Approved by Moderator</span>
                  <span>In Progress</span>
                </div>
              )}
              {item.status === 'CLAIMED' && (
                <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-semibold py-1">
                  <span>04. Property Handover Completed to Claimant</span>
                  <span>CLAIMED</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-black dark:border-neutral-600 text-xs font-semibold uppercase tracking-wider text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
