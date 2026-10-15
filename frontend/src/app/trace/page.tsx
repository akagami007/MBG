'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function TraceGraph() {
  const [batchId, setBatchId] = useState('11111111-2222-3333-4444-555555555555');
  const [traceData, setTraceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runTrace = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch backward trace
      const res = await fetch(`http://localhost:8000/api/trace/backward/${batchId}`);
      if (!res.ok) throw new Error('Failed to fetch trace data');
      const data = await res.json();
      setTraceData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Trace Graph Visualizer</h2>
          <p className="text-slate-400 mt-1">Interactive node-link diagram for backward and forward tracing.</p>
        </div>
        
        <div className="flex gap-2">
          <div className="flex bg-black/20 p-1 rounded-lg border border-white/10">
            <button className="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-md text-sm font-medium border border-blue-500/30">
              Backward Trace
            </button>
            <button className="px-4 py-1.5 text-slate-400 hover:text-white rounded-md text-sm font-medium transition-colors">
              Forward Trace
            </button>
          </div>
          
          <button 
            onClick={() => window.open(`/trace/print?batch=${batchId}`, '_blank')}
            disabled={!traceData}
            className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-emerald-500/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Audit
          </button>
        </div>
      </div>

      <div className="glass rounded-xl p-4 flex gap-4 items-center shrink-0">
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input 
            type="text" 
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 text-white" 
            placeholder="Enter Batch ID (UUID)"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
          />
        </div>
        <button 
          onClick={runTrace}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg text-white text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
        >
          {loading ? 'Tracing...' : 'Run Trace'}
        </button>
      </div>

      <div className="flex-1 glass rounded-xl relative overflow-hidden flex">
        {/* Graph Canvas */}
        <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-white/[0.01] relative p-8 overflow-auto">
          
          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {!traceData && !loading && !error && (
             <div className="h-full flex items-center justify-center text-slate-500">
                Enter a Batch ID and click "Run Trace" to fetch real data from Laravel backend.
             </div>
          )}

          {traceData && (
            <div className="min-w-[800px] h-full relative flex items-center justify-center py-10 px-4 gap-16">
              
              {/* Suppliers / Lots Column */}
              <div className="space-y-6 relative z-10 w-64">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">Ingredient Lots</h4>
                
                {traceData.data.ingredient_lineage?.map((comp: any) => (
                  <div key={comp.component_id} className="glass p-3 rounded-lg border-l-4 border-l-emerald-500 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">{comp.supplier_lot.commodity}</span>
                    </div>
                    <p className="text-sm font-medium text-white mt-2">{comp.supplier_lot.lot_code}</p>
                    <div className="text-xs text-slate-400 mt-1">Used: {comp.quantity_used} (Received: {comp.supplier_lot.quantity} {comp.supplier_lot.unit})</div>
                  </div>
                ))}
              </div>

              {/* Batch Column */}
              <div className="relative z-10 w-80">
                 <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">Production Batch</h4>
                 
                 <div className="glass p-5 rounded-xl border-t-4 border-t-blue-500 bg-blue-900/20 shadow-[0_0_30px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/30">
                   <div className="flex justify-between items-center mb-3">
                     <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">BATCH (FOCUS)</span>
                   </div>
                   <h3 className="text-xl font-bold text-white">{traceData.data.batch_code}</h3>
                   <p className="text-sm text-slate-300 mt-1">{traceData.data.menu_label}</p>
                   <div className="mt-4 pt-3 border-t border-white/10">
                     <p className="text-xs text-slate-400">Prepared by:</p>
                     <p className="text-sm font-medium text-white">{traceData.data.sppg?.name}</p>
                   </div>
                   
                   {traceData.data.incidents?.length > 0 && (
                     <div className="mt-4 pt-3 border-t border-red-500/20">
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded flex items-center w-fit">
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                          {traceData.data.incidents.length} Incidents Found
                        </span>
                     </div>
                   )}
                  </div>
              </div>

              {/* Distributions Column */}
              <div className="space-y-6 relative z-10 w-80">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">Distributions & Telemetry</h4>
                
                {traceData.data.distribution_destinations?.map((dist: any) => (
                  <div key={dist.distribution_id} className="glass p-4 rounded-xl border-l-4 border-l-purple-500 bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">SCHOOL</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${dist.status === 'RECEIVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                        {dist.status || 'DISPATCHED'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white">{dist.destination_school?.name}</p>
                    
                    {dist.telemetry && dist.telemetry.length > 0 && (
                      <div className="mt-4 bg-black/40 p-2 rounded-lg border border-white/5">
                        <div className="text-[10px] text-slate-400 mb-1 flex justify-between">
                          <span>Cold-Chain Telemetry</span>
                          <span className={dist.telemetry.some((t:any) => (t.temperature || t.predicted_temperature || 0) > 25) ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                            Max: {Math.max(...dist.telemetry.map((t:any) => t.temperature || t.predicted_temperature || 0))}°C
                          </span>
                        </div>
                        <div className="h-24 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dist.telemetry}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                              <ReferenceLine y={25} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', fill: '#ef4444', fontSize: 10, value: 'Ambang Batas (25°C)' }} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px' }} 
                                labelFormatter={() => ''}
                              />
                              {/* Actual Temperature */}
                              <Line type="monotone" dataKey="temperature" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                              {/* Predicted Temperature (Extrapolated) */}
                              <Line type="monotone" dataKey="predicted_temperature" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 4 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

        {/* Info Panel Sidebar */}
        <div className="w-80 border-l border-white/10 bg-black/20 p-5 overflow-y-auto">
          <h3 className="font-bold text-white text-lg mb-4">Trace Details</h3>
          
          {!traceData ? (
            <p className="text-sm text-slate-500">Run a trace to view details.</p>
          ) : (
            <div className="space-y-4">
              
              {traceData.data.incidents?.length > 0 && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <h4 className="text-red-400 font-semibold text-sm flex items-center mb-2">
                    Incident Alerts
                  </h4>
                  {traceData.data.incidents.map((inc: any) => (
                    <div key={inc.id} className="text-xs text-slate-300 border-b border-red-500/10 pb-2 mb-2 last:border-0 last:mb-0 last:pb-0">
                      <strong className="block text-red-300">{inc.category} ({inc.severity})</strong>
                      {inc.description}
                    </div>
                  ))}
                </div>
              )}
              
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Batch Information</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">ID</span>
                    <span className="text-white font-mono text-[10px] truncate w-32 text-right" title={traceData.data.batch_id}>
                      {traceData.data.batch_id}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">Code</span>
                    <span className="text-white">{traceData.data.batch_code}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">SPPG</span>
                    <span className="text-white text-right">{traceData.data.sppg?.name}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-400">Time</span>
                    <span className="text-white text-xs">{new Date(traceData.data.production_time).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Raw API Payload</p>
                <div className="bg-black/50 p-2 rounded-lg text-[10px] font-mono text-emerald-400 overflow-x-auto max-h-64">
                  <pre>{JSON.stringify(traceData, null, 2)}</pre>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
