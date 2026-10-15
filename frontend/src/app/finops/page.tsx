'use client';

import React, { useEffect, useState } from 'react';

export default function FinOpsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/finops/overview')
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setData(res.data);
        } else {
          setError(res.message);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RELEASED': return <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold shadow-sm">💰 CAIR (RELEASED)</span>;
      case 'PENDING': return <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold shadow-sm">⏳ TERTUNDA</span>;
      case 'FROZEN': return <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-bold shadow-sm">❄️ DIBEKUKAN (FROZEN)</span>;
      default: return <span className="px-3 py-1 bg-slate-500/20 text-slate-400 border border-slate-500/30 rounded-full text-xs font-bold shadow-sm">{status}</span>;
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">FinOps & Escrow</h2>
          <p className="text-slate-400 mt-1">
            Automasi Penyaluran Dana SPPG berbasis Integritas Data <span className="font-mono text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded text-xs ml-2">Smart Contract</span>
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-400 animate-pulse">Menghubungkan ke node finansial...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-400 bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">{error}</p>
        </div>
      ) : data ? (
        <div className="flex-1 flex flex-col space-y-6 overflow-hidden">
          
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
            {/* Total Released */}
            <div className="glass p-6 rounded-2xl border-2 border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
              <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Dana Tersalurkan (Released)
              </p>
              <h3 className="text-4xl font-black text-white">{formatCurrency(data.metrics.total_released)}</h3>
              <p className="text-xs text-slate-400 mt-2">Otomatis dicairkan karena log aman.</p>
            </div>
            
            {/* Total Pending */}
            <div className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
              <p className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Dana Tertunda (Pending)
              </p>
              <h3 className="text-4xl font-black text-white">{formatCurrency(data.metrics.total_pending)}</h3>
              <p className="text-xs text-slate-400 mt-2">Menunggu konfirmasi kedatangan di sekolah.</p>
            </div>
            
            {/* Total Frozen */}
            <div className="glass p-6 rounded-2xl border-2 border-red-500/20 relative overflow-hidden group hover:border-red-500/50 transition-colors">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-colors"></div>
              <p className="text-sm font-bold text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                Dana Dibekukan (Frozen)
              </p>
              <h3 className="text-4xl font-black text-white">{formatCurrency(data.metrics.total_frozen)}</h3>
              <p className="text-xs text-red-400/80 mt-2">Ditahan otomatis akibat temuan IoT/insiden.</p>
            </div>
          </div>

          {/* List/Table */}
          <div className="flex-1 glass rounded-2xl border border-white/5 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-white/5 bg-white/5">
              <h3 className="font-bold text-white text-lg">Buku Besar Pencairan SPPG (Escrow Ledger)</h3>
            </div>
            
            <div className="flex-1 overflow-auto p-2">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs text-slate-400 uppercase bg-black/40 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 font-semibold tracking-wider">Kode Batch</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Dapur Umum (SPPG)</th>
                    <th className="px-6 py-4 font-semibold tracking-wider text-right">Nilai Tagihan (Rp)</th>
                    <th className="px-6 py-4 font-semibold tracking-wider text-center">Status Pencairan</th>
                    <th className="px-6 py-4 font-semibold tracking-wider text-center">Tarik Paksa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.batches.map((batch: any) => (
                    <tr key={batch.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-mono text-emerald-400">{batch.batch_code}</td>
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{batch.kitchen_name}</p>
                        <p className="text-xs text-slate-500">{batch.menu_label}</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-white text-right">
                        {formatCurrency(batch.escrow_amount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(batch.payment_status)}
                        {batch.incidents_count > 0 && (
                          <p className="text-[10px] text-red-400 mt-2 font-bold animate-pulse">⚠️ {batch.incidents_count} INSIDEN DETECTED</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button disabled className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-xs text-slate-400 transition-colors disabled:opacity-50">Manual Review</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      ) : null}
    </div>
  );
}
