'use client';

import {
  useState,
} from 'react';

import {
  useQuery,
} from '@tanstack/react-query';

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

export default function FindDoctorsPage() {
  const [
    searchTerm,
    setSearchTerm,
  ] = useState('');

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
      axiosGet<
        IBackendDoctor[]
      >('doctors'),
  });

  const doctorsList =
    responseData?.data || [];

  const mappedDoctors:
    Doctor[] =
    doctorsList.map(
      (doc) => ({
        id: String(doc.id),

        name:
          doc.fullName ||
          doc.name ||
          'Dr. Unknown',

        specialty:
          doc.specialty ||
          'General',

        experienceYears:
          Number(
            doc.experienceYrs
          ) || 0,

        rating:
          Number(
            doc.rating
          ) || 4.9,

        location:
          doc.location ||
          'Location unavailable',

        price:
          Number(
            doc.consultationFee
          ) || 0,

        availabilityStatus:
          doc.status ===
          'ACTIVE'
            ? 'Available Today'
            : 'Unavailable',

        availableTimes: [
          '09:00 AM',
          '01:00 PM',
          '04:00 PM',
        ],

        image:
          doc.imageUrl ||
          'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500',
      })
    );

  const filteredDoctors =
    mappedDoctors.filter(
      (doc) => {
        const matchesSearch =
          doc.specialty
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||
          doc.location
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||
          doc.name
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            );

        const matchesSpecialty =
          selectedSpecialty
            ? doc.specialty.toLowerCase() ===
              selectedSpecialty.toLowerCase()
            : true;

        return (
          matchesSearch &&
          matchesSpecialty
        );
      }
    );

  const specialties =
    Array.from(
      new Set(
        mappedDoctors
          .map(
            (doctor) =>
              doctor.specialty
          )
          .filter(Boolean)
      )
    );

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Find Your Doctor
          </h1>

          <p className="text-xs text-slate-500">
            Book appointments
            with top verified
            medical specialists.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />

            <input
              type="text"
              placeholder="Search doctor by name, specialty, or clinic location..."
              value={
                searchTerm
              }
              onChange={(
                event
              ) =>
                setSearchTerm(
                  event.target
                    .value
                )
              }
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
            />
          </div>

          {/* Specialty */}
          <div className="relative">
            <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 z-10" />

            <select
              value={
                selectedSpecialty
              }
              onChange={(
                event
              ) =>
                setSelectedSpecialty(
                  event.target
                    .value
                )
              }
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">
                All Specialties
              </option>

              {specialties.map(
                (specialty) => (
                  <option
                    key={
                      specialty
                    }
                    value={
                      specialty
                    }
                  >
                    {
                      specialty
                    }
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <DoctorList
          doctors={
            filteredDoctors
          }
          isLoading={
            isLoading
          }
          isError={
            isError
          }
          onRetry={
            refetch
          }
        />
      </div>
    </div>
  );
}