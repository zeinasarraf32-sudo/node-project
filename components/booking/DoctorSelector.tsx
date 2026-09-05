'use client';

import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  Loader2,
  User,
} from 'lucide-react';

import { axiosGet } from '@/lib/axios';
import {
  IBackendDoctor,
  IBookingDoctor,
} from '@/interfaces/interfaces';

export type Doctor = IBookingDoctor;

interface DoctorSelectorProps {
  selectedDoctorId?: string;
  autoSelectId?: string;
  onSelect?: (doctor: IBookingDoctor) => void;
  onSelectDoctor?: (doctor: IBookingDoctor) => void;
}

export default function DoctorSelector({
  selectedDoctorId,
  autoSelectId,
  onSelect,
  onSelectDoctor,
}: DoctorSelectorProps) {
  const handleSelectRef =
    useRef<(doctor: IBookingDoctor) => void>(() => {});

  const initializedRef = useRef(false);

  useEffect(() => {
    handleSelectRef.current =
      onSelectDoctor ?? onSelect ?? (() => {});
  }, [onSelectDoctor, onSelect]);

  const {
    data: responseData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['doctors'],
    queryFn: () =>
      axiosGet<IBackendDoctor[]>('doctors'),
  });

  const doctorsList = responseData?.data ?? [];

  /*
   * Only ACTIVE doctors can be booked.
   * All displayed data comes from the API.
   */
  const doctors: IBookingDoctor[] = doctorsList
    .filter((doctor) => doctor.status === 'ACTIVE')
    .map((doctor) => ({
      id: String(doctor.id),

      name:
        doctor.fullName ||
        doctor.name ||
        'Doctor',

      specialty:
        doctor.specialty ||
        'Not specified',

      avatar:
        doctor.imageUrl ||
        doctor.image ||
        '',

      fee: Number(
        doctor.consultationFee ??
        doctor.fee ??
        doctor.price ??
        0
      ),

      location:
        doctor.location ||
        'Not provided',
    }));

  useEffect(() => {
    if (
      doctors.length === 0 ||
      initializedRef.current
    ) {
      return;
    }

    initializedRef.current = true;

    const targetId =
      autoSelectId || selectedDoctorId;

    if (targetId) {
      const foundDoctor = doctors.find(
        (doctor) =>
          doctor.id === String(targetId)
      );

      if (foundDoctor) {
        handleSelectRef.current(foundDoctor);
        return;
      }
    }

    handleSelectRef.current(doctors[0]);
  }, [
    doctors,
    autoSelectId,
    selectedDoctorId,
  ]);

  const handleDoctorClick = (
    doctor: IBookingDoctor
  ) => {
    handleSelectRef.current(doctor);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
          1
        </span>

        <h2 className="text-lg font-bold text-gray-900">
          Select Doctor
        </h2>
      </div>

      <div className="space-y-3">
        {/* Loading */}
        {isLoading && (
          <div className="py-8 text-center text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-600" />

            <p className="text-xs">
              Loading doctors...
            </p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="py-6 text-center text-rose-500 text-xs">
            Failed to load doctors list.
          </div>
        )}

        {/* Empty */}
        {!isLoading &&
          !isError &&
          doctors.length === 0 && (
            <div className="py-6 text-center text-slate-400 text-xs">
              No doctors available right now.
            </div>
          )}

        {/* Doctors */}
        {doctors.map((doctor) => {
          const isSelected =
            doctor.id === String(selectedDoctorId);

          return (
            <button
              key={doctor.id}
              type="button"
              onClick={() => handleDoctorClick(doctor)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition border text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Doctor Avatar */}
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  {doctor.avatar ? (
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                {/* Doctor Info */}
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {doctor.name}
                  </h3>

                  <p className="text-xs text-blue-600 font-medium">
                    {doctor.specialty}
                  </p>

                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>
                      ${doctor.fee}
                    </span>

                    <span>•</span>

                    <span>
                      {doctor.location}
                    </span>
                  </div>
                </div>
              </div>

              {isSelected && (
                <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-600/10" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}