'use client';

import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function QRScannerPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    // Check if we are running in browser
    if (typeof window === 'undefined') return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: {width: 250, height: 250}, aspectRatio: 1.0 },
      false
    );

    const onScanSuccess = (decodedText: string) => {
      // Pause scanner when found
      scanner.pause(true);
      setScanResult(decodedText);
      handleReceiveBatch(decodedText);
    };

    const onScanFailure = (error: any) => {
      // Ignore background scan errors
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);

  const handleReceiveBatch = async (batchId: string) => {
    setIsProcessing(true);
    setMessage(null);
    try {
      const res = await fetch('http://localhost:8000/api/distributions/receive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batch_id: batchId })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage({ type: 'success', text: `Berhasil Menerima Batch! ID: ${batchId.substring(0,8)}...` });
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal memproses batch' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateScan = () => {
    // For prototype purposes when no camera is available
    const dummyBatchId = '11111111-2222-3333-4444-555555555555';
    setScanResult(dummyBatchId);
    handleReceiveBatch(dummyBatchId);
  };

  return (
    <div className="h-full flex flex-col space-y-4 max-w-md mx-auto w-full pt-4 md:pt-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white tracking-tight">QR Scanner Mobile</h2>
        <p className="text-sm text-slate-400 mt-1">Gunakan untuk menandai penerimaan Batch di Sekolah</p>
      </div>

      <div className="glass rounded-2xl p-6 border border-white/10 flex-1 flex flex-col items-center">
        {!scanResult && (
           <div className="w-full bg-black/40 rounded-xl overflow-hidden border-2 border-dashed border-white/20 mb-6">
             <div id="reader" className="w-full"></div>
           </div>
        )}

        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-blue-400 font-medium">Memverifikasi ke Ledger...</p>
          </div>
        )}

        {message && !isProcessing && (
          <div className={`w-full p-4 rounded-xl text-center mb-6 border ${message.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-red-500/20 border-red-500/30 text-red-400'}`}>
            <div className="text-3xl mb-2">{message.type === 'success' ? '✅' : '❌'}</div>
            <p className="font-semibold">{message.text}</p>
            {message.type === 'success' && (
              <p className="text-xs text-emerald-500/70 mt-2">Audit Log tercatat (immutable)</p>
            )}
          </div>
        )}

        <div className="mt-auto w-full space-y-3 pt-6 border-t border-white/10">
          <button 
            onClick={simulateScan}
            disabled={isProcessing}
            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 font-medium transition-all"
          >
            MOCK: Simulate Scan Success
          </button>
          
          {scanResult && !isProcessing && (
            <button 
              onClick={() => {
                setScanResult(null);
                setMessage(null);
                window.location.reload(); // Quick hack to reload scanner
              }}
              className="w-full py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-blue-400 font-medium transition-all"
            >
              Scan QR Lain
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
