import React from 'react';
import { Link, useRouter } from '../../lib/router';

export { Link };

export const PortalShell: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`w-full max-w-6xl mx-auto space-y-6 sm:space-y-8 ${className}`}>
      {children}
    </div>
  );
};

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  copy?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, copy, action }) => {
  return (
    <header className="border-b-2 border-black dark:border-neutral-800 pb-6 sm:pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <p className="label text-[var(--muted)] mb-2 font-mono-numbers">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-[-0.06em] leading-tight text-black dark:text-white break-words">
          {title}
        </h1>
        {copy && (
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-[var(--muted)] max-w-xl leading-relaxed">
            {copy}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 w-full sm:w-auto">{action}</div>}
    </header>
  );
};

export interface StatGridProps {
  stats: [string, string][];
}

export const StatGrid: React.FC<StatGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 border-2 border-black dark:border-neutral-800 divide-x-2 divide-y-2 lg:divide-y-0 divide-black dark:divide-neutral-800 bg-white dark:bg-[#0B1422]">
      {stats.map(([count, label], index) => (
        <div key={index} className="p-4 sm:p-6">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black dark:text-white font-mono-numbers tracking-tight">
            {count}
          </div>
          <div className="label text-[var(--muted)] mt-1.5 sm:mt-2 text-[10px] sm:text-xs">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
};

export const ActionLink: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ href, children, className = '', onClick }) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-block bg-black dark:bg-white text-white dark:text-black px-4 sm:px-5 py-3 text-xs font-bold uppercase tracking-[.12em] hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer text-center ${className}`}
    >
      {children}
    </Link>
  );
};

export const Row: React.FC<{
  title: string;
  meta: string;
  badge?: string;
  href?: string;
  onClick?: () => void;
}> = ({ title, meta, badge, href, onClick }) => {
  const { navigate } = useRouter();
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      navigate(href);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-between gap-4 py-5 ${
        onClick || href ? 'cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/40 -mx-2 px-2 transition-colors' : ''
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="font-bold text-black dark:text-white truncate">{title}</p>
        <p className="mt-1 text-sm text-[var(--muted)] truncate">{meta}</p>
      </div>
      <span className="label text-black dark:text-white shrink-0">→</span>
    </div>
  );
};

export const FormPage: React.FC<{
  eyebrow?: string;
  title: string;
  backHref?: string;
  children: React.ReactNode;
}> = ({ eyebrow, title, backHref = '/app', children }) => {
  return (
    <PortalShell>
      <div className="border-b-2 border-black dark:border-neutral-800 pb-5 sm:pb-6 flex items-center justify-between">
        <div>
          {eyebrow && <p className="label text-[var(--muted)]">{eyebrow}</p>}
          <h1 className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black dark:text-white">
            {title}
          </h1>
        </div>
        <Link href={backHref} className="label hover:underline">
          ← BACK
        </Link>
      </div>
      <div className="pt-4 sm:pt-6">{children}</div>
    </PortalShell>
  );
};
