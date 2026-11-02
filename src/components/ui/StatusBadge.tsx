import React from 'react';
import { ItemStatus, MatchStatus, PhysicalSubmissionStatus } from '../../types';

interface StatusBadgeProps {
  status: ItemStatus | MatchStatus | PhysicalSubmissionStatus | string;
  type?: 'item' | 'match' | 'submission';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  // Format human-readable text
  const label = status.replace(/_/g, ' ');

  // Swiss minimalist style: Sharp rectangular border, unboxed or crisp high-contrast
  let styleClasses = 'border border-black text-black bg-white';

  switch (status) {
    case 'OPEN':
      styleClasses = 'border border-black text-black bg-white';
      break;
    case 'MATCHED':
    case 'PENDING_REVIEW':
      styleClasses = 'border border-[#142B4A] text-[#142B4A] bg-[#E8EDF3] font-semibold';
      break;
    case 'APPROVED':
    case 'RECEIVED_BY_DESK':
      styleClasses = 'border border-black bg-black text-white font-medium';
      break;
    case 'CLAIMED':
      styleClasses = 'border border-[#142B4A] bg-[#142B4A] text-white font-medium';
      break;
    case 'REJECTED':
    case 'CLOSED':
      styleClasses = 'border border-neutral-300 text-neutral-500 bg-neutral-100 line-through';
      break;
    case 'PENDING_SUBMISSION':
      styleClasses = 'border border-[#142B4A] text-[#142B4A] bg-white font-medium border-dashed';
      break;
    case 'NOT_APPLICABLE':
      return <span className="text-xs text-neutral-400">N/A</span>;
    default:
      styleClasses = 'border border-neutral-400 text-neutral-700 bg-white';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] uppercase tracking-wider font-mono-numbers shrink-0 ${styleClasses} ${className}`}
    >
      {label}
    </span>
  );
};
