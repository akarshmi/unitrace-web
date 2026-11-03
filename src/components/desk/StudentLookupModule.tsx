import React, { useState } from 'react';
import { User, Item, Match, HandoverLog } from '../../types';
import { deskApi } from '../../lib/api/desk.api';
import { PageHeader, PortalShell, ActionLink, Link } from '../portal-shell';

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
    <PortalShell>
      <PageHeader
        eyebrow="CAMPUS SECURITY DESK / REGISTRY"
        title="STUDENT LOOKUP."
        copy="Inspect verified university identity and cross-reference reports and custody history."
        action={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <ActionLink href="/desk/items" className="w-full sm:w-auto text-center">
              Master Ledger
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
        <form onSubmit={handleSearch} className="border-2 border-black dark:border-neutral-800 bg-white dark:bg-[#0B1422] p-5 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-[0.12em] text-black dark:text-white">
            Student Registration Number
          </label>
          <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
            <input
              type="text"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder="e.g. 12204598 or 12219430"
              className="flex-1 px-3 py-2 text-xs border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white font-mono-numbers uppercase focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-[0.12em] cursor-pointer hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Inspect'}
            </button>
          </div>
        </form>

        {/* Student Dossier Results */}
        {data && (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="border-2 border-black dark:border-neutral-800 bg-white dark:bg-[#0B1422] p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black dark:border-neutral-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-base font-mono-numbers">
                    {data.student.fullName.slice(0, 1)}
                  </div>
                  <div>
                    <div className="label text-[var(--muted)]">
                      REG: {data.student.registrationNumber}
                    </div>
                    <h3 className="text-base font-bold uppercase text-black dark:text-white">
                      {data.student.fullName}
                    </h3>
                    <div className="text-xs text-[var(--muted)] font-mono-numbers">
                      {data.student.email} · {data.student.department || 'School of Computer Science'}
                    </div>
                  </div>
                </div>

                <div className="border border-black dark:border-white px-2 py-1 text-xs font-mono-numbers font-bold text-black dark:text-white self-start sm:self-auto uppercase">
                  STATUS: VERIFIED
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 border-2 border-black dark:border-neutral-800 divide-x-2 divide-black dark:divide-neutral-800 text-center font-mono-numbers text-xs bg-[var(--surface)] dark:bg-[#111F31]">
                <div className="p-3 sm:p-4">
                  <div className="label text-[var(--muted)] text-[10px]">Total Reports</div>
                  <div className="text-xl font-bold text-black dark:text-white mt-1">{data.items.length}</div>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="label text-[var(--muted)] text-[10px]">Active Matches</div>
                  <div className="text-xl font-bold text-black dark:text-white mt-1">{data.matches.length}</div>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="label text-[var(--muted)] text-[10px]">Handovers Claimed</div>
                  <div className="text-xl font-bold text-black dark:text-white mt-1">{data.handovers.length}</div>
                </div>
              </div>
            </div>

            {/* Reports Ledger */}
            <div className="border-2 border-black dark:border-neutral-800 bg-white dark:bg-[#0B1422] p-6 space-y-4">
              <p className="label">
                ITEMS REPORTED BY STUDENT ({data.items.length})
              </p>

              {data.items.length === 0 ? (
                <p className="text-xs text-[var(--muted)] font-mono-numbers">No items reported by this student.</p>
              ) : (
                <div className="divide-y-2 divide-black dark:divide-neutral-800 border-t-2 border-black dark:border-neutral-800">
                  {data.items.map(item => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[10px] font-mono-numbers">
                          <span className="font-bold">{item.id}</span>
                          <span className="uppercase">({item.type})</span>
                          <span className="border border-black dark:border-white px-1.5 py-0.2 uppercase font-bold text-[9px]">
                            {item.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="font-bold text-sm text-black dark:text-white truncate mt-0.5">
                          {item.title}
                        </div>
                        <div className="text-xs text-[var(--muted)] font-mono-numbers truncate">
                          {item.location} · {item.eventDate}
                        </div>
                      </div>

                      <div className="text-xs font-mono-numbers font-bold text-black dark:text-white shrink-0">
                        {item.submissionStatus === 'RECEIVED_BY_DESK' ? 'IN VAULT' : item.submissionStatus}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PortalShell>
  );
};
