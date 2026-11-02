import React, { useState } from 'react';
import { Item, ReceptionRecord, User } from '../../types';
import { deskApi } from '../../lib/api/desk.api';
import { 
  Inbox, 
  ShieldCheck, 
  Check, 
  AlertCircle 
} from 'lucide-react';

interface PhysicalReceptionModuleProps {
  items: Item[];
  receptions: ReceptionRecord[];
  officer: User;
  onRefreshData: () => void;
  preselectedItem?: Item | null;
}

export const PhysicalReceptionModule: React.FC<PhysicalReceptionModuleProps> = ({
  items,
  receptions,
  officer,
  onRefreshData,
  preselectedItem,
}) => {
  const [searchQuery, setSearchQuery] = useState(preselectedItem?.id || '');
  const [selectedItem, setSelectedItem] = useState<Item | null>(preselectedItem || null);

  const [intakeCondition, setIntakeCondition] = useState<'MINT' | 'GOOD' | 'WORN' | 'DAMAGED'>('GOOD');
  const [storageBin, setStorageBin] = useState('Vault Locker B-04');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<ReceptionRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pendingDropOffs = items.filter(
    i => i.type === 'FOUND' && i.submissionStatus === 'PENDING_SUBMISSION'
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!searchQuery.trim()) return;

    const q = searchQuery.trim().toUpperCase();
    const found = items.find(
      i => i.id.toUpperCase() === q || i.reporterRegNo.toUpperCase() === q
    );

    if (!found) {
      setError(`No record found for "${searchQuery}".`);
      setSelectedItem(null);
      return;
    }

    setSelectedItem(found);
  };

  const handleConfirmReception = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setSubmitting(true);
    setError(null);

    try {
      const record = await deskApi.receivePhysicalItem({
        itemId: selectedItem.id,
        itemTitle: selectedItem.title,
        reporterRegNo: selectedItem.reporterRegNo,
        intakeCondition,
        officerName: officer.fullName,
        officerRegNo: officer.registrationNumber,
        storageBin,
        notes: notes || 'Verified at Security Desk intake.',
      });

      setSuccessReceipt(record);
      onRefreshData();
    } catch (err: any) {
      setError(err.message || 'Failed to record intake.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b-2 border-black dark:border-neutral-800 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--navy)] dark:text-blue-400 font-mono-numbers mb-1">
            Section // 03 · Custody Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black dark:text-white">
            Physical Item Intake
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Accept found items surrendered by students, assign vault storage bins, and issue intake receipts.
          </p>
        </div>

        <div className="text-xs font-mono-numbers text-[var(--muted)]">
          Pending Drop-offs: <strong className="text-black dark:text-white">{pendingDropOffs.length}</strong>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Intake Terminal Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Lookup */}
          <form onSubmit={handleSearch} className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#0B1422] p-5 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-[0.12em] text-black dark:text-white">
              Scan Reference Code or Student Registration Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. ITEM-2026-0955 or 12204598"
                className="flex-1 px-3 py-2 text-sm border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white font-mono-numbers focus:outline-none focus:border-[var(--navy)] uppercase"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-[0.12em] cursor-pointer"
              >
                Lookup
              </button>
            </div>
            {error && (
              <p className="text-xs text-black dark:text-white flex items-center gap-1 font-mono-numbers pt-1">
                <AlertCircle className="w-3.5 h-3.5 text-[var(--navy)]" />
                <span>{error}</span>
              </p>
            )}
          </form>

          {/* Receipt Confirmation */}
          {successReceipt && (
            <div className="border-2 border-black dark:border-neutral-700 bg-[var(--surface)] dark:bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center gap-2 text-black dark:text-white font-bold uppercase text-xs">
                <Check className="w-4 h-4 text-[var(--navy)]" />
                <span>Intake Receipt Issued: {successReceipt.id}</span>
              </div>
              <div className="text-xs text-[var(--muted)] font-mono-numbers space-y-1">
                <div>Item: <strong className="text-black dark:text-white">{successReceipt.itemTitle}</strong> ({successReceipt.itemId})</div>
                <div>Surrendered by: <strong className="text-black dark:text-white">{successReceipt.reporterRegNo}</strong></div>
                <div>Storage Bin: <strong className="text-black dark:text-white">{successReceipt.storageBin}</strong> (Condition: {successReceipt.intakeCondition})</div>
                <div>Receiving Officer: <strong className="text-black dark:text-white">{successReceipt.officerName}</strong> ({successReceipt.officerRegNo})</div>
                <div>Timestamp: <strong className="text-black dark:text-white">{successReceipt.receivedAt}</strong></div>
              </div>
              <button
                onClick={() => {
                  setSuccessReceipt(null);
                  setSelectedItem(null);
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[var(--navy)] hover:bg-[var(--navy-hover)] text-white text-xs font-bold uppercase tracking-[0.12em] cursor-pointer"
              >
                Intake Another Item
              </button>
            </div>
          )}

          {/* Selected Item Form */}
          {selectedItem && !successReceipt && (
            <form onSubmit={handleConfirmReception} className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#0B1422] p-6 space-y-6">
              <div className="flex items-start gap-4 border-b-2 border-black dark:border-neutral-800 pb-4">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  referrerPolicy="no-referrer"
                  className="w-18 h-18 object-cover border-2 border-black shrink-0"
                />
                <div className="space-y-1">
                  <div className="text-xs font-mono-numbers text-[var(--muted)] font-bold">
                    {selectedItem.id} · {selectedItem.type}
                  </div>
                  <h3 className="text-base font-bold text-black dark:text-white">
                    {selectedItem.title}
                  </h3>
                  <div className="text-xs text-[var(--muted)] font-mono-numbers">
                    Surrendered by: {selectedItem.reporterRegNo} · Location: {selectedItem.location}
                  </div>
                </div>
              </div>

              {selectedItem.submissionStatus === 'RECEIVED_BY_DESK' && (
                <div className="p-3 bg-[var(--surface)] dark:bg-slate-900 border-2 border-black text-xs text-black dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--navy)]" />
                  <span>Item already recorded in vault custody ({selectedItem.deskNotes}).</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-[0.12em] text-black dark:text-white">
                    Physical Condition *
                  </label>
                  <select
                    value={intakeCondition}
                    onChange={(e) => setIntakeCondition(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white uppercase font-mono-numbers"
                  >
                    <option value="MINT">MINT (Like New)</option>
                    <option value="GOOD">GOOD (Normal Wear)</option>
                    <option value="WORN">WORN (Visible Scratches)</option>
                    <option value="DAMAGED">DAMAGED (Cracked / Broken)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-[0.12em] text-black dark:text-white">
                    Vault Bin / Locker *
                  </label>
                  <select
                    value={storageBin}
                    onChange={(e) => setStorageBin(e.target.value)}
                    className="w-full px-3 py-2 text-xs border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white uppercase font-mono-numbers"
                  >
                    <option value="Vault Locker B-04">Vault Locker B-04 (Electronics)</option>
                    <option value="Vault Locker C-11">Vault Locker C-11 (Audio / Gadgets)</option>
                    <option value="Storage Bin A-02">Storage Bin A-02 (Backpacks / Bags)</option>
                    <option value="Storage Bin A-09">Storage Bin A-09 (Apparel)</option>
                    <option value="Secure Safe D-01">Secure Safe D-01 (Wallets, Cards)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-[0.12em] text-black dark:text-white">
                  Officer Intake Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record serial numbers or unique identifiers..."
                  className="w-full px-3 py-2 text-xs border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-black dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 border-2 border-black text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-neutral-100"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[var(--navy)] hover:bg-[var(--navy-hover)] text-white text-xs font-bold uppercase tracking-[0.12em] cursor-pointer transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Recording...' : 'Confirm Intake & Issue Receipt'}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Right: Urgent Pending Intake Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border-2 border-black dark:border-neutral-700 p-5 bg-white dark:bg-[#0B1422] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold uppercase tracking-tight text-black dark:text-white">
                Awaiting Drop-off
              </h2>
              <span className="text-xs font-mono-numbers text-[var(--navy)] dark:text-blue-400 font-bold">
                {pendingDropOffs.length} PENDING
              </span>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Found items registered online. Students must surrender these items to the Security Desk before 5:00 PM.
            </p>

            <div className="divide-y-2 divide-black dark:divide-neutral-800 border-t-2 border-black dark:border-neutral-800 pt-2">
              {pendingDropOffs.map(item => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-mono-numbers text-[10px] text-[var(--muted)] font-bold">
                      {item.id} · Student: {item.reporterRegNo}
                    </div>
                    <div className="font-bold text-xs text-black dark:text-white line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-[var(--muted)] font-mono-numbers">
                      {item.location} · {item.eventDate}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setSearchQuery(item.id);
                    }}
                    className="px-3 py-1 bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer"
                  >
                    Receive
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reception Logs */}
          <div className="border-2 border-black dark:border-neutral-800 p-4 bg-[var(--surface)] dark:bg-slate-900 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
              Recent Vault Receipts ({receptions.length})
            </div>
            <div className="space-y-2 text-xs font-mono-numbers">
              {receptions.slice(0, 3).map(rec => (
                <div key={rec.id} className="p-2 border-2 border-black bg-white dark:bg-slate-800">
                  <div className="flex justify-between font-bold">
                    <span>{rec.id}</span>
                    <span className="text-[var(--muted)]">{rec.receivedAt.slice(11, 16)}</span>
                  </div>
                  <div className="truncate text-black dark:text-white font-sans text-xs">{rec.itemTitle}</div>
                  <div className="text-[10px] text-[var(--muted)]">{rec.storageBin} · Officer {rec.officerName}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
