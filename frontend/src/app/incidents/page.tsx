'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Incidents() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const res = await fetch('http://localhost:8000/api/incidents');
        if (!res.ok) throw new Error('Failed to fetch incidents');
        
        const data = await res.json();
        setIncidents(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchIncidents();
  }, []);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Incident Management</h2>
          <p className="text-slate-400 mt-1">Review, correlate, and manage reported issues.</p>
        </div>
        
        <button className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 border border-red-400/20 rounded-lg text-white font-medium transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          Report New Incident
        </button>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4 flex flex-wrap gap-4 items-center border border-white/5">
        <div className="flex-1 min-w-[200px] relative">
           <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white" placeholder="Search incidents..." />
           <span className="absolute inset-y-0 left-0 flex items-center pl-3">
             <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </span>
        </div>
        <select className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50">
          <option>All Severities</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50">
          <option>All Statuses</option>
          <option>Draft</option>
          <option>Correlated</option>
          <option>Under Investigation</option>
          <option>Resolved</option>
        </select>
        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors">
          Filter
        </button>
      </div>

      {/* Incidents Table */}
      <div className="flex-1 glass rounded-xl border border-white/5 overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading incidents...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">{error}</div>
        ) : (
          <>
            <div className="overflow-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 bg-white/5 uppercase sticky top-0 backdrop-blur-md z-10">
                  <tr>
                    <th className="px-6 py-4 font-medium tracking-wider">Incident ID</th>
                    <th className="px-6 py-4 font-medium tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 font-medium tracking-wider">Category</th>
                    <th className="px-6 py-4 font-medium tracking-wider">Severity</th>
                    <th className="px-6 py-4 font-medium tracking-wider">Status</th>
                    <th className="px-6 py-4 font-medium tracking-wider">Correlations</th>
                    <th className="px-6 py-4 font-medium tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {incidents.map((inc) => (
                    <tr key={inc.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-mono text-white text-[11px] truncate w-24" title={inc.id}>{inc.id.substring(0, 8)}...</div>
                        <div className="text-xs text-slate-500 mt-1 truncate max-w-[200px]" title={inc.description}>{inc.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-400">{new Date(inc.observed_time).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-300">{inc.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-md flex w-fit items-center gap-1.5 ${
                          inc.severity === 'CRITICAL' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                          inc.severity === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                          inc.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-semibold text-slate-300 bg-white/5 px-2 py-1 rounded border border-white/5 uppercase">
                          {inc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {inc.production_batch_id ? (
                          <Link href={`/trace?batchId=${inc.production_batch_id}`} className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center">
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            View Batch
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-sm font-medium text-blue-400 hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-white/5 flex justify-between items-center text-sm text-slate-400">
              <span>Showing 1 to {incidents.length} of {incidents.length} entries</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 disabled:opacity-50" disabled>Prev</button>
                <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 disabled:opacity-50" disabled>Next</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
