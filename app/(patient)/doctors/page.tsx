'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Stethoscope,
} from 'lucide-react';

import { axiosGet } from '@/lib/axios';

import DoctorList from '@/components/doctors/DoctorList';
import {
  Doctor,
} from '@/components/doctors/DoctorCard';

import {
  IBackendDoctor,
} from '@/interfaces/interfaces';

function parseOptionalNumber(
  value: number | string | null | undefined
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue)
    ? parsedValue
    : null;
}

export default function FindDoctorsPage() {
  const [searchTerm, setSearchTerm] =
    useState('');

  const [
    selectedSpecialty,
    setSelectedSpecialty,
  ] = useState('');

  const {
    data: responseData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['doctors'],
    queryFn: () =>
      axiosGet<IBackendDoctor[]>('doctors'),
  });

  const doctorsList =
    responseData?.data ?? [];

  /*
   * Map only real API / Database fields.
   * No rating, fake times, fake image,
   * or fake "Available Today" value.
   */
  const mappedDoctors: Doctor[] =
    doctorsList.map((doctor) => ({
      id: String(doctor.id),

      name:
        doctor.fullName ||
        doctor.name ||
        'Doctor',

      specialty:
        doctor.specialty ||
        'Not specified',

      experienceYears:
        parseOptionalNumber(
          doctor.experienceYrs
        ),

      location:
        doctor.location || null,

      price:
        parseOptionalNumber(
          doctor.consultationFee ??
          doctor.fee ??
          doctor.price
        ),

      status:
        doctor.status === 'ACTIVE'
          ? 'ACTIVE'
          : doctor.status === 'ON_LEAVE'
            ? 'ON_LEAVE'
            : 'INACTIVE',

      image:
        doctor.imageUrl ||
        doctor.image ||
        null,
    }));

  /*
   * Search + Specialty Filter
   */
  const normalizedSearch =
    searchTerm.trim().toLowerCase();

  const filteredDoctors =
    mappedDoctors.filter((doctor) => {
      const matchesSearch =
        doctor.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        doctor.specialty
          .toLowerCase()
          .includes(normalizedSearch) ||
        (doctor.location || '')
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesSpecialty =
        selectedSpecialty
          ? doctor.specialty.toLowerCase() ===
            selectedSpecialty.toLowerCase()
          : true;

      return (
        matchesSearch &&
        matchesSpecialty
      );
    });

  /*
   * Specialties are generated
   * from real Doctor data.
   */
  const specialties = Array.from(
    new Set(
      mappedDoctors
        .map((doctor) => doctor.specialty)
        .filter(
          (specialty) =>
            specialty !== 'Not specified'
        )
    )
  ).sort();

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Find Your Doctor
          </h1>

          <p className="text-xs text-slate-500">
            Find medical specialists and book your
            appointment easily.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />

            <input
              type="text"
              placeholder="Search doctor by name, specialty, or clinic location..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
            />
          </div>

          {/* Specialty */}
          <div className="relative">
            <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 z-10" />

            <select
              value={selectedSpecialty}
              onChange={(event) =>
                setSelectedSpecialty(
                  event.target.value
                )
              }
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">
                All Specialties
              </option>

              {specialties.map((specialty) => (
                <option
                  key={specialty}
                  value={specialty}
                >
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctors */}
        <DoctorList
          doctors={filteredDoctors}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => {
            void refetch();
          }}
        />
      </div>
    </div>
  );
}