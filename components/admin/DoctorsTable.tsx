'use client';

import React, { useState } from 'react';
import { Search, Pencil, Trash2, Star } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  patients: number;
  rating: number;
  status: 'Active' | 'On Leave';
  avatar: string;
}

const initialDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sara Al-Halabi',
    specialty: 'Cardiologist',
    patients: 248,
    rating: 4.9,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: '2',
    name: 'Dr. Jamal Issa',
    specialty: 'Neurologist',
    patients: 189,
    rating: 4.8,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: '3',
    name: "Dr. Layla Al-Rafi'i",
    specialty: 'Pediatrician',
    patients: 312,
    rating: 4.9,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1594824813566-78a931a10619?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: '4',
    name: 'Dr. Marwan Qabbani',
    specialty: 'Orthopedic',
    patients: 145,
    rating: 4.7,
    status: 'On Leave',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150',
  },
];

export default function DoctorsTable() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = initialDoctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search doctors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
        />
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 tracking-wider">
                <th className="py-4 px-6">Doctor</th>
                <th className="py-4 px-6">Specialty</th>
                <th className="py-4 px-6">Patients</th>
                <th className="py-4 px-6">Rating</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {filteredDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Doctor Info */}
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-100"
                      />
                      <span className="font-semibold text-slate-800">{doc.name}</span>
                    </div>
                  </td>

                  {/* Specialty */}
                  <td className="py-3.5 px-6 text-slate-500 font-medium">{doc.specialty}</td>

                  {/* Patients Count */}
                  <td className="py-3.5 px-6 font-bold text-slate-800">{doc.patients}</td>

                  {/* Rating */}
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-1 font-semibold text-slate-700">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{doc.rating}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                        doc.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button className="p-1 hover:text-slate-600 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 hover:text-rose-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}