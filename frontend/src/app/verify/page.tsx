'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function PublicVerification() {
  const [batchCode, setBatchCode] = useState('BATCH-2026-X892');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchCode.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`http://localhost:8000/api/public/trace/${encodeURIComponent(batchCode.trim())}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Kode Batch tidak ditemukan.');
      setResult(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900 flex flex-col font-sans">
      <Head>
        <title>SafeTrace - Cek Makan Siang MBG</title>
      </Head>

      {/* Mobile-first Constrained Container */}
      <div className="flex-1 w-full max-w-md mx-auto bg-slate-900 relative shadow-2xl flex flex-col">
        
        {/* Header */}
        <header className="px-6 py-8 text-center border-b border-white/10 bg-gradient-to-b from-blue-900/40 to-slate-900">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight">
            SafeTrace
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Portal Verifikasi Publik
          </p>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-6 flex flex-col">
          
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white text-center mb-2">Cek Keamanan Makanan</h2>
            <p className="text-center text-slate-400 text-sm mb-6">
              Masukkan Kode Batch pada kotak makan siang untuk melihat detail keamanan.
            </p>
            
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  value={batchCode}
                  onChange={(e) => setBatchCode(e.target.value)}
                  placeholder="MBG-2026-..." 
                  className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-4 text-center text-lg font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all uppercase tracking-wider"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading || !batchCode}
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {loading ? 'Memvalidasi...' : 'VERIFIKASI SEKARANG'}
              </button>
            </form>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-6 text-center animate-in fade-in slide-in-from-bottom-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
              <h3 className="text-lg font-bold text-red-400 mb-1">Pencarian Gagal</h3>
              <p className="text-slate-300 text-sm">{error}</p>
            </div>
          )}

          {/* Result State */}
          {result && (
            <div className={`border-2 rounded-3xl p-6 text-center animate-in fade-in zoom-in-95 duration-300 ${result.is_safe ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/50 bg-red-500/10 shadow-2xl shadow-red-900/20'}`}>
              
              {/* Giant Stamp */}
              <div className="relative mb-6">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 ${result.is_safe ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' : 'border-red-500 text-red-500 bg-red-500/20'} shadow-inner`}>
                  {result.is_safe ? (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  )}
                </div>
              </div>

              <h3 className={`text-2xl font-black uppercase tracking-wide mb-1 ${result.is_safe ? 'text-emerald-400' : 'text-red-500'}`}>
                {result.is_safe ? 'AMAN DIKONSUMSI' : 'JANGAN DIKONSUMSI'}
              </h3>
              <p className="text-slate-300 text-sm font-medium mb-6">
                {result.status_message}
              </p>

              {/* Data Card */}
              <div className="bg-slate-900 rounded-2xl p-4 border border-white/5 space-y-4 text-left">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Menu Makanan</p>
                  <p className="text-white font-medium">{result.menu_label}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Dapur Penyiap</p>
                    <p className="text-slate-300 text-sm">{result.kitchen_name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Waktu Masak</p>
                    <p className="text-slate-300 text-sm">{new Date(result.production_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
              </div>

              {result.is_safe && (
                <div className="mt-6 flex items-center justify-center gap-2 text-emerald-400/80 text-xs font-medium bg-emerald-500/10 py-2 px-3 rounded-full border border-emerald-500/20">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  Tervalidasi & Diaudit Blockchain
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <footer className="p-6 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-white transition-colors underline underline-offset-4">
            Akses Dasbor Internal Pegawai
          </Link>
          <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-slate-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <span className="text-[10px] font-bold uppercase tracking-widest">MBG SafeTrace v2.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
