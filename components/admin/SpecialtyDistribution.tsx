'use client';

import React, { useState } from 'react';

const specialties = [
  { id: 'cardiology', name: 'Cardiology', percentage: '28%', patients: 3595, doctors: 24, bg: 'bg-blue-600' },
  { id: 'pediatrics', name: 'Pediatrics', percentage: '22%', patients: 2824, doctors: 20, bg: 'bg-emerald-500' },
  { id: 'neurology', name: 'Neurology', percentage: '18%', patients: 2311, doctors: 16, bg: 'bg-indigo-600' },
  { id: 'orthopedics', name: 'Orthopedics', percentage: '14%', patients: 1797, doctors: 12, bg: 'bg-amber-500' },
];

export default function SpecialtyDistribution() {
  const [active, setActive] = useState<typeof specialties[0] | null>(null);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col justify-between">
      <h3 className="font-semibold text-slate-800 text-sm">By Specialty</h3>

      <div className="relative flex items-center justify-center my-3">
        <div
          className="w-32 h-32 rounded-full relative flex items-center justify-center p-3 shadow-inner"
          style={{
            background: 'conic-gradient(#2563eb 0% 28%, #10b981 28% 50%, #4f46e5 50% 68%, #f59e0b 68% 82%, #e2e8f0 82% 100%)',
          }}
        >
          <div onMouseEnter={() => setActive(specialties[0])} onMouseLeave={() => setActive(null)} className="absolute top-0 right-0 w-1/2 h-1/2 cursor-pointer z-10" />
          <div onMouseEnter={() => setActive(specialties[1])} onMouseLeave={() => setActive(null)} className="absolute bottom-0 right-0 w-1/2 h-1/2 cursor-pointer z-10" />
          <div onMouseEnter={() => setActive(specialties[2])} onMouseLeave={() => setActive(null)} className="absolute bottom-0 left-0 w-1/2 h-1/2 cursor-pointer z-10" />
          <div onMouseEnter={() => setActive(specialties[3])} onMouseLeave={() => setActive(null)} className="absolute top-0 left-0 w-1/2 h-1/2 cursor-pointer z-10" />

          <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center text-center shadow-sm z-20 pointer-events-none">
            {active ? (
              <>
                <p className="text-xs font-bold text-slate-800">{active.percentage}</p>
                <p className="text-[10px] text-slate-400 font-medium truncate max-w-[60px]">{active.name}</p>
              </>
            ) : (
              <p className="text-[10px] text-slate-400">Hover Arc</p>
            )}
          </div>
        </div>
      </div>

      <div className="h-8 mb-2">
        {active ? (
          <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs flex justify-between">
            <span>Patients: <strong>{active.patients}</strong></span>
            <span>Doctors: <strong>{active.doctors}</strong></span>
          </div>
        ) : (
          <p className="text-[11px] text-slate-400 text-center pt-1">Hover over any color on the circle</p>
        )}
      </div>

      <div className="space-y-1.5">
        {specialties.map((item) => (
          <div key={item.id} className={`flex items-center justify-between text-xs p-1 rounded-lg ${active?.id === item.id ? 'bg-slate-50' : ''}`}>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${item.bg}`} />
              <span className="text-slate-700">{item.name}</span>
            </div>
            <span className="font-bold text-slate-800">{item.percentage}</span>
          </div>
        ))}
      </div>
    </div>
  );
}