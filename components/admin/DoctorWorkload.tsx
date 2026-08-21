'use client';

import React, { useState } from 'react';

interface WorkloadData {
  id: string;
  name: string;
  morningAppointments: number;
  eveningAppointments: number;
  heightMorning: string;
  heightEvening: string;
}

const workloadList: WorkloadData[] = [
  { id: '1', name: 'Al-Halabi', morningAppointments: 18, eveningAppointments: 22, heightMorning: 'h-20', heightEvening: 'h-24' },
  { id: '2', name: 'Issa', morningAppointments: 12, eveningAppointments: 10, heightMorning: 'h-14', heightEvening: 'h-10' },
  { id: '3', name: 'Al-Rafi\'i', morningAppointments: 25, eveningAppointments: 20, heightMorning: 'h-28', heightEvening: 'h-22' },
  { id: '4', name: 'Qabbani', morningAppointments: 10, eveningAppointments: 8, heightMorning: 'h-12', heightEvening: 'h-8' },
  { id: '5', name: 'Karami', morningAppointments: 15, eveningAppointments: 14, heightMorning: 'h-16', heightEvening: 'h-14' },
  { id: '6', name: 'Salama', morningAppointments: 28, eveningAppointments: 26, heightMorning: 'h-32', heightEvening: 'h-28' },
];

export default function DoctorWorkload() {
  const [hoveredDoc, setHoveredDoc] = useState<WorkloadData | null>(null);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
      {/* Header with Fixed Height for Stats Badge */}
      <div className="flex items-center justify-between mb-4 h-7">
        <h3 className="font-semibold text-slate-800 text-sm">Doctor Workload (Today)</h3>
        {hoveredDoc ? (
          <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full">
            Dr. {hoveredDoc.name}: {hoveredDoc.morningAppointments + hoveredDoc.eveningAppointments} Total
          </span>
        ) : (
          <span className="text-xs text-slate-400 font-normal">Hover over bars</span>
        )}
      </div>

      <div className="h-44 flex items-end justify-between px-2 gap-2 border-b border-slate-100 pb-2 pt-6">
        {workloadList.map((doc) => (
          <div
            key={doc.id}
            onMouseEnter={() => setHoveredDoc(doc)}
            onMouseLeave={() => setHoveredDoc(null)}
            className="flex flex-col items-center gap-1 group cursor-pointer relative"
          >
            {/* Fixed Tooltip on Top */}
            {hoveredDoc?.id === doc.id && (
              <div className="absolute -top-12 bg-slate-800 text-white text-[10px] p-1.5 rounded-lg whitespace-nowrap shadow-md z-10">
                <div>AM: {doc.morningAppointments}</div>
                <div>PM: {doc.eveningAppointments}</div>
              </div>
            )}

            <div className="flex gap-1 items-end">
              <div
                className={`w-3.5 bg-blue-200 rounded-t group-hover:bg-blue-400 ${doc.heightMorning}`}
              ></div>
              <div
                className={`w-3.5 bg-blue-600 rounded-t group-hover:bg-blue-800 ${doc.heightEvening}`}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-[10px] text-slate-400 mt-3 px-1">
        {workloadList.map((doc) => (
          <span
            key={doc.id}
            className={`cursor-pointer ${
              hoveredDoc?.id === doc.id ? 'text-blue-600 font-bold' : ''
            }`}
          >
            {doc.name}
          </span>
        ))}
      </div>
    </div>
  );
}