import React, { useEffect, useState } from 'react';
import { BackendItemResponse } from '../../lib/api/backend.types';
import { deskApi } from '../../lib/api/desk.api';
import { PageHeader, PortalShell, ActionLink, Link } from '../portal-shell';
import { Check, AlertCircle } from 'lucide-react';

interface PhysicalReceptionModuleProps {
  preselectedItem?: BackendItemResponse | null;
}

export const PhysicalReceptionModule: React.FC<PhysicalReceptionModuleProps> = ({
  preselectedItem,
}) => {
  const [items, setItems] = useState<BackendItemResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState(preselectedItem?.id || '');
  const [selectedItem, setSelectedItem] = useState<BackendItemResponse | null>(preselectedItem || null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successReceipt, setSuccessReceipt] = useState<BackendItemResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const loaded: BackendItemResponse[] = [];
      let page = 0;
      let response = await deskApi.getReceivableItems(page);
      loaded.push(...response.content);
      while (!response.last) {
        page += 1;
        response = await deskApi.getReceivableItems(page);
        loaded.push(...response.content);
      }
      setItems(loaded.filter(item => item.deskReceivedAt === null));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load items awaiting desk reception.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const query = searchQuery.trim().toUpperCase();
    if (!query) {
      setSelectedItem(null);
      return;
    }

    const found = items.find(item => item.id.toUpperCase() === query);
    if (!found) {
      setError(`No eligible found report found for "${searchQuery}". Search by item reference code.`);
      setSelectedItem(null);
      return;
    }
    setSelectedItem(found);
  };

  const handleConfirmReception = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedItem || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      const receivedItem = await deskApi.receivePhysicalItem(selectedItem.id);
      setSuccessReceipt(receivedItem);
      setSelectedItem(null);
      setItems(current => current.filter(item => item.id !== receivedItem.id));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Failed to receive item.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PortalShell>
      <PageHeader
        eyebrow="CAMPUS SECURITY DESK / INTAKE"
        title="PHYSICAL INTAKE."
        copy="Accept found items surrendered by students and record their arrival at the Security Desk."
        action={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <ActionLink href="/desk/handovers" className="w-full sm:w-auto text-center">Handover Terminal</ActionLink>
            <Link href="/desk/items" className="border-2 border-black dark:border-white px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors w-full sm:w-auto text-center">
              Master Ledger
            </Link>
          </div>
        }
      />

      <div className="py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSearch} className="border-2 border-black dark:border-neutral-800 bg-white dark:bg-[#0B1422] p-5 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-[0.12em] text-black dark:text-white">
              Scan Found Item Reference Code
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                placeholder="e.g. ITEM-2026-0955"
                className="flex-1 px-3 py-2 text-xs border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white font-mono-numbers focus:outline-none uppercase"
              />
              <button type="submit" className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-[0.12em] cursor-pointer hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                Lookup
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-700 dark:text-red-400 flex items-center gap-1 font-mono-numbers pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </form>

          {successReceipt && (
            <div className="border-2 border-black dark:border-neutral-800 bg-[var(--surface)] dark:bg-[#111F31] p-6 space-y-4">
              <div className="flex items-center gap-2 text-black dark:text-white font-bold uppercase text-xs">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Physical Reception Recorded</span>
              </div>
              <div className="text-xs text-[var(--muted)] font-mono-numbers space-y-1.5 border-y-2 border-black dark:border-neutral-800 py-3">
                <div>Item: <strong className="text-black dark:text-white">{successReceipt.title}</strong> ({successReceipt.id})</div>
                <div>Reported by: <strong className="text-black dark:text-white">{successReceipt.reportedByName}</strong></div>
                <div>Desk received at: <strong className="text-black dark:text-white">{successReceipt.deskReceivedAt || 'Recorded'}</strong></div>
              </div>
              <button
                onClick={() => {
                  setSuccessReceipt(null);
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-[0.12em] cursor-pointer hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                Intake Another Item
              </button>
            </div>
          )}

          {selectedItem && !successReceipt && (
            <form onSubmit={handleConfirmReception} className="border-2 border-black dark:border-neutral-800 bg-white dark:bg-[#0B1422] p-6 space-y-5">
              <div className="flex items-start gap-4 border-b-2 border-black dark:border-neutral-800 pb-4">
                {selectedItem.imageUrl && <img src={selectedItem.imageUrl} alt={selectedItem.title} referrerPolicy="no-referrer" className="w-16 h-16 object-cover border-2 border-black shrink-0" />}
                <div className="space-y-1 min-w-0">
                  <div className="text-xs font-mono-numbers text-[var(--muted)] font-bold">{selectedItem.id} · {selectedItem.type}</div>
                  <h3 className="text-base font-bold text-black dark:text-white truncate">{selectedItem.title}</h3>
                  <div className="text-xs text-[var(--muted)] font-mono-numbers truncate">Reported by: {selectedItem.reportedByName} · Location: {selectedItem.location}</div>
                </div>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Confirm that this found item has been physically surrendered to the Security Desk. The backend will record the reception timestamp and receiving moderator.
              </p>
              <div className="flex items-center justify-between pt-4 border-t-2 border-black dark:border-neutral-800">
                <button type="button" onClick={() => setSelectedItem(null)} className="px-4 py-2 border-2 border-black dark:border-white text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  Clear
                </button>
                <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-[0.12em] cursor-pointer hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50">
                  {submitting ? 'Recording...' : 'Confirm Physical Reception'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="border-2 border-black dark:border-neutral-800 p-5 bg-white dark:bg-[#0B1422] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">Awaiting Drop-off</h2>
              <span className="text-xs font-mono-numbers font-bold text-black dark:text-white">{items.length} PENDING</span>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">Found reports that are open and have not yet been received at the Security Desk.</p>
            <div className="divide-y-2 divide-black dark:divide-neutral-800 border-t-2 border-black dark:border-neutral-800 pt-2">
              {loading ? (
                <div className="py-4 text-center text-xs text-[var(--muted)] font-mono-numbers">Loading eligible items...</div>
              ) : items.length === 0 ? (
                <div className="py-4 text-center text-xs text-[var(--muted)] font-mono-numbers">No items currently awaiting physical surrender.</div>
              ) : (
                items.slice(0, 3).map(item => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="font-mono-numbers text-[10px] text-[var(--muted)] font-bold">{item.id}</div>
                      <div className="font-bold text-xs text-black dark:text-white truncate">{item.title}</div>
                      <div className="text-[10px] text-[var(--muted)] font-mono-numbers truncate">{item.location} · {item.eventFrom?.slice(0, 10) || 'Date unavailable'}</div>
                    </div>
                    <button onClick={() => { setSelectedItem(item); setSearchQuery(item.id); }} className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                      Receive
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
};
