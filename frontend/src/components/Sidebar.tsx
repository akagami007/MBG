'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const ROLES = [
  { id: 'QUALITY_REVIEWER', label: 'Quality Reviewer', initials: 'QR' },
  { id: 'AUDITOR', label: 'Auditor', initials: 'AU' },
  { id: 'DATA_STEWARD', label: 'Data Steward', initials: 'DS' },
  { id: 'SUPPLIER_CONTACT', label: 'Supplier Contact', initials: 'SC' },
  { id: 'PIC_SCHOOL', label: 'PIC School', initials: 'PS' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [activeRole, setActiveRole] = useState(ROLES[1]); // Default to Auditor
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <aside className="w-64 glass-panel border-r border-white/10 hidden md:flex flex-col relative z-20 shadow-2xl">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          SafeTrace
        </h1>
        <p className="text-xs text-slate-400 mt-1">Assurance & Traceability</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link 
          href="/" 
          className={`flex items-center px-4 py-3 rounded-lg ${isActive('/') ? 'bg-white/5 text-white border border-white/5 shadow-sm' : 'text-slate-300 hover:bg-white/5 hover:text-white'} group`}
        >
          <svg className={`w-5 h-5 mr-3 ${isActive('/') ? 'text-blue-400' : 'text-blue-500 group-hover:text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </Link>
        <Link 
          href="/trace" 
          className={`flex items-center px-4 py-3 rounded-lg ${isActive('/trace') ? 'bg-white/5 text-white border border-white/5 shadow-sm' : 'text-slate-300 hover:bg-white/5 hover:text-white'} group`}
        >
          <svg className={`w-5 h-5 mr-3 ${isActive('/trace') ? 'text-emerald-400' : 'text-emerald-500 group-hover:text-emerald-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Trace Graph
        </Link>
        <Link 
          href="/incidents" 
          className={`flex items-center px-4 py-3 rounded-lg ${isActive('/incidents') ? 'bg-white/5 text-white border border-white/5 shadow-sm' : 'text-slate-300 hover:bg-white/5 hover:text-white'} group`}
        >
          <svg className={`w-5 h-5 mr-3 ${isActive('/incidents') ? 'text-amber-400' : 'text-amber-500 group-hover:text-amber-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Incidents
        </Link>
        <Link 
          href="/blockchain" 
          className={`flex items-center px-4 py-3 rounded-lg ${isActive('/blockchain') ? 'bg-white/5 text-white border border-white/5 shadow-sm' : 'text-slate-300 hover:bg-white/5 hover:text-white'} group`}
        >
          <svg className={`w-5 h-5 mr-3 ${isActive('/blockchain') ? 'text-indigo-400' : 'text-indigo-500 group-hover:text-indigo-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Ledger Explorer
        </Link>
        <Link 
          href="/finops" 
          className={`flex items-center px-4 py-3 rounded-lg ${isActive('/finops') ? 'bg-white/5 text-white border border-white/5 shadow-sm' : 'text-slate-300 hover:bg-white/5 hover:text-white'} group`}
        >
          <svg className={`w-5 h-5 mr-3 ${isActive('/finops') ? 'text-orange-400' : 'text-orange-500 group-hover:text-orange-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          FinOps & Escrow
        </Link>
        <Link 
          href="/map" 
          className={`flex items-center px-4 py-3 rounded-lg ${isActive('/map') ? 'bg-white/5 text-white border border-white/5 shadow-sm' : 'text-slate-300 hover:bg-white/5 hover:text-white'} group`}
        >
          <svg className={`w-5 h-5 mr-3 ${isActive('/map') ? 'text-rose-400' : 'text-rose-500 group-hover:text-rose-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Live Map
        </Link>
        <Link 
          href="/scan" 
          className={`flex items-center px-4 py-3 rounded-lg ${isActive('/scan') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm' : 'text-slate-300 hover:bg-emerald-500/5 hover:text-emerald-400'} group mt-4`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          Scan QR (PIC)
        </Link>

        <p className="mt-8 mb-4 px-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Public Access
        </p>
        
        <a href="/verify" className="flex items-center px-4 py-3 rounded-lg text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition-colors group" target="_blank" rel="noopener noreferrer">
          <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Portal Orang Tua
        </a>
      </nav>
      
      <div className="p-4 border-t border-white/10 relative">
        <button 
          onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
          className="w-full text-left flex items-center justify-between gap-3 px-2 py-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xs">
              {activeRole.initials}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{activeRole.label}</p>
              <p className="text-[10px] text-slate-400">Switch Role</p>
            </div>
          </div>
          <svg className={`w-4 h-4 text-slate-400 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {isRoleDropdownOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-slate-800 border border-white/10 rounded-lg shadow-xl overflow-hidden py-1 z-50">
            {ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  setActiveRole(role);
                  setIsRoleDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${activeRole.id === role.id ? 'text-emerald-400 bg-white/5' : 'text-slate-300'}`}
              >
                {role.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
