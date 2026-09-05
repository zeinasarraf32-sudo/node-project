'use client';

import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  Star,
  Loader2,
  User,
} from 'lucide-react';

import { axiosGet } from '@/lib/axios';

import {
  IBackendDoctor,
  IBookingDoctor,
} from '@/interfaces/interfaces';

/*
 * Keep this alias temporarily so old imports such as:
 *
 * import { Doctor } from './DoctorSelector'
 *
 * continue working.
 */
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
  const handleSelect =
    onSelectDoctor ||
    onSelect ||
    (() => {});

  /*
   * Keep the current callback inside a ref
   * to prevent unnecessary effect loops.
   */
  const handleSelectRef =
    useRef(handleSelect);

  useEffect(() => {
    handleSelectRef.current =
      handleSelect;
  }, [handleSelect]);

  const initializedRef =
    useRef(false);

  const {
    data: responseData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['doctors'],

    queryFn: () =>
      axiosGet<IBackendDoctor[]>(
        'doctors'
      ),
  });

  const doctorsList =
    responseData?.data || [];

  const doctors: IBookingDoctor[] =
    doctorsList.map((doc) => ({
      id: String(doc.id),

      name:
        doc.fullName ||
        doc.name ||
        'Dr. Unknown',

      specialty:
        doc.specialty ||
        'General',

      rating: Number(
        doc.rating ?? 4.9
      ),

      reviewsCount: Number(
        doc.reviewsCount ?? 312
      ),

      /*
       * If doctor does not have image,
       * we keep empty string.
       *
       * UI below shows User icon instead.
       */
      avatar:
        doc.imageUrl ||
        doc.image ||
        '',

      fee:
        Number(
          doc.consultationFee ??
            doc.fee ??
            doc.price
        ) || 35,

      location:
        doc.location ||
        'Clinic Location',
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
      autoSelectId ||
      selectedDoctorId;

    if (targetId) {
      const foundDoctor =
        doctors.find(
          (doctor) =>
            doctor.id ===
            String(targetId)
        );

      if (foundDoctor) {
        handleSelectRef.current(
          foundDoctor
        );

        return;
      }
    }

    handleSelectRef.current(
      doctors[0]
    );
  }, [
    doctors,
    autoSelectId,
    selectedDoctorId,
  ]);

  const handleDoctorClick = (
    doctor: IBookingDoctor
  ) => {
    handleSelect(doctor);
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
        {doctors.map((doc) => {
          const isSelected =
            doc.id ===
            String(
              selectedDoctorId
            );

          return (
            <div
              key={doc.id}
              onClick={() =>
                handleDoctorClick(doc)
              }
              className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition border ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Doctor Avatar */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  {doc.avatar ? (
                    <img
                      src={
                        doc.avatar
                      }
                      alt={doc.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                {/* Doctor Info */}
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {doc.name}
                  </h3>

                  <p className="text-xs text-blue-600 font-medium">
                    {
                      doc.specialty
                    }
                  </p>

                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />

                    <span className="font-bold text-gray-800">
                      {doc.rating}
                    </span>

                    <span>
                      (
                      {
                        doc.reviewsCount
                      }
                      )
                    </span>
                  </div>
                </div>
              </div>

              {isSelected && (
                <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-600/10" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}