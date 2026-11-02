import React, { useState } from 'react';
import { User, Item, Match, HandoverLog } from '../../types';
import { deskApi } from '../../lib/api/desk.api';
import { StatusBadge } from '../ui/StatusBadge';
import { Search } from 'lucide-react';

export const StudentLookupModule: React.FC = () => {
  const [regNo, setRegNo] = useState('12204598');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    student: User;
    items: Item[];
    matches: Match[];
    handovers: HandoverLog[];
  } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNo.trim()) return;
    setLoading(true);
    try {
      const res = await deskApi.lookupStudent(regNo);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleSearch({ preventDefault: () => {} } as any);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-black dark:border-neutral-800 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--navy)] dark:text-blue-400 font-mono-numbers mb-1">
            Section // 06 · Security Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black dark:text-white">
            Student Credential Lookup
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Inspect verified university identity and cross-reference reports and handover history.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#0B1422] p-5">
        <label className="block text-xs font-bold uppercase tracking-[0.12em] text-black dark:text-white mb-2">
          Student Registration Number
        </label>
        <div className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder="e.g. 12204598 or 12219430"
              className="w-full pl-9 pr-3 py-2 text-sm border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white font-mono-numbers uppercase focus:outline-none focus:border-[var(--navy)]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[var(--navy)] hover:bg-[var(--navy-hover)] text-white text-xs font-bold uppercase tracking-[0.12em] cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Inspect'}
          </button>
        </div>
      </form>

      {/* Student Dossier Results */}
      {data && (
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#0B1422] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--navy)] text-white flex items-center justify-center font-bold text-lg font-mono-numbers">
                  {data.student.fullName.slice(0, 1)}
                </div>
                <div>
                  <div className="text-xs font-mono-numbers text-[var(--muted)] font-bold">
                    REG NO: {data.student.registrationNumber}
                  </div>
                  <h3 className="text-lg font-bold uppercase text-black dark:text-white">
                    {data.student.fullName}
                  </h3>
                  <div className="text-xs text-[var(--muted)] font-mono-numbers">
                    {data.student.email} · {data.student.department || 'School of Computer Science'}
                  </div>
                </div>
              </div>

              <div className="px-3 py-1 border-2 border-black bg-[var(--surface)] dark:bg-slate-800 text-xs font-mono-numbers font-bold text-black dark:text-white self-start sm:self-center">
                ROLE: {data.student.role} · VERIFIED
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-0 border-2 border-black dark:border-neutral-800 divide-x-2 divide-black dark:divide-neutral-800 mt-4 text-center font-mono-numbers text-xs bg-white dark:bg-[#111F31]">
              <div className="p-3">
                <div className="text-[var(--muted)] uppercase text-[10px] font-bold">Total Reports</div>
                <div className="text-lg font-bold text-black dark:text-white mt-1">{data.items.length}</div>
              </div>
              <div className="p-3">
                <div className="text-[var(--muted)] uppercase text-[10px] font-bold">Active Matches</div>
                <div className="text-lg font-bold text-[var(--navy)] dark:text-blue-400 mt-1">{data.matches.length}</div>
              </div>
              <div className="p-3">
                <div className="text-[var(--muted)] uppercase text-[10px] font-bold">Handovers Claimed</div>
                <div className="text-lg font-bold text-black dark:text-white mt-1">{data.handovers.length}</div>
              </div>
            </div>
          </div>

          {/* Student's Reports Ledger */}
          <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#0B1422] p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
              Items Reported by Student ({data.items.length})
            </h4>

            {data.items.length === 0 ? (
              <p className="text-xs text-[var(--muted)] font-mono-numbers">No items reported by this student.</p>
            ) : (
              <div className="divide-y-2 divide-black dark:divide-neutral-800 border-t-2 border-black dark:border-neutral-800">
                {data.items.map(item => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover border border-black shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-mono-numbers">
                          <span className="font-bold">{item.id}</span>
                          <span className="uppercase">({item.type})</span>
                          <StatusBadge status={item.status} />
                        </div>
                        <div className="font-bold text-sm text-black dark:text-white">
                          {item.title}
                        </div>
                        <div className="text-xs text-[var(--muted)] font-mono-numbers">
                          {item.location} · {item.eventDate}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-mono-numbers font-bold text-black dark:text-white">
                      {item.submissionStatus}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
