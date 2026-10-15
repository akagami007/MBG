'use client';
import dynamic from 'next/dynamic';

// Next.js doesn't allow Server Side Rendering for leaflet map components
// so we have to dynamically import it with ssr: false
const MapDashboard = dynamic(() => import('@/components/MapDashboard'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-slate-900 rounded-xl border border-white/5">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Loading map engine...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Live Map</h2>
          <p className="text-slate-400 mt-1">Real-time supply chain network and incident heatmap.</p>
        </div>
      </div>
      
      <div className="flex-1 glass rounded-xl border border-white/5 overflow-hidden">
        <MapDashboard />
      </div>
    </div>
  );
}
