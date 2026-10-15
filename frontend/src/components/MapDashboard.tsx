'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons using divIcon
const createCustomIcon = (type: string) => {
  let color = 'bg-blue-500';
  let label = 'S';
  
  if (type === 'SPPG') {
    color = 'bg-emerald-500';
    label = 'D'; // Dapur
  } else if (type === 'SCHOOL') {
    color = 'bg-blue-400';
    label = 'K'; // Kelas/School
  } else if (type === 'SUPPLIER') {
    color = 'bg-amber-500';
    label = 'P'; // Pemasok
  }

  return L.divIcon({
    html: `<div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white shadow-lg ${color}">${label}</div>`,
    className: 'custom-leaflet-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const truckIcon = typeof window !== 'undefined' ? L.divIcon({
  html: `<div class="w-8 h-8 rounded-full bg-slate-900 border-2 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)] flex items-center justify-center text-white"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7c-.276 0-.5.224-.5.5V11h3V8.5A1.5 1.5 0 0015.5 7H14z" /></svg></div>`,
  className: 'truck-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
}) : null;

const DUMMY_ROUTES = [
  { start: [-6.2000, 106.8166], end: [-6.1900, 106.8250], progress: 0, speed: 0.002, name: 'Truk Distribusi #A1' },
  { start: [-6.2300, 106.8600], end: [-6.2150, 106.8450], progress: 0.3, speed: 0.0015, name: 'Truk Suplai #B2' },
  { start: [-6.1800, 106.8600], end: [-6.2088, 106.8456], progress: 0.6, speed: 0.003, name: 'Truk Distribusi #C3' }
];

export default function MapDashboard() {
  const [network, setNetwork] = useState<any>(null);
  const [incidents, setIncidents] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [trucks, setTrucks] = useState(DUMMY_ROUTES);

  useEffect(() => {
    // Truck animation loop
    const interval = setInterval(() => {
      setTrucks(prev => prev.map(truck => {
        let nextProgress = truck.progress + truck.speed;
        if (nextProgress >= 1) nextProgress = 0;
        return { ...truck, progress: nextProgress };
      }));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      try {
        const [netRes, incRes] = await Promise.all([
          fetch('http://localhost:8000/api/geo/network'),
          fetch('http://localhost:8000/api/geo/incidents')
        ]);
        
        if (netRes.ok) setNetwork(await netRes.json());
        if (incRes.ok) setIncidents(await incRes.json());
      } catch (e) {
        console.error("Map data fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    
    // Ensure Leaflet cleanup on full unmount
    return () => {
      setMounted(false);
    };
  }, []);

  if (!mounted) return null;

  // Jakarta coordinates
  const center: [number, number] = [-6.2088, 106.8456];

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={center} 
        zoom={12} 
        style={{ width: '100%', height: '100%', minHeight: '600px' }}
        zoomControl={false}
      >
        {/* Standard OpenStreetMap Theme (looks like Google Maps) */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Network Nodes */}
        {!loading && network?.features?.map((feature: any, idx: number) => {
          const coords = feature.geometry.coordinates; // [lng, lat]
          const latLng: [number, number] = [coords[1], coords[0]];
          
          return (
            <Marker 
              key={`net-${idx}`} 
              position={latLng}
              icon={createCustomIcon(feature.properties.type)}
            >
              <Popup className="glass-popup">
                <div className="font-sans">
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{feature.properties.name}</h3>
                  <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {feature.properties.type}
                  </span>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Moving Fleet Trucks */}
        {mounted && truckIcon && trucks.map((truck, idx) => {
          const lat = truck.start[0] + (truck.end[0] - truck.start[0]) * truck.progress;
          const lng = truck.start[1] + (truck.end[1] - truck.start[1]) * truck.progress;
          
          return (
            <Marker key={`truck-${idx}`} position={[lat, lng]} icon={truckIcon}>
              <Popup className="glass-popup">
                <div className="font-sans">
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{truck.name}</h3>
                  <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    Sedang Dalam Perjalanan ({(truck.progress * 100).toFixed(0)}%)
                  </span>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Incidents Heatmap (CircleMarkers) */}
        {!loading && incidents?.features?.map((feature: any, idx: number) => {
          const coords = feature.geometry.coordinates; // [lng, lat]
          const latLng: [number, number] = [coords[1], coords[0]];
          
          let radius = 10;
          let color = '#ef4444'; // default red
          
          if (feature.properties.severity === 'CRITICAL') { radius = 25; color = '#a855f7'; }
          else if (feature.properties.severity === 'HIGH') { radius = 20; color = '#ef4444'; }
          else if (feature.properties.severity === 'MEDIUM') { radius = 15; color = '#f59e0b'; }
          
          return (
            <CircleMarker
              key={`inc-${idx}`}
              center={latLng}
              radius={radius}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.4,
                weight: 2
              }}
            >
              <Popup>
                <div className="font-sans">
                  <h3 className="font-bold text-red-600 text-sm">{feature.properties.category}</h3>
                  <p className="text-xs text-slate-600 mt-1">{feature.properties.description}</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-6 right-6 z-[1000] bg-slate-900/90 backdrop-blur border border-white/10 rounded-lg p-4 shadow-xl">
        <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Legend</h4>
        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>Dapur Umum (SPPG)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span>Titik Distribusi (Sekolah)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>Pemasok Bahan Baku</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-900 border border-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.5)]"></div>
            <span>Armada Pengiriman (Live)</span>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-2 border-t border-white/10">
            <div className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500"></div>
            <span>Zona Risiko / Insiden Aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
}
