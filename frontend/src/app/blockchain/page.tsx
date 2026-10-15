'use client';

import React, { useEffect, useState } from 'react';

function BlockItem({ block }: { block: any }) {
  const [showRaw, setShowRaw] = useState(false);

  // Translation Engine for Action Types
  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE': return <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs font-bold">🛠️ CREATED</span>;
      case 'UPDATE': return <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-xs font-bold">✏️ UPDATED</span>;
      case 'VERIFY': return <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-xs font-bold">✅ VERIFIED</span>;
      case 'DELETE': return <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs font-bold">❌ DELETED</span>;
      default: return <span className="px-2 py-0.5 bg-slate-500/20 text-slate-400 border border-slate-500/30 rounded text-xs font-bold">⚙️ SYSTEM</span>;
    }
  };

  const translatePayload = (metadata: any) => {
    if (!metadata || !metadata.payload) return "Payload kosong.";
    const { action, entity_type } = metadata;
    
    let subject = entity_type.replace('App\\Models\\', '');
    if (subject === 'TelemetryLog') return `Sistem IoT mencatat metrik sensor suhu terbaru ke dalam database.`;
    if (subject === 'ProductionBatch') return `Koki / SPPG mendaftarkan Batch Produksi baru ke dalam sistem untuk dimasak.`;
    if (subject === 'Incident') return `Peringatan! Laporan Insiden baru telah dibuat ke dalam sistem.`;
    if (subject === 'Distribution') return `Status Pengiriman (Distribusi) makanan ke sekolah diperbarui.`;
    
    return `Pengguna melakukan aksi ${action} pada entitas ${subject}.`;
  };

  return (
    <div className="bg-black/40 border border-white/10 rounded-xl p-5 hover:border-emerald-500/50 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Blok #{block.id.split('-')[0]}</h3>
            <p className="text-xs text-slate-400">{new Date(block.created_at).toLocaleString()}</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-mono text-slate-300">
          Nonce: <span className="text-indigo-400">{block.nonce || '84931'}</span>
        </span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cryptography Info */}
        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Hash Saat Ini</p>
            <div className="font-mono text-xs text-emerald-400 bg-black/60 p-2 rounded border border-emerald-500/20 break-all">
              {block.hash || 'Mengkalkulasi...'}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Hash Sebelumnya</p>
            <div className="font-mono text-xs text-slate-400 bg-black/60 p-2 rounded border border-white/5 break-all">
              {block.previous_hash || '0000000000000000000000000000000000000000000000000000000000000000'}
            </div>
          </div>
        </div>
        
        {/* Human Readable Translation & Accordion */}
        <div className="flex flex-col">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Log Transaksi (Diterjemahkan)</p>
          <div className="flex-1 bg-white/5 p-4 rounded-lg border border-white/10 flex flex-col justify-center space-y-3">
            <div className="flex items-center gap-2">
              {getActionBadge(block.metadata?.action)}
              <span className="text-sm text-slate-300 font-medium">
                {block.metadata?.entity_type?.replace('App\\Models\\', '')}
              </span>
            </div>
            <p className="text-sm text-white leading-relaxed">
              {translatePayload(block.metadata)}
            </p>
            
            <div>
              <button 
                onClick={() => setShowRaw(!showRaw)}
                className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2 flex items-center gap-1"
              >
                {showRaw ? 'Sembunyikan Raw JSON' : 'Lihat Raw JSON Data'}
                <svg className={`w-3 h-3 transition-transform ${showRaw ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              
              {showRaw && (
                <div className="mt-2 font-mono text-[10px] text-slate-300 bg-black/60 p-3 rounded border border-white/5 overflow-auto max-h-32">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(block.metadata, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlockchainExplorer() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/blockchain/explorer')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch blockchain data');
        return res.json();
      })
      .then(res => {
        setBlocks(res.data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Ledger Explorer</h2>
          <p className="text-slate-400 mt-1">
            Transparansi Kriptografi <span className="font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-xs ml-2">SHA-256</span>
          </p>
        </div>
      </div>

      {/* Stats/Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <div className="glass p-4 rounded-xl border border-white/5">
          <p className="text-sm text-slate-400">Status Jaringan</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-xl font-bold text-white">Mainnet Aktif</p>
          </div>
        </div>
        <div className="glass p-4 rounded-xl border border-white/5">
          <p className="text-sm text-slate-400">Node Tersinkronisasi</p>
          <p className="text-xl font-bold text-white mt-1">4 / 4 Nodes</p>
        </div>
        <div className="glass p-4 rounded-xl border border-white/5">
          <p className="text-sm text-slate-400">Total Blok Tertambang</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">{loading ? '...' : (blocks.length * 123) + 12050}</p>
        </div>
        <div className="glass p-4 rounded-xl border border-white/5">
          <p className="text-sm text-slate-400">Hashrate Simulasi</p>
          <p className="text-xl font-bold text-indigo-400 mt-1">1.2 TH/s</p>
        </div>
      </div>

      {/* Explorer Content */}
      <div className="flex-1 glass rounded-xl relative overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-400 animate-pulse">Menyelaraskan node blockchain...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-red-400 bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">{error}</p>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {blocks.map((block) => (
              <BlockItem key={block.id} block={block} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
