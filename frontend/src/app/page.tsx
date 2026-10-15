import React from 'react';
import Link from 'next/link';
import VendorRiskBoard from '@/components/VendorRiskBoard';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">System Overview</h2>
          <p className="text-slate-400 mt-1">Real-time assurance and traceability metrics.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-sm font-medium transition-all shadow-sm">
            Export Report
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 border border-blue-400/20 rounded-lg text-white text-sm font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]">
            New Trace Inquiry
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-5 rounded-xl border-l-4 border-l-blue-500 hover:transform hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Batches Monitored</p>
              <h3 className="text-3xl font-bold text-white mt-1">1,248</h3>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-400 flex items-center font-medium">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              12%
            </span>
            <span className="text-slate-500 ml-2">vs last month</span>
          </div>
        </div>

        <div className="glass p-5 rounded-xl border-l-4 border-l-emerald-500 hover:transform hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Active SPPGs</p>
              <h3 className="text-3xl font-bold text-white mt-1">84</h3>
            </div>
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-400 flex items-center font-medium">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              3
            </span>
            <span className="text-slate-500 ml-2">new this week</span>
          </div>
        </div>

        <div className="glass p-5 rounded-xl border-l-4 border-l-amber-500 hover:transform hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Active Incidents</p>
              <h3 className="text-3xl font-bold text-white mt-1">12</h3>
            </div>
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-400 flex items-center font-medium">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              4
            </span>
            <span className="text-slate-500 ml-2">needs attention</span>
          </div>
        </div>

        <div className="glass p-5 rounded-xl border-l-4 border-l-purple-500 hover:transform hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Trace Operations</p>
              <h3 className="text-3xl font-bold text-white mt-1">8,041</h3>
            </div>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-400 font-medium text-xs bg-white/5 px-2 py-1 rounded">24h volume</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {/* Recent Incidents */}
        <div className="glass rounded-xl lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center">
              <svg className="w-4 h-4 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Recent Correlated Incidents
            </h3>
            <Link href="/incidents" className="text-xs text-blue-400 hover:text-blue-300 font-medium">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 bg-white/5 uppercase">
                <tr>
                  <th className="px-6 py-3 font-medium tracking-wider">ID</th>
                  <th className="px-6 py-3 font-medium tracking-wider">Category</th>
                  <th className="px-6 py-3 font-medium tracking-wider">Status</th>
                  <th className="px-6 py-3 font-medium tracking-wider">Severity</th>
                  <th className="px-6 py-3 font-medium tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { id: 'INC-9042', cat: 'Quality Issue', status: 'Draft', sev: 'HIGH', date: '2026-10-07' },
                  { id: 'INC-9041', cat: 'Delay', status: 'Correlated', sev: 'MEDIUM', date: '2026-10-06' },
                  { id: 'INC-9040', cat: 'Spoilage', status: 'Resolved', sev: 'LOW', date: '2026-10-06' },
                ].map((inc) => (
                  <tr key={inc.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-300">{inc.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{inc.cat}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                        inc.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        inc.status === 'Correlated' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                      }`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`flex items-center gap-1.5 ${
                        inc.sev === 'HIGH' ? 'text-red-400' : 
                        inc.sev === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          inc.sev === 'HIGH' ? 'bg-red-400' : 
                          inc.sev === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}></span>
                        {inc.sev}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400">{inc.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vendor Risk Board */}
        <div className="lg:col-span-1">
          <VendorRiskBoard />
        </div>

        {/* Action Panel */}
        <div className="glass rounded-xl flex flex-col p-5 lg:col-span-1">
          <h3 className="font-semibold text-white mb-4">Quick Trace</h3>
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Batch Code or Lot Number</label>
              <div className="relative">
                <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="e.g. BATCH-2026-X" />
                <button className="absolute inset-y-0 right-0 px-3 flex items-center bg-blue-600 hover:bg-blue-500 rounded-r-lg transition-colors">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Trace Examples</h4>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-left transition-colors border border-white/5">
                  <div>
                    <p className="text-slate-300 font-medium">B-2026-X892</p>
                    <p className="text-xs text-slate-500">Chicken Rice (Oct 7)</p>
                  </div>
                  <span className="text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded text-[10px] font-bold">BATCH</span>
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-left transition-colors border border-white/5">
                  <div>
                    <p className="text-slate-300 font-medium">SL-4002-MILK</p>
                    <p className="text-xs text-slate-500">PT. Dairy Fresh</p>
                  </div>
                  <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-[10px] font-bold">LOT</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
