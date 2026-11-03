import React, { useState } from 'react';
import { Item, ItemType, ItemStatus } from '../../types';
import { PageHeader, PortalShell, ActionLink, Link } from '../portal-shell';
import { useRouter } from '../../lib/router';

interface DeskItemManagementProps {
  items: Item[];
  onSelectItem: (item: Item) => void;
  onInitiateReception?: (item: Item) => void;
}

type TabType = 'ALL' | 'LOST' | 'FOUND' | 'IN_VAULT';

export const DeskItemManagement: React.FC<DeskItemManagementProps> = ({
  items,
  onSelectItem,
  onInitiateReception,
}) => {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter(item => {
    if (activeTab === 'LOST' && item.type !== 'LOST') return false;
    if (activeTab === 'FOUND' && item.type !== 'FOUND') return false;
    if (activeTab === 'IN_VAULT' && item.submissionStatus !== 'RECEIVED_BY_DESK') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.reporterRegNo.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const lostCount = items.filter(i => i.type === 'LOST').length;
  const foundCount = items.filter(i => i.type === 'FOUND').length;
  const vaultCount = items.filter(i => i.submissionStatus === 'RECEIVED_BY_DESK').length;

  return (
    <PortalShell>
      <PageHeader
        eyebrow="CAMPUS SECURITY DESK / RECORDS"
        title="MASTER LEDGER."
        copy="Complete registry of all student-reported items, intake custody, and vault lockers."
        action={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <ActionLink href="/desk/submissions" className="w-full sm:w-auto text-center">
              Physical Intake
            </ActionLink>
            <Link
              href="/desk/handovers"
              className="border-2 border-black dark:border-white px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors w-full sm:w-auto text-center"
            >
              Handover
            </Link>
          </div>
        }
      />

      <div className="py-4 sm:py-6 space-y-6">
        {/* Search Bar */}
        <div className="border-2 border-black dark:border-neutral-800 p-3 sm:p-4 bg-white dark:bg-[#0B1422]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student reg no, item ID, title, or location..."
            className="w-full px-3 py-2 text-xs border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white font-mono-numbers focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 sm:gap-6 border-b-2 border-black dark:border-neutral-800 overflow-x-auto whitespace-nowrap -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`pb-3 sm:pb-4 text-xs font-bold uppercase tracking-[.12em] cursor-pointer transition-colors -mb-[2px] ${
              activeTab === 'ALL'
                ? 'border-b-4 border-black dark:border-white text-black dark:text-white'
                : 'border-b-4 border-transparent text-[var(--muted)] hover:text-black dark:hover:text-white'
            }`}
          >
            All records ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('LOST')}
            className={`pb-3 sm:pb-4 text-xs font-bold uppercase tracking-[.12em] cursor-pointer transition-colors -mb-[2px] ${
              activeTab === 'LOST'
                ? 'border-b-4 border-black dark:border-white text-black dark:text-white'
                : 'border-b-4 border-transparent text-[var(--muted)] hover:text-black dark:hover:text-white'
            }`}
          >
            Lost ({lostCount})
          </button>
          <button
            onClick={() => setActiveTab('FOUND')}
            className={`pb-3 sm:pb-4 text-xs font-bold uppercase tracking-[.12em] cursor-pointer transition-colors -mb-[2px] ${
              activeTab === 'FOUND'
                ? 'border-b-4 border-black dark:border-white text-black dark:text-white'
                : 'border-b-4 border-transparent text-[var(--muted)] hover:text-black dark:hover:text-white'
            }`}
          >
            Found ({foundCount})
          </button>
          <button
            onClick={() => setActiveTab('IN_VAULT')}
            className={`pb-3 sm:pb-4 text-xs font-bold uppercase tracking-[.12em] cursor-pointer transition-colors -mb-[2px] ${
              activeTab === 'IN_VAULT'
                ? 'border-b-4 border-black dark:border-white text-black dark:text-white'
                : 'border-b-4 border-transparent text-[var(--muted)] hover:text-black dark:hover:text-white'
            }`}
          >
            In Vault Custody ({vaultCount})
          </button>
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 ? (
          <div className="border-2 border-black dark:border-neutral-800 p-8 sm:p-12 text-center bg-white dark:bg-[#0B1422]">
            <p className="font-bold uppercase tracking-wider text-black dark:text-white text-base">
              No ledger records found
            </p>
            <p className="mt-2 text-xs text-[var(--muted)] max-w-sm mx-auto">
              No items match your active filters or search keyword.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="md:hidden divide-y-2 divide-black dark:divide-neutral-800 border-2 border-black dark:border-neutral-800 bg-white dark:bg-[#0B1422]">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="p-4 flex items-center justify-between gap-3 active:bg-neutral-100 dark:active:bg-neutral-800 cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono-numbers font-bold px-1.5 py-0.5 border border-black dark:border-white uppercase">
                        {item.type}
                      </span>
                      <span className="text-[10px] font-mono-numbers text-[var(--muted)]">
                        Reg: {item.reporterRegNo}
                      </span>
                    </div>
                    <p className="font-bold text-sm text-black dark:text-white truncate mt-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-[var(--muted)] font-mono-numbers truncate mt-0.5">
                      {item.location} · {item.eventDate}
                    </p>
                  </div>
                  <span className="label text-black dark:text-white shrink-0 text-sm">→</span>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto border-2 border-black dark:border-neutral-800">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-black text-xs uppercase tracking-[.1em] text-white">
                  <tr>
                    <th className="p-4">Item</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Student Reg</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Custody Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black dark:divide-neutral-800 bg-white dark:bg-[#0B1422]">
                  {filteredItems.map(item => (
                    <tr
                      key={item.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors"
                    >
                      <td className="p-4 font-bold text-black dark:text-white">
                        <div className="hover:underline cursor-pointer" onClick={() => onSelectItem(item)}>
                          {item.title}
                        </div>
                        <div className="text-xs text-[var(--muted)] font-mono-numbers">
                          {item.id}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono-numbers text-xs uppercase font-bold">
                          {item.type}
                        </span>
                      </td>
                      <td className="p-4 font-mono-numbers text-xs font-bold text-black dark:text-white">
                        {item.reporterRegNo}
                      </td>
                      <td className="p-4 text-xs font-medium text-black dark:text-white">
                        {item.location}
                      </td>
                      <td className="p-4">
                        <span className="border border-black dark:border-white px-2 py-0.5 text-xs font-bold uppercase">
                          {item.type === 'FOUND' && item.submissionStatus === 'RECEIVED_BY_DESK'
                            ? 'IN VAULT'
                            : item.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {item.type === 'FOUND' && item.submissionStatus === 'PENDING_SUBMISSION' && onInitiateReception && (
                          <button
                            onClick={() => onInitiateReception(item)}
                            className="bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Intake
                          </button>
                        )}
                        <button
                          onClick={() => onSelectItem(item)}
                          className="border-2 border-black dark:border-white px-3 py-1 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </PortalShell>
  );
};
