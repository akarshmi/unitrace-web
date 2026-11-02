import React from 'react';
import { User } from '../../types';
import { ShieldCheck, Mail, GraduationCap, Building2, Phone, LogOut, Check } from 'lucide-react';

interface StudentProfileViewProps {
  user: User;
  onLogout: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  user,
  onLogout,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b-2 border-black dark:border-neutral-800 pb-4">
        <div className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--navy)] dark:text-blue-400 font-mono-numbers mb-1">
          Identity Registry // LPU
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black dark:text-white">
          Student Credential Profile
        </h1>
        <p className="text-xs text-[var(--muted)] mt-1">
          Verified university identity used for physical property claims at the Security Office.
        </p>
      </div>

      {/* Main Profile Dossier Card */}
      <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#0B1422] p-6 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black dark:border-neutral-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[var(--navy)] text-white flex items-center justify-center font-bold text-xl font-mono-numbers">
              {user.fullName.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold uppercase tracking-tight text-black dark:text-white">
                  {user.fullName}
                </h2>
                {user.isEmailVerified && (
                  <span className="flex items-center gap-1 text-[10px] font-mono-numbers bg-neutral-100 dark:bg-slate-800 text-black dark:text-white px-2 py-0.5 border border-black dark:border-neutral-600 font-bold uppercase">
                    <Check className="w-3 h-3 text-[var(--navy)]" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
              <div className="text-xs font-mono-numbers text-[var(--muted)] mt-0.5">
                REG NO: {user.registrationNumber} · {user.role}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 border-2 border-black dark:border-neutral-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-xs font-bold uppercase tracking-[0.12em] transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Credential Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border-2 border-black dark:border-neutral-800 space-y-1 bg-white dark:bg-[#111F31]">
            <div className="text-[10px] uppercase font-mono-numbers font-bold text-[var(--muted)] flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[var(--navy)]" />
              <span>University Registration ID</span>
            </div>
            <div className="text-sm font-bold font-mono-numbers text-black dark:text-white">
              {user.registrationNumber}
            </div>
          </div>

          <div className="p-4 border-2 border-black dark:border-neutral-800 space-y-1 bg-white dark:bg-[#111F31]">
            <div className="text-[10px] uppercase font-mono-numbers font-bold text-[var(--muted)] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[var(--navy)]" />
              <span>University Email</span>
            </div>
            <div className="text-sm font-bold text-black dark:text-white">
              {user.email}
            </div>
          </div>

          <div className="p-4 border-2 border-black dark:border-neutral-800 space-y-1 bg-white dark:bg-[#111F31]">
            <div className="text-[10px] uppercase font-mono-numbers font-bold text-[var(--muted)] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[var(--navy)]" />
              <span>Academic Department</span>
            </div>
            <div className="text-sm font-bold text-black dark:text-white">
              {user.department || 'School of Computer Science & Engineering'}
            </div>
          </div>

          <div className="p-4 border-2 border-black dark:border-neutral-800 space-y-1 bg-white dark:bg-[#111F31]">
            <div className="text-[10px] uppercase font-mono-numbers font-bold text-[var(--muted)] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[var(--navy)]" />
              <span>Student Phone (Private)</span>
            </div>
            <div className="text-sm font-bold font-mono-numbers text-black dark:text-white">
              {user.phoneMasked || '+91 98*** **412'}
            </div>
          </div>
        </div>

        {/* Security Rule Notice */}
        <div className="border-2 border-black dark:border-neutral-800 p-4 bg-[var(--surface)] dark:bg-slate-900/60 text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[var(--navy)] dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-black dark:text-white uppercase tracking-wider mb-1">
              Student Privacy Guarantee
            </div>
            <p className="leading-relaxed text-xs text-[var(--muted)]">
              Your contact details are never exposed to other students. All item returns are processed confidentially by the Security Desk using one-time verification keys.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
