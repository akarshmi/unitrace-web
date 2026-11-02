import React, { useState } from 'react';
import { Item, ItemType } from '../../types';
import { PageHeader, PortalShell, ActionLink, Link } from '../portal-shell';
import { useRouter } from '../../lib/router';

interface MyItemsViewProps {
  items: Item[];
  studentId: string;
  onSelectItem?: (item: Item) => void;
  onNavigateToReport?: (type: ItemType) => void;
}

type TabType = 'ALL' | 'LOST' | 'FOUND';

export const MyItemsView: React.FC<MyItemsViewProps> = ({
  items,
  studentId,
  onSelectItem,
}) => {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('ALL');

  const studentItems = items.filter(i => i.reporterId === studentId);

  const filteredItems = studentItems.filter(item => {
    if (activeTab === 'LOST') return item.type === 'LOST';
    if (activeTab === 'FOUND') return item.type === 'FOUND';
    return true;
  });

  const lostCount = studentItems.filter(i => i.type === 'LOST').length;
  const foundCount = studentItems.filter(i => i.type === 'FOUND').length;

  const handleSelect = (item: Item) => {
    if (onSelectItem) {
      onSelectItem(item);
    } else {
      navigate(`/app/items/${item.id}`);
    }
  };

  return (
    <PortalShell>
      <PageHeader
        eyebrow="STUDENT PORTAL / RECORDS"
        title="MY ITEMS."
        copy="Every report stays visible from first submission to final return."
        action={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <ActionLink href="/app/report/lost" className="w-full sm:w-auto text-center">
              Report lost
            </ActionLink>
            <Link
              href="/app/report/found"
              className="border-2 border-black dark:border-white px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors w-full sm:w-auto text-center"
            >
              Report found
            </Link>
          </div>
        }
      />

      <div className="py-4 sm:py-6">
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
            All items ({studentItems.length})
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
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 ? (
          <div className="mt-8 border-2 border-black dark:border-neutral-800 p-8 sm:p-12 text-center bg-white dark:bg-[#0B1422]">
            <p className="font-bold uppercase tracking-wider text-black dark:text-white text-base">
              No records in this tab
            </p>
            <p className="mt-2 text-xs text-[var(--muted)] max-w-sm mx-auto">
              Submit a new lost or found report to track it through the university system.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <ActionLink href="/app/report/lost" className="w-full sm:w-auto">Report lost item</ActionLink>
              <Link
                href="/app/report/found"
                className="border-2 border-black dark:border-white px-4 py-2.5 text-xs font-bold uppercase tracking-[.12em] text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors w-full sm:w-auto text-center"
              >
                Report found item
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile View: High-contrast touch rows */}
            <div className="md:hidden mt-6 divide-y-2 divide-black dark:divide-neutral-800 border-2 border-black dark:border-neutral-800 bg-white dark:bg-[#0B1422]">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="p-4 flex items-center justify-between gap-3 active:bg-neutral-100 dark:active:bg-neutral-800 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-12 h-12 object-cover border border-black dark:border-neutral-700 shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono-numbers font-bold px-1.5 py-0.5 border border-black dark:border-white uppercase">
                          {item.type}
                        </span>
                        <span className="text-[10px] font-mono-numbers font-bold uppercase text-[var(--muted)]">
                          {item.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="font-bold text-sm text-black dark:text-white truncate mt-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-[var(--muted)] font-mono-numbers truncate mt-0.5">
                        {item.location} · {item.eventDate || 'Recent'}
                      </p>
                    </div>
                  </div>
                  <span className="label text-black dark:text-white shrink-0 text-sm">→</span>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block mt-8 overflow-x-auto border-2 border-black dark:border-neutral-800">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-black text-xs uppercase tracking-[.1em] text-white">
                  <tr>
                    <th className="p-4">Item</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Reported</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black dark:divide-neutral-800 bg-white dark:bg-[#0B1422]">
                  {filteredItems.map(item => (
                    <tr
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 cursor-pointer transition-colors"
                    >
                      <td className="p-4 font-bold text-black dark:text-white">
                        <div className="flex items-center gap-3">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-10 h-10 object-cover border border-black dark:border-neutral-700 shrink-0"
                            />
                          )}
                          <div>
                            <div className="hover:underline">{item.title}</div>
                            <div className="text-xs text-[var(--muted)] font-mono-numbers">
                              {item.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono-numbers text-xs uppercase font-bold">
                          {item.type}
                        </span>
                      </td>
                      <td className="p-4 font-mono-numbers text-xs text-[var(--muted)]">
                        {item.eventDate || 'Recent'}
                      </td>
                      <td className="p-4 text-xs font-bold text-black dark:text-white">
                        {item.location}
                      </td>
                      <td className="p-4">
                        <span className="border border-black dark:border-white px-2 py-1 text-xs font-bold uppercase text-black dark:text-white">
                          {item.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="label text-black dark:text-white">
                          View →
                        </span>
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
