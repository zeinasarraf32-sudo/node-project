'use client';

import React, { useState } from 'react';

interface MonthlyStat {
  month: string;
  appointments: number;
  completed: number;
}

const trendData: MonthlyStat[] = [
  { month: 'Feb', appointments: 800, completed: 750 },
  { month: 'Mar', appointments: 920, completed: 860 },
  { month: 'Apr', appointments: 980, completed: 910 },
  { month: 'May', appointments: 1100, completed: 1020 },
  { month: 'Jun', appointments: 1050, completed: 970 },
  { month: 'Jul', appointments: 1250, completed: 1180 },
  { month: 'Aug', appointments: 1320, completed: 1240 },
];

export default function AppointmentTrends() {
  const [activeStat, setActiveStat] = useState<MonthlyStat | null>(null);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-slate-800 text-sm">Appointment Trends</h3>
        <span className="text-xs text-slate-400 font-medium">Feb – Aug 2026</span>
      </div>

      <div className="h-8 mb-2 flex items-center">
        {activeStat ? (
          <div className="w-full text-xs flex justify-between items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-700">{activeStat.month}:</span>
            <div className="flex gap-4">
              <span className="text-blue-600 font-semibold">Total: {activeStat.appointments}</span>
              <span className="text-emerald-600 font-semibold">Completed: {activeStat.completed}</span>
            </div>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400">Hover over the lines to see details</span>
        )}
      </div>

      <div className="h-44 w-full flex flex-col justify-between border-b border-slate-100 pb-2 relative">
        <div className="flex justify-between text-[10px] text-slate-300"><span>1400</span></div>
        <div className="flex justify-between text-[10px] text-slate-300"><span>1050</span></div>
        <div className="flex justify-between text-[10px] text-slate-300"><span>700</span></div>
        <div className="flex justify-between text-[10px] text-slate-300"><span>350</span></div>
        <div className="flex justify-between text-[10px] text-slate-300"><span>0</span></div>

        <div className="absolute inset-x-8 bottom-6 top-6 flex items-end">
          <svg className="w-full h-full text-blue-500 overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
            {/* Original Blue Path */}
            <path d="M0,80 Q 125,40 250,50 T 500,20" fill="none" stroke="currentColor" strokeWidth="3" />
            
            <path d="M0,90 Q 125,55 250,60 T 500,35" fill="none" stroke="#10b981" strokeWidth="2" />

            {trendData.map((item, index) => {
              const xPos = (index / 6) * 500;
              return (
                <rect
                  key={item.month}
                  x={xPos - 25}
                  y="0"
                  width="50"
                  height="100"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveStat(item)}
                  onMouseLeave={() => setActiveStat(null)}
                />
              );
            })}
          </svg>
        </div>
      </div>

      <div className="flex justify-between text-[11px] text-slate-400 mt-2 px-6">
        {trendData.map((item) => (
          <span
            key={item.month}
            className={activeStat?.month === item.month ? 'text-blue-600 font-bold' : ''}
          >
            {item.month}
          </span>
        ))}
      </div>
    </div>
  );
}