'use client';

import React, { useState } from 'react';
import {
  Search,
  MoreVertical,
  Users,
  Mail,
  Phone,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { axiosGet } from '@/lib/axios';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';

interface Patient {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  condition: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export default function PatientsList() {
  const [searchTerm, setSearchTerm] =
    useState('');

  const {
    data: patients = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const response =
        await axiosGet<Patient[]>('patients');

      return response.data || [];
    },
  });

  const filteredPatients = patients.filter(
    (patient) => {
      const search =
        searchTerm.toLowerCase();

      return (
        patient.fullName
          .toLowerCase()
          .includes(search) ||
        patient.email
          .toLowerCase()
          .includes(search) ||
        (patient.phone || '')
          .toLowerCase()
          .includes(search)
      );
    }
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <ErrorState
        message={
          error instanceof Error
            ? error.message
            : 'Failed to load patients'
        }
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">
            Patients
          </h3>

          <p className="text-[11px] text-slate-400 mt-1">
            {patients.length} registered patients
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Patients */}
      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPatients.map(
            (patient) => (
              <div
                key={patient.id}
                className="p-4 bg-slate-100/70 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-all"
              >
                {/* Patient Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {patient.fullName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {patient.fullName}
                      </h4>
                    </div>
                  </div>

                  <button className="p-1 text-slate-300 hover:text-slate-600 transition-colors cursor-pointer">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                {/* Patient Information */}
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />

                    <span className="truncate">
                      {patient.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />

                    <span>
                      {patient.phone ||
                        'No phone number'}
                    </span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl">

          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 text-slate-400">
            <Users className="w-6 h-6" />
          </div>

          <p className="text-xs font-semibold text-slate-700">
            No patients found
          </p>

          <p className="text-[11px] text-slate-400 mt-1">
            {searchTerm
              ? 'Try adjusting your search query'
              : 'No patients have registered yet'}
          </p>
        </div>
      )}
    </div>
  );
}