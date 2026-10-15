'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function PrintAuditReportContent() {
  const searchParams = useSearchParams();
  const batchId = searchParams.get('batch');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!batchId) {
      setError('Batch ID is missing.');
      return;
    }
    
    fetch(`http://localhost:8000/api/trace/backward/${batchId}`)
      .then(res => res.json())
      .then(res => setData(res.data))
      .catch(err => setError(err.message));
  }, [batchId]);

  // Trigger print dialog once data is loaded and rendered
  useEffect(() => {
    if (data) {
      // Small timeout to allow images/layout to paint
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [data]);

  if (error) return <div className="p-10 text-red-500 font-bold">{error}</div>;
  if (!data) return <div className="p-10 font-bold">Menyiapkan Laporan Audit...</div>;

  return (
    <div className="bg-white min-h-screen text-black p-8 md:p-16 max-w-4xl mx-auto print:p-0 print:max-w-none">
      {/* Header Kop Surat */}
      <div className="border-b-4 border-black pb-4 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest">MBG SafeTrace</h1>
          <p className="text-sm font-bold text-gray-600 mt-1">Laporan Investigasi Insiden & Rantai Pasok</p>
        </div>
        <div className="text-right text-xs">
          <p><strong>Dicetak pada:</strong> {new Date().toLocaleString('id-ID')}</p>
          <p><strong>Sistem Referensi:</strong> SIPGN-MBG-Trace-v0.1</p>
          <p><strong>Status:</strong> RAHASIA</p>
        </div>
      </div>

      {/* Identitas Batch */}
      <section className="mb-8 border border-gray-300 p-4">
        <h2 className="bg-black text-white inline-block px-3 py-1 text-sm font-bold uppercase mb-4">Informasi Batch Produksi</h2>
        <table className="w-full text-sm text-left">
          <tbody>
            <tr className="border-b border-gray-100">
              <th className="py-2 font-semibold w-40">ID Batch (UUID)</th>
              <td className="py-2 font-mono text-xs">{data.batch_id}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <th className="py-2 font-semibold">Kode Produksi</th>
              <td className="py-2 font-bold text-base">{data.batch_code}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <th className="py-2 font-semibold">Menu Utama</th>
              <td className="py-2">{data.menu_label}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <th className="py-2 font-semibold">Waktu Produksi</th>
              <td className="py-2">{new Date(data.production_time).toLocaleString('id-ID')}</td>
            </tr>
            <tr>
              <th className="py-2 font-semibold">Nama SPPG</th>
              <td className="py-2">{data.sppg?.name}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Ringkasan Insiden */}
      <section className="mb-8">
        <h2 className="bg-black text-white inline-block px-3 py-1 text-sm font-bold uppercase mb-4">Laporan Insiden (Anomali)</h2>
        {(!data.incidents || data.incidents.length === 0) ? (
          <div className="p-4 bg-gray-50 border border-gray-200 text-sm">Tidak ada insiden yang tercatat untuk batch ini.</div>
        ) : (
          <div className="space-y-4">
            {data.incidents.map((inc: any, idx: number) => (
              <div key={idx} className="border-l-4 border-black pl-4 py-2 bg-gray-50">
                <div className="flex justify-between">
                  <span className="font-bold text-red-600 uppercase">[{inc.severity}] {inc.category}</span>
                  <span className="text-xs text-gray-500">{new Date(inc.created_at).toLocaleString('id-ID')}</span>
                </div>
                <p className="text-sm mt-1">{inc.description}</p>
                <p className="text-xs text-gray-600 mt-1">Status Penanganan: <strong>{inc.status}</strong></p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Rantai Pasok (Bahan Baku) */}
      <section className="mb-8">
        <h2 className="bg-black text-white inline-block px-3 py-1 text-sm font-bold uppercase mb-4">Komposisi Bahan Baku (Backward Trace)</h2>
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="p-2">No. Lot Pemasok</th>
              <th className="p-2">Komoditas</th>
              <th className="p-2">Pemasok Asal</th>
              <th className="p-2">Jumlah Digunakan</th>
            </tr>
          </thead>
          <tbody>
            {data.ingredient_lineage?.map((comp: any, idx: number) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="p-2 font-mono text-xs">{comp.supplier_lot.lot_code}</td>
                <td className="p-2">{comp.supplier_lot.commodity}</td>
                <td className="p-2 font-semibold">{comp.supplier_lot.supplier?.name}</td>
                <td className="p-2">{comp.quantity_used} {comp.supplier_lot.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Rute Distribusi */}
      <section className="mb-8">
        <h2 className="bg-black text-white inline-block px-3 py-1 text-sm font-bold uppercase mb-4">Titik Distribusi (Sekolah)</h2>
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="p-2">Sekolah Tujuan</th>
              <th className="p-2">Status</th>
              <th className="p-2">Peringatan Suhu (Max)</th>
            </tr>
          </thead>
          <tbody>
            {data.distribution_destinations?.map((dist: any, idx: number) => {
              const maxTemp = dist.telemetry && dist.telemetry.length > 0 
                  ? Math.max(...dist.telemetry.map((t:any) => t.temperature)) 
                  : null;
              
              return (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="p-2 font-semibold">{dist.destination_school?.name}</td>
                  <td className="p-2">{dist.status || 'DISPATCHED'}</td>
                  <td className="p-2">
                    {maxTemp !== null ? (
                      <span className={maxTemp > 25 ? 'text-red-600 font-bold' : ''}>
                        {maxTemp}°C {maxTemp > 25 ? '(BAHAYA)' : '(Aman)'}
                      </span>
                    ) : 'Tidak ada data'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Penandatanganan */}
      <div className="mt-16 pt-8 border-t border-gray-300 grid grid-cols-2 gap-8 text-center text-sm">
        <div>
          <p className="mb-16">Disetujui oleh Auditor Kualitas,</p>
          <p className="font-bold border-b border-black inline-block px-8 pb-1">........................................</p>
          <p className="mt-1">NIP / ID Auditor</p>
        </div>
        <div>
          <p className="mb-16">Mengetahui Kepala Badan Pangan,</p>
          <p className="font-bold border-b border-black inline-block px-8 pb-1">........................................</p>
          <p className="mt-1">NIP / Jabatan</p>
        </div>
      </div>
      
      {/* Print styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:max-w-none { max-width: none !important; }
        }
      `}} />
    </div>
  );
}

export default function PrintAuditReport() {
  return (
    <Suspense fallback={<div className="p-10 font-bold">Memuat Modul Audit...</div>}>
      <PrintAuditReportContent />
    </Suspense>
  );
}
