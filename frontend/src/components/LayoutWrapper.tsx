'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Paths that do NOT use the internal sidebar layout
  const isAuthOrPublic = pathname === '/login' || pathname.startsWith('/verify') || pathname.startsWith('/vendor');

  if (isAuthOrPublic) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <header className="h-16 glass-panel border-b border-white/10 flex items-center justify-between px-6 z-20">
          <div className="flex items-center md:hidden">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              SafeTrace
            </span>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl ml-4">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all" placeholder="Search batch code, supplier lot, or incident ID..." />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10">
              <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-6 relative z-10">
          {children}
        </div>
      </main>

      {/* Disclaimer Footer */}
      <div className="absolute bottom-4 left-64 right-0 text-center pointer-events-none">
        <p className="text-[10px] text-slate-500 max-w-2xl mx-auto px-4 bg-slate-900/50 p-2 rounded backdrop-blur-sm border border-slate-700/50">
          <strong>Disclaimer:</strong> Sistem MBG SafeTrace v0.1 ini adalah prototipe (Proof of Concept) yang diperuntukkan bagi tujuan audit dan penelusuran internal. Sistem ini bukan merupakan rekam medis resmi dan tidak digunakan untuk secara otomatis menjatuhkan sanksi hukum tanpa investigasi lebih lanjut.
        </p>
      </div>
    </div>
  );
}
