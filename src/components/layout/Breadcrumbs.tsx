import React from 'react';
import { useRouter, Link } from '../../lib/router';

interface BreadcrumbsProps {
  currentPath: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentPath }) => {
  const isDesk = currentPath.startsWith('/desk');
  const baseTitle = isDesk ? 'Security Office Desk' : 'Student Workspace';
  const basePath = isDesk ? '/desk' : '/app';

  // Parse path segments
  const segments = currentPath.split('/').filter(Boolean);
  // e.g. ['app', 'report', 'lost'] or ['desk', 'matches', 'MATCH-101']

  const getSegmentLabel = (seg: string, idx: number): string => {
    switch (seg) {
      case 'app': return 'Workspace';
      case 'desk': return 'Desk Command';
      case 'report': return 'Report Filing';
      case 'lost': return 'Lost Belonging';
      case 'found': return 'Found Belonging';
      case 'items': return 'Master Ledger';
      case 'matches': return 'Verified Matches';
      case 'notifications': return 'Dispatches & Alerts';
      case 'profile': return 'Student Identity';
      case 'submissions': return 'Physical Intake';
      case 'handovers': return 'Key Verification';
      case 'students': return 'Student Registry';
      default: return seg.toUpperCase();
    }
  };

  return (
    <nav className="flex items-center text-xs text-neutral-500 font-mono-numbers tracking-tight" aria-label="Breadcrumb">
      <Link href={basePath} className="uppercase font-bold text-black dark:text-white hover:text-[var(--navy)]">
        {baseTitle}
      </Link>

      {segments.slice(1).map((seg, i) => {
        const segPath = '/' + segments.slice(0, i + 2).join('/');
        const isLast = i === segments.length - 2;

        return (
          <React.Fragment key={segPath}>
            <span className="mx-2 text-neutral-400">/</span>
            {isLast ? (
              <span className="uppercase text-[var(--navy)] dark:text-blue-400 font-bold">
                {getSegmentLabel(seg, i)}
              </span>
            ) : (
              <Link href={segPath} className="uppercase hover:text-black dark:hover:text-white transition-colors">
                {getSegmentLabel(seg, i)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
