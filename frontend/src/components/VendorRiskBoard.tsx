'use client';

import React, { useEffect, useState } from 'react';

export default function VendorRiskBoard() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/vendors/risk')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setVendors(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="glass rounded-xl flex flex-col p-5 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-white flex items-center">
          <svg className="w-4 h-4 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
          Vendor Risk Board
        </h3>
        <span className="text-[10px] bg-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">AI Observer</span>
      </div>
      
      <div className="flex-1 space-y-3">
        {loading ? (
          <div className="text-slate-500 text-sm animate-pulse">Analyzing vendor trust scores...</div>
        ) : vendors.length === 0 ? (
          <div className="text-slate-500 text-sm">No vendors found.</div>
        ) : (
          vendors.map(vendor => (
            <div key={vendor.id} className="bg-black/30 p-3 rounded-lg border border-white/5 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-white truncate pr-2">{vendor.name}</span>
                <span className={`text-lg font-black ${
                  vendor.trust_score >= 90 ? 'text-emerald-400' :
                  vendor.trust_score >= 70 ? 'text-amber-400' : 'text-rose-500'
                }`}>
                  {vendor.trust_score}
                </span>
              </div>
              
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-slate-400">{vendor.type}</span>
                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${
                  vendor.trust_status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  vendor.trust_status === 'PROBATION' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse'
                }`}>
                  {vendor.trust_status}
                </span>
              </div>
              
              <div className="w-full bg-slate-800 rounded-full h-1 mt-2 overflow-hidden">
                <div 
                  className={`h-1 rounded-full ${
                    vendor.trust_score >= 90 ? 'bg-emerald-500' :
                    vendor.trust_score >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, vendor.trust_score))}%` }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
