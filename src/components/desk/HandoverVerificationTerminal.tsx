import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Lock, RefreshCw, ShieldCheck } from 'lucide-react';
import { DeskMatch } from '../../lib/api/adapters';
import { deskApi } from '../../lib/api/desk.api';
import { Link, PageHeader, PortalShell, ActionLink } from '../portal-shell';

interface HandoverVerificationTerminalProps {
  onOpenHandover: (matchId: string) => void;
}

export const HandoverVerificationTerminal: React.FC<HandoverVerificationTerminalProps> = ({
  onOpenHandover,
}) => {
  const [matches, setMatches] = useState<DeskMatch[]>([]);
  const [activeMatch, setActiveMatch] = useState<DeskMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const loaded: DeskMatch[] = [];
      let page = 0;
      let response = await deskApi.getMatches('APPROVED', page);
      loaded.push(...response.content);
      while (!response.last) {
        page += 1;
        response = await deskApi.getMatches('APPROVED', page);
        loaded.push(...response.content);
      }
      setMatches(loaded);
      setActiveMatch(current => current && loaded.some(match => match.id === current.id)
        ? loaded.find(match => match.id === current.id) || current
        : loaded[0] || null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load approved handovers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMatches();
  }, []);

  return (
    <PortalShell>
      <PageHeader
        eyebrow="CAMPUS SECURITY DESK / RELEASE"
        title="HANDOVER TERMINAL."
        copy="Validate the student registration number and single-use key before releasing property."
        action={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <ActionLink href="/desk/items" className="w-full sm:w-auto text-center">Master Ledger</ActionLink>
            <Link href="/desk/matches" className="border-2 border-black dark:border-white px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors w-full sm:w-auto text-center">
              Match Queue
            </Link>
          </div>
        }
      />

      <div className="py-4 sm:py-6 space-y-6">
        {error && <div className="border-2 border-red-700 p-4 text-xs text-red-700 dark:text-red-300"><AlertCircle className="inline w-4 h-4 mr-1" />{error}</div>}
        {loading ? (
          <div className="border-2 border-black p-10 text-center text-xs text-[var(--muted)]">Loading approved handovers...</div>
        ) : matches.length === 0 ? (
          <div className="border-2 border-black dark:border-neutral-800 p-10 text-center bg-white dark:bg-[#0B1422]">
            <p className="font-bold uppercase text-black dark:text-white">No approved handovers</p>
            <p className="mt-2 text-xs text-[var(--muted)]">Approved matches will appear here after moderation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 border-2 border-black dark:border-neutral-800 bg-white dark:bg-[#0B1422] divide-y-2 divide-black dark:divide-neutral-800">
              <div className="p-4 text-xs font-bold uppercase tracking-wider">Approved Queue ({matches.length})</div>
              {matches.map(match => (
                <button key={match.id} onClick={() => setActiveMatch(match)} className={`w-full text-left p-4 cursor-pointer ${activeMatch?.id === match.id ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-[var(--surface)]'}`}>
                  <div className="text-[10px] font-mono-numbers opacity-70">{match.id}</div>
                  <div className="font-bold text-sm truncate mt-1">{match.lostItem.title}</div>
                  <div className="text-[10px] font-mono-numbers mt-1 opacity-70">Expires: {match.handoverKeyExpiresAt || 'Unavailable'}</div>
                </button>
              ))}
            </div>
            {activeMatch && (
              <div className="lg:col-span-8 border-2 border-black dark:border-neutral-800 bg-white dark:bg-[#0B1422] p-6 space-y-5">
                <div className="flex items-start gap-4 border-b-2 border-black dark:border-neutral-800 pb-4">
                  {activeMatch.lostItem.imageUrl && <img src={activeMatch.lostItem.imageUrl} alt={activeMatch.lostItem.title} referrerPolicy="no-referrer" className="w-16 h-16 object-cover border-2 border-black shrink-0" />}
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs font-mono-numbers text-[var(--muted)] font-bold">DOSSIER: {activeMatch.id}</div>
                    <h3 className="text-base font-bold text-black dark:text-white truncate">{activeMatch.lostItem.title}</h3>
                    <div className="text-xs text-[var(--muted)] font-mono-numbers">Claimant registration: {activeMatch.lostItem.reporterRegistrationNumber}</div>
                    <div className="text-xs text-[var(--muted)] font-mono-numbers">Status: {activeMatch.status}</div>
                  </div>
                </div>
                {activeMatch.handoverFailedAttempts >= 3 && (
                  <div className="border-2 border-red-700 p-4 text-xs text-red-700 dark:text-red-300">
                    <Lock className="inline w-4 h-4 mr-1" />Handover attempts are locked. Open the dossier to reissue the key.
                  </div>
                )}
                <button onClick={() => onOpenHandover(activeMatch.id)} className="w-full px-5 py-3 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-[.12em] cursor-pointer">
                  Open Verification Dossier →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </PortalShell>
  );
};
