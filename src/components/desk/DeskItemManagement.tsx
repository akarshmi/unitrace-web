import React, { useState } from 'react';
import { Item, ItemCategory, ItemStatus, ItemType } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { Search, Filter, ArrowUpRight, Inbox, Eye } from 'lucide-react';

interface DeskItemManagementProps {
  items: Item[];
  onSelectItem: (item: Item) => void;
  onInitiateReception?: (item: Item) => void;
}

export const DeskItemManagement: React.FC<DeskItemManagementProps> = ({
  items,
  onSelectItem,
  onInitiateReception,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | ItemType>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ItemStatus>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | ItemCategory>('ALL');

  const filteredItems = items.filter(item => {
    if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-black dark:border-neutral-800 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest font-mono-numbers text-neutral-500 mb-1">
            Section // 02
          </div>
          <h1 className="text-3xl font-display text-black dark:text-white uppercase tracking-tight">
            Campus Master Ledger
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            Complete database of all lost reports, found declarations, and physical custody lockers.
          </p>
        </div>

        <div className="text-xs font-mono-numbers text-neutral-500">
          Showing {filteredItems.length} of {items.length} records
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="border-2 border-black dark:border-neutral-800 p-4 bg-white dark:bg-[#0B1422] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Reg No, ID, title, venue..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white focus:outline-none focus:border-black font-mono-numbers"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white focus:outline-none focus:border-black uppercase font-mono-numbers"
            >
              <option value="ALL">All Types (LOST &amp; FOUND)</option>
              <option value="LOST">Lost Reports Only</option>
              <option value="FOUND">Found Items Only</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white focus:outline-none focus:border-black uppercase font-mono-numbers"
            >
              <option value="ALL">All Item Statuses</option>
              <option value="OPEN">OPEN (Under Investigation)</option>
              <option value="MATCHED">MATCHED (Candidate Paired)</option>
              <option value="CLAIMED">CLAIMED (Custody Returned)</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white focus:outline-none focus:border-black uppercase font-mono-numbers"
            >
              <option value="ALL">All Categories</option>
              <option value="ELECTRONICS">Electronics</option>
              <option value="BAGS_AND_WALLETS">Bags &amp; Wallets</option>
              <option value="DOCUMENTS_AND_CARDS">IDs &amp; Documents</option>
              <option value="KEYS">Keys &amp; Cards</option>
              <option value="BOOKS_AND_STATIONERY">Books &amp; Stationery</option>
              <option value="ACCESSORIES">Accessories</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Master Table */}
      <div className="border-2 border-black dark:border-neutral-800 overflow-x-auto bg-white dark:bg-[#0B1422]">
        <table className="w-full text-left text-xs font-mono-numbers">
          <thead className="bg-neutral-100 dark:bg-slate-900 border-b-2 border-black dark:border-neutral-800 uppercase font-semibold text-black dark:text-white">
            <tr>
              <th className="p-3 w-16">Visual</th>
              <th className="p-3">Ref ID &amp; Item Title</th>
              <th className="p-3">Type</th>
              <th className="p-3">Reporter Reg</th>
              <th className="p-3">Location &amp; Date</th>
              <th className="p-3">Intake Custody</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {filteredItems.map(item => (
              <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-slate-900/50 transition-colors">
                <td className="p-3">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover border border-neutral-300 dark:border-slate-700"
                  />
                </td>
                <td className="p-3 font-sans">
                  <div className="font-mono-numbers text-[10px] text-neutral-500 font-bold">
                    {item.id}
                  </div>
                  <div className="font-bold text-sm text-black dark:text-white line-clamp-1">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-neutral-500 line-clamp-1 max-w-xs">
                    {item.description}
                  </div>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 border text-[10px] font-bold ${
                    item.type === 'LOST' 
                      ? 'border-black bg-black text-white' 
                      : 'border-[#142B4A] text-[#142B4A] bg-[#E8EDF3]'
                  }`}>
                    {item.type}
                  </span>
                </td>
                <td className="p-3 font-bold text-black dark:text-white">
                  {item.reporterRegNo}
                </td>
                <td className="p-3">
                  <div className="font-sans font-medium text-black dark:text-white truncate max-w-[150px]">
                    {item.location}
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    {item.eventDate} ({item.eventTime})
                  </div>
                </td>
                <td className="p-3">
                  {item.type === 'FOUND' ? (
                    <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-bold border-2 ${
                      item.submissionStatus === 'RECEIVED_BY_DESK'
                        ? 'border-black bg-black text-white dark:border-white'
                        : 'border-[var(--navy)] text-[var(--navy)] bg-[#E8EDF3] border-dashed'
                    }`}>
                      {item.submissionStatus === 'RECEIVED_BY_DESK' ? 'IN VAULT' : 'PENDING INTAKE'}
                    </span>
                  ) : (
                    <span className="text-neutral-400">N/A</span>
                  )}
                </td>
                <td className="p-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="p-3 text-right space-x-1">
                  {item.type === 'FOUND' && item.submissionStatus === 'PENDING_SUBMISSION' && onInitiateReception && (
                    <button
                      onClick={() => onInitiateReception(item)}
                      className="px-2.5 py-1 bg-[#142B4A] hover:bg-[#1D3B63] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                      title="Receive physical item into custody"
                    >
                      Intake
                    </button>
                  )}
                  <button
                    onClick={() => onSelectItem(item)}
                    className="px-2.5 py-1 border border-black dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-slate-800 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
