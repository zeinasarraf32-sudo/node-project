'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { User } from 'lucide-react';

import { axiosGet } from '@/lib/axios';
import { IDoctor } from '@/interfaces/interfaces';

export default function RecommendedDoctors() {
  const {
    data: responseData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['doctors'],
    queryFn: () =>
      axiosGet<IDoctor[]>('doctors'),
  });

  const doctors = responseData?.data ?? [];

  const availableDoctors = doctors
    .filter(
      (doctor) =>
        doctor.status === 'ACTIVE'
    )
    .slice(0, 2);

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-full flex items-center justify-center">
        <p className="text-xs text-gray-400">
          Loading available doctors...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-full flex items-center justify-center">
        <p className="text-xs text-red-500">
          Failed to load doctors.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          Available Doctors
        </h2>

        <Link
          href="/doctors"
          className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
        >
          See all
        </Link>
      </div>

      {/* Doctors */}
      <div className="flex-1 flex flex-col justify-center">
        {availableDoctors.length === 0 ? (
          <div className="text-center">
            <p className="text-xs text-gray-400">
              No active doctors available.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {availableDoctors.map((doctor) => {
              const doctorImage =
                doctor.imageUrl?.trim();

              return (
                <div
                  key={doctor.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
                      {doctorImage ? (
                        <img
                          src={doctorImage}
                          alt={doctor.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-blue-500" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">
                        {doctor.fullName}
                      </h4>

                      <p className="text-gray-400 text-xs truncate mt-0.5">
                        {doctor.specialty}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Active
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Button */}
      <Link
        href="/doctors"
        className="block w-full text-center bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-3 rounded-2xl text-xs transition"
      >
        Book Appointment
      </Link>
    </div>
  );
}