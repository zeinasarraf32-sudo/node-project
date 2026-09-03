'use client';

import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Users } from 'lucide-react';
import AddPatientModal, { IPatientFormData } from './AddPatientModal';

export interface Patient {
  id: string;
  code: string;
  name: string;
  condition: string;
  lastVisit: string;
  avatar: string;
}

export default function PatientsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]); // قائمة فارغة بدون بيانات وهمية
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = (newPatient: IPatientFormData) => {
    const newId = (patients.length + 1).toString();
    const formattedCode = `#MG-${String(patients.length + 1).padStart(3, '0')}`;

    const createdPatient: Patient = {
      id: newId,
      code: formattedCode,
      name: newPatient.fullName,
      condition: newPatient.condition,
      lastVisit: newPatient.lastVisit || 'Today',
      avatar:
        newPatient.avatarUrl ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    };

    setPatients((prev) => [createdPatient, ...prev]);
  };

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

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Grid or Empty State */}
      {filteredPatients.length > 0 ? (
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

              <button className="p-1 text-slate-300 hover:text-slate-600 transition-colors cursor-pointer">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 text-slate-400">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-slate-700">No patients found</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {searchTerm ? 'Try adjusting your search query' : 'Click "Add Patient" to create your first record'}
          </p>
        </div>
      )}

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPatient={handleAddPatient}
      />
    </div>
  );
}