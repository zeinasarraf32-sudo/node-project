'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BriefcaseMedical,
  MapPin,
  User,
} from 'lucide-react';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number | null;
  location: string | null;
  price: number | null;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  image?: string | null;
}

export default function DoctorCard({
  doctor,
}: {
  doctor: Doctor;
}) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const isAvailable = doctor.status === 'ACTIVE';

  const statusLabel =
    doctor.status === 'ACTIVE'
      ? 'Available'
      : doctor.status === 'ON_LEAVE'
        ? 'On Leave'
        : 'Unavailable';

  const handleBooking = () => {
    if (!isAvailable) {
      return;
    }

    const bookingPath = `/booking/${doctor.id}`;

    const isAuthenticated =
      typeof window !== 'undefined' &&
      localStorage.getItem('isLoggedIn') === 'true' &&
      localStorage.getItem('role') === 'patient';

    if (isAuthenticated) {
      router.push(bookingPath);
      return;
    }

    router.push(
      `/login?redirectTo=${encodeURIComponent(bookingPath)}`
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition">
      <div>
        {/* Doctor Image */}
        <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center">
          {doctor.image && !imageError ? (
            <img
              src={doctor.image}
              alt={doctor.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <User className="w-16 h-16 text-gray-300" />
          )}

          {/* Status */}
          <span
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
              doctor.status === 'ACTIVE'
                ? 'bg-emerald-100/90 text-emerald-700'
                : doctor.status === 'ON_LEAVE'
                  ? 'bg-amber-100/90 text-amber-700'
                  : 'bg-gray-100/90 text-gray-600'
            }`}
          >
            {statusLabel}
          </span>

          {/* Fee */}
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-sm">
            {doctor.price !== null
              ? `$${doctor.price}`
              : 'Fee not provided'}
          </span>
        </div>

        {/* Doctor Information */}
        <div className="p-5 space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-base">
              {doctor.name}
            </h3>

            <p className="text-blue-600 text-xs font-medium mt-0.5">
              {doctor.specialty}
            </p>
          </div>

          {/* Experience */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <BriefcaseMedical className="w-3.5 h-3.5 shrink-0" />

            <span>
              {doctor.experienceYears !== null
                ? `${doctor.experienceYears} years experience`
                : 'Experience not provided'}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5 shrink-0" />

            <span className="truncate">
              {doctor.location || 'Location not provided'}
            </span>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="p-5 pt-0">
        <button
          type="button"
          onClick={handleBooking}
          disabled={!isAvailable}
          className={`w-full font-medium py-2.5 rounded-xl text-xs transition ${
            isAvailable
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isAvailable
            ? 'Book Appointment'
            : statusLabel}
        </button>
      </div>
    </div>
  );
}