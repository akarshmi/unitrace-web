import React from 'react';
import { StudentItem, StudentMatch } from '../../types';
import { PortalShell, PageHeader, Link } from '../portal-shell';

interface ItemDetailPageProps {
  item: StudentItem | null;
  match: StudentMatch | null;
}

export const ItemDetailPage: React.FC<ItemDetailPageProps> = ({ item, match }) => {
  if (!item) {
    return (
      <PortalShell>
        <PageHeader
          eyebrow="MY ITEMS / NOT FOUND"
          title="ITEM NOT FOUND."
          copy="The requested report record could not be located in university custody."
          action={
            <Link
              href="/app/items"
              className="border-2 border-black dark:border-white px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              Back to items
            </Link>
          }
        />
      </PortalShell>
    );
  }

  const isLostOwner = match?.yourRole === 'LOST_OWNER';
  const matchedFoundItemReceived = Boolean(match?.otherItem.deskReceivedAt);
  const keyExpired = Boolean(
    match?.handoverKeyExpiresAt &&
    new Date(match.handoverKeyExpiresAt).getTime() < Date.now()
  );
  const isCollectionAuthorized = Boolean(
    match &&
    isLostOwner &&
    match.status === 'APPROVED' &&
    matchedFoundItemReceived &&
    match.handoverKeyIssued &&
    !keyExpired
  );
  const isPendingSubmission = item.type === 'FOUND' && !item.deskReceivedAt;
  const formatDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? 'Not available'
      : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  };

  return (
    <PortalShell>
      {/* Page Header */}
      <PageHeader
        eyebrow={`MY ITEMS / ${item.id}`}
        title={`${item.title.toUpperCase()}.`}
        copy={`${item.type === 'LOST' ? 'Lost' : 'Found'} item report submitted on ${item.createdAt}.`}
        action={
          <Link
            href="/app/items"
            className="border-2 border-black dark:border-white px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            Back to items
          </Link>
        }
      />

      {/* Grid Layout: Report Details + Next Step */}
      <div className="grid gap-8 py-6 lg:grid-cols-12">
        {/* Left Column: Report Details (7 cols) */}
        <section className="border-2 border-black dark:border-neutral-800 bg-white dark:bg-[#0B1422] p-7 lg:col-span-7">
          <div className="flex items-center justify-between">
            <p className="label">REPORT DETAILS</p>
            <span className="border border-black dark:border-white px-2 py-0.5 text-xs font-bold uppercase text-black dark:text-white">
              {item.status.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Optional item photo */}
          {item.imageUrl && (
            <div className="mt-6 border-2 border-black dark:border-neutral-700 overflow-hidden max-h-72">
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Key Value Metadata */}
          <dl className="mt-7 grid gap-5 sm:grid-cols-2">
            {[
              ['Status', item.status.replace(/_/g, ' ')],
              ['Category', 'Not provided by backend'],
              [item.type === 'LOST' ? 'Last seen' : 'Found location', item.location],
              ['Date', item.eventFrom || item.eventTo || 'Recorded'],
              ['Reference', item.id],
              ['Submitted by', 'You'],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="label text-[var(--muted)]">{label}</dt>
                <dd className="mt-1 text-sm font-bold text-black dark:text-white font-mono-numbers">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Description */}
          <div className="mt-8 border-t-2 border-black dark:border-neutral-800 pt-6">
            <p className="label">DESCRIPTION</p>
            <p className="mt-3 text-sm leading-7 text-black dark:text-white">
              {item.description || 'No additional description provided in the original submission.'}
            </p>
          </div>
        </section>

        {/* Right Column: Next Step Aside (5 cols) */}
        <aside className="h-fit bg-black dark:bg-neutral-900 p-7 text-white lg:col-span-5 border-2 border-black dark:border-neutral-800">
          {isCollectionAuthorized ? (
            <>
              <p className="label text-white/60">COLLECTION STATUS</p>
              <h2 className="mt-4 text-2xl font-bold tracking-[-.04em]">
                Ready for Pickup at Desk
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/60">
                Visit the Campus Security Office with your University ID and verification key to complete custody handover.
              </p>
              <div className="mt-6 border-2 border-white p-4 font-mono-numbers text-center font-bold text-sm tracking-wider bg-white/10 break-words">
                Handover key issued. Email delivery status is not available here. Expires {formatDate(match?.handoverKeyExpiresAt || '')}.
              </div>
            </>
          ) : match?.status === 'APPROVED' && isLostOwner && !matchedFoundItemReceived ? (
            <>
              <p className="label text-white/60">COLLECTION PENDING</p>
              <h2 className="mt-4 text-2xl font-bold tracking-[-.04em]">Awaiting Physical Deposit</h2>
              <p className="mt-4 text-sm leading-6 text-white/60">
                Your match has been approved. Collection will be available once Campus Security receives the physical item.
              </p>
            </>
          ) : match?.status === 'APPROVED' && isLostOwner && keyExpired ? (
            <>
              <p className="label text-white/60">HANDOVER KEY EXPIRED</p>
              <h2 className="mt-4 text-2xl font-bold tracking-[-.04em]">Contact Campus Security</h2>
              <p className="mt-4 text-sm leading-6 text-white/60">
                The backend reports that the handover key has expired. Campus Security must reissue a key before collection.
              </p>
            </>
          ) : match?.status === 'COMPLETED' ? (
            <>
              <p className="label text-white/60">HANDOVER COMPLETED</p>
              <h2 className="mt-4 text-2xl font-bold tracking-[-.04em]">Item Handover Completed</h2>
              <p className="mt-4 text-sm leading-6 text-white/60">The handover has been completed.</p>
            </>
          ) : isPendingSubmission ? (
            <>
              <p className="label text-white/60">DESK DROP-OFF REQUIRED</p>
              <h2 className="mt-4 text-2xl font-bold tracking-[-.04em]">
                Hand Over Item to Desk
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/60">
                Bring this item to the Campus Security Office during operating hours to lodge it into verified campus custody.
              </p>
            </>
          ) : (
            <>
              <p className="label text-white/60">NEXT STEP</p>
              <h2 className="mt-4 text-2xl font-bold tracking-[-.04em]">
                We&apos;ll notify you when there&apos;s an update.
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/60">
                Keep your notification settings on so the Security Office can reach you quickly.
              </p>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-white/20 text-xs text-white/60 font-mono-numbers leading-relaxed">
            Campus Security Desk
          </div>
        </aside>
      </div>
    </PortalShell>
  );
};
