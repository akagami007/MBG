'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const DEMO_ACCOUNTS = [
  { email: 'superadmin@mbg.id', role: 'SUPERADMIN', label: 'Super Admin', icon: '👑', color: 'text-amber-400' },
  { email: 'admin@mbg.id', role: 'AUDITOR', label: 'Auditor', icon: '🔍', color: 'text-blue-400' },
  { email: 'reviewer@mbg.id', role: 'QUALITY_REVIEWER', label: 'Quality Reviewer', icon: '✅', color: 'text-emerald-400' },
  { email: 'steward@mbg.id', role: 'DATA_STEWARD', label: 'Data Steward', icon: '📊', color: 'text-purple-400' },
  { email: 'sppg@mbg.id', role: 'SPPG', label: 'Dapur Umum (SPPG)', icon: '🧑‍🍳', color: 'text-orange-400' },
  { email: 'supplier@mbg.id', role: 'SUPPLIER_CONTACT', label: 'Supplier', icon: '🚚', color: 'text-teal-400' },
  { email: 'sekolah@mbg.id', role: 'PIC_SCHOOL', label: 'PIC Sekolah', icon: '🏫', color: 'text-pink-400' },
];

function getRedirectPath(role: string): string {
  switch (role) {
    case 'SUPPLIER_CONTACT':
    case 'SPPG':
      return '/vendor';
    default:
      return '/';
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('mbg_token', data.data.token);
        localStorage.setItem('mbg_user', JSON.stringify(data.data.user));
        router.push(getRedirectPath(data.data.user.role));
      } else {
        setError(data.message || 'Login gagal.');
      }
    } catch (err: any) {
      setError('Kesalahan jaringan. Pastikan backend aktif.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-800/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight">
            SafeTrace
          </h1>
          <p className="text-slate-400 mt-2 text-sm">Masuk ke Portal Terintegrasi</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="Pilih akun demo di bawah..."
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg disabled:opacity-50 transition-all mt-4 active:scale-[0.98]"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo accounts quick-select */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4 text-center">
            Quick Login — Pilih Role
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                onClick={() => quickLogin(acc.email)}
                className={`flex items-center gap-2 px-3 py-2.5 bg-white/5 hover:bg-white/10 border rounded-lg text-xs transition-all active:scale-95 ${
                  email === acc.email ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/10'
                }`}
              >
                <span className="text-base">{acc.icon}</span>
                <div className="text-left">
                  <p className={`font-bold ${acc.color}`}>{acc.label}</p>
                  <p className="text-[9px] text-slate-500 font-mono">{acc.email}</p>
                </div>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 mt-4 text-center">
            Semua password: <span className="text-white font-mono">password</span>
          </p>
        </div>
      </div>
    </div>
  );
}
