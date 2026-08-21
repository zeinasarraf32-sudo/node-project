'use client';

import React, { useState } from 'react';
import { Search, Plus, MoreVertical } from 'lucide-react';

interface Patient {
  id: string;
  code: string;
  name: string;
  condition: string;
  lastVisit: string;
  avatar: string;
}

const initialPatients: Patient[] = [
  {
    id: '1',
    code: '#MG-001',
    name: 'Ali Hassan',
    condition: 'Hypertension',
    lastVisit: 'Jul 18',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: '2',
    code: '#MG-002',
    name: 'Rana Saad',
    condition: 'Diabetes T2',
    lastVisit: 'Aug 1',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: '3',
    code: '#MG-003',
    name: 'Khalid Najm',
    condition: 'Asthma',
    lastVisit: 'Jul 25',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: '4',
    code: '#MG-004',
    name: 'Nour Al-Din',
    condition: 'Migraine',
    lastVisit: 'Aug 3',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: '5',
    code: '#MG-005',
    name: 'Maisa Taha',
    condition: 'Arthritis',
    lastVisit: 'Jul 30',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: '6',
    code: '#MG-006',
    name: 'Hussam Arab',
    condition: 'Anxiety',
    lastVisit: 'Aug 2',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
  },
];

export default function PatientsList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = initialPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-6">
      {/* Top Bar: Search & Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
          />
        </div>

        <button className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all"
          >
            <div className="flex items-center gap-3">
              <img
                src={patient.avatar}
                alt={patient.name}
                className="w-10 h-10 rounded-xl object-cover border border-slate-200/60"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-800 leading-tight">
                  {patient.name}
                </h4>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {patient.code} · {patient.condition}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Last visit: {patient.lastVisit}
                </p>
              </div>
            </div>

            <button className="p-1 text-slate-300 hover:text-slate-600 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}